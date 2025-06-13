import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';

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
            <div key={q.id} className="space-y-2">
              <label className="block font-medium text-gray-700 text-sm sm:text-base">
                {q.question} <span className="text-red-500">*</span>
              </label>
              <Controller
                name={`questions.${q.id}`}
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full border rounded-md shadow-sm p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
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
                <p className="text-sm text-red-600">
                  {errors.questions[q.id].message}
                </p>
              )}
            </div>
          );
        case 'checkbox':
          return (
            <div key={q.id} className="space-y-3">
              <label className="block font-medium text-gray-700 text-sm sm:text-base">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt) => (
                      <label
                        key={opt._id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
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
                          className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="text-sm sm:text-base text-gray-700">
                          {opt.label || opt.value}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              />
              {errors.questions?.[q.id] && (
                <p className="text-sm text-red-600">
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
    'Company Info',
    'Tech & Questions',
    'Preview',
  ];

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center space-y-6">
          {/* Logo Section */}
          <div className="flex justify-center">
            <div className="w-24 h-12 sm:w-32 sm:h-16 rounded-xl flex items-center justify-center shadow-md bg-white">
              <img src="emilo-logo.png" alt="Emilo Logo" className="h-8 sm:h-12 object-contain" />
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700">🎉 Application Submitted!</h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
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
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            You may now safely close this tab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="text-center border-b border-gray-200 p-4 sm:p-6">
          <div className="flex justify-center mb-3">
            <img src="emilo-logo.png" alt="Emilo Logo" className="h-10 sm:h-12 w-auto" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Emilo Ventures</h1>
          <p className="text-xs sm:text-sm md:text-base text-indigo-600 font-medium mt-1">If it's there, it's here</p>
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mt-2">Join Our Growing Team</h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 max-w-2xl mx-auto leading-relaxed">
            We're looking for passionate developers to join our team. Complete the application form to get started.
          </p>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            {/* Step Indicator */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6 sm:mb-8">
              <div className="flex flex-wrap gap-4 sm:gap-6 w-full sm:w-auto justify-center sm:justify-start">
                {stepTitles.map((label, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${
                        step === index + 1 ? 'bg-indigo-600' : step > index + 1 ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      {step > index + 1 ? '✓' : index + 1}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium transition-colors ${
                        step === index + 1
                          ? 'text-indigo-600'
                          : step > index + 1 
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1 - Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                      type="text"
                      className={`w-full border rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Please enter a valid 10-digit phone number'
                        }
                      })}
                      type="tel"
                      className={`w-full border rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter 10-digit phone number"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      type="email"
                      className={`w-full border rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* DOB */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('dob', { 
                        required: 'Date of birth is required'
                      })}
                      type="date"
                      className={`w-full border rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${
                        errors.dob ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dob && (
                      <p className="text-sm text-red-600">{errors.dob.message}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('gender', {
                        required: 'Gender is required',
                      })}
                      className={`w-full border rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${
                        errors.gender ? 'border-red-500' : 'border-gray-300'
                      }`}
                      defaultValue=""
                    >
                      <option value="" disabled>Select your gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {errors.gender && (
                      <p className="text-sm text-red-600">{errors.gender.message}</p>
                    )}
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('state', { 
                        required: 'State is required'
                      })}
                      type="text"
                      className={`w-full border rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your state"
                    />
                    {errors.state && (
                      <p className="text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('city', { 
                        required: 'City is required'
                      })}
                      type="text"
                      className={`w-full border rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your city"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Experience (in months) <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('experience', { 
                        required: 'Experience is required',
                        min: { value: 0, message: 'Experience cannot be negative' },
                        valueAsNumber: true
                      })}
                      type="number"
                      min="0"
                      className={`w-full border rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${
                        errors.experience ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter experience in months"
                    />
                    {errors.experience && (
                      <p className="text-sm text-red-600">{errors.experience.message}</p>
                    )}
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Resume <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="file"
                    control={control}
                    rules={{ required: 'Resume is required' }}
                    render={({ field: { onChange, value, ...field } }) => (
                      <div className="space-y-2">
                        <input
                          {...field}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleResumeChange(e, onChange)}
                          className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${
                            errors.file ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <p className="text-xs text-gray-500">
                          Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                        </p>
                      </div>
                    )}
                  />
                  {errors.file && (
                    <p className="text-sm text-red-600">{errors.file.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 - Company Information */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 border-b pb-2">Current Company Information</h2>
                <p className="text-sm text-gray-600">This section is optional. You can skip it if you're not currently employed.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Current Company */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      {...register('currentCompany')}
                      className="w-full border border-gray-300 rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
                      placeholder="Enter current company name"
                    />
                  </div>

                  {/* Company State */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Company State</label>
                    <input
                      {...register('companyState')}
                      className="w-full border border-gray-300 rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
                      placeholder="Enter company state"
                    />
                  </div>

                  {/* Company City */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Company City</label>
                    <input
                      {...register('companyCity')}
                      className="w-full border border-gray-300 rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
                      placeholder="Enter company city"
                    />
                  </div>

                  {/* Company Designation */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Current Designation</label>
                    <input
                      {...register('companyDesignation')}
                      className="w-full border border-gray-300 rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
                      placeholder="Enter current designation"
                    />
                  </div>

                  {/* Notice Period */}
                  <div className="space-y-2 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Notice Period (In Days)</label>
                    <input
                      {...register('noticePeriod')}
                      type="number"
                      className="w-full sm:max-w-xs border border-gray-300 rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
                      placeholder="Enter notice period in days"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 - Technology & Questions */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 border-b pb-2">Technology & Questions</h2>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Technology <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('tech', { 
                      required: 'Please select a technology'
                    })}
                    className={`w-full border rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${
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
                    <p className="text-sm text-red-600">{errors.tech.message}</p>
                  )}
                </div>

                {dynamicQuestions.length > 0 && (
                  <div className="space-y-6 pt-4">
                    <h3 className="text-base sm:text-lg font-medium text-gray-800">Technology-specific Questions</h3>
                    <div className="space-y-6">{renderQuestions(dynamicQuestions)}</div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4 - Preview */}
            {step === 4 && (
              <div className="space-y-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-b pb-2">
                  Preview Your Application
                </h2>

                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-indigo-700 border-b pb-1">Basic Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base text-gray-800">
                    <div><span className="font-medium">Name:</span> {watch('name')}</div>
                    <div><span className="font-medium">Phone:</span> {watch('phone')}</div>
                    <div><span className="font-medium">Email:</span> {watch('email')}</div>
                    <div><span className="font-medium">DOB:</span> {watch('dob')}</div>
                    <div><span className="font-medium">Gender:</span> {watch('gender')}</div>
                    <div><span className="font-medium">State:</span> {watch('state')}</div>
                    <div><span className="font-medium">City:</span> {watch('city')}</div>
                    <div><span className="font-medium">Experience:</span> {watch('experience')} months</div>
                    <div className="sm:col-span-2"><span className="font-medium">Resume:</span> {watch('file')?.name || 'Not uploaded'}</div>
                  </div>
                </div>

                {/* Company Info */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-indigo-700 border-b pb-1">Company Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base text-gray-800">
                    <div><span className="font-medium">Company Name:</span> {watch('currentCompany') || 'Not provided'}</div>
                    <div><span className="font-medium">Company State:</span> {watch('companyState') || 'Not provided'}</div>
                    <div><span className="font-medium">Company City:</span> {watch('companyCity') || 'Not provided'}</div>
                    <div><span className="font-medium">Designation:</span> {watch('companyDesignation') || 'Not provided'}</div>
                    <div className="sm:col-span-2"><span className="font-medium">Notice Period:</span> {watch('noticePeriod') ? `${watch('noticePeriod')} days` : 'Not provided'}</div>
                  </div>
                </div>

                {/* Technology & Questions */}
                {watchedTech && (
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-indigo-700 border-b pb-1">Technology & Questions</h3>
                    <div className="text-sm sm:text-base text-gray-800 space-y-3">
                      <div>
                        <span className="font-medium">Technology:</span> {watch('tech')}
                      </div>
                      {dynamicQuestions.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-700">Responses:</h4>
                          <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                            {dynamicQuestions.map((q) => (
                              <div key={q.id} className="space-y-1">
                                <p className="font-medium text-gray-700">{q.question}</p>
                                <p className="text-gray-600 pl-2">
                                  {Array.isArray(watch(`questions.${q.id}`))
                                    ? watch(`questions.${q.id}`)?.join(', ') || 'Not answered'
                                    : watch(`questions.${q.id}`) || 'Not answered'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 space-y-3 sm:space-y-0 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="w-full sm:w-auto px-6 py-3 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                  >
                    ← Back
                  </button>
                )}
                
                {step < 4 ? (
                  <button
                    type="button"
                    disabled={step === 2 && isSubmitting}
                    onClick={handleNext}
                    className={`w-full sm:w-auto px-6 py-3 rounded-md text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      step === 2 && isSubmitting 
                        ? 'bg-indigo-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {step === 2 ? (isSubmitting ? 'Saving...' : 'Save & Continue →') : 'Next →'}
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto px-6 py-3 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                    >
                      ✏️ Edit Application
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full sm:w-auto px-8 py-3 rounded-md text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                        isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isSubmitting ? '⏳ Submitting...' : '🚀 Submit Application'}
                    </button>
                  </div>
                )}
              </div>
              
              {/* Progress indicator */}
              <div className="text-xs sm:text-sm text-gray-500 order-first sm:order-last">
                Step {step} of {stepTitles.length}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;