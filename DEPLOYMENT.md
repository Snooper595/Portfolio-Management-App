# Quick Deployment Guide

## Deploy to Vercel in 3 Steps

### Step 1: Prepare Your Project

```bash
cd portfolio-tracker
npm install
npm run build
```

This will verify everything works correctly.

### Step 2: Deploy

**Option A - Via Vercel CLI:**
```bash
npm i -g vercel
vercel login
vercel
```

**Option B - Via GitHub:**
1. Create a new repository on GitHub
2. Push this code:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```
3. Go to [vercel.com](https://vercel.com/new)
4. Click "Import Project"
5. Select your GitHub repository
6. Click "Deploy"

### Step 3: Configure (Optional)

Get a free API key from Alpha Vantage for better rate limits:
1. Visit: https://www.alphavantage.co/support/#api-key
2. In Vercel dashboard: Settings → Environment Variables
3. Add: `ALPHA_VANTAGE_API_KEY` = your key
4. Update `app/api/stock-price/route.ts` line 6:
```typescript
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
```

## Test Locally First

```bash
npm run dev
```

Open http://localhost:3000 and test:
- Add a position (try: TSLA, AAPL, MSFT)
- Refresh prices
- Export CSV
- Test on mobile view

## Troubleshooting

**Build fails?**
- Run `npm install` again
- Check Node.js version (needs 18+)
- Delete `.next` folder and rebuild

**Deploy fails?**
- Ensure all files are committed
- Check Vercel build logs
- Verify package.json is correct

**API not working?**
- Demo key has limits (5 calls/min)
- Get your own key (free)
- Check browser console for errors

## Your App Will Be Live At:
`https://your-project-name.vercel.app`

Share this URL with your team!
