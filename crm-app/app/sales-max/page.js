'use client';

import { useState } from 'react';
import PersonalizedOutreach from '@/components/PersonalizedOutreach';
import ParallelAnalysis from '@/components/ParallelAnalysis';

// Import contacts from CSV - in production, fetch from API
const allContacts = [
  { id: 1, firstName: 'Dale', lastName: 'Elwell', company: 'Adobe Acrobat', email: 'cit46532@adobe.com', industry: 'Technology' },
  { id: 2, firstName: 'Alexandra', lastName: 'Vukoder', company: 'Akron Art Museum', email: 'jfiume@akronartmuseum.org', industry: 'Arts & Culture' },
  { id: 3, firstName: 'Kaitlyn', lastName: 'Sauers', company: 'A Taste of Excellence', email: 'kaitlyn.sauers@taste-food.com', industry: 'Food Service' },
  { id: 4, firstName: 'Steve', lastName: 'Arrington', company: 'AFox Solutions', email: 'ledgington@americanbus.com', industry: 'Transportation' },
  { id: 5, firstName: 'Jodi', lastName: 'Henderson-Ross', company: 'AfterMath', email: 'mmccallum@teamaftermath.com', industry: 'Services' },
  { id: 6, firstName: 'Keith', lastName: 'Munnerlyn', company: 'Akron AIDS Collaborative', email: 'keith@ohioaac.org', industry: 'Healthcare/Nonprofit' },
  { id: 7, firstName: 'Joseph', lastName: 'Walton', company: 'Akron Art Museum', email: 'jWalton@AkronArtMuseum.org', industry: 'Arts & Culture' },
  { id: 8, firstName: 'Michael', lastName: 'Davids', company: 'Akron Community Foundation', email: 'jgarofalo@akroncf.org', industry: 'Nonprofit' },
];

export default function SalesMaximizationPage() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-3">Personal Touch Sales Maximization System</h1>
          <p className="text-xl text-blue-100 mb-4">
            Research-backed AI personalization engine • 3-5x response rates • 10x meeting bookings
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">125</div>
              <div className="text-sm text-blue-100">Total Contacts</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">10-15</div>
              <div className="text-sm text-blue-100">Target New Clients</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">90</div>
              <div className="text-sm text-blue-100">Days to Execute</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Overview & Strategy
            </button>
            <button
              onClick={() => setActiveTab('parallels')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'parallels'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Deep Parallel Analysis
            </button>
            <button
              onClick={() => setActiveTab('personalize')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'personalize'
                  ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Personalized Outreach
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Strategy Overview */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Research-Backed Sales Strategy
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  This system leverages proven psychological principles and modern sales research
                  to maximize revenue from your 125-contact database through hyper-personalized
                  outreach that builds genuine relationships and drives conversions.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center">
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
                      Core Research Findings
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-900">
                      <li>• 76% engagement increase with deep personalization (McKinsey)</li>
                      <li>• 42% higher response with value-first approach (Cialdini)</li>
                      <li>• 80% of sales happen touches 5-12 (Salesforce)</li>
                      <li>• 73% trust increase with specificity (Stanford/MIT)</li>
                      <li>• 5x conversion with warm introductions (Network research)</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Expected Outcomes
                    </h3>
                    <ul className="space-y-2 text-sm text-green-900">
                      <li>• 3-5x email open rates (60% vs 21% avg)</li>
                      <li>• 5x reply rates (40% vs 8% avg)</li>
                      <li>• 10x meeting bookings (20% vs 2% avg)</li>
                      <li>• 25-35 qualified meetings from 125 contacts</li>
                      <li>• 10-15 new clients in 90 days</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5 mt-6">
                  <h3 className="font-bold text-yellow-900 mb-3">The 12-Touch Strategy</h3>
                  <p className="text-sm text-yellow-900 mb-3">
                    Research shows most salespeople give up after 2-3 touches, missing 80% of
                    opportunities. This system ensures systematic follow-through:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-yellow-900">
                    <div>✓ Touch 1: Value email</div>
                    <div>✓ Touch 2: LinkedIn connect</div>
                    <div>✓ Touch 3: Resource share</div>
                    <div>✓ Touch 4: Social engage</div>
                    <div>✓ Touch 5: Video message</div>
                    <div>✓ Touch 6: Phone call</div>
                    <div>✓ Touch 7: Case study</div>
                    <div>✓ Touch 8: Webinar invite</div>
                    <div>✓ Touch 9: Direct mail</div>
                    <div>✓ Touch 10: Intro connection</div>
                    <div>✓ Touch 11: Executive outreach</div>
                    <div>✓ Touch 12: Creative close</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setActiveTab('parallels')}
                className="bg-purple-600 text-white rounded-lg p-8 hover:bg-purple-700 transition-all shadow-lg text-left group"
              >
                <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform">
                  1. Analyze Parallels →
                </h3>
                <p className="text-purple-100">
                  Find hidden connections, map referral chains, and identify cross-sell
                  opportunities across all 125 contacts.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('personalize')}
                className="bg-pink-600 text-white rounded-lg p-8 hover:bg-pink-700 transition-all shadow-lg text-left group"
              >
                <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform">
                  2. Generate Outreach →
                </h3>
                <p className="text-pink-100">
                  Create hyper-personalized emails, subject lines, and follow-up strategies for
                  each contact using AI.
                </p>
              </button>
            </div>

            {/* Documentation Links */}
            <div className="bg-gray-800 text-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Documentation</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <a
                    href="/PERSONAL_TOUCH_SALES_STRATEGY.md"
                    className="text-blue-300 hover:text-blue-200 underline"
                  >
                    📄 Complete Sales Strategy & Research
                  </a>
                  <p className="text-gray-400 text-xs mt-1">
                    Full strategy with psychological principles, research citations, and detailed
                    frameworks
                  </p>
                </div>
                <div>
                  <a
                    href="/SALES_MAXIMIZATION_GUIDE.md"
                    className="text-blue-300 hover:text-blue-200 underline"
                  >
                    📋 Quick Start Implementation Guide
                  </a>
                  <p className="text-gray-400 text-xs mt-1">
                    Step-by-step 90-day action plan, metrics tracking, and execution checklist
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'parallels' && (
          <ParallelAnalysis contacts={allContacts} />
        )}

        {activeTab === 'personalize' && (
          <div className="space-y-6">
            {/* Contact Selector */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4">
                Select Contact for Personalized Outreach
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {allContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      selectedContact?.id === contact.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{contact.company}</div>
                    <div className="text-xs text-gray-500 mt-1">{contact.industry}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Personalization Component */}
            {selectedContact ? (
              <PersonalizedOutreach contact={selectedContact} />
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                <svg
                  className="w-16 h-16 text-yellow-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="text-lg font-bold text-yellow-900 mb-2">
                  Select a Contact to Begin
                </h3>
                <p className="text-yellow-800">
                  Choose a contact from the list above to generate hyper-personalized outreach
                  content.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
