
import './index.css'
import AppRouter from './routes/Approuter'
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext'
function App() {
  return (
    <AuthProvider>
      <AppRouter/>
      <ToastContainer position="top-right" autoClose={3000} />
   </AuthProvider>
  )
}

export default App
