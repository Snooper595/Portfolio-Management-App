import { NextResponse } from 'next/server';

// Get your free API key at https://financialmodelingprep.com/developer/docs/
// Free tier: 250 requests per day
const FMP_API_KEY = process.env.FMP_API_KEY || 'demo'; // Set in environment variables

// Mock ESG data for common sustainable stocks (used as fallback)
const MOCK_ESG_DATA: Record<string, {
  esgScore: number;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  esgRating: string;
}> = {
  TSLA: {
    esgScore: 72,
    environmentalScore: 85,
    socialScore: 65,
    governanceScore: 66,
    esgRating: 'B',
  },
  ENPH: {
    esgScore: 78,
    environmentalScore: 92,
    socialScore: 70,
    governanceScore: 72,
    esgRating: 'A',
  },
  NEE: {
    esgScore: 81,
    environmentalScore: 88,
    socialScore: 76,
    governanceScore: 79,
    esgRating: 'A',
  },
  MSFT: {
    esgScore: 86,
    environmentalScore: 82,
    socialScore: 88,
    governanceScore: 88,
    esgRating: 'A+',
  },
  AAPL: {
    esgScore: 84,
    environmentalScore: 80,
    socialScore: 86,
    governanceScore: 86,
    esgRating: 'A+',
  },
  GOOGL: {
    esgScore: 82,
    environmentalScore: 78,
    socialScore: 84,
    governanceScore: 84,
    esgRating: 'A',
  },
  SEDG: {
    esgScore: 75,
    environmentalScore: 90,
    socialScore: 68,
    governanceScore: 67,
    esgRating: 'B+',
  },
  RIVN: {
    esgScore: 68,
    environmentalScore: 82,
    socialScore: 60,
    governanceScore: 62,
    esgRating: 'B',
  },
  NIO: {
    esgScore: 66,
    environmentalScore: 80,
    socialScore: 58,
    governanceScore: 60,
    esgRating: 'B-',
  },
  ICLN: {
    esgScore: 83,
    environmentalScore: 91,
    socialScore: 78,
    governanceScore: 80,
    esgRating: 'A',
  },
  ESGU: {
    esgScore: 85,
    environmentalScore: 84,
    socialScore: 86,
    governanceScore: 85,
    esgRating: 'A+',
  },
};

// Helper function to calculate ESG rating from score
function calculateESGRating(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  return 'D';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  const upperSymbol = symbol.toUpperCase();

  // Try to fetch from Financial Modeling Prep API
  if (FMP_API_KEY !== 'demo') {
    try {
      const response = await fetch(
        `https://financialmodelingprep.com/api/v4/esg-environmental-social-governance-data?symbol=${upperSymbol}&apikey=${FMP_API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data && data.length > 0) {
          const esgData = data[0];
          return NextResponse.json({
            symbol: upperSymbol,
            esgScore: Math.round(
              (esgData.environmentalScore + esgData.socialScore + esgData.governanceScore) / 3
            ),
            environmentalScore: Math.round(esgData.environmentalScore),
            socialScore: Math.round(esgData.socialScore),
            governanceScore: Math.round(esgData.governanceScore),
            esgRating: calculateESGRating(
              (esgData.environmentalScore + esgData.socialScore + esgData.governanceScore) / 3
            ),
            source: 'Financial Modeling Prep',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching ESG data from FMP:', error);
      // Fall through to mock data
    }
  }

  // Return mock data if available
  if (MOCK_ESG_DATA[upperSymbol]) {
    return NextResponse.json({
      symbol: upperSymbol,
      ...MOCK_ESG_DATA[upperSymbol],
      source: 'Demo Data',
      note: 'Using demo data. Set FMP_API_KEY environment variable for real data.',
    });
  }

  // Generate random but reasonable ESG scores for unknown symbols
  const envScore = 50 + Math.floor(Math.random() * 40);
  const socScore = 50 + Math.floor(Math.random() * 40);
  const govScore = 50 + Math.floor(Math.random() * 40);
  const avgScore = Math.round((envScore + socScore + govScore) / 3);

  return NextResponse.json({
    symbol: upperSymbol,
    esgScore: avgScore,
    environmentalScore: envScore,
    socialScore: socScore,
    governanceScore: govScore,
    esgRating: calculateESGRating(avgScore),
    source: 'Generated Demo Data',
    note: 'Generated data for demonstration. Set FMP_API_KEY environment variable for real data.',
  });
}
