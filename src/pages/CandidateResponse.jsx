import React from 'react';

const CandidateResponse = ({ data }) => {
  const { candidateInfo, techId, responses, totalScore,actualTotalScore, submittedAt } = data;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 bg-gray-50 min-h-screen">
      <div className="text-3xl font-bold text-gray-800 mb-2">Candidate Response</div>
      <p className="text-sm text-gray-500">Submitted on {new Date(submittedAt).toLocaleString()}</p>

      {/* Basic Information */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">🧍 Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <div><strong>Name:</strong> {candidateInfo.name}</div>
          <div><strong>Email:</strong> {candidateInfo.email}</div>
          <div><strong>Phone:</strong> {candidateInfo.phone}</div>
          <div><strong>DOB:</strong> {candidateInfo.dob}</div>
          <div><strong>Gender:</strong> {candidateInfo.gender}</div>
          <div><strong>State:</strong> {candidateInfo.state}</div>
          <div><strong>City:</strong> {candidateInfo.city}</div>
          <div><strong>Experience:</strong> {candidateInfo.experience}</div>
        </div>
      </div>

      {/* Current Company Info */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">🏢 Current Company Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <div><strong>Company:</strong> {candidateInfo.currentCompany}</div>
          <div><strong>Company State:</strong> {candidateInfo.companyState}</div>
          <div><strong>Company City:</strong> {candidateInfo.companyCity}</div>
          <div><strong>Notice Period:</strong> {candidateInfo.noticePeriod}</div>
        </div>
      </div>

      {/* Technology */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">💻 Technology Selected</h2>
        <p className="text-md text-gray-700"><strong>Technology:</strong> {techId.technology}</p>
      </div>

      {/* Question Answers */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-indigo-600">📝 Question Responses</h2>
          <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
            Total Score: {`${totalScore}/${actualTotalScore}`}
          </span>
        </div>

        <div className="space-y-4">
          {responses.map((res) => (
            <div key={res._id} className="border border-gray-200 rounded-xl p-4">
              <p className="font-medium text-gray-800">{res.questionText}</p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Answer:</strong>{' '}
                {Array.isArray(res.answer) ? res.answer.join(', ') : res.answer}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Points Earned:</strong> {res.pointsEarned}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateResponse;
