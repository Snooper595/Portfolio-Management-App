# Sustainable Investment Portfolio Tracker

A real-time portfolio management application for tracking sustainable investment funds with live market data.

## Features

- **Multi-Fund Tracking**: Manage three funds (Aggressive, Medium, Conservative) simultaneously
- **Real-Time Data**: Fetch live stock prices using Alpha Vantage API
- **Portfolio Metrics**: Track returns, cost basis, current value, and cash positions
- **Position Management**: Add and remove positions with automatic price updates
- **Export Functionality**: Download portfolio data as CSV for reports
- **Local Storage**: All data persisted in browser (no database required)
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A free Alpha Vantage API key (optional but recommended for production)

### Installation

1. Navigate to the project directory:
```bash
cd portfolio-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding Positions

1. Click "Add Position" button
2. Select a fund (Aggressive, Medium, or Conservative)
3. Enter the stock symbol (e.g., TSLA, AAPL, ENPH)
4. Enter number of shares
5. Enter purchase price
6. Click "Add"

The app will automatically fetch the current market price.

### Updating Prices

Click the "Refresh" button on any fund card to update all positions with current market prices.

### Exporting Data

Click "Export CSV" in the Portfolio Summary section to download your complete portfolio data.

### Example Sustainable Stocks to Track

- **Clean Energy**: ENPH (Enphase), SEDG (SolarEdge), NEE (NextEra Energy)
- **Electric Vehicles**: TSLA (Tesla), RIVN (Rivian), NIO (NIO)
- **Sustainable Tech**: MSFT (Microsoft), GOOGL (Google), AAPL (Apple)
- **ESG Funds**: ICLN (iShares Clean Energy), ESGU (iShares ESG Aware)

## Configuration

### API Key Setup (Recommended for Production)

The app uses a demo API key with limited calls (5 per minute, 500 per day). For production use:

1. Get a free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Update the API key in `app/api/stock-price/route.ts`:

```typescript
const API_KEY = 'YOUR_API_KEY_HERE';
```

### Customizing Initial Fund Values

Edit the `defaultFunds` array in `app/page.tsx` to set custom starting capital:

```typescript
initialValue: 100000, // Change this value
```

### Adding More Funds

You can easily add additional funds by extending the `defaultFunds` array with new fund types.

## Deployment to Vercel

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

Follow the prompts to complete deployment.

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Click "Deploy"

### Environment Variables (Optional)

If you want to use environment variables for the API key:

1. In your Vercel project dashboard, go to Settings > Environment Variables
2. Add: `ALPHA_VANTAGE_API_KEY` with your API key
3. Update the route to use: `process.env.ALPHA_VANTAGE_API_KEY`

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Alpha Vantage (free tier)
- **Storage**: Browser localStorage

## Data Persistence

All portfolio data is stored in browser localStorage, meaning:
- ✅ No database setup required
- ✅ Works offline after initial load
- ✅ No user authentication needed
- ⚠️ Data is browser-specific (clearing cache will reset)
- ⚠️ Data isn't synced across devices

## Limitations

### Free API Tier Limits:
- 5 API calls per minute
- 500 API calls per day
- Use the "Refresh" button strategically to stay within limits

### Supported Assets:
- US stocks (NYSE, NASDAQ)
- Some international stocks with US ticker symbols
- Does not support: cryptocurrencies, forex, commodities (without API modification)

## Future Enhancements

Potential features to add:
- Database integration (PostgreSQL/Supabase) for multi-user support
- Historical performance charts
- Dividend tracking
- Sector allocation visualization
- ESG score integration
- Mobile app version
- PDF report generation
- Portfolio rebalancing suggestions

## Troubleshooting

### "API limit reached" error
- Wait 1 minute before refreshing again
- Get your own API key for higher limits
- Consider upgrading to Alpha Vantage premium

### Stock symbol not found
- Ensure you're using US stock symbols
- Check symbol on [Yahoo Finance](https://finance.yahoo.com)
- Some stocks may not be available in the free tier

### Data disappeared
- Check if browser cache/cookies were cleared
- Data is stored per browser - use same browser/device
- Export CSV regularly as backup

## Contributing

Feel free to fork this project and submit pull requests with improvements!

## License

MIT License - feel free to use for educational purposes.

## Support

For issues or questions:
- Alpha Vantage API: [Documentation](https://www.alphavantage.co/documentation/)
- Next.js: [Documentation](https://nextjs.org/docs)
- Vercel Deployment: [Documentation](https://vercel.com/docs)

---

Built for sustainable investment societies to track and learn from real-world portfolio management.
