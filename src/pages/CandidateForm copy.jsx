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


  const renderQuestions = () => {
    
    if (!dynamicQuestions.length) return null;
  
    return (
      <>
      
        {/* Q1: Number of Flutter apps */}
        <label className='block font-medium text-sm text-gray-700 mt-2'>How many Flutter apps have you built?</label>
        <Input
          type="number"
          placeholder="How many Flutter apps have you built?"
          onChange={(e) => handleQuestionChange('flutter_apps', e.target.value)}
          value={formData.questions.flutter_apps || ''}
        />

        {/* Q2: Used Firebase */}
        <label className='block font-medium text-sm text-gray-700 mt-2'>Used Firebase?</label>
        <Select
          value={formData.questions.firebase || ""}
          onChange={(val) => handleQuestionChange('firebase', val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Used Firebase?" value={formData.questions.firebase} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>

        {/* Q3: State Management Approaches (Multi-select) */}
        <label className="block font-medium text-sm text-gray-700 mt-2">State Management Used</label>
        <div className="flex flex-wrap gap-3">
          {['Provider', 'BLoC', 'GetX'].map((item) => (
            <label key={item} className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.questions.state_mgmt?.includes(item) || false}
                onChange={(e) => {
                  const selected = formData.questions.state_mgmt || [];
                  if (e.target.checked) {
                    handleQuestionChange('state_mgmt', [...selected, item]);
                  } else {
                    handleQuestionChange(
                      'state_mgmt',
                      selected.filter((i) => i !== item)
                    );
                  }
                }}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </div>

       
      </>
    );
    
  
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
                {renderQuestions()}
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
