import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import StudyMaterial from './pages/StudyMaterial';
import Leadership from './pages/Leadership';
import Contact from './pages/Contact';
import PrayerRequest from './pages/PrayerRequest';
import Testimonies from './pages/Testimonies';
import SupportUs from './pages/SupportUs';
import Gallery from './pages/Gallery';

// Admin Pages
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import AdminEvents from './admin/Events';
import AdminPamphlets from './admin/Pamphlets';
import AdminMembers from './admin/Members';
import AdminAnnouncements from './admin/Announcements';
import AdminLeaders from './admin/Leaders';
import AdminPrayerRequests from './admin/PrayerRequests';
import AdminTestimonies from './admin/Testimonies';
import AdminSettings from './admin/Settings';
import AdminProgrammes from './admin/Programmes';
import AdminMessages from './admin/Messages';
import AdminSubscribers from './admin/Subscribers';
import AdminGallery from './admin/AdminGallery';
import AdminSermons from './admin/Sermons';
import AdminCommunication from './admin/Communication';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scm-blue"></div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/study-material" element={<StudyMaterial />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/prayer-request" element={<PrayerRequest />} />
          <Route path="/testimonies" element={<Testimonies />} />
          <Route path="/support-us" element={<SupportUs />} />
          <Route path="/gallery" element={<Gallery />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={session ? <Navigate to="/admin/dashboard" /> : <Login />} />
        
        <Route
          path="/admin"
          element={session ? <AdminLayout /> : <Navigate to="/admin/login" />}
        >
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="communication" element={<AdminCommunication />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="pamphlets" element={<AdminPamphlets />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="leaders" element={<AdminLeaders />} />
          <Route path="prayer-requests" element={<AdminPrayerRequests />} />
          <Route path="testimonies" element={<AdminTestimonies />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="programmes" element={<AdminProgrammes />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="sermons" element={<AdminSermons />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
