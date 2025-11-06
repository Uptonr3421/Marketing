'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock data - in production, this would come from an API
const mockContactData = {
  1: {
    id: 1,
    name: 'Sarah Chen',
    company: 'Adobe Acrobat',
    email: 'cit46532@adobe.com',
    role: 'Director of Marketing',
    tier: 1,
    status: 'active',
    research: `Adobe Acrobat is a leading document management and PDF solutions company. They are focused on digital transformation and workflow automation. Recent company news indicates they are expanding their enterprise solutions division and investing heavily in AI-powered document processing.`,
    painPoints: [
      'Managing document workflows across distributed teams',
      'Need for better integration with existing CRM systems',
      'Seeking automation solutions for repetitive tasks',
      'Looking to improve customer engagement through personalized communications'
    ],
    linkedInMessage: `Hi Sarah,

I noticed Adobe Acrobat is expanding its enterprise solutions division. I've been working with similar companies in the document management space to streamline their workflow automation and CRM integration.

Would love to share some insights on how we've helped companies reduce manual processes by 40% while improving customer engagement.

Are you open to a brief conversation next week?

Best regards`,
    emailMessage: `Subject: Streamlining Document Workflows at Adobe Acrobat

Hi Sarah,

I hope this email finds you well. I've been following Adobe Acrobat's recent expansion in enterprise solutions and am impressed by your focus on AI-powered document processing.

I work with companies in the document management space to optimize their workflow automation and CRM integration. We've helped similar organizations:

• Reduce manual document processing by 40%
• Improve cross-team collaboration efficiency
• Enhance customer engagement through personalized communications
• Seamlessly integrate with existing CRM systems

I'd love to share some specific case studies that might be relevant to Adobe Acrobat's current initiatives.

Would you be available for a 15-minute call next week?

Best regards`,
    activities: [
      { id: 1, type: 'note', content: 'Initial outreach sent via LinkedIn', date: '2025-11-01', user: 'John Smith' },
      { id: 2, type: 'email', content: 'Follow-up email sent with case studies', date: '2025-11-02', user: 'John Smith' },
      { id: 3, type: 'note', content: 'Connection accepted on LinkedIn', date: '2025-11-03', user: 'System' },
      { id: 4, type: 'call', content: 'Brief intro call scheduled for next week', date: '2025-11-04', user: 'John Smith' }
    ]
  },
  2: {
    id: 2,
    name: 'Jennifer Fiume',
    company: 'Akron Art Museum',
    email: 'jfiume@akronartmuseum.org',
    role: 'Executive Director',
    tier: 1,
    status: 'active',
    research: `The Akron Art Museum is a renowned cultural institution focused on contemporary art. They are currently running a major fundraising campaign and looking to expand their digital presence to reach younger audiences.`,
    painPoints: [
      'Need to engage younger demographics',
      'Limited digital marketing budget',
      'Want to improve donor relationship management',
      'Seeking innovative ways to promote exhibitions'
    ],
    linkedInMessage: `Hi Jennifer,

I've been following the Akron Art Museum's initiatives to expand digital engagement with younger audiences. I work with cultural institutions to develop cost-effective digital strategies that resonate with millennial and Gen Z demographics.

Would you be interested in learning about how we've helped similar museums increase youth engagement by 65%?

Looking forward to connecting.`,
    emailMessage: `Subject: Expanding Digital Engagement at Akron Art Museum

Hi Jennifer,

I hope you're doing well. I've been impressed by the Akron Art Museum's commitment to contemporary art and your recent efforts to expand digital outreach.

I specialize in helping cultural institutions develop cost-effective digital strategies that engage younger audiences. Recent projects include:

• Increasing youth engagement by 65% for similar museums
• Developing donor relationship management systems
• Creating social media campaigns that drive exhibition attendance
• Implementing budget-friendly digital marketing solutions

I'd love to share some specific strategies that could help the Akron Art Museum reach its digital engagement goals.

Would you have 20 minutes for a conversation in the coming weeks?

Best regards`,
    activities: [
      { id: 1, type: 'note', content: 'Researched museum\'s current digital initiatives', date: '2025-10-28', user: 'John Smith' },
      { id: 2, type: 'email', content: 'Initial outreach email sent', date: '2025-10-30', user: 'John Smith' }
    ]
  }
};

export default function ContactDetailPage() {
  const params = useParams();
  const contactId = parseInt(params.id);
  const contact = mockContactData[contactId] || mockContactData[1];

  const [notes, setNotes] = useState(contact.activities || []);
  const [newNote, setNewNote] = useState('');
  const [copiedMessage, setCopiedMessage] = useState('');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      const note = {
        id: notes.length + 1,
        type: 'note',
        content: newNote,
        date: new Date().toISOString().split('T')[0],
        user: 'Current User'
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const copyToClipboard = async (text, messageType) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(messageType);
      setTimeout(() => setCopiedMessage(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getTierBadgeColor = (tier) => {
    switch(tier) {
      case 1:
        return 'bg-red-100 text-red-800 border-red-200';
      case 2:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 3:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'note':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'call':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/contacts"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Contacts
          </Link>
        </div>

        {/* Contact Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{contact.name}</h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTierBadgeColor(contact.tier)}`}>
                  Tier {contact.tier}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-lg text-gray-700">{contact.role}</p>
                <p className="text-lg font-semibold text-gray-900">{contact.company}</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline inline-block"
                >
                  {contact.email}
                </a>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Send Email
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  Edit Contact
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Research Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Research</h2>
              <p className="text-gray-700 leading-relaxed">{contact.research}</p>
            </div>

            {/* Pain Points */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pain Points</h2>
              <ul className="space-y-3">
                {contact.painPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Outreach Messages */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Outreach Messages</h2>

              {/* LinkedIn Message */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    LinkedIn Message
                  </h3>
                  <button
                    onClick={() => copyToClipboard(contact.linkedInMessage, 'linkedin')}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    {copiedMessage === 'linkedin' ? (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{contact.linkedInMessage}</pre>
                </div>
              </div>

              {/* Email Message */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Message
                  </h3>
                  <button
                    onClick={() => copyToClipboard(contact.emailMessage, 'email')}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    {copiedMessage === 'email' ? (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{contact.emailMessage}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Add Note Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add Note</h2>
              <form onSubmit={handleAddNote}>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this contact..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
                <button
                  type="submit"
                  className="w-full mt-3 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Note
                </button>
              </form>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Timeline</h2>
              <div className="space-y-4">
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">No activities yet</p>
                ) : (
                  notes.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'note' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'email' ? 'bg-purple-100 text-purple-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">{activity.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{activity.user}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{activity.date}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
