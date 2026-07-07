import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "./lib/supabaseClient";

// Public Components
import Navbar from "./components/Navbar";
import StickyWhatsApp from "./components/StickyWhatsApp";
import PaystackButton from "./components/PaystackButton";
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

import YouTubeSection from "./components/YouTubeSection";
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
      if (session) {
        fetchUserRole(session.user.id);
        // If user lands on auth page while already logged in, send them to dashboard
        setCurrentPage((prev) => prev === 'auth' ? 'user-dashboard' : prev);
      }
    });

    // Auth Listener - runs once on mount only
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
        // Redirect away from auth page if already logged in
        setCurrentPage((prev) => prev === 'auth' ? 'user-dashboard' : prev);
      } else {
        setUserRole('user');
      }
    });

    return () => subscription.unsubscribe();
  }, []); // empty deps — subscribe once, not on every page change

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
              <YouTubeSection />
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
          {currentPage === 'auth' && !session && (
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
              <UserDashboard onLogout={handleLogout} navigateTo={navigateTo} />
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
      {currentPage !== 'admin-dashboard' && currentPage !== 'admin-login' && <PaystackButton navigateTo={navigateTo} />}

      {!isDashboardView && (
        <footer className="bg-black py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-8 space-y-8">
            <div className="flex justify-center gap-8">
              <a href="https://facebook.com/share/1EvzvFTPJB/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" title="Facebook">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://tiktok.com/@road_angels.sa?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" title="TikTok">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>
              </a>
              <a href="https://instagram.com/road_angels.sa" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" title="Instagram">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://wa.me/27604807393" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" title="WhatsApp">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </a>
              <a href="https://youtube.com/@roadangelsrsa?si=hIwWpRO3-6gRTbNU" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" title="YouTube">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
            <div className="flex justify-between items-center text-[8px] text-gray-500 uppercase tracking-[0.4em] font-bold border-t border-white/10 pt-8">
              <p>&copy; {new Date().getFullYear()} Road Angels RSA</p>
              <p className="hover:text-white cursor-pointer transition-colors" onClick={() => navigateTo('admin-login')}>SECURE TERMINAL</p>
              <p>Developed by Assend Creatives</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
