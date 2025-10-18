import { NextResponse } from 'next/server';

// Get API key from environment variable or fall back to demo
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    // Alpha Vantage API for real-time stock quotes
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );

    const data = await response.json();

    if (data['Error Message']) {
      return NextResponse.json({ error: 'Invalid symbol' }, { status: 404 });
    }

    if (data['Note']) {
      // API call frequency limit reached
      return NextResponse.json({ 
        error: 'API limit reached. Please wait a moment or use your own API key.' 
      }, { status: 429 });
    }

    const quote = data['Global Quote'];
    
    if (!quote || !quote['05. price']) {
      return NextResponse.json({ error: 'No data available for this symbol' }, { status: 404 });
    }

    return NextResponse.json({
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent'],
      lastUpdate: quote['07. latest trading day']
    });
  } catch (error) {
    console.error('Error fetching stock price:', error);
    return NextResponse.json({ error: 'Failed to fetch stock price' }, { status: 500 });
  }
}
