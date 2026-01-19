# 🚀 Next.js Project Setup & Vercel Deployment Guide

This guide covers **everything step-by-step** — from installing dependencies to deploying your project on **Vercel**, including fixing common production-only issues like login not working.

---

## 📌 1. System Requirements

Make sure you have:

- Node.js ≥ 18.x
- npm or yarn
- Git
- A GitHub account
- A Vercel account

Check versions:

```bash
node -v
npm -v
git --version
```

---

## 📌 2. Project Installation

Clone your repository:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

Install dependencies:

```bash
npm install
```

---

## 📌 3. Environment Variables Setup (Local)

Create a file:

```bash
.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DEMO_EMAIL=admin@example.com
DEMO_PASSWORD=123456
JWT_SECRET=your_secret
```

⚠️ Restart dev server after editing env files.

---

## 📌 4. Run Project Locally

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

Make sure:
- Login works
- No runtime errors

---

## 📌 5. Lint & Type Check (Before Build)

Run:

```bash
npm run lint
npm run type-check
```

Fix all **errors** (warnings optional but recommended).

---

## 📌 6. Production Build Test (Local)

```bash
npm run build
npm start
```

Visit:

```
http://localhost:3000
```

Make sure:
- Login works
- Routing works
- No crash

---

## 📌 7. Fix Common Build Errors

### ❌ Error: `target` is no longer supported

✅ Fix: Remove from `next.config.ts`

```ts
const nextConfig = {};
export default nextConfig;
```

---

### ❌ Error: `appDir` or `swcMinify` not supported

✅ Fix: Remove those properties from config.

---

### ⚠️ Warning: Multiple lockfiles detected

✅ Fix: Keep only one `package-lock.json` in your project root.

---

### ⚠️ Middleware deprecated

✅ Fix: Rename `middleware.ts` → `proxy.ts`

---

## 📌 8. Auth Fix for Production (Vercel Login Issue)

### Problem:
Login works locally but fails on Vercel.

### Solution:
Persist auth state in `localStorage`.

Example:

```ts
useEffect(() => {
  const stored = localStorage.getItem("auth");
  if (stored) setIsAuthenticated(true);
}, []);

const login = () => {
  setIsAuthenticated(true);
  localStorage.setItem("auth", "true");
};
```

---

## 📌 9. Push Code to GitHub

```bash
git status
git add .
git commit -m "Ready for production"
git push origin main
```

---

## 📌 10. Deploy to Vercel

### Method 1: GitHub Auto Deploy (Recommended)

1. Go to https://vercel.com
2. Click **New Project**
3. Import your GitHub repo
4. Select framework: **Next.js**
5. Click **Deploy**

---

## 📌 11. Add Environment Variables on Vercel

Vercel Dashboard → Project → Settings → Environment Variables

Add same keys from `.env.local`

Then:

```bash
Redeploy → Clear cache
```

---

## 📌 12. Production Testing Checklist

After deploy:

- ✅ Login works
- ✅ Redirect works
- ✅ Protected routes work
- ✅ Refresh keeps login
- ✅ No console errors

---

## 📌 13. Vercel Build Failed Fixes

### ❌ Error: Command "npm run build" exited with 1

Fix by:

```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

Then commit and redeploy.

---

## 📌 14. Recommended Scripts (package.json)

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## 📌 15. Final Deployment Flow Summary

```text
Install → Env Setup → Local Test → Lint → Build → Git Push → Vercel Import → Env Setup → Redeploy → Live 🎉
```

---

## 🧠 Pro Tips

- Always test `npm run build && npm start` locally before Vercel
- Never store secrets directly in frontend
- Use `NEXT_PUBLIC_` prefix only for public env vars
- Use App Router imports: `next/navigation`

---

## ✅ Project Ready for Production 🚀

Your project is now fully:

✔ Build-safe
✔ Production-ready
✔ Vercel-compatible
✔ Auth-stable

---

If you want, I can also:
- Add CI/CD pipeline
- Add protected route middleware
- Add role-based auth
- Add production logger

Just tell me 😎

