import { NextResponse } from 'next/server';

// Get API key from environment or use demo
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

// Mock prices for common stocks (used as fallback)
const MOCK_PRICES: Record<string, number> = {
  TSLA: 248.50,
  AAPL: 178.20,
  MSFT: 380.45,
  GOOGL: 139.80,
  AMZN: 175.30,
  NVDA: 495.20,
  META: 485.90,
  ENPH: 125.40,
  SEDG: 45.80,
  NEE: 72.90,
  RIVN: 12.50,
  NIO: 5.80,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  const upperSymbol = symbol.toUpperCase();

  // Try to fetch from Alpha Vantage API
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${upperSymbol}&apikey=${API_KEY}`,
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );

    if (response.ok) {
      const data = await response.json();

      // Check if we got valid data
      if (data['Global Quote'] && data['Global Quote']['05. price']) {
        return NextResponse.json({
          symbol: upperSymbol,
          price: parseFloat(data['Global Quote']['05. price']),
          source: 'Alpha Vantage',
        });
      }

      // Check if rate limit was hit
      if (data['Note'] && data['Note'].includes('API call frequency')) {
        console.log('Alpha Vantage rate limit reached, using fallback');
      }
    }
  } catch (error) {
    console.error('Error fetching from Alpha Vantage:', error);
  }

  // Fallback: Return mock price if available
  if (MOCK_PRICES[upperSymbol]) {
    return NextResponse.json({
      symbol: upperSymbol,
      price: MOCK_PRICES[upperSymbol],
      source: 'Demo Data',
      note: 'Using demo price. Set ALPHA_VANTAGE_API_KEY for real data.',
    });
  }

  // Generate a reasonable mock price for unknown symbols
  const mockPrice = parseFloat((50 + Math.random() * 450).toFixed(2));
  
  return NextResponse.json({
    symbol: upperSymbol,
    price: mockPrice,
    source: 'Generated Demo Data',
    note: 'Generated demo price. Set ALPHA_VANTAGE_API_KEY for real data.',
  });
}
