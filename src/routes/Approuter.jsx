import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CandidateForm from '../pages/CandidateForm';
import DynamicFormSystem from '../pages/DynamicFormSystem';
import DashboardPage from '../pages/DashboardPage';
import CandidateResponsePage from '../pages/[responseId]'
import ProtectedRoute from '../components/ProtectedRoute';
import LoginPage from '../pages/Login';
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CandidateForm/>} />
        <Route path="/adm-login" element={<LoginPage/>} />
        <Route path='/hire/form-builder' element={<ProtectedRoute><DynamicFormSystem/></ProtectedRoute>} />
        <Route path='/hire/dashboard' element={<ProtectedRoute><DashboardPage/></ProtectedRoute>} />
        <Route path='/hire/candidate-response/:responseId' element={<ProtectedRoute><CandidateResponsePage/></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default AppRouter;