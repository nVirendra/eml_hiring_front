import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CandidateForm from '../pages/hire/CandidateForm';
import DynamicFormSystem from '../pages/hire/DynamicFormSystem';
import DashboardPage from '../pages/hire/DashboardPage';
import CandidateResponsePage from '../pages/hire/[responseId]'
import ProtectedRoute from '../components/ProtectedRoute';
import LoginPage from '../pages/Login';
import Logout from '../pages/Logout';
import EvaluationFormEditor from '../pages/hire/[formId]';
import LandingPage from '../pages/LandingPage';
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/hire/register" element={<CandidateForm/>} />
        <Route path="/adm-login" element={<LoginPage/>} />
        <Route path="/logout" element={<Logout />} />
        <Route path='/hire/form-builder' element={<ProtectedRoute><DynamicFormSystem/></ProtectedRoute>} />
        <Route path='/hire/forms/edit/:formId' element={<ProtectedRoute><EvaluationFormEditor/></ProtectedRoute>} />

        <Route path='/hire/dashboard' element={<ProtectedRoute><DashboardPage/></ProtectedRoute>} />
        <Route path='/hire/candidate-response/:responseId' element={<ProtectedRoute><CandidateResponsePage/></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default AppRouter;