import React from 'react';
import { FileText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardStats = ({ stats }) => {
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

      {/* Recent Responses */}
      <div className="border rounded-xl shadow-sm p-6 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">🕓 Recent Responses</h2>
        {recentResponses.length === 0 ? (
          <p className="text-gray-500">No recent responses available.</p>
        ) : (
          <div className="space-y-5">
            {recentResponses.map((resp) => (
              <Link to={`/candidate-response/${resp._id}`} key={resp._id}>
                <div className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-lg transition">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold text-lg">{resp.candidateInfo.name}</p>
                      <p className="text-sm text-gray-500">{resp.candidateInfo.email}</p>
                      <p className="text-sm text-gray-500">{resp.candidateInfo.phone}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Tech:</span> {resp.techId.technology}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Score:</span> {resp.totalScore}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted at: {new Date(resp.submittedAt).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Top Technologies */}
      <div className="border rounded-xl shadow-sm p-6 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">🔥 Top Technologies</h2>
        <div className="flex flex-wrap gap-4">
          {topTechnologies.map((tech) => (
            <div
              key={tech._id}
              className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-medium border border-indigo-200"
            >
              {tech._id} — {tech.count} responses
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
