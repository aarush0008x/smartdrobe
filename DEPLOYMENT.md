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

### Step 3: Add Environment Variables
In the **Environment Variables** section on Vercel, add:
- `GEMINI_API_KEY`: `your_gemini_api_key_here`
- `JWT_SECRET`: `smartdrobe-secret-jwt-key-2026-super-secure`

### Step 4: Click Deploy!
- Click **Deploy**. Vercel will build your project in ~60 seconds.
- Your application will be live at: **`https://smartdrobe.vercel.app`** with a free SSL certificate!

---

## 📱 PWA Mobile App Installation on Vercel
Once deployed to `https://smartdrobe.vercel.app`:
- Open `https://smartdrobe.vercel.app` on Android Chrome or iOS Safari.
- Tap **Install App** -> your phone will install **SmartDrobe** as a native standalone app on your home screen!
