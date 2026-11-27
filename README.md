# Smart Inventory Manager

**Live App:** [Click here to open](https://<your-live-link>)

A multi-tenant inventory and credit (udhar) management web app built for local retail shops.

This is not a tutorial clone. It solves two real problems small shopkeepers deal with every day: losing money on expired/dead stock, and struggling to recover pending customer credit (udhar). The UI is kept clean and minimal so a non-technical shopkeeper can use it without any training.

---

## Core Features

### 1. Dead Inventory & Automated Expiry Alerts
- Tracks product stock along with expiry dates.
- Runs scheduled background jobs (`node-cron`) that send Gmail alerts at two stages:
  - **Half shelf-life alert:** Reminds the owner early enough to push sales or talk to distributors for replacement.
  - **30-day pre-expiry alert:** Includes practical AI-generated business tips to clear out slow-moving items.
- **Multi-model AI fallback:** If the primary AI model times out or returns a `503`/busy error, the cron job automatically falls back across secondary models, and finally to static business tips—so alerts never fail to go out.

### 2. 1-Click AI Bill Scanning (Human-in-the-Loop)
- Shopkeepers can scan or upload a purchase bill to extract items automatically instead of typing everything manually.
- Uses a **human-in-the-loop** flow: AI fills the fields, and nothing gets saved to the database until the admin reviews, edits if needed, and confirms.

### 3. Udhar (Credit) Recovery — 1-Click WhatsApp Reminder
- Keeps pending customer balances in one place with a 1-click WhatsApp payment reminder.
- **Why it is manual, not automated:** Local retail runs on personal relationships. Sending automated messages to regular customers can hurt trust. Keeping it 1-click leaves full control with the shopkeeper on *who* gets reminded and *when*.

---

## Security & Multi-Tenant Architecture

Built with production-grade backend security from the ground up:

- **Tenant Isolation:** Every database query is strictly scoped with a `tenantId` so one shop's data is never accessible to another.
- **Two-Token Authentication:** Short-lived JWT access tokens paired with refresh tokens stored in `HttpOnly` cookies.
- **Refresh Token Rotation & Reuse Detection:** Every refresh rotates the token and revokes the old `jti`. If a revoked token is reused, active sessions are immediately invalidated to stop token theft.
- **Password & OTP Hardening:** Passwords and OTPs are hashed and salted (`bcrypt`), with strict password regex validation and OTP expiry (TTL).
- **API Protection:** Role-Based Access Control (RBAC), rate limiting, CSRF protection, and custom auth middleware across all protected routes.

---

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Background Jobs & Mail:** `node-cron`,Brevo API
- **AI:** Google Gemini API (with multi-model fallback)

---

## About

Built and deployed live during my 1st semester (3 months into college). The goal was to skip generic clones and ship something practical for local shopkeepers while learning real backend architecture and security.
