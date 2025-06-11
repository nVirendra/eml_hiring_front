import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const CandidateForm = () => {
  const [submitted, setSubmitted] = useState(false);

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
    file: null,
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResumeChange = (e) => {
    const resume = e.target.files?.[0];
    if (resume) {
      setFormData((prev) => ({ ...prev, file: resume }));
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
      const form = new FormData();
      for (const key in formData) {
        if (key === 'questions') {
          form.append('questions', JSON.stringify(formData.questions));
        } else {
          form.append(key, formData[key]);
        }
      }
      const result = await axios.post(`${API_BASE_URL}/responses`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (result.data?.success) {
        setSubmitted(true);
      }

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

  const stepTitles = [
    'Basic Info',
    'Company Info',
    'Technology & Questions',
    'Preview',
  ];

  if (submitted) {
  return (
    <div className="max-w-xl mx-auto py-20 px-6 bg-white rounded-xl shadow-lg text-center space-y-6">
      {/* Logo Section */}
      <div className="flex justify-center">
        <div className="w-32 h-16 rounded-xl flex items-center justify-center shadow-md bg-white">
          <img src="emilo-logo.png" alt="Emilo Logo" className="h-12 object-contain" />
        </div>
      </div>

      {/* Success Message */}
      <h2 className="text-3xl font-bold text-green-700">🎉 Application Submitted!</h2>
      <p className="text-gray-600 text-md max-w-md mx-auto">
        Thank you for applying to <span className="font-semibold text-gray-800">Emilo Ventures</span>.
        We appreciate your interest. Our team will review your application and reach out soon.
      </p>

      {/* Button */}
      <button
  onClick={() => {
    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      dob: '',
      state: '',
      city: '',
      experience: '',
      file: null,
      currentCompany: '',
      companyState: '',
      companyCity: '',
      companyDesignation: '',
      noticePeriod: '',
      techId: '',
      tech: '',
      questions: {},
    });
    setStep(1);
    setSubmitted(false);

    // Attempt to close window
    setTimeout(() => {
      window.close();
    }, 100); // delay for cleanup before closing
  }}
  className="inline-block mt-6 px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
>
  You may now safely close this tab.
</button>

    </div>
  );
}

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 bg-white rounded-xl shadow-lg space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 border-b border-gray-200 pb-8">
        <div className="flex justify-center">
          <div className="w-30 h-16 rounded-xl flex items-center justify-center shadow-lg">
            <img src="emilo-logo.png" alt="Logo" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Emilo Ventures</h1>
        <p className="text-lg text-indigo-600 font-medium">
          Where Innovation Meets Opportunity
        </p>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Join Our Growing Team
        </h2>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          We're looking for passionate developers to join our team. Complete the
          application form to get started.
        </p>
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
            {['name', 'phone', 'email', 'dob', 'state', 'city', 'experience'].map(
              (field, i) => (
                <input
                  key={i}
                  type={field === 'dob' ? 'date' : 'text'}
                  placeholder={field.replace(/([A-Z])/g, ' $1')}
                  value={formData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              )
            )}
          </div>
          <div className="md:col-span-2 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume
            </label>
            <input
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
          <div className="mt-6 space-y-4">{renderQuestions(dynamicQuestions)}</div>
        </>
      )}

      {step === 4 && (
  <div className="space-y-10">
    <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
      Preview Your Application
    </h2>

    {/* Basic Info */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-indigo-700 border-b pb-1">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
        <div><span className="font-medium">Name:</span> {formData.name}</div>
        <div><span className="font-medium">Phone:</span> {formData.phone}</div>
        <div><span className="font-medium">Email:</span> {formData.email}</div>
        <div><span className="font-medium">DOB:</span> {formData.dob}</div>
        <div><span className="font-medium">State:</span> {formData.state}</div>
        <div><span className="font-medium">City:</span> {formData.city}</div>
        <div><span className="font-medium">Experience:</span> {formData.experience}</div>
        <div><span className="font-medium">Resume:</span> {formData.file?.name || 'Not uploaded'}</div>
      </div>
    </div>

    {/* Company Info */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-indigo-700 border-b pb-1">Company Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
        <div><span className="font-medium">Company Name:</span> {formData.currentCompany}</div>
        <div><span className="font-medium">Company State:</span> {formData.companyState}</div>
        <div><span className="font-medium">Company City:</span> {formData.companyCity}</div>
        <div><span className="font-medium">Designation:</span> {formData.companyDesignation}</div>
        <div><span className="font-medium">Notice Period:</span> {formData.noticePeriod}</div>
      </div>
    </div>

    {/* Technology & Questions */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-indigo-700 border-b pb-1">Technology & Questions</h3>
      <div className="text-sm text-gray-800">
        <div className="mb-2">
          <span className="font-medium">Technology:</span> {formData.tech}
        </div>
        <ul className="space-y-2 list-disc list-inside">
          {dynamicQuestions.map((q) => (
            <li key={q.id}>
              <span className="font-medium">{q.question}</span>:{" "}
              {Array.isArray(formData.questions[q.id])
                ? formData.questions[q.id].join(', ')
                : formData.questions[q.id] || 'N/A'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
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
        {step < 4 && (
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
        {step === 4 && (
          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateForm;
