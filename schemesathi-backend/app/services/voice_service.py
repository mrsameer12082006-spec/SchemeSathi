import os
import re
import json
import base64
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import httpx

from app.config import get_settings

logger = logging.getLogger("schemesathi.voice")


class VoiceService(ABC):
    """
    Abstract interface for Voice Processing (STT + TTS).
    Ensures modularity: can swap Sarvam AI, Bhashini, or local mocks without changing application logic.
    """

    @abstractmethod
    async def transcribe(self, audio_bytes: bytes, language_code: str = "hi-IN", filename: str = "audio.wav") -> Dict[str, Any]:
        """Transcribes spoken audio (Hindi, Hinglish, or English) into text."""
        pass

    @abstractmethod
    async def synthesize(self, text: str, language_code: str = "hi-IN", speaker: Optional[str] = None) -> Dict[str, Any]:
        """Synthesizes text into high-quality natural Indian speech audio (base64 encoded)."""
        pass

    @abstractmethod
    async def stream_synthesize(self, text: str, language_code: str = "hi-IN", speaker: Optional[str] = None):
        """Streams audio chunks in real-time (HTTP audio/mpeg)."""
        pass

    async def speech_to_text(self, audio_data: Any, language_code: str = "hi-IN", filename: str = "audio.wav"):
        """Convenience alias for transcribe."""
        if isinstance(audio_data, str):
            try:
                raw_bytes = base64.b64decode(audio_data)
            except Exception:
                raw_bytes = audio_data.encode("utf-8")
        else:
            raw_bytes = audio_data
        res = await self.transcribe(raw_bytes, language_code=language_code, filename=filename)
        return res.get("transcript", ""), res.get("language", language_code)

    async def text_to_speech(self, text: str, language_code: str = "hi-IN", speaker: Optional[str] = None) -> str:
        """Convenience alias for synthesize returning base64 string."""
        res = await self.synthesize(text, language_code=language_code, speaker=speaker)
        return res.get("audio_base64", "")


class SarvamVoiceService(VoiceService):
    """
    Production-grade Sarvam AI implementation:
    - STT: Saaras v4 model with native Hinglish and Hindi code-mix accuracy, high VAD sensitivity, and scheme domain hotwords.
    - TTS: Bulbul v4-flash low-latency streaming and natural Indian voice persona synthesis.
    """

    STT_URL = "https://api.sarvam.ai/speech-to-text"
    TTS_URL = "https://api.sarvam.ai/text-to-speech"
    TTS_STREAM_URL = "https://api.sarvam.ai/text-to-speech/stream"

    DOMAIN_HOTWORDS = "PM-KISAN, PMAY, Ayushman Bharat, PM-JAY, scholarship, Kisan Credit Card, Sukanya Samriddhi, Mudra, PM-KMY, PMFBY, DBT, ration card"

    def __init__(self, api_key: str):
        self.api_key = api_key.strip()
        self.headers = {
            "api-subscription-key": self.api_key
        }

    async def transcribe(self, audio_bytes: bytes, language_code: str = "hi-IN", filename: str = "audio.wav") -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                files = {
                    "file": (filename, audio_bytes, "audio/wav")
                }
                data = {
                    "model": "saaras:v4",
                    "language_code": language_code,
                    "mode": "codemix",
                    "high_vad_sensitivity": "true",
                    "prompt": self.DOMAIN_HOTWORDS
                }
                response = await client.post(
                    self.STT_URL,
                    headers=self.headers,
                    data=data,
                    files=files
                )

                if response.status_code == 200:
                    res_json = response.json()
                    transcript = res_json.get("transcript", "").strip()
                    logger.info(f"Sarvam STT transcribed: '{transcript[:80]}...'")
                    return {
                        "transcript": transcript,
                        "language": res_json.get("language_code", language_code),
                        "provider": "sarvam",
                        "status": "success"
                    }
                else:
                    error_msg = f"Sarvam STT failed ({response.status_code}): {response.text}"
                    logger.error(error_msg)
                    return {
                        "transcript": "",
                        "language": language_code,
                        "provider": "sarvam",
                        "status": "error",
                        "error": error_msg
                    }
        except Exception as e:
            logger.error(f"Sarvam STT network exception: {e}")
            return {
                "transcript": "",
                "language": language_code,
                "provider": "sarvam",
                "status": "error",
                "error": str(e)
            }

    def _prepare_tts_payload(self, text: str, language_code: str = "hi-IN", speaker: Optional[str] = None) -> tuple[Dict[str, Any], str]:
        # Clean HTML or markdown tags from text before speech synthesis
        clean_text = text.replace("**", "").replace("*", "").replace("#", "").strip()

        # Auto-detect language from script: if Devanagari Hindi characters are present, always use hi-IN
        has_devanagari = any('\u0900' <= c <= '\u097f' for c in clean_text)
        target_lang = "hi-IN" if (language_code.startswith("hi") or has_devanagari) else "en-IN"

        # Preprocess Hindi speech text: normalize English abbreviations and rupee signs
        if target_lang == "hi-IN":
            clean_text = re.sub(r'\bPM[- ]?KISAN\b', 'प्रधानमंत्री किसान', clean_text, flags=re.IGNORECASE)
            clean_text = re.sub(r'\bPM[- ]?YASASVI\b', 'प्रधानमंत्री यशस्वी', clean_text, flags=re.IGNORECASE)
            clean_text = re.sub(r'\bPM\b', 'प्रधानमंत्री', clean_text)
            clean_text = re.sub(r'\bOBC\b', 'अन्य पिछड़ा वर्ग', clean_text, flags=re.IGNORECASE)
            clean_text = re.sub(r'\bSC/ST\b', 'अनुसूचित जाति और जनजाति', clean_text, flags=re.IGNORECASE)
            clean_text = re.sub(r'\bSC\b', 'अनुसूचित जाति', clean_text)
            clean_text = re.sub(r'\bST\b', 'अनुसूचित जनजाति', clean_text)
            clean_text = re.sub(r'\b(\d+)\s*LPA\b', r'\1 लाख रुपये वार्षिक आय', clean_text, flags=re.IGNORECASE)
            clean_text = re.sub(r'₹\s*(\d+)', r'\1 रुपये', clean_text)

        if len(clean_text) > 500:
            clean_text = clean_text[:497] + "..."

        # Persona speaker mapping for bulbul:v4-flash
        # Legacy speaker names like 'priya' / 'anushka' map to 'simran_hi_conversation'
        configured_speaker = os.environ.get("SARVAM_SPEAKER")
        effective_speaker = speaker or configured_speaker
        if not effective_speaker or effective_speaker in ["priya", "anushka", "default"]:
            effective_speaker = "simran_hi_conversation" if target_lang == "hi-IN" else "simran_en_customer"

        pace_val = float(os.environ.get("SARVAM_PACE", 1.0))
        temp_val = float(os.environ.get("SARVAM_TEMPERATURE", 0.6))

        payload = {
            "text": clean_text,
            "target_language_code": target_lang,
            "speaker": effective_speaker,
            "model": "bulbul:v4-flash",
            "pace": pace_val,
            "temperature": temp_val,
            "enable_preprocessing": True
        }
        return payload, target_lang

    async def synthesize(self, text: str, language_code: str = "hi-IN", speaker: Optional[str] = None) -> Dict[str, Any]:
        try:
            payload, _ = self._prepare_tts_payload(text, language_code, speaker)
            async with httpx.AsyncClient(timeout=20.0) as client:
                headers = {**self.headers, "Content-Type": "application/json"}
                response = await client.post(
                    self.TTS_URL,
                    headers=headers,
                    json=payload
                )

                if response.status_code == 200:
                    res_json = response.json()
                    audios = res_json.get("audios", [])
                    audio_base64 = audios[0] if audios else ""
                    return {
                        "audio_base64": audio_base64,
                        "format": "wav",
                        "provider": "sarvam",
                        "status": "success"
                    }
                else:
                    logger.warning(f"Sarvam TTS failed ({response.status_code}): {response.text}")
                    return {
                        "audio_base64": "",
                        "format": "wav",
                        "provider": "sarvam",
                        "status": "error",
                        "error": response.text
                    }
        except Exception as e:
            logger.error(f"Sarvam TTS exception: {e}")
            return {
                "audio_base64": "",
                "format": "wav",
                "provider": "sarvam",
                "status": "error",
                "error": str(e)
            }

    async def stream_synthesize(self, text: str, language_code: str = "hi-IN", speaker: Optional[str] = None):
        """Streams audio/mpeg frames in real time from Sarvam Bulbul v4-flash."""
        try:
            payload, _ = self._prepare_tts_payload(text, language_code, speaker)
            headers = {**self.headers, "Content-Type": "application/json"}
            async with httpx.AsyncClient(timeout=20.0) as client:
                async with client.stream("POST", self.TTS_STREAM_URL, headers=headers, json=payload) as response:
                    if response.status_code != 200:
                        err_bytes = await response.aread()
                        logger.error(f"Sarvam TTS Stream failed ({response.status_code}): {err_bytes.decode('utf-8', errors='ignore')}")
                        return
                    async for chunk in response.aiter_bytes():
                        if chunk:
                            yield chunk
        except Exception as e:
            logger.error(f"Sarvam TTS Stream exception: {e}")


class MockVoiceService(VoiceService):
    """
    Fallback Voice Service for testing before adding SARVAM_API_KEY.
    Allows end-to-end frontend/backend pipeline testing without errors.
    """

    async def transcribe(self, audio_bytes: bytes, language_code: str = "hi-IN", filename: str = "audio.wav") -> Dict[str, Any]:
        logger.info(f"MockVoiceService received {len(audio_bytes)} bytes of audio. (SARVAM_API_KEY not set)")
        return {
            "transcript": "मैं एक किसान हूँ, मेरे पास 3 बीघा ज़मीन है और वार्षिक आय 1 लाख से कम है।",
            "language": language_code,
            "provider": "mock",
            "status": "mock",
            "note": "Set SARVAM_API_KEY in .env to enable production Hinglish STT via Sarvam AI Saaras."
        }

    async def synthesize(self, text: str, language_code: str = "hi-IN", speaker: Optional[str] = None) -> Dict[str, Any]:
        logger.info(f"MockVoiceService TTS requested for: '{text[:60]}...'")
        return {
            "audio_base64": "",
            "format": "wav",
            "provider": "mock",
            "status": "mock",
            "fallback_to_browser_tts": True,
            "text": text,
            "note": "Set SARVAM_API_KEY in .env to enable production Hindi neural voice TTS via Sarvam AI Bulbul."
        }

    async def stream_synthesize(self, text: str, language_code: str = "hi-IN", speaker: Optional[str] = None):
        """Mock stream generator."""
        logger.info(f"MockVoiceService TTS Stream requested for: '{text[:60]}...'")
        yield b""


def get_voice_service() -> VoiceService:
    """Factory to retrieve active VoiceService based on environment configuration."""
    settings = get_settings()
    api_key = settings.SARVAM_API_KEY or os.environ.get("SARVAM_API_KEY", "")
    if api_key and api_key.strip() and not api_key.startswith("your_") and not api_key.startswith("placeholder"):
        return SarvamVoiceService(api_key.strip())
    return MockVoiceService()


# Global singleton instance
voice_service = get_voice_service()
