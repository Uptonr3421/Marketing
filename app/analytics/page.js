export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sales Performance</h2>
          <p className="text-gray-600">
            Sales performance charts and metrics will be displayed here.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Insights</h2>
          <p className="text-gray-600">
            Customer analytics and insights will be displayed here.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue Trends</h2>
          <p className="text-gray-600">
            Revenue trend analysis will be displayed here.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Activity Reports</h2>
          <p className="text-gray-600">
            Activity reports and statistics will be displayed here.
          </p>
        </div>
      </div>
    </div>
  )
}
