import React, { useState,useEffect } from 'react';
import Input from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/Select';
import { Card, CardContent } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';



const CandidateForm = () => {
  const [techRoles,setTechRoles] = useState([]);
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
    questions: {}
  });

  const fetchTechnologies = async()=>{
    try{
      const result = await axios.get(`${API_BASE_URL}/forms`);
      console.log('here is',(result.data));
      if(result.data.success){
        console.log('2 ',result.data.data);
        setTechRoles(result.data.data);
      }
    }catch(error){
      console.log(error.message);
    }
  }

  useEffect(()=>{
    fetchTechnologies();
  },[null])

  const handleChange = (field, value) => {
    if(field === 'tech'){

    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        [field]: value
      }
    }));
  };


  useEffect(() => {
  const fetchDynamicForm = async () => {
    if (!formData.tech) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/forms/${formData.tech}`);
      console.log('res: ',res.data);
      if (res.data.success) {
        setDynamicQuestions(res.data.data[0].questions);
      }
    } catch (err) {
      console.error('Error loading form:', err);
    }
  };

  fetchDynamicForm();
}, [formData.tech]);




const renderQuestions = (dynamicQuestions) => {
  
  console.log('dynamicQuestions: ',dynamicQuestions);
  
  return dynamicQuestions.map((q) => {
    const fieldValue = formData.questions[q.id] || (q.type === 'checkbox' ? [] : '');
    
    switch (q.type) {
      case 'number':
        return (
          <div key={q.id}>
            <label className="block font-medium text-sm text-gray-700 mt-2">{q.question}</label>
            <Input
              type="number"
              placeholder={q.question}
              value={fieldValue}
              onChange={(e) => handleQuestionChange(q.id, e.target.value)}
            />
          </div>
        );

      case 'select':
        return (
          <div key={q.id}>
            <label className="block font-medium text-sm text-gray-700 mt-2">{q.question}</label>
            <Select
              value={fieldValue}
              onValueChange={(val) => handleQuestionChange(q.id, val)}
            >
              <SelectTrigger>
                <SelectValue placeholder={q.question} />
              </SelectTrigger>
              <SelectContent>
                {q.options.map((opt) => (
                  <SelectItem key={opt._id} value={opt.value}>
                    {opt.label || opt.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={q.id}>
            <label className="block font-medium text-sm text-gray-700 mt-2">{q.question}</label>
            <div className="flex flex-wrap gap-3">
              {q.options.map((opt) => (
                <label key={opt._id} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
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
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm">{opt.label || opt.value}</span>
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
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    console.log('Form Submitted:', formData);
    // Submit to backend here
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <CardContent className="p-6 space-y-6">
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Full Name" onChange={(e) => handleChange('name', e.target.value)} />
                <Input placeholder="Phone" onChange={(e) => handleChange('phone', e.target.value)} />
                <Input placeholder="Email" onChange={(e) => handleChange('email', e.target.value)} />
                <Input placeholder="Date of Birth" type="date" onChange={(e) => handleChange('dob', e.target.value)} />
                <Input placeholder="State" onChange={(e) => handleChange('state', e.target.value)} />
                <Input placeholder="City" onChange={(e) => handleChange('city', e.target.value)} />
                <Input placeholder="Overall Experience (Years)" onChange={(e) => handleChange('experience', e.target.value)} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold">Current Company Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Current Working Place" onChange={(e) => handleChange('currentCompany', e.target.value)} />
                <Input placeholder="Company State" onChange={(e) => handleChange('companyState', e.target.value)} />
                <Input placeholder="Company City" onChange={(e) => handleChange('companyCity', e.target.value)} />
                <Input placeholder="Notice Period" onChange={(e) => handleChange('noticePeriod', e.target.value)} />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold">Select Technology Role</h2>
              <label>Select Technology</label>
              <Select value={formData.tech} onChange={(val) => handleChange('tech', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose Tech Stack" value={formData.tech} />
              </SelectTrigger>
              <SelectContent>
                {techRoles.map((role) => (
                  <SelectItem key={role._id} value={role.technology}>{role.technology}</SelectItem>
                ))}
              </SelectContent>
            </Select>

              <div className="pt-6 space-y-4">
                {renderQuestions(dynamicQuestions)}
              </div>
            </>
          )}

          <div className="flex justify-between pt-6">
            {step > 1 && <Button onClick={handleBack} variant="outline">Back</Button>}
            {step < 3 && <Button onClick={handleNext}>Next</Button>}
            {step === 3 && <Button onClick={handleSubmit}>Submit</Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateForm;
