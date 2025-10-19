import { NextResponse } from 'next/server';

export async function GET() {
  const fmpKey = process.env.FMP_API_KEY;
  
  // Test the API with a known symbol
  const testSymbol = 'MSFT';
  let apiTestResult = null;
  
  if (fmpKey && fmpKey !== 'demo') {
    try {
      const response = await fetch(
        `https://financialmodelingprep.com/api/v4/esg-environmental-social-governance-data?symbol=${testSymbol}&apikey=${fmpKey}`
      );
      
      const data = await response.json();
      
      apiTestResult = {
        status: response.status,
        statusText: response.statusText,
        dataReceived: data && data.length > 0,
        rawResponse: data,
      };
    } catch (error: any) {
      apiTestResult = {
        error: error.message,
      };
    }
  }
  
  return NextResponse.json({
    apiKeyConfigured: fmpKey !== undefined && fmpKey !== 'demo',
    apiKeyLength: fmpKey?.length || 0,
    apiKeyPreview: fmpKey ? `${fmpKey.substring(0, 4)}...${fmpKey.substring(fmpKey.length - 4)}` : 'not set',
    testSymbol,
    apiTestResult,
    timestamp: new Date().toISOString(),
  });
}
