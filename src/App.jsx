import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import SiteContent from './components/SiteContent';
import AllProjectsPage from './components/AllProjectsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SiteContent />} />
        <Route path="/projects" element={<AllProjectsPage />} />
        <Route path="/api/content/*" element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
