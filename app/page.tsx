'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, DollarSign, Trash2, RefreshCw, Download } from 'lucide-react';

type Position = {
  id: string;
  symbol: string;
  shares: number;
  purchasePrice: number;
  currentPrice?: number;
  lastUpdate?: string;
};

type Fund = {
  id: string;
  name: string;
  type: 'aggressive' | 'medium' | 'conservative';
  positions: Position[];
  initialValue: number;
};

const FUND_COLORS = {
  aggressive: 'bg-red-100 border-red-300 text-red-800',
  medium: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  conservative: 'bg-green-100 border-green-300 text-green-800',
};

export default function Home() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [newPosition, setNewPosition] = useState({
    fundId: '',
    symbol: '',
    shares: '',
    purchasePrice: '',
  });
  const [showAddPosition, setShowAddPosition] = useState(false);

  // Load funds from localStorage on mount
  useEffect(() => {
    const savedFunds = localStorage.getItem('portfolioFunds');
    if (savedFunds) {
      setFunds(JSON.parse(savedFunds));
    } else {
      // Initialize with default funds
      const defaultFunds: Fund[] = [
        {
          id: 'aggressive',
          name: 'Aggressive Growth Fund',
          type: 'aggressive',
          positions: [],
          initialValue: 100000,
        },
        {
          id: 'medium',
          name: 'Balanced Fund',
          type: 'medium',
          positions: [],
          initialValue: 100000,
        },
        {
          id: 'conservative',
          name: 'Conservative Fund',
          type: 'conservative',
          positions: [],
          initialValue: 100000,
        },
      ];
      setFunds(defaultFunds);
      localStorage.setItem('portfolioFunds', JSON.stringify(defaultFunds));
    }
  }, []);

  // Save funds to localStorage whenever they change
  useEffect(() => {
    if (funds.length > 0) {
      localStorage.setItem('portfolioFunds', JSON.stringify(funds));
    }
  }, [funds]);

  const fetchStockPrice = async (symbol: string): Promise<number | null> => {
    try {
      const response = await fetch(`/api/stock-price?symbol=${symbol}`);
      if (!response.ok) {
        const error = await response.json();
        console.error('Error fetching price:', error);
        return null;
      }
      const data = await response.json();
      return data.price;
    } catch (error) {
      console.error('Error fetching stock price:', error);
      return null;
    }
  };

  const refreshPrices = async (fundId: string) => {
    setLoading({ ...loading, [fundId]: true });
    const fund = funds.find((f) => f.id === fundId);
    if (!fund) return;

    const updatedPositions = await Promise.all(
      fund.positions.map(async (position) => {
        const currentPrice = await fetchStockPrice(position.symbol);
        return {
          ...position,
          currentPrice: currentPrice || position.currentPrice,
          lastUpdate: currentPrice ? new Date().toISOString() : position.lastUpdate,
        };
      })
    );

    setFunds(
      funds.map((f) =>
        f.id === fundId ? { ...f, positions: updatedPositions } : f
      )
    );
    setLoading({ ...loading, [fundId]: false });
  };

  const addPosition = async () => {
    const { fundId, symbol, shares, purchasePrice } = newPosition;
    if (!fundId || !symbol || !shares || !purchasePrice) return;

    const currentPrice = await fetchStockPrice(symbol.toUpperCase());
    if (!currentPrice) {
      alert('Could not fetch price for this symbol. Please check the symbol and try again.');
      return;
    }

    const position: Position = {
      id: Date.now().toString(),
      symbol: symbol.toUpperCase(),
      shares: parseFloat(shares),
      purchasePrice: parseFloat(purchasePrice),
      currentPrice,
      lastUpdate: new Date().toISOString(),
    };

    setFunds(
      funds.map((fund) =>
        fund.id === fundId
          ? { ...fund, positions: [...fund.positions, position] }
          : fund
      )
    );

    setNewPosition({ fundId: '', symbol: '', shares: '', purchasePrice: '' });
    setShowAddPosition(false);
  };

  const removePosition = (fundId: string, positionId: string) => {
    setFunds(
      funds.map((fund) =>
        fund.id === fundId
          ? {
              ...fund,
              positions: fund.positions.filter((p) => p.id !== positionId),
            }
          : fund
      )
    );
  };

  const calculateFundMetrics = (fund: Fund) => {
    const currentValue = fund.positions.reduce(
      (sum, pos) => sum + (pos.currentPrice || pos.purchasePrice) * pos.shares,
      0
    );
    const costBasis = fund.positions.reduce(
      (sum, pos) => sum + pos.purchasePrice * pos.shares,
      0
    );
    const totalReturn = currentValue - costBasis;
    const returnPercent = costBasis > 0 ? (totalReturn / costBasis) * 100 : 0;

    return {
      currentValue,
      costBasis,
      totalReturn,
      returnPercent,
      cash: fund.initialValue - costBasis,
    };
  };

  const calculateOverallMetrics = () => {
    const totalCurrent = funds.reduce(
      (sum, fund) => sum + calculateFundMetrics(fund).currentValue,
      0
    );
    const totalCost = funds.reduce(
      (sum, fund) => sum + calculateFundMetrics(fund).costBasis,
      0
    );
    const totalCash = funds.reduce(
      (sum, fund) => sum + calculateFundMetrics(fund).cash,
      0
    );
    const totalInitial = funds.reduce((sum, fund) => sum + fund.initialValue, 0);
    const totalReturn = totalCurrent - totalCost;
    const returnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

    return {
      totalValue: totalCurrent + totalCash,
      totalCurrent,
      totalCost,
      totalCash,
      totalInitial,
      totalReturn,
      returnPercent,
    };
  };

  const exportToCSV = () => {
    let csv = 'Fund,Symbol,Shares,Purchase Price,Current Price,Cost Basis,Current Value,Return,Return %\n';
    
    funds.forEach((fund) => {
      fund.positions.forEach((pos) => {
        const costBasis = pos.shares * pos.purchasePrice;
        const currentValue = pos.shares * (pos.currentPrice || pos.purchasePrice);
        const posReturn = currentValue - costBasis;
        const returnPercent = (posReturn / costBasis) * 100;
        
        csv += `${fund.name},"${pos.symbol}",${pos.shares},${pos.purchasePrice},${pos.currentPrice || pos.purchasePrice},${costBasis.toFixed(2)},${currentValue.toFixed(2)},${posReturn.toFixed(2)},${returnPercent.toFixed(2)}%\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const overall = calculateOverallMetrics();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Sustainable Investment Portfolio Tracker
          </h1>
          <p className="text-slate-600">Track your funds with real-time market data</p>
        </div>

        {/* Overall Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Portfolio Summary</h2>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 mb-1">Total Portfolio Value</div>
              <div className="text-2xl font-bold text-blue-900">
                ${overall.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-600 mb-1">Invested</div>
              <div className="text-2xl font-bold text-purple-900">
                ${overall.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="text-sm text-amber-600 mb-1">Cash Available</div>
              <div className="text-2xl font-bold text-amber-900">
                ${overall.totalCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className={`p-4 rounded-lg border ${overall.totalReturn >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className={`text-sm mb-1 ${overall.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Total Return
              </div>
              <div className={`text-2xl font-bold ${overall.totalReturn >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                ${Math.abs(overall.totalReturn).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-lg ml-2">
                  ({overall.returnPercent >= 0 ? '+' : ''}{overall.returnPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Position Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddPosition(!showAddPosition)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <PlusCircle size={20} />
            Add Position
          </button>
        </div>

        {/* Add Position Form */}
        {showAddPosition && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Position</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <select
                value={newPosition.fundId}
                onChange={(e) =>
                  setNewPosition({ ...newPosition, fundId: e.target.value })
                }
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Fund</option>
                {funds.map((fund) => (
                  <option key={fund.id} value={fund.id}>
                    {fund.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Symbol (e.g., TSLA)"
                value={newPosition.symbol}
                onChange={(e) =>
                  setNewPosition({ ...newPosition, symbol: e.target.value.toUpperCase() })
                }
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Shares"
                value={newPosition.shares}
                onChange={(e) =>
                  setNewPosition({ ...newPosition, shares: e.target.value })
                }
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Purchase Price"
                value={newPosition.purchasePrice}
                onChange={(e) =>
                  setNewPosition({ ...newPosition, purchasePrice: e.target.value })
                }
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addPosition}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Funds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {funds.map((fund) => {
            const metrics = calculateFundMetrics(fund);
            return (
              <div key={fund.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Fund Header */}
                <div className={`p-4 border-b-4 ${FUND_COLORS[fund.type]}`}>
                  <h3 className="text-xl font-bold">{fund.name}</h3>
                  <div className="text-sm mt-1 opacity-80">
                    {fund.type.charAt(0).toUpperCase() + fund.type.slice(1)} Risk
                  </div>
                </div>

                {/* Fund Metrics */}
                <div className="p-4 bg-slate-50 border-b">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-slate-600">Current Value</div>
                      <div className="font-bold text-slate-900">
                        ${metrics.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-600">Cash</div>
                      <div className="font-bold text-slate-900">
                        ${metrics.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-600">Cost Basis</div>
                      <div className="font-bold text-slate-900">
                        ${metrics.costBasis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-600">Return</div>
                      <div className={`font-bold flex items-center gap-1 ${metrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metrics.totalReturn >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {metrics.returnPercent >= 0 ? '+' : ''}{metrics.returnPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Positions */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-slate-900">Positions</h4>
                    <button
                      onClick={() => refreshPrices(fund.id)}
                      disabled={loading[fund.id] || fund.positions.length === 0}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-200 text-slate-700 rounded hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <RefreshCw size={14} className={loading[fund.id] ? 'animate-spin' : ''} />
                      Refresh
                    </button>
                  </div>

                  {fund.positions.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      No positions yet. Add your first position above.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {fund.positions.map((position) => {
                        const costBasis = position.shares * position.purchasePrice;
                        const currentValue = position.shares * (position.currentPrice || position.purchasePrice);
                        const posReturn = currentValue - costBasis;
                        const returnPercent = (posReturn / costBasis) * 100;

                        return (
                          <div
                            key={position.id}
                            className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-bold text-slate-900">{position.symbol}</div>
                                <div className="text-xs text-slate-600">
                                  {position.shares} shares @ ${position.purchasePrice.toFixed(2)}
                                </div>
                              </div>
                              <button
                                onClick={() => removePosition(fund.id, position.id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <div className="text-slate-600">Current</div>
                                <div className="font-semibold">
                                  ${(position.currentPrice || position.purchasePrice).toFixed(2)}
                                </div>
                              </div>
                              <div>
                                <div className="text-slate-600">Value</div>
                                <div className="font-semibold">
                                  ${currentValue.toFixed(2)}
                                </div>
                              </div>
                              <div className="col-span-2">
                                <div className="text-slate-600">Return</div>
                                <div className={`font-semibold ${posReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  ${Math.abs(posReturn).toFixed(2)} ({returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%)
                                </div>
                              </div>
                            </div>
                            {position.lastUpdate && (
                              <div className="text-xs text-slate-500 mt-2">
                                Updated: {new Date(position.lastUpdate).toLocaleString()}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">Getting Started</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Click "Add Position" to add stocks to any of the three funds</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Use US stock symbols (e.g., TSLA for Tesla, AAPL for Apple, ENPH for Enphase Energy)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Click "Refresh" on each fund to update prices with real-time market data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>Export your portfolio data to CSV for reports and analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">5.</span>
              <span>All data is saved locally in your browser (no account needed)</span>
            </li>
          </ul>
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-sm text-yellow-900">
            <strong>Note:</strong> This app uses a demo API key with limited calls. For production use, get a free API key at 
            <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer" className="underline ml-1">
              Alpha Vantage
            </a> and update it in the API route.
          </div>
        </div>
      </div>
    </main>
  );
}
