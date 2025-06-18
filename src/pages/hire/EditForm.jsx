import React, { useState, useEffect } from 'react';
import { Plus, X, Edit3, Save, Loader2, AlertCircle, Check } from 'lucide-react';
import { API_BASE_URL } from '../../utils/constants';

const EvaluationFormEditor = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editingForm, setEditingForm] = useState(null);

  

  // Fetch form data from API
  const fetchFormData = async (technology = 'Flutter') => {
    try {
      setLoading(true);
      setError(null);
      
      // Replace with your actual API call
      const response = await fetch(`${API_BASE_URL}/forms/${technology}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch form data');
      }
      
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        const form = result.data[0];
        setFormData(form);
        setEditingForm({ ...form });
      } else {
        throw new Error('No form data found');
      }
    } catch (err) {
      setError(err.message);
      // For demo purposes, use mock data
      //loadMockData();
    } finally {
      setLoading(false);
    }
  };

  // Load mock data for demonstration
  const loadMockData = () => {
    const mockData = {
      "_id": "685222fb3d69fe715e248b38",
      "technology": "Flutter",
      "questions": [
        {
          "id": "1750212849265",
          "type": "number",
          "question": "How many Flutter apps have you developed?",
          "options": [
            { "label": "", "value": "1", "points": 2, "_id": "685222fb3d69fe715e248b3a" },
            { "label": "", "value": "2", "points": 5, "_id": "685222fb3d69fe715e248b3b" },
            { "label": "", "value": "3", "points": 10, "_id": "685222fb3d69fe715e248b3c" }
          ],
          "scoring": { "1": 2, "2": 5, "3": 10 },
          "_id": "685222fb3d69fe715e248b39"
        },
        {
          "id": "1750212967941",
          "type": "checkbox",
          "question": "Which state management libraries have you used?",
          "options": [
            { "label": "Riverpod", "value": "Riverpod", "points": 5, "_id": "685222fb3d69fe715e248b3e" },
            { "label": "Provider", "value": "Provider", "points": 3, "_id": "685222fb3d69fe715e248b3f" },
            { "label": "BLoC", "value": "BLoC", "points": 4, "_id": "685222fb3d69fe715e248b40" }
          ],
          "scoring": { "Provider": 3, "Riverpod": 5, "BLoC": 4 },
          "_id": "685222fb3d69fe715e248b3d"
        },
        {
          "id": "1750213017989",
          "type": "select",
          "question": "Have you integrated native code in a Flutter app (platform channels)?",
          "options": [
            { "label": "Yes", "value": "Yes", "points": 5, "_id": "685222fb3d69fe715e248b42" },
            { "label": "No", "value": "No", "points": 0, "_id": "685222fb3d69fe715e248b43" }
          ],
          "scoring": { "Yes": 5, "No": 0 },
          "_id": "685222fb3d69fe715e248b41"
        }
      ],
      "createdBy": "admin",
      "isActive": true,
      "createdAt": "2025-06-18T02:22:51.895Z",
      "updatedAt": "2025-06-18T02:22:51.895Z"
    };
    
    setFormData(mockData);
    setEditingForm({ ...mockData });
  };

  // Save form data to API
  const saveFormData = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Clean up the data before sending
      const cleanedForm = {
        ...editingForm,
        questions: editingForm.questions.map(q => ({
          ...q,
          scoring: q.options.reduce((acc, opt) => {
            acc[opt.value] = opt.points;
            return acc;
          }, {})
        }))
      };

      // Replace with your actual API call
      const response = await fetch(`${API_BASE_URL}/forms/${editingForm._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedForm)
      });

      if (!response.ok) {
        throw new Error('Failed to save form data');
      }

      const result = await response.json();
      
      if (result.success) {
        setFormData({ ...editingForm });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Save operation was not successful');
      }
    } catch (err) {
      setError(err.message);
      // For demo purposes, simulate success
      setFormData({ ...editingForm });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  // Add new question
  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      type: 'select',
      question: '',
      options: [
        { label: 'Option 1', value: 'option1', points: 1, _id: Date.now().toString() + '1' }
      ],
      scoring: { option1: 1 },
      _id: Date.now().toString() + '_q'
    };

    setEditingForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  // Remove question
  const removeQuestion = (questionIndex) => {
    setEditingForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex)
    }));
  };

  // Update question
  const updateQuestion = (questionIndex, field, value) => {
    setEditingForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex ? { ...q, [field]: value } : q
      )
    }));
  };

  // Add option to question
  const addOption = (questionIndex) => {
    const newOption = {
      label: '',
      value: '',
      points: 1,
      _id: Date.now().toString()
    };

    setEditingForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex 
          ? { ...q, options: [...q.options, newOption] }
          : q
      )
    }));
  };

  // Remove option from question
  const removeOption = (questionIndex, optionIndex) => {
    setEditingForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex 
          ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
          : q
      )
    }));
  };

  // Update option
  const updateOption = (questionIndex, optionIndex, field, value) => {
    setEditingForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIndex) => 
        qIndex === questionIndex 
          ? {
              ...q,
              options: q.options.map((opt, oIndex) => 
                oIndex === optionIndex ? { ...opt, [field]: value } : opt
              )
            }
          : q
      )
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading evaluation form...</span>
        </div>
      </div>
    );
  }

  if (!editingForm) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Form Data</h2>
          <p className="text-gray-600">Unable to load the evaluation form.</p>
          <button 
            onClick={() => fetchFormData()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Edit3 className="w-6 h-6 mr-2 text-blue-600" />
              Edit Evaluation Form
            </h1>
            <div className="flex items-center space-x-3">
              {success && (
                <div className="flex items-center text-green-600">
                  <Check className="w-5 h-5 mr-1" />
                  <span className="text-sm">Saved successfully!</span>
                </div>
              )}
              <button
                onClick={saveFormData}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Form
                  </>
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Technology Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technology</label>
            <input
              type="text"
              value={editingForm.technology}
              onChange={(e) => setEditingForm(prev => ({ ...prev, technology: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter technology name"
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {editingForm.questions.map((question, questionIndex) => (
            <div key={question.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Question {questionIndex + 1}
                </h3>
                <button
                  onClick={() => removeQuestion(questionIndex)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Question Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(questionIndex, 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="select">Single Select</option>
                  <option value="checkbox">Multiple Choice (Checkbox)</option>
                  <option value="number">Number Input</option>
                  <option value="text">Text Input</option>
                </select>
              </div>

              {/* Question Text */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                <textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="Enter your question"
                />
              </div>

              {/* Options */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Options & Scoring</label>
                  <button
                    onClick={() => addOption(questionIndex)}
                    className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </button>
                </div>

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <div key={option._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {question.type === 'number' ? 'Number' : 'Label'}
                        </label>
                        <input
                          type="text"
                          value={option.label}
                          onChange={(e) => updateOption(questionIndex, optionIndex, 'label', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder={question.type === 'number' ? 'Number' : 'Option label'}
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                        <input
                          type="text"
                          value={option.value}
                          onChange={(e) => updateOption(questionIndex, optionIndex, 'value', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="Value"
                        />
                      </div>
                      <div className="w-20">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Points</label>
                        <input
                          type="number"
                          value={option.points}
                          onChange={(e) => updateOption(questionIndex, optionIndex, 'points', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                      <button
                        onClick={() => removeOption(questionIndex, optionIndex)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Question Button */}
        <div className="mt-6 text-center">
          <button
            onClick={addQuestion}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mx-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Question
          </button>
        </div>

        {/* Form Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Form ID:</span> {editingForm._id}
            </div>
            <div>
              <span className="font-medium">Created By:</span> {editingForm.createdBy}
            </div>
            <div>
              <span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${editingForm.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {editingForm.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <span className="font-medium">Last Updated:</span> {new Date(editingForm.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationFormEditor;