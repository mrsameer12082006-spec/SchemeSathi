# SchemeSathi Deployment Guide 🚀

This guide provides step-by-step instructions for deploying SchemeSathi (FastAPI Backend + React Frontend + Supabase) to production.

---

## 🌟 Recommended Free-Tier Architecture

| Component | Platform | Plan | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com) (or Netlify) | Free Hobby | React + Vite Single Page App with instant global CDN |
| **Backend** | [Render](https://render.com) (or Railway) | Free Web Service | FastAPI Python ASGI server with ephemeral RAM session store |
| **Database** | [Supabase](https://supabase.com) | Free Tier | Public scheme catalogue & eligibility criteria tables |
| **AI LLM** | [Groq Cloud](https://console.groq.com) | Free Tier | Blazing-fast Llama-3 / Qwen entity extraction & explanations |

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:
1. **GitHub Account**: Code pushed to a GitHub repository.
2. **Groq Cloud API Key**: Free API key from [console.groq.com](https://console.groq.com).
3. **Supabase Project Credentials**: Your `SUPABASE_URL` and `SUPABASE_KEY` (or use SchemeSathi's pre-configured cloud database).
4. *(Optional)* **Sarvam AI API Key**: If using Sarvam voice models from [sarvam.ai](https://www.sarvam.ai).

---

## Step 1: Push Code to GitHub

If you haven't already committed and pushed your latest changes:

```bash
git add .
git commit -m "feat: prepare production deployment configurations"
git push origin main
```

---

## Step 2: Deploy Backend to Render

1. Go to **[dashboard.render.com](https://dashboard.render.com/)** and sign in.
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository (`SchemeSathi`).
4. Configure the service:
   - **Name**: `schemesathi-backend`
   - **Region**: Closest to your users (e.g., *Singapore* or *Frankfurt*)
   - **Branch**: `main`
   - **Root Directory**: `schemesathi-backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`

5. Under **Environment Variables**, add:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `SUPABASE_URL` | `https://yywtrgwhemfwywfnwmxf.supabase.co` | Or your custom Supabase URL |
   | `SUPABASE_KEY` | `sb_publishable_hBj_1ALXEzUorlS28aXOPg_AXM-b_xx` | Supabase Anon Key |
   | `GROQ_API_KEY` | `gsk_your_groq_api_key_here` | From console.groq.com |
   | `GROQ_MODEL` | `qwen/qwen3.8-27b` | Default high-accuracy model |
   | `GROQ_WHISPER_MODEL` | `whisper-large-v3` | Fast transcription |
   | `SARVAM_API_KEY` | *(optional)* | Leave empty if not using Sarvam |
   | `CORS_ORIGINS` | `*` *(or your Vercel URL later)* | e.g. `https://schemesathi.vercel.app` |
   | `DEBUG` | `False` | Production mode |

6. Click **Create Web Service**.
7. Once deployed, copy your backend URL:
   `https://schemesathi-backend-xxxx.onrender.com`
8. Verify it works by opening `https://schemesathi-backend-xxxx.onrender.com/health` in your browser. You should see:
   ```json
   {"status": "healthy", "service": "SchemeSathi API & Eligibility Engine", "version": "1.0.0"}
   ```

---

## Step 3: Deploy Frontend to Vercel

1. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub.
2. Click **Add New...** > **Project**.
3. Import your `SchemeSathi` GitHub repository.
4. In the configuration window:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `schemesathi-frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. Expand **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://schemesathi-backend-xxxx.onrender.com` *(your Render backend URL from Step 2)* |
   | `VITE_SUPABASE_URL` | `https://yywtrgwhemfwywfnwmxf.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `sb_publishable_hBj_1ALXEzUorlS28aXOPg_AXM-b_xx` |

6. Click **Deploy**.
7. In ~60 seconds, your site is live! You will get a URL like `https://schemesathi.vercel.app`.

---

## Step 4: Lock Down CORS on Backend (Best Practice)

Once you have your Vercel URL (e.g. `https://schemesathi.vercel.app`):
1. Go back to your Render Dashboard -> `schemesathi-backend` -> **Environment**.
2. Update `CORS_ORIGINS`:
   ```
   https://schemesathi.vercel.app,http://localhost:5173
   ```
3. Click **Save Changes**. Render will automatically redeploy the backend with strict CORS protection.

---

## Alternative: 1-Click Deployment with Render Blueprint

If you prefer hosting **both** Frontend and Backend on Render using the included `render.yaml`:
1. In Render Dashboard, click **New +** > **Blueprint**.
2. Select your repository.
3. Render reads `render.yaml` and sets up both the `schemesathi-backend` web service and `schemesathi-frontend` static site automatically!
4. Enter your `GROQ_API_KEY` when prompted and click **Apply**.

---

## Alternative: Containerized Deployment (Docker / Railway / Fly.io)

For container-based hosting platforms (e.g. Railway, Fly.io, AWS App Runner):
- A ready-to-use [`Dockerfile`](file:///c:/Users/Sameer%20Mishra/Desktop/Projects/SchemeSathi/schemesathi-backend/Dockerfile) is included in `schemesathi-backend/`.
- Build and run locally:
  ```bash
  cd schemesathi-backend
  docker build -t schemesathi-backend .
  docker run -p 8000:8000 -e GROQ_API_KEY=your_key schemesathi-backend
  ```

---

## ✅ Post-Deployment Verification Checklist

1. [ ] Open your live frontend Vercel URL.
2. [ ] Test language toggle: Switch between **English** and **हिन्दी** on the Navbar.
3. [ ] Click **Start Voice Chat** or **Scheme Discovery**.
4. [ ] Send a message (e.g., *"I have 2 hectares of agricultural land and need crop assistance"*).
5. [ ] Verify that:
   - Backend responds with recommendations (PM Kisan / PMFBY).
   - Quick reply option chips appear correctly in the active language.
   - Eligible scheme detail pages open with document checklists.
   - Privacy guarantee badge remains active.
