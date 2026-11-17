# SchemeSathi Contribution Guidelines

> **Note**: For the full, comprehensive contribution documentation, please refer to [**CONTRIBUTING.md**](./CONTRIBUTING.md).

---

## Quick Summary for Contributors

Thank you for contributing to **SchemeSathi (योजना साथी)**!

### Core Rules:
1. **Zero-PII Privacy Guarantee**: Never store, log, or persist user data on disk, in databases, or in `localStorage`/cookies. All user profiling must remain ephemeral in volatile memory.
2. **Bilingual Parity**: All new user-facing strings must have both English and Hindi translations added to `src/i18n.js` and `src/i18n.extra.js`.
3. **Deterministic Rules Engine**: Recommendations must provide transparent `passed`, `failed`, and `missing` criteria breakdown.
4. **Verified Government Sources**: All schemes must be sourced directly from official `.gov.in` nodal ministry websites.

### Getting Started:
- **Frontend Setup**:
  ```bash
  cd schemesathi-frontend
  npm install
  npm run dev
  ```
- **Backend Setup**:
  ```bash
  cd schemesathi-backend
  python -m venv venv
  source venv/bin/activate  # or venv\Scripts\activate on Windows
  pip install -r requirements.txt
  python run.py
  ```
- **Run Tests**:
  ```bash
  cd schemesathi-backend && pytest tests/ -v
  cd schemesathi-frontend && npm run build
  ```

Please see [**CONTRIBUTING.md**](./CONTRIBUTING.md) for detailed Git workflow, coding standards, and how to add new schemes.
