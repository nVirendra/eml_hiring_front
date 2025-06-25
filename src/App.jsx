
import './index.css'
import AppRouter from './routes/Approuter'
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const SITE_KEY = '6LeOOG0rAAAAAHHun10VbL27ZCRZLZ8qCQ_DvK-S';


function App() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}>
    <AuthProvider>
      <AppRouter/>
      <ToastContainer position="top-right" autoClose={3000} />
   </AuthProvider>
   </GoogleReCaptchaProvider>
  )
}

export default App
