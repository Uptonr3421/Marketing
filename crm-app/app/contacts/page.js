'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// Mock data - in production, this would come from an API
const mockContacts = [
  { id: 1, rank: 1, company: 'Adobe Acrobat', contact: 'Sarah Chen', email: 'cit46532@adobe.com', tier: 1, status: 'active' },
  { id: 2, rank: 2, company: 'Akron Art Museum', contact: 'Jennifer Fiume', email: 'jfiume@akronartmuseum.org', tier: 1, status: 'active' },
  { id: 3, rank: 3, company: 'A Taste of Excellence', contact: 'Rachel Schwieterman', email: 'rschwieterman@taste-food.com', tier: 2, status: 'contacted' },
  { id: 4, rank: 4, company: 'AfterMath', contact: 'Mike McCallum', email: 'mmccallum@teamaftermath.com', tier: 2, status: 'contacted' },
  { id: 5, rank: 5, company: 'Akron AIDS Collaborative', contact: 'Stan Williams', email: 'stan1727@gmail.com', tier: 2, status: 'active' },
  { id: 6, rank: 6, company: 'AFox Solutions', contact: 'Laura Edgington', email: 'ledgington@americanbus.com', tier: 3, status: 'prospect' },
  { id: 7, rank: 7, company: 'Akron Art Museum', contact: 'Bob Bartlett', email: 'bBartlett@akronartmuseum.org', tier: 3, status: 'prospect' },
  { id: 8, rank: 8, company: 'A Taste of Excellence', contact: 'Kaitlyn Sauers', email: 'kaitlyn.sauers@taste-food.com', tier: 3, status: 'inactive' },
];

const statusOptions = ['active', 'contacted', 'prospect', 'inactive'];

export default function ContactsPage() {
  const [contacts, setContacts] = useState(mockContacts);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contacts, searchTerm]);

  const handleStatusChange = (id, newStatus) => {
    setContacts(contacts.map(contact =>
      contact.id === id ? { ...contact, status: newStatus } : contact
    ));
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

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-50 text-green-700';
      case 'contacted':
        return 'bg-blue-50 text-blue-700';
      case 'prospect':
        return 'bg-purple-50 text-purple-700';
      case 'inactive':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
          <p className="text-gray-600">Manage your contact relationships and outreach</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Contacts
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by company or contact name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                        {contact.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{contact.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{contact.contact}</div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {contact.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTierBadgeColor(contact.tier)}`}>
                        Tier {contact.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={contact.status}
                        onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border-0 outline-none cursor-pointer ${getStatusBadgeColor(contact.status)}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/contacts/${contact.id}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search terms
              </p>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{contacts.length}</div>
              <div className="text-sm text-gray-600">Total Contacts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {contacts.filter(c => c.tier === 1).length}
              </div>
              <div className="text-sm text-gray-600">Tier 1</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {contacts.filter(c => c.tier === 2).length}
              </div>
              <div className="text-sm text-gray-600">Tier 2</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {contacts.filter(c => c.tier === 3).length}
              </div>
              <div className="text-sm text-gray-600">Tier 3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
