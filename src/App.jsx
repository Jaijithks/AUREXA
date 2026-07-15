import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import SiteContent from './components/SiteContent';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SiteContent />} />
        <Route path="/api/content/*" element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
