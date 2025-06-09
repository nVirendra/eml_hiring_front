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
    noticePeriod: '',
    tech: '',
    questions: {},
  });

  const fetchTechnologies = async () => {
    try {
      const result = await axios.get(`${API_BASE_URL}/forms`);
      if (result.data.success) {
        setTechRoles(result.data.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: {
        ...prev.questions,
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    const fetchDynamicForm = async () => {
      if (!formData.tech) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/forms/${formData.tech}`);
        if (res.data.success) {
          setDynamicQuestions(res.data.data[0].questions);
        }
      } catch (err) {
        console.error('Error loading form:', err);
      }
    };

    fetchDynamicForm();
  }, [formData.tech]);

  const renderQuestions = (questions) => {
    return questions.map((q) => {
      const fieldValue = formData.questions[q.id] || (q.type === 'checkbox' ? [] : '');

      switch (q.type) {
        case 'number':
        case 'select':
          return (
            <div key={q.id}>
              <label className="block text-sm font-medium text-gray-700 mt-2">{q.question}</label>
              <select
                value={fieldValue}
                onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
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
            <div key={q.id}>
              <label className="block text-sm font-medium text-gray-700 mt-2">{q.question}</label>
              <div className="flex flex-wrap gap-3 mt-1">
                {q.options.map((opt) => (
                  <label key={opt._id} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                      value={opt.value}
                      checked={fieldValue.includes(opt.value)}
                      onChange={(e) => {
                        const selected = new Set(fieldValue);
                        if (e.target.checked) {
                          selected.add(opt.value);
                        } else {
                          selected.delete(opt.value);
                        }
                        handleQuestionChange(q.id, Array.from(selected));
                      }}
                    />
                    <span className="ml-2">{opt.label || opt.value}</span>
                  </label>
                ))}
              </div>
            </div>
          );

        default:
          return null;
      }
    });
  };

  const handleNext = () => {
    if (step === 3 && !formData.tech) return alert('Please select a tech role.');
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    console.log('Form Submitted:', formData);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Full Name" className="border p-2 rounded" onChange={(e) => handleChange('name', e.target.value)} />
            <input placeholder="Phone" className="border p-2 rounded" onChange={(e) => handleChange('phone', e.target.value)} />
            <input placeholder="Email" className="border p-2 rounded" onChange={(e) => handleChange('email', e.target.value)} />
            <input type="date" className="border p-2 rounded" onChange={(e) => handleChange('dob', e.target.value)} />
            <input placeholder="State" className="border p-2 rounded" onChange={(e) => handleChange('state', e.target.value)} />
            <input placeholder="City" className="border p-2 rounded" onChange={(e) => handleChange('city', e.target.value)} />
            <input placeholder="Experience (Years)" className="border p-2 rounded" onChange={(e) => handleChange('experience', e.target.value)} />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Current Company Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Current Company" className="border p-2 rounded" onChange={(e) => handleChange('currentCompany', e.target.value)} />
            <input placeholder="Company State" className="border p-2 rounded" onChange={(e) => handleChange('companyState', e.target.value)} />
            <input placeholder="Company City" className="border p-2 rounded" onChange={(e) => handleChange('companyCity', e.target.value)} />
            <input placeholder="Notice Period" className="border p-2 rounded" onChange={(e) => handleChange('noticePeriod', e.target.value)} />
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Technology Selection</h2>
          <label className="block text-sm font-medium text-gray-700">Select Technology</label>
          <select
            className="w-full border p-2 mt-1 rounded"
            value={formData.tech}
            onChange={(e) => handleChange('tech', e.target.value)}
          >
            <option value="">-- Choose Tech Stack --</option>
            {techRoles.map((role) => (
              <option key={role._id} value={role.technology}>
                {role.technology}
              </option>
            ))}
          </select>

          <div className="pt-6 space-y-4">{renderQuestions(dynamicQuestions)}</div>
        </>
      )}

      <div className="flex justify-between pt-6">
        {step > 1 && (
          <button onClick={handleBack} className="px-4 py-2 bg-gray-100 rounded border border-gray-300">
            Back
          </button>
        )}
        {step < 3 && (
          <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded">
            Next
          </button>
        )}
        {step === 3 && (
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default CandidateForm;
