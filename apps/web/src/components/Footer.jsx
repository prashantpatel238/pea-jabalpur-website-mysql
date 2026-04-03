
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [logoUrl, setLogoUrl] = useState(null);
  const [orgTitle, setOrgTitle] = useState('Professional Engineers Association Jabalpur');

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

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 border-t border-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${orgTitle} Logo`}
                  className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-primary-foreground font-bold text-xl">PEA</span>
                </div>
              )}
              <span className="text-2xl font-bold text-white tracking-tight">{orgTitle}</span>
            </Link>
            <p className="text-slate-400 mb-8 leading-relaxed max-w-sm">
              Empowering engineering professionals through collaboration, continuous learning, and advocacy for excellence in the field.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Instagram, label: 'Instagram' }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:-translate-y-1" 
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { path: '/about', label: 'About Us' },
                { path: '/important-members', label: 'Leadership' },
                { path: '/directory', label: 'Member Directory' },
                { path: '/notices', label: 'Notice Board' },
                { path: '/contact', label: 'Contact Us' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-slate-400 hover:text-primary transition-colors inline-flex items-center group">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-6">Resources</h3>
            <ul className="space-y-4">
              {[
                { path: '/register', label: 'Join Association' },
                { path: '/resources/technical-standards', label: 'Technical Standards' },
                { path: '/resources/industry-guidelines', label: 'Industry Guidelines' },
                { path: '/resources/best-practices', label: 'Best Practices' },
                { path: '/resources/webinars', label: 'Webinars' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-slate-400 hover:text-primary transition-colors inline-flex items-center group">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-slate-400 leading-relaxed pt-2">841 Sanjeevani Nagar,<br />Garha, Jabalpur-482003<br />Madhya Pradesh, India</span>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col pt-2">
                  <span className="text-slate-300 font-medium">9425412820</span>
                  <a href="https://wa.me/919425412820" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-secondary/80 transition-colors text-sm mt-1">
                    Chat on WhatsApp
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <a href="mailto:info@pea.org" className="text-slate-400 hover:text-white transition-colors">info@pea.org</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {currentYear} {orgTitle}. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
