import React from 'react';
import { FileText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardStats = ({ stats,onTechClick ,selectedTech }) => {
  const { totalForms, totalResponses, recentResponses, topTechnologies } = stats;

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-sm opacity-80">Total Forms</h3>
            <p className="text-4xl font-bold">{totalForms}</p>
          </div>
          <FileText className="w-10 h-10 opacity-80" />
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-sm opacity-80">Total Responses</h3>
            <p className="text-4xl font-bold">{totalResponses}</p>
          </div>
          <Users className="w-10 h-10 opacity-80" />
        </div>
      </div>

      {/* Top Technologies */}
      <div className="border rounded-xl shadow-sm p-6 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">🔥 Technologies</h2>
        <div className="flex flex-wrap gap-4">
          {topTechnologies.map((tech) => (
            <button
              key={tech.formId}
              onClick={() => onTechClick(tech.formId)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
                selectedTech === tech.formId
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              {tech.technology} — {tech.count} responses
            </button>
          ))}
        </div>
      </div>

      {/* Recent Responses */}
      <div className="border rounded-xl shadow-sm p-6 bg-gray-50">
  <h2 className="text-lg font-semibold text-gray-800 mb-4">🕓 Recent Responses</h2>

  {recentResponses.length === 0 ? (
    <p className="text-gray-500">No recent responses available.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recentResponses.map((resp) => (
        <Link to={`/candidate-response/${resp._id}`} key={resp._id}>
          <div className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-lg transition duration-300 ease-in-out">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-lg text-gray-800">{resp.candidateInfo.name}</p>
                <p className="text-sm text-gray-500">{resp.candidateInfo.email}</p>
                <p className="text-sm text-gray-500">{resp.candidateInfo.phone}</p>
              </div>
              <div className="text-right text-sm space-y-1">
                <p>
                  <span className="font-medium text-gray-700">Tech:</span> {resp.techId.technology}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Score:</span> {`${resp.totalScore}/${resp.actualTotalScore}`}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2 space-y-1">
              <p>Created at: {new Date(resp.candidateInfo.createdAt).toLocaleString()}</p>
              <p>Submitted at: {new Date(resp.submittedAt).toLocaleString()}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )}
</div>


      
    </div>
  );
};

export default DashboardStats;
