'use client';

import { useState } from 'react';

export default function ParallelAnalysis({ contacts = [] }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const runParallelAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-agents/analyze-parallels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contacts }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze parallels');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <svg
            className="w-8 h-8 mr-3 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Deep Parallel Analysis Engine
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          AI-powered pattern recognition • Find hidden connections • Maximize cross-sell
          opportunities
        </p>
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-900">{contacts.length}</div>
          <div className="text-sm text-blue-700 mt-1">Total Contacts</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="text-3xl font-bold text-green-900">
            {Math.round(contacts.length * 0.2)}
          </div>
          <div className="text-sm text-green-700 mt-1">Expected Conversions (20%)</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="text-3xl font-bold text-purple-900">10-15</div>
          <div className="text-sm text-purple-700 mt-1">Target New Clients (90 days)</div>
        </div>
      </div>

      {/* Analysis Info */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h3 className="font-bold text-indigo-900 mb-2">What This Analysis Reveals:</h3>
        <ul className="space-y-1 text-sm text-indigo-800">
          <li>• Industry clusters and cross-selling opportunities</li>
          <li>• Geographic patterns for in-person meeting optimization</li>
          <li>• Hidden connections and referral mapping</li>
          <li>• Pain point clustering by sector</li>
          <li>• Tier recommendations for ROI maximization</li>
          <li>• Parallel outreach campaign strategies</li>
          <li>• Strategic sequencing for warm introductions</li>
          <li>• 90-day action plan for maximum conversions</li>
        </ul>
      </div>

      {/* Run Analysis Button */}
      <button
        onClick={runParallelAnalysis}
        disabled={loading || contacts.length === 0}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Analyzing {contacts.length} Contacts for Deep Parallels...
          </span>
        ) : (
          `Analyze All ${contacts.length} Contacts for Hidden Patterns`
        )}
      </button>

      {contacts.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            No contacts loaded. Please import contacts or refresh the page.
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error: {error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6 border-t pt-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center text-lg">
              <svg
                className="w-6 h-6 text-green-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Deep Parallel Analysis Complete
            </h3>
            <p className="text-sm text-gray-700">
              Analyzed {analysis.totalContacts} contacts • Generated{' '}
              {new Date(analysis.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Intelligence Brief */}
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-gray-900">Intelligence Briefing</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(analysis.analysis);
                  alert('Analysis copied to clipboard!');
                }}
                className="text-sm bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Copy Analysis
              </button>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-900 leading-relaxed font-mono text-sm">
                {analysis.analysis}
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-orange-50 border border-orange-300 rounded-lg p-5">
            <h3 className="font-bold text-orange-900 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              Next Steps for Maximum Sales
            </h3>
            <ol className="space-y-2 text-sm text-orange-900 ml-4">
              <li className="list-decimal">
                Review tier recommendations and prioritize Tier 1 contacts (35)
              </li>
              <li className="list-decimal">
                Use PersonalizedOutreach component for each Tier 1 contact (white-glove treatment)
              </li>
              <li className="list-decimal">
                Launch parallel campaigns identified in analysis (group similar contacts)
              </li>
              <li className="list-decimal">
                Follow referral mapping strategy (warm introductions = 5x conversion)
              </li>
              <li className="list-decimal">Execute 12-touch sequences systematically</li>
              <li className="list-decimal">
                Track metrics: open rates, reply rates, meeting bookings, conversions
              </li>
            </ol>
          </div>

          {/* Research Backing */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Research Foundation:</strong> This analysis uses AI pattern recognition
              combined with proven sales research: multi-touch attribution (Salesforce), social
              proof effects (Meta-analysis), and network theory. By identifying parallels and
              connections, you can leverage warm introductions (5x higher conversion) and
              industry-specific messaging (3x higher engagement).
            </p>
          </div>

          {/* Export Button */}
          <button
            onClick={() => {
              const blob = new Blob([analysis.analysis], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `parallel-analysis-${new Date().toISOString().split('T')[0]}.md`;
              a.click();
            }}
            className="w-full bg-gray-800 text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Export Analysis as Markdown
          </button>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gray-100 rounded-lg p-4 text-xs text-gray-600">
        <p className="font-semibold mb-2">How to Use This Analysis:</p>
        <p>
          1. Run analysis once you have all contacts loaded
          <br />
          2. Review the intelligence briefing for patterns and opportunities
          <br />
          3. Follow tier recommendations for resource allocation
          <br />
          4. Execute parallel campaigns to scale outreach efficiently
          <br />
          5. Use referral mapping for warm introductions
          <br />
          6. Track results and refine based on actual conversion data
        </p>
      </div>
    </div>
  );
}
