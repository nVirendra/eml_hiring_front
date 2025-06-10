import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const CandidateForm = () => {
  const [techRoles, setTechRoles] = useState([]);
  const [step, setStep] = useState(1);
  const [dynamicQuestions, setDynamicQuestions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    state: '',
    city: '',
    experience: '',
    currentCompany: '',
    companyState: '',
    companyCity: '',
    companyDesignation: '',
    noticePeriod: '',
    techId: '',
    tech: '',
    questions: {},
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/forms`).then((res) => {
      if (res.data.success) setTechRoles(res.data.data);
    });
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!formData.tech) return;
      const res = await axios.get(`${API_BASE_URL}/forms/${formData.tech}`);
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, techId: res.data.data[0]._id }));
        setDynamicQuestions(res.data.data[0].questions);
      }
    };
    loadQuestions();
  }, [formData.tech]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: { ...prev.questions, [id]: value },
    }));
  };

  const handleSubmit = async () => {
    try {
      const result = await axios.post(`${API_BASE_URL}/responses`, formData);
      console.log('Submitted:', result.data);
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  const renderQuestions = (questions) =>
    questions.map((q) => {
      const value = formData.questions[q.id] || (q.type === 'checkbox' ? [] : '');
      switch (q.type) {
        case 'number':
        case 'select':
          return (
            <div key={q.id}>
              <label className="block font-medium text-gray-700 mt-4">{q.question}</label>
              <select
                value={value}
                onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
              >
                <option value="">-- Select --</option>
                {q.options.map((opt) => (
                  <option key={opt._id} value={opt.value}>
                    {opt.label || opt.value}
                  </option>
                ))}
              </select>
            </div>
          );
        case 'checkbox':
          return (
            <div key={q.id} className="mt-4">
              <label className="block font-medium text-gray-700">{q.question}</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {q.options.map((opt) => (
                  <label key={opt._id} className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      value={opt.value}
                      checked={value.includes(opt.value)}
                      onChange={(e) => {
                        const updated = new Set(value);
                        e.target.checked ? updated.add(opt.value) : updated.delete(opt.value);
                        handleQuestionChange(q.id, Array.from(updated));
                      }}
                      className="text-indigo-600 rounded"
                    />
                    {opt.label || opt.value}
                  </label>
                ))}
              </div>
            </div>
          );
        default:
          return null;
      }
    });

  const stepTitles = ['Basic Info', 'Company Info', 'Technology & Questions'];

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 bg-white rounded-xl shadow-lg space-y-8">
      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-4">
        {stepTitles.map((label, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm ${
                step === index + 1 ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              {index + 1}
            </div>
            <span className={`text-sm ${step === index + 1 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['name', 'phone', 'email', 'dob', 'state', 'city', 'experience'].map((field, i) => (
              <input
                key={i}
                type={field === 'dob' ? 'date' : 'text'}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            ))}
          </div>
        </>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <>
          <h2 className="text-xl font-semibold text-gray-800">Current Company Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['currentCompany', 'companyState', 'companyCity', 'companyDesignation', 'noticePeriod'].map((field, i) => (
              <input
                key={i}
                placeholder={field.replace(/([A-Z])/g, ' $1')}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            ))}
          </div>
        </>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <>
          <h2 className="text-xl font-semibold text-gray-800">Technology & Questions</h2>
          <label className="block font-medium text-gray-700 mt-2">Select Technology</label>
          <select
            className="border border-gray-300 rounded-md p-2 w-full mt-1 focus:ring-2 focus:ring-indigo-500"
            value={formData.tech}
            onChange={(e) => handleChange('tech', e.target.value)}
          >
            <option value="">-- Choose Technology --</option>
            {techRoles.map((role) => (
              <option key={role._id} value={role.technology}>
                {role.technology}
              </option>
            ))}
          </select>

          <div className="mt-6 space-y-4">{renderQuestions(dynamicQuestions)}</div>
        </>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Back
          </button>
        )}
        {step < 3 && (
          <button
            onClick={() => {
              if (step === 3 && !formData.tech) return alert('Please select a tech stack');
              setStep(step + 1);
            }}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Next
          </button>
        )}
        {step === 3 && (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default CandidateForm;
