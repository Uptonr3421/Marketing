'use client';

import { useState } from 'react';

export default function PersonalizedOutreach({ contact }) {
  const [loading, setLoading] = useState(false);
  const [touchNumber, setTouchNumber] = useState(1);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [context, setContext] = useState('');
  const [error, setError] = useState(null);

  const generatePersonalizedOutreach = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-agents/personalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact,
          touchNumber,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate personalized content');
      }

      const data = await response.json();
      setGeneratedContent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          AI-Powered Personal Touch Generator
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Research-backed personalization engine • 3-5x response rates • 10x meeting bookings
        </p>
      </div>

      {/* Contact Info Display */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Target Contact</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Name:</span>
            <span className="ml-2 font-medium">
              {contact?.firstName} {contact?.lastName}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Company:</span>
            <span className="ml-2 font-medium">{contact?.company}</span>
          </div>
          <div>
            <span className="text-gray-600">Email:</span>
            <span className="ml-2 font-medium">{contact?.email}</span>
          </div>
          <div>
            <span className="text-gray-600">Industry:</span>
            <span className="ml-2 font-medium">{contact?.industry || 'Not specified'}</span>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Touch Number (1-12)
          </label>
          <select
            value={touchNumber}
            onChange={(e) => setTouchNumber(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <key key={num} value={num}>
                Touch {num} - {getTouchDescription(num)}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Research shows 80% of sales happen between touches 5-12
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Context (Optional)
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Add any specific details: recent company news, mutual connections, specific pain points, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            More context = deeper personalization = higher conversion rates
          </p>
        </div>

        <button
          onClick={generatePersonalizedOutreach}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Generating Hyper-Personalized Content...
            </span>
          ) : (
            'Generate Personal Touch Outreach'
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error: {error}</p>
        </div>
      )}

      {/* Generated Content Display */}
      {generatedContent && (
        <div className="space-y-6 border-t pt-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Personalized Content Generated Successfully
            </h3>
            <p className="text-sm text-gray-700">
              Touch #{generatedContent.touchNumber} for {generatedContent.contact.name} at{' '}
              {generatedContent.contact.company}
            </p>
          </div>

          {/* Generated Content */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                {generatedContent.generated}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedContent.generated);
                alert('Content copied to clipboard!');
              }}
              className="flex-1 bg-gray-800 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={() => setGeneratedContent(null)}
              className="flex-1 bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Generate Another
            </button>
          </div>

          {/* Research Backing Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900">
              <strong>Research-Backed Approach:</strong> This content uses proven psychological
              triggers including reciprocity (Cialdini), specificity (Stanford/MIT studies), and
              the PAID method to maximize response rates. Expected: 3-5x higher engagement than
              generic outreach.
            </p>
          </div>
        </div>
      )}

      {/* Strategy Guide */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
        <h3 className="font-bold text-purple-900 mb-2">12-Touch Strategy Guide</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-purple-800">
          <div>Touch 1: Value email</div>
          <div>Touch 7: Case study</div>
          <div>Touch 2: LinkedIn connect</div>
          <div>Touch 8: Webinar invite</div>
          <div>Touch 3: Resource share</div>
          <div>Touch 9: Direct mail</div>
          <div>Touch 4: Social engage</div>
          <div>Touch 10: Intro connection</div>
          <div>Touch 5: Video message</div>
          <div>Touch 11: Executive outreach</div>
          <div>Touch 6: Phone call</div>
          <div>Touch 12: Creative close</div>
        </div>
        <p className="text-xs text-purple-700 mt-3">
          Remember: Most salespeople quit after 2-3 touches. 80% of sales happen between touches
          5-12. Persistence with value = maximum conversions.
        </p>
      </div>
    </div>
  );
}

function getTouchDescription(num) {
  const descriptions = {
    1: 'Initial value email',
    2: 'LinkedIn connection',
    3: 'Resource/article share',
    4: 'Social media engagement',
    5: 'Video message',
    6: 'Phone call',
    7: 'Case study delivery',
    8: 'Webinar invitation',
    9: 'Direct mail piece',
    10: 'Strategic introduction',
    11: 'Executive outreach',
    12: 'Creative close email',
  };
  return descriptions[num] || 'Follow-up';
}
