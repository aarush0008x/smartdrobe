# 🚀 How to Deploy SmartDrobe Live for FREE (Step-by-Step Guide)

SmartDrobe can be deployed 100% free of charge on **Vercel** with automatic HTTPS SSL certificates, global CDN, and full mobile PWA app installation support!

---

## ⚡ Option 1: Vercel Deployment (Recommended - 60 Seconds)

### Step 1: Push Code to GitHub
Run the following commands in your terminal:
```bash
git init
git add .
git commit -m "Deploying SmartDrobe AI Minimalist Wardrobe"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smartdrobe.git
git push -u origin main
```

### Step 2: Import Project on Vercel
1. Go to **[vercel.com/new](https://vercel.com/new)** and sign in with your GitHub account.
2. Click **Import** next to your `smartdrobe` repository.

### Step 3: Add Free Vercel Postgres Live Database (1-Click)
1. On your Vercel Project dashboard (`smartdrobe-rho`), click the **Storage** tab.
2. Click **Create Database** ➔ select **Postgres** (or **Neon**) ➔ click **Create**.
3. Vercel will automatically connect the database and populate your `DATABASE_URL` environment variable!

### Step 4: Add Environment Variables
In **Project Settings ➔ Environment Variables** on Vercel, ensure you have:
- `DATABASE_URL`: Automatically populated by Vercel Postgres
- `GEMINI_API_KEY`: `your_gemini_api_key_here`
- `JWT_SECRET`: `smartdrobe-secret-jwt-key-2026-super-secure`

### Step 5: Click Deploy!
- Click **Deploy**. Vercel will build your project, push the Prisma schema to your live Postgres database, and seed the default admin account!
- Your application will be live at: **`https://smartdrobe-rho.vercel.app`** with full database connectivity!

---

## 📱 PWA Mobile App Installation on Vercel
Once deployed to `https://smartdrobe.vercel.app`:
- Open `https://smartdrobe.vercel.app` on Android Chrome or iOS Safari.
- Tap **Install App** -> your phone will install **SmartDrobe** as a native standalone app on your home screen!
