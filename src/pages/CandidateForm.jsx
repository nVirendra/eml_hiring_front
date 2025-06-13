import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const CandidateForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [techRoles, setTechRoles] = useState([]);
  const [step, setStep] = useState(1);
  const [dynamicQuestions, setDynamicQuestions] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      dob: '',
      gender: '',
      state: '',
      city: '',
      experience: 0,
      file: null,
      currentCompany: '',
      companyState: '',
      companyCity: '',
      companyDesignation: '',
      noticePeriod: '',
      techId: '',
      tech: '',
      questions: {},
    }
  });

  const watchedTech = watch('tech');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/forms`).then((res) => {
      if (res.data.success) setTechRoles(res.data.data);
    });
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!watchedTech) return;
      const res = await axios.get(`${API_BASE_URL}/forms/${watchedTech}`);
      if (res.data.success) {
        setValue('techId', res.data.data[0]._id);
        setDynamicQuestions(res.data.data[0].questions);
        
        // Reset questions when tech changes
        setValue('questions', {});
      }
    };
    loadQuestions();
  }, [watchedTech, setValue]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleResumeChange = (e, onChange) => {
    const resume = e.target.files?.[0];
    if (resume) {
      onChange(resume);
      trigger('file');
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const result = await axios.post(`${API_BASE_URL}/responses`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (result.data?.success) {
        setSubmitted(true);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
    }finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = async (currentStep) => {
    let fieldsToValidate = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['name', 'phone', 'email', 'dob','gender', 'state', 'city', 'experience', 'file'];
        break;
      case 2:
        // No validation required for company info fields - they are optional
        return true;
      case 3:
        fieldsToValidate = ['tech'];
        // Add dynamic questions validation
        dynamicQuestions.forEach(q => {
          fieldsToValidate.push(`questions.${q.id}`);
        });
        break;
      default:
        return true;
    }
    
    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isStepValid = await validateStep(step);
    if (isStepValid) {
      if(step === 2 && !watchedTech){
        const formData = getValues();
        console.log('formData inside handleNext',formData);
        try {
            setIsSubmitting(true);
            const result = await axios.post(`${API_BASE_URL}/responses`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (result.data?.success) {
              setIsSubmitting(false);
              setStep(step + 1);
            }
          } catch (err) {
            console.error('Save error:', err);
            setIsSubmitting(false);
          }finally {
            setIsSubmitting(false);
          }
      }
      if (step === 3 && !watchedTech) {
        alert('Please select a technology');
        return;
      }
      setStep(step + 1);
    }
  };

  const renderQuestions = (questions) =>
    questions.map((q) => {
      switch (q.type) {
        case 'number':
        case 'select':
          return (
            <div key={q.id}>
              <label className="block font-medium text-gray-700 mt-4">
                {q.question} <span className="text-red-500">*</span>
              </label>
              <Controller
                name={`questions.${q.id}`}
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.questions?.[q.id] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Select --</option>
                    {q.options.map((opt) => (
                      <option key={opt._id} value={opt.value}>
                        {opt.label || opt.value}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.questions?.[q.id] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.questions[q.id].message}
                </p>
              )}
            </div>
          );
        case 'checkbox':
          return (
            <div key={q.id} className="mt-4">
              <label className="block font-medium text-gray-700">
                {q.question} <span className="text-red-500">*</span>
              </label>
              <Controller
                name={`questions.${q.id}`}
                control={control}
                rules={{ 
                  required: 'Please select at least one option',
                  validate: value => (Array.isArray(value) && value.length > 0) || 'Please select at least one option'
                }}
                defaultValue={[]}
                render={({ field: { onChange, value = [] } }) => (
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
                            onChange(Array.from(updated));
                          }}
                          className="text-indigo-600 rounded"
                        />
                        {opt.label || opt.value}
                      </label>
                    ))}
                  </div>
                )}
              />
              {errors.questions?.[q.id] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.questions[q.id].message}
                </p>
              )}
            </div>
          );
        default:
          return null;
      }
    });

  const stepTitles = [
    'Basic Info',
    'Current Company Info',
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
            setValue('name', '');
            setValue('phone', '');
            setValue('email', '');
            setValue('dob', '');
            setValue('state', '');
            setValue('city', '');
            setValue('experience', 0);
            setValue('file', null);
            setValue('currentCompany', '');
            setValue('companyState', '');
            setValue('companyCity', '');
            setValue('companyDesignation', '');
            setValue('noticePeriod', '');
            setValue('techId', '');
            setValue('tech', '');
            setValue('questions', {});
            setStep(1);
            setSubmitted(false);

            // Attempt to close window
            setTimeout(() => {
              window.close();
            }, 100);
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
<div className="text-center border-b border-gray-200 pb-6 pt-6 px-4">
  <div className="flex justify-center mb-3">
    <img src="emilo-logo.png" alt="Emilo Logo" className="h-12 w-auto" />
  </div>
  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Emilo Ventures</h1>
  <p className="text-sm md:text-base text-indigo-600 font-medium mt-1">If it's there, it's here</p>
  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mt-2">Join Our Growing Team</h2>
  <p className="text-sm md:text-base text-gray-600 mt-1 max-w-2xl mx-auto leading-snug">
    We're looking for passionate developers to join our team. Complete the application form to get started.
  </p>
</div>


      <form onSubmit={handleSubmit(onSubmit)}>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">  Full Name <span className="text-red-500">*</span></label>
                <input
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  type="text"
                  className={`border rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">  Phone <span className="text-red-500">*</span></label>
                <input
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                  type="tel"
                  className={`border rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">  Email <span className="text-red-500">*</span></label>
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  type="email"
                  className={`border rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700">  DOB <span className="text-red-500">*</span></label>
                <input
                  {...register('dob', { 
                    required: 'Date of birth is required'
                  })}
                  type="date"
                  className={`border rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                    errors.dob ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dob && (
                  <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('gender', {
                    required: 'Gender is required',
                  })}
                  className={`border rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                    errors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
                  defaultValue=""
                >
                  <option value="" disabled>Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>


              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700">  State <span className="text-red-500">*</span></label>
                <input
                  {...register('state', { 
                    required: 'State is required'
                  })}
                  type="text"
                  className={`border rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700">  City <span className="text-red-500">*</span></label>
                <input
                  {...register('city', { 
                    required: 'City is required'
                  })}
                  type="text"
                  placeholder="City *"
                  className={`border rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700">  Experience ( in month) <span className="text-red-500">*</span></label>
                <input
                  {...register('experience', { 
                    required: 'Experience is required',
                    min: { value: 0, message: 'Experience cannot be negative' },
                    valueAsNumber: true
                  })}
                  type="number"
                  min="0"
                  className={`border rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                )}
              </div>
            </div>

            {/* Resume Upload */}
            <div className="md:col-span-2 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume <span className="text-red-500">*</span>
              </label>
              <Controller
                name="file"
                control={control}
                rules={{ required: 'Resume is required' }}
                render={({ field: { onChange, value, ...field } }) => (
                  <input
                    {...field}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleResumeChange(e, onChange)}
                    className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                      errors.file ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                )}
              />
              {errors.file && (
                <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
              </p>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            {/* <h2 className="text-xl font-semibold text-gray-800">
              Current Company Info
            </h2> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  {...register('currentCompany')}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Company State */}
              <div>
                <label className="block text-sm font-medium text-gray-700"> Company State</label>
                <input
                  {...register('companyState')}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Company City */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Company City</label>
                <input
                  {...register('companyCity')}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Company Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Designation</label>
                <input
                  {...register('companyDesignation')}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Notice Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Notice Period (In Days)</label>
                <input
                  {...register('noticePeriod')}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            {/* <h2 className="text-xl font-semibold text-gray-800">
              Technology & Questions
            </h2> */}
            <div>
              <label className="block font-medium text-gray-700 mt-2">
                Select Technology <span className="text-red-500">*</span>
              </label>
              <select
                {...register('tech', { 
                  required: 'Please select a technology'
                })}
                className={`border rounded-md p-2 w-full mt-1 focus:ring-2 focus:ring-indigo-500 ${
                  errors.tech ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Choose Technology --</option>
                {techRoles.map((role) => (
                  <option key={role._id} value={role.technology}>
                    {role.technology}
                  </option>
                ))}
              </select>
              {errors.tech && (
                <p className="mt-1 text-sm text-red-600">{errors.tech.message}</p>
              )}
            </div>
            <div className="mt-6 space-y-4">{renderQuestions(dynamicQuestions)}</div>
          </>
        )}

        {/* Step 4 - Preview */}
        {step === 4 && (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
              Preview Your Application
            </h2>

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-indigo-700 border-b pb-1">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                <div><span className="font-medium">Name:</span> {watch('name')}</div>
                <div><span className="font-medium">Phone:</span> {watch('phone')}</div>
                <div><span className="font-medium">Email:</span> {watch('email')}</div>
                <div><span className="font-medium">DOB:</span> {watch('dob')}</div>
                <div><span className="font-medium">State:</span> {watch('state')}</div>
                <div><span className="font-medium">City:</span> {watch('city')}</div>
                <div><span className="font-medium">Experience:</span> {watch('experience')}</div>
                <div><span className="font-medium">Resume:</span> {watch('file')?.name || 'Not uploaded'}</div>
              </div>
            </div>

            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-indigo-700 border-b pb-1">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                <div><span className="font-medium">Company Name:</span> {watch('currentCompany')}</div>
                <div><span className="font-medium">Company State:</span> {watch('companyState')}</div>
                <div><span className="font-medium">Company City:</span> {watch('companyCity')}</div>
                <div><span className="font-medium">Designation:</span> {watch('companyDesignation')}</div>
                <div><span className="font-medium">Notice Period:</span> {watch('noticePeriod')}</div>
              </div>
            </div>

            {/* Technology & Questions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-indigo-700 border-b pb-1">Technology & Questions</h3>
              <div className="text-sm text-gray-800">
                <div className="mb-2">
                  <span className="font-medium">Technology:</span> {watch('tech')}
                </div>
                <ul className="space-y-2 list-disc list-inside">
                  {dynamicQuestions.map((q) => (
                    <li key={q.id}>
                      <span className="font-medium">{q.question}</span>:{" "}
                      {Array.isArray(watch(`questions.${q.id}`))
                        ? watch(`questions.${q.id}`)?.join(', ')
                        : watch(`questions.${q.id}`) || 'N/A'}
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
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Back
            </button>
          )}
          {step < 4 && (
            <button
            type="button"
            disabled={step === 2 && isSubmitting}
            onClick={handleNext}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {step === 2 ? (isSubmitting ? 'Saving...' : 'Save & Continue') : 'Next'}
          </button>

          )}
          {step === 4 && (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-white ${
                isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              } transition`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>

            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CandidateForm;