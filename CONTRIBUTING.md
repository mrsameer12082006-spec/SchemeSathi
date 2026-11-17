# Contributing to SchemeSathi (योजना साथी) 🇮🇳

Thank you for your interest in contributing to **SchemeSathi**! 

SchemeSathi is an open-source civic tech initiative dedicated to bridging the digital divide in India. Our mission is to empower citizens—especially farmers, women, daily-wage workers, students, and seniors—to discover and understand official government welfare schemes in plain language without falling prey to predatory middlemen or privacy invasion.

Every contribution—whether adding new government schemes, improving Hindi translations, enhancing accessibility, or extending the eligibility engine—directly impacts civic inclusion.

---

## 📌 Table of Contents

- [Code of Conduct & Civic Tech Values](#-code-of-conduct--civic-tech-values)
- [How You Can Contribute](#-how-you-can-contribute)
- [Development Workflow](#-development-workflow)
  - [1. Fork & Clone](#1-fork--clone)
  - [2. Branch Naming](#2-branch-naming)
  - [3. Setting Up Locally](#3-setting-up-locally)
  - [4. Commit Guidelines](#4-commit-guidelines)
- [Strict Architectural Principles](#-strict-architectural-principles)
  - [1. Zero-PII Privacy Guarantee](#1-zero-pii-privacy-guarantee)
  - [2. Bilingual Parity (English & Hindi)](#2-bilingual-parity-english--hindi)
  - [3. Deterministic & Explainable Rules](#3-deterministic--explainable-rules)
  - [4. Official Ministry Source Verification](#4-official-ministry-source-verification)
- [How to Add or Update a Government Scheme](#-how-to-add-or-update-a-government-scheme)
  - [Adding to Supabase (PostgreSQL)](#adding-to-supabase-postgresql)
  - [Adding to Frontend Mock Engine](#adding-to-frontend-mock-engine)
- [Testing & Quality Verification](#-testing--quality-verification)
- [Pull Request Process](#-pull-request-process)
- [Recognition & Community](#-recognition--community)

---

## 🤝 Code of Conduct & Civic Tech Values

When contributing to SchemeSathi, please uphold our core community values:

1. **Empathy & Inclusion**: We build for users of all backgrounds, digital literacy levels, and physical abilities. User interfaces must be friendly, legible, and simple.
2. **Neutrality & Accuracy**: SchemeSathi is non-partisan and non-political. All scheme information must strictly reflect official gazettes and ministry portals (`.gov.in`).
3. **Respect & Kindness**: Treat all contributors and community members with dignity, respect, and constructive encouragement. Harassment or discriminatory behavior will not be tolerated.

---

## 🎯 How You Can Contribute

| Area | What You Can Do |
| :--- | :--- |
| **📜 Scheme Research & Verification** | Add missing state and central schemes, verify changing income ceilings or land limits against official notifications. |
| **🗣️ Regional Languages & Translation** | Improve Hindi Devanagari phrasing, refine dialect understanding, or contribute new Indian language mappings (Tamil, Telugu, Bengali, Marathi, Kannada, etc.). |
| **🎨 UI/UX & Accessibility** | Improve screen-reader compatibility (ARIA), mobile performance on low-end smartphones, high-contrast dark mode, and voice interaction. |
| **⚙️ Eligibility Engine & Backend** | Add new criteria evaluation rules (e.g., student course categories, minority classifications, disability allowances) in Python/FastAPI. |
| **🎙️ Voice & LLM Integration** | Build multimodal connectors (Gemini Live, Sarvam AI, OpenAI Whisper, ElevenLabs) that consume the FastAPI `/api/eligibility/evaluate` endpoint. |
| **📖 Documentation & Guides** | Improve onboarding tutorials, API docs, architecture diagrams, and user help content. |

---

## 🛠️ Development Workflow

### 1. Fork & Clone

1. Fork the repository on GitHub: `https://github.com/your-username/SchemeSathi`.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/SchemeSathi.git
   cd SchemeSathi
   ```
3. Set the upstream remote:
   ```bash
   git remote add upstream https://github.com/mrsameer12082006-spec/SchemeSathi.git
   ```

### 2. Branch Naming

Create a feature branch with a clear, descriptive prefix:
- `feat/add-pm-kusum-criteria` (new features or scheme rules)
- `fix/hindi-translation-wrap` (bug fixes)
- `docs/update-voice-agent-guide` (documentation updates)
- `refactor/session-store-sweep` (code refactoring)
- `test/eligibility-edge-cases` (adding tests)

```bash
git checkout -b feat/your-feature-name
```

### 3. Setting Up Locally

Follow the setup steps in [README.md](./README.md):
- **Frontend**: `cd schemesathi-frontend && npm install && npm run dev`
- **Backend**: `cd schemesathi-backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python run.py`

### 4. Commit Guidelines

We follow the **Conventional Commits** specification:

```
<type>(<scope>): <short description>

[optional body]
```

#### Types:
- `feat`: A new feature or scheme addition
- `fix`: A bug fix
- `docs`: Documentation changes only
- `style`: Changes that do not affect code logic (formatting, missing semi-colons)
- `refactor`: Code refactoring without adding features or fixing bugs
- `perf`: A code change that improves performance
- `test`: Adding or correcting tests
- `chore`: Build process or auxiliary tool changes

#### Examples:
- `feat(schemes): add PM Surya Ghar Muft Bijli Yojana criteria`
- `fix(i18n): correct Devanagari translation for landholding chips`
- `test(backend): add pytest case for tenant farmer eligibility`
- `docs(readme): add troubleshooting section for Supabase connection`

---

## 📐 Strict Architectural Principles

Every contribution must adhere to the four non-negotiable architectural tenets of SchemeSathi:

### 1. Zero-PII Privacy Guarantee
- **Never save personal data to disk**: No user accounts, passwords, phone numbers, or Aadhaar numbers may ever be requested or stored.
- **No persistent browser storage**: Never use `localStorage`, `sessionStorage`, or persistent cookies to track citizen activity. All React state must reside in memory (`useState`) and clear when the user leaves.
- **Backend RAM-Only**: The backend must keep sessions strictly in RAM (`SessionStore`) with automatic TTL eviction. Never create a `users` table in Supabase.

### 2. Bilingual Parity (English & Hindi)
- Every new user-facing feature, question, chip, or error message **must** be provided in both English and Hindi (हिन्दी).
- Update both:
  - `schemesathi-frontend/src/i18n.js` (core dialogue strings, scheme names, criteria phrases, quick-reply chips)
  - `schemesathi-frontend/src/i18n.extra.js` (static pages, navigation, category names, informational notes)
- Use standard, respectful Devanagari Hindi (e.g. *पात्र हो सकते हैं* instead of literal robotic translations).

### 3. Deterministic & Explainable Rules
- **No black-box recommendations**: The Eligibility Engine must evaluate explicit rules (land size, income, age, area, gender).
- Recommendations must always be structured into three transparent lists:
  1. `passed`: Criteria the user definitively meets (e.g., *"Landholding within 2 hectares"*).
  2. `failed`: Criteria the user definitely does not satisfy.
  3. `missing`: Details needed to confirm eligibility (e.g., *"Crop sowing verification needed"*).
- Use non-prescriptive, non-definitive semantics: *"May be eligible"* (*पात्र हो सकते हैं*), never *"You are guaranteed to receive this scheme"*.

### 4. Official Ministry Source Verification
- All newly added welfare schemes must reference official nodal ministry portals ending in `.gov.in` or `.nic.in`.
- Every scheme must include a clear anti-scam notice reminding citizens that official government applications are **free**.

---

## 📝 How to Add or Update a Government Scheme

### Adding to Supabase (PostgreSQL)

Schemes are stored in the relational schema defined in [`supabase_schema_and_seed.sql`](./supabase_schema_and_seed.sql). Use the `seed_scheme` helper function to add a scheme:

```sql
SELECT seed_scheme(
    'farmers',                                           -- Category code: farmers, students, women, seniors, workers, business
    'pm-surya-ghar',                                     -- Unique scheme code
    'PM Surya Ghar Muft Bijli Yojana',                   -- English Name
    'पीएम सूर्य घर मुफ्त बिजली योजना',                   -- Hindi Name
    'Subsidized rooftop solar electricity for households.', -- English Summary
    'घरों के लिए रियायती रूफटॉप सोलर बिजली सहायता।',      -- Hindi Summary
    'Ministry of New and Renewable Energy',              -- Nodal Ministry
    'Up to ₹78,000 direct subsidy for installing rooftop solar systems.', -- English Benefits
    'रूफटॉप सोलर पैनल लगाने के लिए ₹78,000 तक की सीधी सरकारी सब्सिडी।',  -- Hindi Benefits
    'https://pmsuryaghar.gov.in',                        -- Official .gov.in URL
    18, 100, 300000.00, NULL,                            -- Min Age, Max Age, Max Annual Income, Max Landholding
    '{"All", "Homeowner"}',                              -- Allowed occupations
    '{"Male", "Female", "Other"}',                       -- Allowed genders
    '{"Rural", "Urban"}',                                -- Allowed residential areas
    'Electricity Bill copy', 'बिजली बिल की प्रति',       -- Mandatory Document 1
    'Aadhaar Card', 'आधार कार्ड',                        -- Mandatory Document 2
    'Bank Passbook copy', 'बैंक पासबुक की प्रति',         -- Mandatory Document 3
    'Apply on National Portal', 'Submit application on pmsuryaghar.gov.in', -- Step 1
    'Technical Feasibility Approval', 'DISCOM inspects roof and approves installation' -- Step 2
);
```

### Adding to Frontend Mock Engine

If adding a scheme for offline/standalone mode, also register its schema in:
1. `schemesathi-frontend/src/services/api.js`: Add to `MOCK_SCHEMES_EN` and `MOCK_SCHEMES_HI`.
2. `schemesathi-frontend/src/i18n.js`: Add its English $\leftrightarrow$ Hindi title and summary to `EN_TO_HI`.

---

## 🧪 Testing & Quality Verification

Before submitting a Pull Request, verify all tests pass locally:

### 1. Frontend Build Verification
```bash
cd schemesathi-frontend
npm run build
```
Ensure that Vite compiles with `0` syntax or bundling errors.

### 2. Backend Automated Test Suite
```bash
cd schemesathi-backend
pytest tests/ -v
```
Ensure all 14 tests in `test_session_store.py`, `test_eligibility.py`, and `test_live_api.py` pass. If you added new criteria logic, add corresponding unit tests in `tests/test_eligibility.py`.

### 3. Manual Functional Checklist
- [ ] Test in both **English** and **Hindi** via the top navbar toggle.
- [ ] Test the **Speech-to-Text (STT)** microphone input.
- [ ] Test the **Text-to-Speech (TTS)** "Listen" (सुनें) audio narration.
- [ ] Click "Answer 1 question" on a scheme marked `needs_information` and verify the follow-up question renders with appropriate quick-reply chips.
- [ ] Refresh the page or close the tab and verify zero citizen data is retained.

---

## 🚀 Pull Request Process

1. Push your feature branch to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch of `SchemeSathi`.
3. Provide a clear, structured PR description using the template:
   - **What changed?** (Summary of additions or fixes)
   - **Why was this change needed?** (Context or issue link)
   - **How was this tested?** (List tests run and manual verification steps)
   - **Screenshots / Recordings** (Especially for UI or translation updates)
4. A maintainer will review your PR. Be responsive to feedback or requested adjustments.
5. Once approved, your PR will be squash-merged into `main`.

---

## 🌟 Recognition & Community

All contributors who have code, translations, documentation, or scheme data merged will be credited in our `README.md` and in the in-app **Developers & Contributors Modal**.

Have questions, ideas, or feedback?
- Open an [Issue on GitHub](https://github.com/mrsameer12082006-spec/SchemeSathi/issues).
- Reach out to the core project maintainers:
  - **Sameer Mishra** (`mrsameer12082006@gmail.com`)
  - **Lakshay Gupta** (`garglakshay292@gmail.com`)

Thank you for contributing to an inclusive, open, and scam-free digital welfare ecosystem for India! 🇮🇳
