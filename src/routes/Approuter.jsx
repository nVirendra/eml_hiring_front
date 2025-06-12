import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CandidateForm from '../pages/CandidateForm';
import DynamicFormSystem from '../pages/DynamicFormSystem';
import DashboardPage from '../pages/DashboardPage';
import CandidateResponsePage from '../pages/[responseId]'
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CandidateForm/>} />
        <Route path='/form-builder' element={<DynamicFormSystem/>} />
        <Route path='/dashboard' element={<DashboardPage/>} />
        <Route path='/candidate-response/:responseId' element={<CandidateResponsePage/>} />
      </Routes>
    </Router>
  );
}

export default AppRouter;