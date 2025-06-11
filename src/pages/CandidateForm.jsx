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
    resume: null,
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

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      formData.resume = file;
    }
  };

  const handleQuestionChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: { ...prev.questions, [id]: value },
    }));
  };

  const handleSubmit = async () => {
    try {
      const result = await axios.post(`${API_BASE_URL}/responses`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Submitted:', result.data);
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  const renderQuestions = (questions) =>
    questions.map((q) => {
      const value =
        formData.questions[q.id] || (q.type === 'checkbox' ? [] : '');
      switch (q.type) {
        case 'number':
        case 'select':
          return (
            <div key={q.id}>
              <label className="block font-medium text-gray-700 mt-4">
                {q.question}
              </label>
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
              <label className="block font-medium text-gray-700">
                {q.question}
              </label>
              <div className="flex flex-wrap gap-4 mt-2">
                {q.options.map((opt) => (
                  <label
                    key={opt._id}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <input
                      type="checkbox"
                      value={opt.value}
                      checked={value.includes(opt.value)}
                      onChange={(e) => {
                        const updated = new Set(value);
                        e.target.checked
                          ? updated.add(opt.value)
                          : updated.delete(opt.value);
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
      {/* Logo and Header Section */}
      <div className="text-center space-y-4 border-b border-gray-200 pb-8">
        {/* Company Logo */}
        <div className="flex justify-center">
          <div className="w-30 h-16  rounded-xl flex items-center justify-center shadow-lg">
            <img src="emilo-logo.png"></img>
          </div>
        </div>

        {/* Company Name & Tagline */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emilo Ventures</h1>
          <p className="text-lg text-indigo-600 font-medium">
            Where Innovation Meets Opportunity
          </p>
        </div>

        {/* Hiring Description */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Join Our Growing Team
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We're looking for passionate developers and tech enthusiasts to join
            our dynamic team. Take the first step towards an exciting career
            with us by completing this application form.
          </p>
        </div>
      </div>

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
            <span
              className={`text-sm ${
                step === index + 1
                  ? 'text-indigo-600 font-medium'
                  : 'text-gray-500'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold text-gray-800">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'name',
              'phone',
              'email',
              'dob',
              'state',
              'city',
              'experience',
            ].map((field, i) => (
              <input
                key={i}
                type={field === 'dob' ? 'date' : 'text'}
                placeholder={
                  field.charAt(0).toUpperCase() +
                  field.slice(1).replace(/([A-Z])/g, ' $1')
                }
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            ))}
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="resume"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Resume
            </label>
            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
            </p>
          </div>
        </>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <>
          <h2 className="text-xl font-semibold text-gray-800">
            Current Company Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'currentCompany',
              'companyState',
              'companyCity',
              'companyDesignation',
              'noticePeriod',
            ].map((field, i) => (
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
          <h2 className="text-xl font-semibold text-gray-800">
            Technology & Questions
          </h2>
          <label className="block font-medium text-gray-700 mt-2">
            Select Technology
          </label>
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

          <div className="mt-6 space-y-4">
            {renderQuestions(dynamicQuestions)}
          </div>
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
              if (step === 3 && !formData.tech)
                return alert('Please select a tech stack');
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
