import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CossToastProvider } from './components/ui/CossUI';
import Login          from './pages/Login';
import Signup         from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';
import Dashboard      from './pages/Dashboard';
import CollectReview  from './pages/CollectReview';
import WallOfLove     from './pages/WallOfLove';
import Home           from './pages/Home';

function App() {
  return (
    <CossToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"                 element={<Home />} />
          <Route path="/login"            element={<Login />} />
          <Route path="/signup"           element={<Signup />} />
          <Route path="/forgot-password"  element={<ForgotPassword />} />
          <Route path="/reset-password"   element={<ResetPassword />} />
          <Route path="/dashboard/*"      element={<Dashboard />} />
          <Route path="/collect/:spaceSlug" element={<CollectReview />} />
          <Route path="/wall/:spaceSlug"  element={<WallOfLove />} />
          <Route path="*"                 element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CossToastProvider>
  );
}

export default App;
