
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [orgTitle, setOrgTitle] = useState('Professional Engineers Association Jabalpur');
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin, isMemberManager, isApproved } = useAuth();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const records = await pb.collection('settings').getFullList({
          filter: 'setting_key="logo" || setting_key="organization_title"',
          $autoCancel: false
        });
        
        const logoRecord = records.find(r => r.setting_key === 'logo');
        if (logoRecord && logoRecord.logo_image) {
          setLogoUrl(pb.files.getUrl(logoRecord, logoRecord.logo_image));
        }

        const titleRecord = records.find(r => r.setting_key === 'organization_title');
        if (titleRecord && titleRecord.setting_value) {
          setOrgTitle(titleRecord.setting_value);
        }
      } catch (error) {
        console.error('Failed to fetch branding:', error);
      }
    };

    fetchBranding();
  }, []);

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/important-members', label: 'Leadership' },
    { path: '/contact', label: 'Contact' }
  ];

  if (currentUser && (isApproved || isAdmin || isMemberManager)) {
    publicLinks.push({ path: '/noticeboard', label: 'Notice Board' });
  }

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50 py-3' 
          : 'bg-white py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-3 focus:outline-none group"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${orgTitle} Logo`}
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="h-10 w-10 flex items-center justify-center bg-primary rounded-xl shadow-sm shadow-primary/20 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-primary/30">
                <span className="font-bold text-lg text-primary-foreground">PEA</span>
              </div>
            )}
            <span className="block font-bold text-base sm:text-lg text-slate-900 tracking-tight group-hover:text-primary transition-colors duration-300">
              {orgTitle}
            </span>
          </button>

          <nav className="hidden md:flex items-center space-x-1">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div 
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-t-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <>
                <Button asChild variant="ghost" className="font-semibold rounded-full hover:bg-slate-100">
                  <Link to={isAdmin || isMemberManager ? '/admin' : '/dashboard'}>
                    <User className="w-4 h-4 mr-2" />
                    {isAdmin || isMemberManager ? 'Admin' : 'Dashboard'}
                  </Link>
                </Button>
                <Button variant="outline" className="font-semibold rounded-full border-slate-200 hover:bg-slate-50 hover:text-destructive hover:border-destructive/30 transition-colors" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="font-semibold rounded-full hover:bg-slate-100">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild className="font-semibold rounded-full shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5">
                  <Link to="/signup">
                    Join Now
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl overflow-hidden absolute top-full left-0 w-full shadow-xl"
          >
            <div className="px-4 py-6 space-y-2">
              {publicLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-6 mt-4 border-t border-slate-100 space-y-3">
                {currentUser ? (
                  <>
                    <Button asChild variant="secondary" className="w-full justify-start rounded-xl h-12" onClick={() => setMobileMenuOpen(false)}>
                      <Link to={isAdmin || isMemberManager ? '/admin' : '/dashboard'}>
                        <User className="w-5 h-5 mr-3" />
                        {isAdmin || isMemberManager ? 'Admin Dashboard' : 'My Dashboard'}
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl h-12 text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/20" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                      <LogOut className="w-5 h-5 mr-3" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    <Button asChild className="w-full rounded-xl h-12 shadow-sm" onClick={() => setMobileMenuOpen(false)}>
                      <Link to="/signup">Join Association</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full rounded-xl h-12" onClick={() => setMobileMenuOpen(false)}>
                      <Link to="/login">Sign In</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
