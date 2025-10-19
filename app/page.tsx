'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Download, Plus, X, RefreshCw, Leaf, DollarSign } from 'lucide-react';

interface Position {
  id: string;
  symbol: string;
  shares: number;
  purchasePrice: number;
  currentPrice?: number;
  esgScore?: number;
  esgRating?: string;
  environmentalScore?: number;
  socialScore?: number;
  governanceScore?: number;
  esgSource?: string;
}

interface Fund {
  id: string;
  name: string;
  type: 'aggressive' | 'medium' | 'conservative';
  initialValue: number;
  positions: Position[];
  cash: number;
}

export default function Home() {
  const defaultFunds: Fund[] = [
    { id: '1', name: 'Aggressive Growth', type: 'aggressive', initialValue: 100000, positions: [], cash: 100000 },
    { id: '2', name: 'Balanced', type: 'medium', initialValue: 100000, positions: [], cash: 100000 },
    { id: '3', name: 'Conservative', type: 'conservative', initialValue: 100000, positions: [], cash: 100000 },
  ];

  const [funds, setFunds] = useState<Fund[]>(defaultFunds);
  const [showAddPosition, setShowAddPosition] = useState<string | null>(null);
  const [newPosition, setNewPosition] = useState({ symbol: '', shares: '', price: '' });
  const [loading, setLoading] = useState<string | null>(null);
  const [fetchingPrice, setFetchingPrice] = useState(false);

  const fetchCurrentPrice = async () => {
    if (!newPosition.symbol) {
      alert('Please enter a symbol first');
      return;
    }

    setFetchingPrice(true);
    try {
      const response = await fetch(`/api/stock-price?symbol=${newPosition.symbol}`);
      if (response.ok) {
        const data = await response.json();
        if (data.price) {
          setNewPosition({ ...newPosition, price: data.price.toFixed(2) });
          // Show a subtle note if using demo data
          if (data.source && data.source !== 'Alpha Vantage') {
            console.log(`Using ${data.source} for ${newPosition.symbol}: $${data.price.toFixed(2)}`);
          }
        } else {
          alert('Could not fetch price for this symbol. Please enter manually.');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error fetching price. Please enter manually.');
      }
    } catch (error) {
      console.error('Error fetching price:', error);
      alert('Network error. Please enter price manually.');
    } finally {
      setFetchingPrice(false);
    }
  };

  const addPosition = async (fundId: string) => {
    if (!newPosition.symbol || !newPosition.shares || !newPosition.price) return;

    setLoading(fundId);
    const positionId = Date.now().toString();
    const shares = parseFloat(newPosition.shares);
    const price = parseFloat(newPosition.price);
    const totalCost = shares * price;

    // Fetch current price and ESG data
    try {
      let currentPrice = price; // Default to purchase price
      let esgData: any = null;

      // Try to fetch current price
      try {
        const priceResponse = await fetch(`/api/stock-price?symbol=${newPosition.symbol}`);
        if (priceResponse.ok) {
          const priceDataResult = await priceResponse.json();
          currentPrice = priceDataResult.price || price;
        }
      } catch (error) {
        console.error('Error fetching stock price:', error);
        // Continue with purchase price
      }

      // Try to fetch ESG rating
      try {
        const esgResponse = await fetch(`/api/esg-rating?symbol=${newPosition.symbol}`);
        if (esgResponse.ok) {
          esgData = await esgResponse.json();
        }
      } catch (error) {
        console.error('Error fetching ESG data:', error);
        // Continue without ESG data
      }

      setFunds(
        funds.map((fund) => {
          if (fund.id === fundId && fund.cash >= totalCost) {
            return {
              ...fund,
              positions: [
                ...fund.positions,
                {
                  id: positionId,
                  symbol: newPosition.symbol.toUpperCase(),
                  shares,
                  purchasePrice: price,
                  currentPrice: currentPrice,
                  ...(esgData && {
                    esgScore: esgData.esgScore,
                    esgRating: esgData.esgRating,
                    environmentalScore: esgData.environmentalScore,
                    socialScore: esgData.socialScore,
                    governanceScore: esgData.governanceScore,
                    esgSource: esgData.source,
                  }),
                },
              ],
              cash: fund.cash - totalCost,
            };
          }
          return fund;
        })
      );

      setNewPosition({ symbol: '', shares: '', price: '' });
      setShowAddPosition(null);
    } catch (error) {
      console.error('Error adding position:', error);
      alert('Failed to add position. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const removePosition = (fundId: string, positionId: string) => {
    setFunds(
      funds.map((fund) => {
        if (fund.id === fundId) {
          const position = fund.positions.find((p) => p.id === positionId);
          if (position) {
            return {
              ...fund,
              positions: fund.positions.filter((p) => p.id !== positionId),
              cash: fund.cash + position.shares * position.purchasePrice,
            };
          }
        }
        return fund;
      })
    );
  };

  const refreshPrices = async (fundId: string) => {
    setLoading(fundId);
    const fund = funds.find((f) => f.id === fundId);
    if (!fund) return;

    try {
      const updatedPositions = await Promise.all(
        fund.positions.map(async (position) => {
          try {
            // Refresh stock price
            const priceResponse = await fetch(`/api/stock-price?symbol=${position.symbol}`);
            const priceData = await priceResponse.json();

            // Refresh ESG rating if not already fetched
            let esgData = null;
            if (!position.esgScore) {
              const esgResponse = await fetch(`/api/esg-rating?symbol=${position.symbol}`);
              esgData = await esgResponse.json();
            }

            return {
              ...position,
              currentPrice: priceData.price,
              ...(esgData && {
                esgScore: esgData.esgScore,
                esgRating: esgData.esgRating,
                environmentalScore: esgData.environmentalScore,
                socialScore: esgData.socialScore,
                governanceScore: esgData.governanceScore,
                esgSource: esgData.source,
              }),
            };
          } catch (error) {
            console.error(`Error updating ${position.symbol}:`, error);
            return position;
          }
        })
      );

      setFunds(
        funds.map((f) => {
          if (f.id === fundId) {
            return { ...f, positions: updatedPositions };
          }
          return f;
        })
      );
    } catch (error) {
      console.error('Error refreshing prices:', error);
    } finally {
      setLoading(null);
    }
  };

  const getESGColor = (score?: number): string => {
    if (!score) return 'bg-gray-500';
    if (score >= 80) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getESGTextColor = (score?: number): string => {
    if (!score) return 'text-gray-700';
    if (score >= 80) return 'text-green-700';
    if (score >= 70) return 'text-blue-700';
    if (score >= 60) return 'text-yellow-700';
    return 'text-orange-700';
  };

  const getFundHeaderClass = (type: 'aggressive' | 'medium' | 'conservative'): string => {
    if (type === 'aggressive') return 'bg-red-500';
    if (type === 'medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const calculateFundMetrics = (fund: Fund) => {
    const totalCost = fund.positions.reduce((sum, pos) => sum + pos.shares * pos.purchasePrice, 0);
    const totalCurrent = fund.positions.reduce(
      (sum, pos) => sum + pos.shares * (pos.currentPrice || pos.purchasePrice),
      0
    );
    const totalValue = totalCurrent + fund.cash;
    const totalReturn = totalCurrent - totalCost;
    const returnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

    // Calculate weighted average ESG score
    const positionsWithESG = fund.positions.filter((p) => p.esgScore);
    const weightedESGScore =
      positionsWithESG.length > 0 && totalCurrent > 0
        ? positionsWithESG.reduce((sum, pos) => {
            const value = pos.shares * (pos.currentPrice || pos.purchasePrice);
            return sum + (pos.esgScore || 0) * value;
          }, 0) / totalCurrent
        : 0;

    return {
      totalValue,
      totalCurrent,
      totalCost,
      totalReturn,
      returnPercent,
      weightedESGScore: Math.round(weightedESGScore),
    };
  };

  const calculateOverallMetrics = () => {
    const totalInitial = funds.reduce((sum, fund) => sum + fund.initialValue, 0);
    const totalCash = funds.reduce((sum, fund) => sum + fund.cash, 0);
    const totalCost = funds.reduce(
      (sum, fund) => sum + fund.positions.reduce((s, pos) => s + pos.shares * pos.purchasePrice, 0),
      0
    );
    const totalCurrent = funds.reduce(
      (sum, fund) =>
        sum + fund.positions.reduce((s, pos) => s + pos.shares * (pos.currentPrice || pos.purchasePrice), 0),
      0
    );
    const totalReturn = totalCurrent - totalCost;
    const returnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

    // Calculate portfolio-wide ESG score
    const allPositions = funds.flatMap((f) => f.positions).filter((p) => p.esgScore);
    const totalESGValue = allPositions.reduce(
      (sum, pos) => sum + (pos.esgScore || 0) * pos.shares * (pos.currentPrice || pos.purchasePrice),
      0
    );
    const portfolioESGScore = totalCurrent > 0 ? Math.round(totalESGValue / totalCurrent) : 0;

    return {
      totalValue: totalCurrent + totalCash,
      totalCurrent,
      totalCost,
      totalCash,
      totalInitial,
      totalReturn,
      returnPercent,
      portfolioESGScore,
    };
  };

  const exportToCSV = () => {
    let csv =
      'Fund,Symbol,Shares,Purchase Price,Current Price,Cost Basis,Current Value,Return,Return %,ESG Score,ESG Rating,Environmental,Social,Governance\n';

    funds.forEach((fund) => {
      fund.positions.forEach((pos) => {
        const costBasis = pos.shares * pos.purchasePrice;
        const currentValue = pos.shares * (pos.currentPrice || pos.purchasePrice);
        const posReturn = currentValue - costBasis;
        const returnPercent = (posReturn / costBasis) * 100;

        csv += `${fund.name},"${pos.symbol}",${pos.shares},${pos.purchasePrice},${pos.currentPrice || pos.purchasePrice},${costBasis.toFixed(2)},${currentValue.toFixed(2)},${posReturn.toFixed(2)},${returnPercent.toFixed(2)}%,${pos.esgScore || 'N/A'},${pos.esgRating || 'N/A'},${pos.environmentalScore || 'N/A'},${pos.socialScore || 'N/A'},${pos.governanceScore || 'N/A'}\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-esg-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const overall = calculateOverallMetrics();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Leaf className="text-green-600" size={40} />
            Sustainable Investment Portfolio Tracker
          </h1>
          <p className="text-slate-600">Track your funds with real-time market data and ESG ratings</p>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium mb-1">Total Value</p>
              <p className="text-2xl font-bold text-blue-900">${overall.totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-medium mb-1">Invested</p>
              <p className="text-2xl font-bold text-green-900">${overall.totalCurrent.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-600 font-medium mb-1">Cash</p>
              <p className="text-2xl font-bold text-purple-900">${overall.totalCash.toLocaleString()}</p>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                overall.totalReturn >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <p
                className={`text-sm font-medium mb-1 ${
                  overall.totalReturn >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                Total Return
              </p>
              <p
                className={`text-2xl font-bold flex items-center gap-1 ${
                  overall.totalReturn >= 0 ? 'text-emerald-900' : 'text-red-900'
                }`}
              >
                {overall.totalReturn >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                {overall.totalReturn >= 0 ? '+' : ''}${overall.totalReturn.toLocaleString()}
              </p>
              <p className={`text-sm ${overall.totalReturn >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {overall.returnPercent.toFixed(2)}%
              </p>
            </div>
            <div className={`p-4 rounded-lg border ${getESGColor(overall.portfolioESGScore).replace('bg-', 'bg-opacity-10 bg-')} ${getESGColor(overall.portfolioESGScore).replace('bg-', 'border-')}`}>
              <p className={`text-sm font-medium mb-1 flex items-center gap-1 ${getESGTextColor(overall.portfolioESGScore)}`}>
                <Leaf size={14} />
                Portfolio ESG Score
              </p>
              <p className={`text-2xl font-bold ${getESGTextColor(overall.portfolioESGScore)}`}>
                {overall.portfolioESGScore || 'N/A'}
              </p>
              <p className={`text-sm ${getESGTextColor(overall.portfolioESGScore)}`}>
                {overall.portfolioESGScore >= 80 ? 'Excellent' : overall.portfolioESGScore >= 70 ? 'Good' : overall.portfolioESGScore >= 60 ? 'Fair' : 'Needs Improvement'}
              </p>
            </div>
          </div>
        </div>

        {/* Funds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {funds.map((fund) => {
            const metrics = calculateFundMetrics(fund);

            return (
              <div key={fund.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className={`${getFundHeaderClass(fund.type)} p-4`}>
                  <h3 className="text-xl font-bold text-white mb-1">{fund.name}</h3>
                  <p className="text-sm text-white opacity-90">
                    ${metrics.totalValue.toLocaleString()} | Cash: ${fund.cash.toLocaleString()}
                  </p>
                  {metrics.weightedESGScore > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <Leaf size={16} className="text-white" />
                      <span className="text-sm text-white font-medium">
                        Avg ESG: {metrics.weightedESGScore}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {/* Fund Metrics */}
                  <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-slate-600">Invested</p>
                      <p className="font-bold text-slate-900">${metrics.totalCurrent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Return</p>
                      <p className={`font-bold ${metrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metrics.totalReturn >= 0 ? '+' : ''}${metrics.totalReturn.toLocaleString()} (
                        {metrics.returnPercent.toFixed(2)}%)
                      </p>
                    </div>
                  </div>

                  {/* Positions */}
                  <div className="space-y-3 mb-4">
                    {fund.positions.map((position) => {
                      const costBasis = position.shares * position.purchasePrice;
                      const currentValue = position.shares * (position.currentPrice || position.purchasePrice);
                      const posReturn = currentValue - costBasis;
                      const posReturnPercent = (posReturn / costBasis) * 100;

                      return (
                        <div key={position.id} className="border border-slate-200 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-900">{position.symbol}</p>
                                {position.esgRating && (
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded font-bold text-white ${getESGColor(position.esgScore)}`}
                                  >
                                    {position.esgRating}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600">
                                {position.shares} shares @ ${position.purchasePrice}
                              </p>
                            </div>
                            <button
                              onClick={() => removePosition(fund.id, position.id)}
                              className="text-slate-400 hover:text-red-600"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Current:</span>
                              <span className="font-medium">
                                ${(position.currentPrice || position.purchasePrice).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Value:</span>
                              <span className="font-medium">${currentValue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Return:</span>
                              <span className={`font-bold ${posReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {posReturn >= 0 ? '+' : ''}${posReturn.toFixed(2)} ({posReturnPercent.toFixed(2)}%)
                              </span>
                            </div>

                            {/* ESG Breakdown */}
                            {position.esgScore && (
                              <div className="mt-2 pt-2 border-t border-slate-200">
                                <div className="flex items-center gap-1 mb-1">
                                  <Leaf size={12} className={getESGTextColor(position.esgScore)} />
                                  <span className="text-xs font-medium text-slate-700">ESG Score: {position.esgScore}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 text-xs">
                                  <div className="text-center">
                                    <div className="text-slate-600">E</div>
                                    <div className="font-medium">{position.environmentalScore}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-slate-600">S</div>
                                    <div className="font-medium">{position.socialScore}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-slate-600">G</div>
                                    <div className="font-medium">{position.governanceScore}</div>
                                  </div>
                                </div>
                                {position.esgSource && (
                                  <p className="text-xs text-slate-500 mt-1 italic">{position.esgSource}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Position Form */}
                  {showAddPosition === fund.id ? (
                    <div className="space-y-2 p-3 bg-slate-50 rounded-lg">
                      <input
                        type="text"
                        placeholder="Symbol (e.g., TSLA)"
                        value={newPosition.symbol}
                        onChange={(e) => setNewPosition({ ...newPosition, symbol: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Shares"
                        value={newPosition.shares}
                        onChange={(e) => setNewPosition({ ...newPosition, shares: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Purchase Price"
                          value={newPosition.price}
                          onChange={(e) => setNewPosition({ ...newPosition, price: e.target.value })}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={fetchCurrentPrice}
                          disabled={fetchingPrice || !newPosition.symbol}
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          title="Get current market price"
                        >
                          {fetchingPrice ? (
                            <RefreshCw size={16} className="animate-spin" />
                          ) : (
                            <DollarSign size={16} />
                          )}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addPosition(fund.id)}
                          disabled={loading === fund.id}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                        >
                          {loading === fund.id ? 'Adding...' : 'Add'}
                        </button>
                        <button
                          onClick={() => {
                            setShowAddPosition(null);
                            setNewPosition({ symbol: '', shares: '', price: '' });
                          }}
                          className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowAddPosition(fund.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus size={16} />
                        Add Position
                      </button>
                      <button
                        onClick={() => refreshPrices(fund.id)}
                        disabled={loading === fund.id || fund.positions.length === 0}
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
                      >
                        {loading === fund.id ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <RefreshCw size={16} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ESG Info */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Leaf className="text-green-600" size={24} />
            About ESG Ratings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Environmental (E)</h4>
              <p className="text-slate-600">
                Measures company's impact on climate, resource use, waste, and pollution.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Social (S)</h4>
              <p className="text-slate-600">
                Evaluates labor practices, diversity, human rights, and community relations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Governance (G)</h4>
              <p className="text-slate-600">
                Assesses board composition, executive compensation, and shareholder rights.
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>ESG Ratings:</strong> A+ (90+) · A (80-89) · B+ (70-79) · B (60-69) · C (50-59) · D (&lt;50)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
