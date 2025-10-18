# 🚀 Quick Start - Get Running in 5 Minutes

## Step 1: Install Dependencies (2 min)

Open terminal and run:

```bash
cd portfolio-tracker
npm install
```

Wait for installation to complete.

## Step 2: Start the App (30 seconds)

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

## Step 3: Add Your First Position (2 min)

1. Click the blue **"Add Position"** button
2. Fill in the form:
   - **Fund**: Select "Aggressive Growth Fund"
   - **Symbol**: Type `TSLA` (Tesla)
   - **Shares**: Type `10`
   - **Purchase Price**: Type `250`
3. Click **"Add"**

🎉 You now have your first position tracked!

## Step 4: Test Features (30 seconds)

- Click **"Refresh"** on the Aggressive fund card → Prices update!
- Click **"Export CSV"** → Download your portfolio data!
- Add another position to test (try: `AAPL` for Apple)

## Step 5: Deploy to Vercel (2 min)

### Option A - Automatic (Easiest):
```bash
npm i -g vercel
vercel login
vercel
```

Follow prompts. Done! 🎉

### Option B - Via GitHub:
1. Create a new GitHub repo
2. Run:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```
3. Go to [vercel.com/new](https://vercel.com/new)
4. Import your repo
5. Click "Deploy"

Your app is now live! 🌐

## Common Test Stocks

Try adding these sustainable stocks:

**Clean Energy:**
- `ENPH` - Enphase Energy
- `SEDG` - SolarEdge
- `NEE` - NextEra Energy

**Electric Vehicles:**
- `TSLA` - Tesla
- `RIVN` - Rivian
- `NIO` - NIO Limited

**Big Tech (ESG):**
- `MSFT` - Microsoft
- `GOOGL` - Google
- `AAPL` - Apple

## Tips for First Time

✅ **DO:**
- Start with 2-3 test positions per fund
- Click Refresh to see live data
- Export CSV to check the output
- Test on mobile browser too

❌ **DON'T:**
- Don't refresh more than once per minute (API limits)
- Don't add fake stock symbols
- Don't clear browser cache (you'll lose data)

## What Next?

1. Read **OVERVIEW.md** for full feature list
2. Read **WORKFLOW.md** for team usage tips
3. Read **README.md** for detailed docs
4. Get your own API key (see README)

## Troubleshooting

**Problem**: Can't install dependencies  
**Fix**: Check Node.js version: `node -v` (needs 18+)

**Problem**: Port 3000 already in use  
**Fix**: Run `npm run dev -- -p 3001` instead

**Problem**: API limit reached  
**Fix**: Wait 1 minute, then refresh again

**Problem**: Stock not found  
**Fix**: Use US ticker symbols only (check Yahoo Finance)

## You're Ready! 🎊

The app is now:
- ✅ Running locally
- ✅ Tracking positions
- ✅ Showing real prices
- ✅ Ready to deploy

Share the deployed URL with your team and start tracking investments!

---

**Need help?** Check the other documentation files or the inline code comments.
