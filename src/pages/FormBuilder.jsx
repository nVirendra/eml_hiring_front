import React, { useState } from 'react';
import Input from '../components/ui/Input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const questionTypes = ['text', 'textarea', 'number', 'select', 'checkbox', 'radio'];

const AdminFormBuilder = () => {
  const [techName, setTechName] = useState('');
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { label: '', key: '', type: 'text', options: [] }
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    if (field === 'type' && ['select', 'checkbox', 'radio', 'number'].includes(value)) {
      updated[index].options = [{ label: '', points: 0 }];
    }
    setQuestions(updated);
  };

  const addOption = (index) => {
    const updated = [...questions];
    updated[index].options.push({ label: '', points: 0 });
    setQuestions(updated);
  };

  const updateOption = (qIdx, oIdx, field, value) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx][field] = field === 'points' ? parseInt(value) || 0 : value;
    setQuestions(updated);
  };

  const saveForm = () => {
    const formatted = {
      tech: techName,
      questions,
    };
    console.log('Saved Form:', formatted);
    // Send to backend here if needed
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Create Dynamic Form</h2>

        <Input
          placeholder="Technology Name (e.g., Flutter, MERN)"
          value={techName}
          onChange={(e) => setTechName(e.target.value)}
          className="mb-4"
        />

        {questions.map((q, index) => (
          <div key={index} className="border p-4 mb-4 rounded">
            <Input
              placeholder="Question Label"
              value={q.label}
              onChange={(e) => updateQuestion(index, 'label', e.target.value)}
              className="mb-2"
            />

            <Input
              placeholder="Unique Key (e.g., firebase, flutter_exp)"
              value={q.key}
              onChange={(e) => updateQuestion(index, 'key', e.target.value)}
              className="mb-2"
            />

            <Select
              value={q.type}
              onValueChange={(val) => updateQuestion(index, 'type', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Question Type" value={q.type} />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {['select', 'checkbox', 'radio', 'number'].includes(q.type) && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-1">Answer Options with Points:</p>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex gap-2 mb-2">
                    <Input
                      placeholder={`Answer ${oIdx + 1}`}
                      value={opt.label}
                      onChange={(e) => updateOption(index, oIdx, 'label', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Points"
                      type="number"
                      value={opt.points}
                      onChange={(e) => updateOption(index, oIdx, 'points', e.target.value)}
                      className="w-24"
                    />
                  </div>
                ))}
                <Button onClick={() => addOption(index)} size="sm">+ Add Option</Button>
              </div>
            )}
          </div>
        ))}

        <div className="flex gap-2">
          <Button onClick={addQuestion}>+ Add Question</Button>
          <Button onClick={saveForm} variant="secondary">Save Form</Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminFormBuilder;
