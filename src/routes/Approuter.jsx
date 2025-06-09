import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CandidateForm from '../pages/CandidateForm';
import FormBuilder from '../pages/FormBuilder'
import DynamicFormSystem from '../pages/DynamicFormSystem';
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CandidateForm/>} />
        <Route path="/form-builder" element={<FormBuilder/>} />
        <Route path='/new-form-builder' element={<DynamicFormSystem/>} />
      </Routes>
    </Router>
  );
}

export default AppRouter;