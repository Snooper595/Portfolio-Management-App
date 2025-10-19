# Sustainable Investment Portfolio Tracker with ESG Ratings

A Next.js application for tracking investment portfolios across multiple funds with real-time stock prices and **ESG (Environmental, Social, Governance) ratings**.

## 🌟 New Features

### ESG Rating Integration
- **Real-time ESG scores** for each stock position
- **E/S/G breakdown**: Individual Environmental, Social, and Governance scores
- **ESG ratings**: Letter grades from A+ to D based on overall score
- **Portfolio-wide ESG metrics**: Weighted average ESG score across all holdings
- **Visual ESG indicators**: Color-coded badges and scores
- **CSV export**: Includes ESG data in exported portfolio reports

### ESG API Integration
The app integrates with **Financial Modeling Prep API** for real ESG data, with intelligent fallback to demo data:
- Free tier: 250 API calls per day
- Covers 7,000+ stocks
- Updated quarterly
- Provides E, S, and G individual scores

## 📊 Screenshots

The app now displays:
- ESG rating badges (A+, A, B+, B, C, D) for each position
- Detailed E/S/G breakdown scores
- Portfolio-wide weighted ESG score
- Color-coded indicators (green for excellent, blue for good, yellow for fair, orange for needs improvement)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or create the project directory**
```bash
mkdir portfolio-tracker
cd portfolio-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up ESG API key (Optional but recommended)**

The app works with demo data out of the box, but for real ESG data:

a. Get a free API key from [Financial Modeling Prep](https://financialmodelingprep.com/developer/docs/)
   - Sign up for free account
   - Get your API key from the dashboard
   - Free tier includes 250 calls/day

b. Create a `.env.local` file in the project root:
```bash
FMP_API_KEY=your_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open the app**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Adding Positions with ESG Data

1. Click **"Add Position"** on any fund
2. Enter:
   - Stock symbol (e.g., TSLA, AAPL, ENPH)
   - Number of shares
   - Purchase price
3. Click **"Add"**

The app will automatically:
- Fetch current market price
- **Retrieve ESG rating and scores**
- Display E/S/G breakdown
- Update portfolio-wide ESG metrics

### Understanding ESG Ratings

**ESG Score Ranges:**
- **A+ (90-100)**: Excellent ESG performance
- **A (80-89)**: Strong ESG practices
- **B+ (70-79)**: Good ESG standards
- **B (60-69)**: Fair ESG compliance
- **C (50-59)**: Below average ESG
- **D (<50)**: Poor ESG performance

**Score Components:**
- **Environmental (E)**: Climate impact, resource use, waste management, pollution
- **Social (S)**: Labor practices, diversity, human rights, community relations
- **Governance (G)**: Board structure, executive compensation, shareholder rights

### Viewing ESG Data

Each stock position shows:
- **Overall ESG Score**: Weighted average of E, S, and G
- **ESG Rating Badge**: Letter grade (A+, A, B+, etc.)
- **Individual Scores**: E, S, and G components (0-100)
- **Data Source**: Indicates if using real API data or demo data

### Portfolio ESG Metrics

The portfolio summary displays:
- **Portfolio ESG Score**: Value-weighted average across all positions
- **Color-coded indicator**: Visual representation of portfolio sustainability
- **Fund-level ESG**: Average ESG score per fund

### Refreshing Data

Click the **refresh button** (🔄) on any fund to:
- Update stock prices
- Refresh ESG ratings for new positions
- Recalculate portfolio metrics

### Exporting Data

Click **"Export CSV"** to download a spreadsheet including:
- All position details
- Current prices and returns
- **Complete ESG data** (overall score, rating, E/S/G breakdown)

## 🏢 Example Sustainable Stocks (with Demo ESG Data)

### Clean Energy
- **ENPH** (Enphase Energy) - ESG Rating: A
- **SEDG** (SolarEdge) - ESG Rating: B+
- **NEE** (NextEra Energy) - ESG Rating: A

### Electric Vehicles
- **TSLA** (Tesla) - ESG Rating: B
- **RIVN** (Rivian) - ESG Rating: B
- **NIO** (NIO) - ESG Rating: B-

### Sustainable Tech
- **MSFT** (Microsoft) - ESG Rating: A+
- **GOOGL** (Google) - ESG Rating: A
- **AAPL** (Apple) - ESG Rating: A+

### ESG ETFs
- **ICLN** (iShares Clean Energy) - ESG Rating: A
- **ESGU** (iShares ESG Aware) - ESG Rating: A+

## 🔧 Configuration

### ESG API Setup (Production)

**Option 1: Financial Modeling Prep (Recommended)**
```bash
# .env.local
FMP_API_KEY=your_fmp_api_key_here
```

Benefits:
- 250 free calls/day
- 7,000+ stocks covered
- Real-time ESG scores
- E/S/G breakdown included

Get your key: https://financialmodelingprep.com/developer/docs/

**Option 2: Use Demo Data**

The app includes demo ESG data for common sustainable stocks. If no API key is provided, the app will:
1. Use pre-defined ESG scores for popular stocks
2. Generate reasonable ESG scores for unknown stocks
3. Display "Demo Data" as the source

### Stock Price API

The app uses Alpha Vantage for stock prices. To use your own key:

1. Get a free key: https://www.alphavantage.co/support/#api-key
2. Update `/app/api/stock-price/route.ts`:
```typescript
const API_KEY = 'YOUR_API_KEY_HERE';
```

### Customizing Initial Fund Values

Edit `/app/page.tsx`:
```typescript
const defaultFunds: Fund[] = [
  { 
    id: '1', 
    name: 'Aggressive Growth', 
    type: 'aggressive', 
    initialValue: 100000,  // Change this
    positions: [], 
    cash: 100000 
  },
  // ... other funds
];
```

### Adding More Funds

Extend the `defaultFunds` array with new fund types:
```typescript
{ 
  id: '4', 
  name: 'ESG Impact', 
  type: 'aggressive', 
  initialValue: 50000, 
  positions: [], 
  cash: 50000 
}
```

## 🌐 Deployment

### Deploy to Vercel

**Option 1: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

**Option 2: GitHub Integration**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variable: `FMP_API_KEY`
5. Deploy

### Environment Variables

Set in Vercel dashboard (Settings → Environment Variables):
- `FMP_API_KEY`: Your Financial Modeling Prep API key
- `ALPHA_VANTAGE_API_KEY`: (Optional) Your stock price API key

## 📊 ESG Data Sources

### Financial Modeling Prep API

**Endpoint**: `/api/v4/esg-environmental-social-governance-data`

**Response Format**:
```json
{
  "symbol": "TSLA",
  "esgScore": 72,
  "environmentalScore": 85,
  "socialScore": 65,
  "governanceScore": 66,
  "esgRating": "B"
}
```

**Coverage**:
- 7,000+ publicly traded companies
- Updated quarterly
- Historical ESG data available
- Covers major US and international markets

### Demo Data

For stocks without API access, the app provides:
- Curated ESG scores for 11 popular sustainable stocks
- Generated scores for unknown symbols (for demo purposes)
- Consistent scoring methodology

## 🎯 Use Cases

### For Student Investment Societies
- Track sustainable investment performance
- Compare ESG ratings across portfolio
- Make data-driven sustainable investment decisions
- Export reports for presentations

### For Sustainable Investors
- Monitor portfolio ESG compliance
- Identify low-ESG holdings for replacement
- Track progress toward sustainability goals
- Benchmark against ESG standards

### For Educational Purposes
- Learn about ESG investing
- Understand E/S/G components
- Practice sustainable portfolio management
- Experiment with different fund strategies

## 🔍 Technical Details

### ESG Score Calculation

**Portfolio-wide ESG Score**:
```
Weighted Average = Σ(ESG Score × Position Value) / Total Portfolio Value
```

**Fund-level ESG Score**:
```
Weighted Average = Σ(ESG Score × Position Value) / Total Fund Value
```

### Color Coding
- **Green (80+)**: Excellent ESG performance
- **Blue (70-79)**: Good ESG practices
- **Yellow (60-69)**: Fair ESG standards
- **Orange (<60)**: Needs improvement

### API Rate Limits

**Financial Modeling Prep (Free Tier)**:
- 250 calls per day
- 5 calls per minute
- Resets at midnight UTC

**Alpha Vantage**:
- 5 calls per minute
- 500 calls per day

## 🐛 Troubleshooting

### ESG Data Not Loading
1. Check if `FMP_API_KEY` is set correctly
2. Verify API key is active at financialmodelingprep.com
3. Check browser console for errors
4. Ensure you haven't exceeded rate limits (250/day)

### Demo Data Being Used
- This is normal if no API key is provided
- Demo data is available for 11 popular stocks
- Set `FMP_API_KEY` environment variable for real data

### API Rate Limit Exceeded
- Free tier: 250 calls/day
- Wait for daily reset (midnight UTC)
- Consider upgrading plan for higher limits
- Use demo data as fallback

## 📝 Future Enhancements

- [ ] Historical ESG score tracking
- [ ] ESG score alerts and notifications
- [ ] Portfolio ESG benchmark comparison
- [ ] ESG-focused fund recommendations
- [ ] Detailed ESG reports and analysis
- [ ] Integration with multiple ESG data providers
- [ ] Custom ESG weighting preferences
- [ ] Sharpe ratio with ESG consideration

## 🤝 Contributing

This is a student project! Feel free to:
- Add new ESG data sources
- Improve the UI/UX
- Add more portfolio analytics
- Enhance mobile responsiveness

## 📄 License

MIT License - feel free to use for your investment society!

## 🙏 Acknowledgments

- **Financial Modeling Prep** for ESG data API
- **Alpha Vantage** for stock price data
- **Next.js** for the awesome framework
- **Tailwind CSS** for styling

---

**Built for sustainable investing education** 🌱📈

Need help? Check the troubleshooting section or open an issue!
