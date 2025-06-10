import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const DynamicFormSystem = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [candidateResponses, setCandidateResponses] = useState({});

  // Admin Form Builder Component
  const AdminFormBuilder = () => {
    const [currentForm, setCurrentForm] = useState({
      id: null,
      title: '',
      technology: '',
      questions: []
    });
    const [editingIndex, setEditingIndex] = useState(-1);

    const questionTypes = [
      { value: 'number', label: 'Number Input' },
      { value: 'select', label: 'Single Select' },
      { value: 'checkbox', label: 'Multiple Choice (Checkbox)' }
    ];

    const addQuestion = () => {
      const newQuestion = {
        id: Date.now(),
        type: 'number',
        question: '',
        options: [],
        scoring: {}
      };
      setCurrentForm(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
      }));
      setEditingIndex(currentForm.questions.length);
    };

    const updateQuestion = (index, field, value) => {
      const updatedQuestions = [...currentForm.questions];
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
      setCurrentForm(prev => ({ ...prev, questions: updatedQuestions }));
    };

    const addOption = (questionIndex) => {
      const updatedQuestions = [...currentForm.questions];
      updatedQuestions[questionIndex].options.push({ label: '', value: '', points: 0 });
      setCurrentForm(prev => ({ ...prev, questions: updatedQuestions }));
    };

    const updateOption = (questionIndex, optionIndex, field, value) => {
      const updatedQuestions = [...currentForm.questions];
      updatedQuestions[questionIndex].options[optionIndex][field] = value;
      
      // Update scoring based on option changes
      if (field === 'value' || field === 'points') {
        const option = updatedQuestions[questionIndex].options[optionIndex];
        updatedQuestions[questionIndex].scoring[option.value] = parseInt(option.points) || 0;
      }
      
      setCurrentForm(prev => ({ ...prev, questions: updatedQuestions }));
    };

    const removeOption = (questionIndex, optionIndex) => {
      const updatedQuestions = [...currentForm.questions];
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      setCurrentForm(prev => ({ ...prev, questions: updatedQuestions }));
    };

    const removeQuestion = (index) => {
      const updatedQuestions = currentForm.questions.filter((_, i) => i !== index);
      setCurrentForm(prev => ({ ...prev, questions: updatedQuestions }));
      setEditingIndex(-1);
    };

    const saveForm = async () => {
      const formToSave = {
        ...currentForm,
        id: currentForm.id || Date.now(),
        createdAt: new Date().toISOString()
      };
      
      console.log('formToSave', formToSave);

      try{
        const result = await axios.post(`${API_BASE_URL}/forms`,formToSave);
      }catch(error){
        console.log('saveForm: ',error.message);
      }

      if (currentForm.id) {
        setForms(prev => prev.map(form => form.id === currentForm.id ? formToSave : form));
      } else {
        setForms(prev => [...prev, formToSave]);
      }
      
      setCurrentForm({ id: null, title: '', technology: '', questions: [] });
      setEditingIndex(-1);
    };

    const loadForm = (form) => {
      setCurrentForm(form);
      setEditingIndex(-1);
    };

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Create Evaluation Form</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Form Title</label>
              <input
                type="text"
                value={currentForm.title}
                onChange={(e) => setCurrentForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., Flutter Developer Assessment"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Technology</label>
              <input
                type="text"
                value={currentForm.technology}
                onChange={(e) => setCurrentForm(prev => ({ ...prev, technology: e.target.value }))}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., Flutter"
              />
            </div>
          </div>

          <div className="space-y-4">
            {currentForm.questions.map((question, questionIndex) => (
              <div key={question.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">Question {questionIndex + 1}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingIndex(editingIndex === questionIndex ? -1 : questionIndex)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => removeQuestion(questionIndex)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {editingIndex === questionIndex ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Question Type</label>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(questionIndex, 'type', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        {questionTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Question Text</label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter your question"
                      />
                    </div>

                    {question.type !== 'number' && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium">Options & Scoring</label>
                          <button
                            onClick={() => addOption(questionIndex)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            <Plus size={14} /> Add Option
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={option.label}
                                onChange={(e) => updateOption(questionIndex, optionIndex, 'label', e.target.value)}
                                className="flex-1 p-2 border rounded-md"
                                placeholder="Option label"
                              />
                              <input
                                type="text"
                                value={option.value}
                                onChange={(e) => updateOption(questionIndex, optionIndex, 'value', e.target.value)}
                                className="w-20 p-2 border rounded-md"
                                placeholder="Value"
                              />
                              <input
                                type="number"
                                value={option.points}
                                onChange={(e) => updateOption(questionIndex, optionIndex, 'points', e.target.value)}
                                className="w-20 p-2 border rounded-md"
                                placeholder="Points"
                              />
                              <button
                                onClick={() => removeOption(questionIndex, optionIndex)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {question.type === 'number' && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium">Number Scoring</label>
                          <button
                            onClick={() => addOption(questionIndex)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            <Plus size={14} /> Add Number Score
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2 items-center">
                              <span className="text-sm font-medium w-16">Number:</span>
                              <input
                                type="number"
                                value={option.value}
                                onChange={(e) => updateOption(questionIndex, optionIndex, 'value', e.target.value)}
                                className="w-20 p-2 border rounded-md"
                                placeholder="e.g., 1"
                              />
                              <span className="text-sm font-medium">Points:</span>
                              <input
                                type="number"
                                value={option.points}
                                onChange={(e) => updateOption(questionIndex, optionIndex, 'points', e.target.value)}
                                className="w-20 p-2 border rounded-md"
                                placeholder="Points"
                              />
                              <button
                                onClick={() => removeOption(questionIndex, optionIndex)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        {question.options.length === 0 && (
                          <div className="text-sm text-gray-500 italic">
                            Add number-to-point mappings (e.g., 1 year = 5 points, 2 years = 5 points, etc.)
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">{question.question || 'Untitled Question'}</p>
                    <p className="text-sm text-gray-600">Type: {questionTypes.find(t => t.value === question.type)?.label}</p>
                    {question.options.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">
                          {question.type === 'number' ? 'Number Scoring:' : 'Options:'}
                        </p>
                        <ul className="text-sm text-gray-600">
                          {question.options.map((option, idx) => (
                            <li key={idx}>
                              {question.type === 'number' 
                                ? `• ${option.value} = ${option.points} points`
                                : `• ${option.label} (${option.points} points)`
                              }
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={addQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Plus size={16} /> Add Question
            </button>
            
            <button
              onClick={saveForm}
              disabled={!currentForm.title || !currentForm.technology || currentForm.questions.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              <Save size={16} /> Save Form
            </button>
          </div>
        </div>

        {/* Existing Forms */}
        {forms.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Existing Forms</h3>
            <div className="grid gap-4">
              {forms.map(form => (
                <div key={form.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{form.title}</h4>
                    <p className="text-sm text-gray-600">{form.technology} • {form.questions.length} questions</p>
                  </div>
                  <button
                    onClick={() => loadForm(form)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Candidate Form Component
  const CandidateForm = () => {
    const [responses, setResponses] = useState({});
    const [score, setScore] = useState(null);

    const handleResponseChange = (questionId, value, isCheckbox = false) => {
      setResponses(prev => {
        if (isCheckbox) {
          const currentValues = prev[questionId] || [];
          const updatedValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
          return { ...prev, [questionId]: updatedValues };
        }
        return { ...prev, [questionId]: value };
      });
    };

    const calculateScore = () => {
      if (!selectedForm) return;

      let totalScore = 0;
      selectedForm.questions.forEach(question => {
        const response = responses[question.id];
        
        if (question.type === 'number') {
          // Use exact number matching with admin-defined scoring
          const num = parseInt(response) || 0;
          totalScore += question.scoring[num.toString()] || 0;
        } else if (question.type === 'select') {
          totalScore += question.scoring[response] || 0;
        } else if (question.type === 'checkbox') {
          if (Array.isArray(response)) {
            response.forEach(value => {
              totalScore += question.scoring[value] || 0;
            });
          }
        }
      });

      setScore(totalScore);
    };

    if (!selectedForm) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Select a Form</h2>
          {forms.length === 0 ? (
            <p className="text-gray-600">No forms available. Please create a form in the Admin panel first.</p>
          ) : (
            <div className="grid gap-3">
              {forms.map(form => (
                <button
                  key={form.id}
                  onClick={() => setSelectedForm(form)}
                  className="text-left p-4 border rounded-lg hover:bg-gray-50"
                >
                  <h3 className="font-medium">{form.title}</h3>
                  <p className="text-sm text-gray-600">{form.technology} Assessment</p>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">{selectedForm.title}</h2>
              <p className="text-gray-600">{selectedForm.technology} Assessment</p>
            </div>
            <button
              onClick={() => setSelectedForm(null)}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Back to Forms
            </button>
          </div>

          <div className="space-y-6">
            {selectedForm.questions.map((question, index) => (
              <div key={question.id} className="border-b pb-6">
                <h3 className="font-medium mb-3">
                  {index + 1}. {question.question}
                </h3>

                {question.type === 'number' && (
                  <input
                    type="number"
                    value={responses[question.id] || ''}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    className="w-full max-w-xs p-2 border rounded-md"
                    placeholder="Enter number"
                  />
                )}

                {question.type === 'select' && (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.value}
                          checked={responses[question.id] === option.value}
                          onChange={(e) => handleResponseChange(question.id, e.target.value)}
                          className="w-4 h-4"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'checkbox' && (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={(responses[question.id] || []).includes(option.value)}
                          onChange={(e) => handleResponseChange(question.id, option.value, true)}
                          className="w-4 h-4"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={calculateScore}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Calculate Score
            </button>

            {score !== null && (
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{score} Points</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Dynamic Form Evaluation System</h1>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'admin' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Admin Panel
            </button>
            <button
              onClick={() => setActiveTab('candidate')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'candidate' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Preview Form
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'admin' ? <AdminFormBuilder /> : <CandidateForm />}
      </div>
    </div>
  );
};

export default DynamicFormSystem;