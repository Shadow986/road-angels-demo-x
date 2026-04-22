import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "./lib/supabaseClient";

// Public Components
import Navbar from "./components/Navbar";
import StickyWhatsApp from "./components/StickyWhatsApp";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import TrustBadges from "./components/TrustBadges";
import DiagnosticTerminal from "./components/DiagnosticTerminal"; 
import ValidationSection from "./components/ValidationSection"; 
import AuthoritySection from "./components/AuthoritySection";
import MembershipSection from "./components/MembershipSection";
import ServicesSection from "./components/ServicesSection";
import ServicesPage from "./components/ServicesPage";
import ServiceDetailView from "./components/ServiceDetailView";
import MembershipPage from "./components/MembershipPage";
import ContactPage from "./components/ContactPage";
import AuthPage from "./components/AuthPage";

// Secure Dashboards
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";

function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [currentPage, setCurrentPage] = useState('home'); 
  const [activeServiceId, setActiveServiceId] = useState(null);

  useEffect(() => {
    // Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserRole(session.user.id);
    });

    // Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
        if (currentPage === 'auth') setCurrentPage('user-dashboard');
      } else {
        setUserRole('user');
      }
    });

    return () => subscription.unsubscribe();
  }, [currentPage]);

  // Helper to fetch role for dashboard routing
  async function fetchUserRole(userId) {
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (data) setUserRole(data.role);
  }

  const navigateTo = (page, serviceId = null) => {
    setActiveServiceId(serviceId);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserRole('user');
    navigateTo('home');
  };

  // UI state logic for hiding common nav on dashboards
  const isDashboardView = ['user-dashboard', 'admin-dashboard', 'auth', 'admin-login'].includes(currentPage);

  return (
    <div className="bg-white text-black min-h-screen font-sans antialiased selection:bg-[var(--color-halo-silver)] selection:text-black overflow-x-hidden">
      {!isDashboardView && (
        <Navbar 
          setPage={(page) => navigateTo(page)} 
          currentPage={currentPage} 
          onLoginClick={() => navigateTo(session ? 'user-dashboard' : 'auth')} 
          isLoggedIn={!!session}
        />
      )}
      
      <main className="min-h-[80vh]">
        <AnimatePresence mode="wait">
          
          {/* --- PUBLIC PAGES --- */}
          {currentPage === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Hero onContactClick={() => navigateTo('contact')} />
              <StatsBar />
              <TrustBadges /> 
              <DiagnosticTerminal />
              <ValidationSection />
              <AuthoritySection />
              <MembershipSection navigateTo={navigateTo} />
              <ServicesSection onViewAll={() => navigateTo('services')} />
            </motion.div>
          )}

          {currentPage === 'services' && (
            <motion.div key="services" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ServicesPage onSelectService={(id) => navigateTo('service-detail', id)} />
            </motion.div>
          )}

          {currentPage === 'service-detail' && (
            <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ServiceDetailView 
                serviceId={activeServiceId} 
                onBack={() => navigateTo('services')} 
                onSubscribe={() => navigateTo('membership')}
              />
            </motion.div>
          )}

          {currentPage === 'membership' && (
            <motion.div key="membership" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <MembershipPage />
            </motion.div>
          )}

          {currentPage === 'contact' && (
            <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ContactPage />
            </motion.div>
          )}

          {/* --- AUTH GATEWAYS --- */}
          {currentPage === 'auth' && (
            <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AuthPage onBack={() => navigateTo('home')} onLoginSuccess={() => navigateTo('user-dashboard')} />
            </motion.div>
          )}

          {/* HIDDEN ADMIN LOGIN: Access via manual code trigger or secret interaction */}
          {currentPage === 'admin-login' && (
            <motion.div key="admin-login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminLogin onLoginSuccess={() => navigateTo('admin-dashboard')} />
            </motion.div>
          )}

          {/* --- SECURE DASHBOARDS --- */}
          {currentPage === 'user-dashboard' && (
            <motion.div key="user-dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <UserDashboard onLogout={handleLogout} />
            </motion.div>
          )}

          {currentPage === 'admin-dashboard' && userRole === 'admin' && (
            <motion.div key="admin-dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminDashboard onLogout={handleLogout} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {!isDashboardView && <StickyWhatsApp />}

      {!isDashboardView && (
        <footer className="bg-black py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-8 flex justify-between items-center text-[8px] text-gray-500 uppercase tracking-[0.4em] font-bold">
            <p>&copy; {new Date().getFullYear()} Road Angels RSA</p>
            <p className="hover:text-white cursor-pointer transition-colors" onClick={() => navigateTo('admin-login')}>SECURE TERMINAL</p>
            <p>Developed by Assend Creatives</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
