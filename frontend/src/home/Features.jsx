import React from 'react'
const Features = () => {
  return (
    
      <section id="features" className=" bg-gray-50 border-t border-gray-200 scroll-mt-16 px-6">
<div className="bg-gray-50 min-h-screen flex flex-col items-center px-6 py-12">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            Give Your Institution a Voice in the AI Era
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl text-center mb-12">
        Our platform helps educational institutions understand how they are represented in AI responses, 
        track visibility against peer institutions, and make data-driven decisions to strengthen their reputation.
      </p>

      {/* Feature grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        
        {/* Feature 1 */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <div className="text-blue-600 text-4xl mb-4">🏫</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Institution Visibility Tracking</h3>
          <p className="text-gray-600">
            Monitor how your school or university appears in AI-generated answers compared to other institutions.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <div className="text-green-600 text-4xl mb-4">📈</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Peer Benchmarking</h3>
          <p className="text-gray-600">
            Compare your institution’s ranking and mentions with peer schools to see where you stand.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <div className="text-purple-600 text-4xl mb-4">💬</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Sentiment Insights</h3>
          <p className="text-gray-600">
            Discover whether your institution is represented positively, negatively, or neutrally in AI content.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <div className="text-orange-600 text-4xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Academic Program Mentions</h3>
          <p className="text-gray-600">
            Track which of your programs or departments are most visible in AI responses and academic discussions.
          </p>
        </div>

        {/* Feature 5 */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <div className="text-red-600 text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Secure Access for Institutions</h3>
          <p className="text-gray-600">
            Safe, role-based access for administrators, faculty, and staff — keeping your data protected.
          </p>
        </div>

        {/* Feature 6 */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <div className="text-yellow-600 text-4xl mb-4">📥</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Data Export & Reporting</h3>
          <p className="text-gray-600">
            Export insights into CSV reports to support institutional strategy, admissions, and communications.
          </p>
        </div>
      </div>
    </div>
      </section>
  );
}

export default Features