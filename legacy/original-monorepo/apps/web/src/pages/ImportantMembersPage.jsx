
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, AlertCircle, RefreshCw, Phone, Mail, Linkedin } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';

const ImportantMembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pb.collection('important_members').getList(1, 100, {
        sort: 'sort_order',
        filter: 'approval_status="approved"',
        $autoCancel: false
      });
      setMembers(data.items || []);
    } catch (err) {
      console.error('Failed to fetch members:', err);
      setError('Failed to load leadership team. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Group members by role
  const groupedMembers = members.reduce((acc, member) => {
    const role = member.role || 'Other';
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(member);
    return acc;
  }, {});

  // Define the order of roles to display
  const roleOrder = [
    'President',
    'Vice President',
    'Secretary',
    'Joint Secretary',
    'Treasurer',
    'Media Prabhari',
    'Core Committee Member',
    'Other'
  ];

  // Sort the groups based on roleOrder
  const sortedRoles = Object.keys(groupedMembers).sort((a, b) => {
    const indexA = roleOrder.indexOf(a);
    const indexB = roleOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <LoadingSpinner />
          <p className="mt-4 text-muted-foreground font-medium">Loading leadership team...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Something went wrong</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-md">{error}</p>
          <Button onClick={fetchMembers} size="lg" className="rounded-full">
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Leadership Team - Professional Engineers Association</title>
        <meta name="description" content="Meet the dedicated professionals guiding our association towards excellence and innovation." />
      </Helmet>
      <Header />

      {/* Premium Hero Section */}
      <section className="relative min-h-[50vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1685955011452-2d9cf1cb4081?q=80&w=2940&auto=format&fit=crop" 
            alt="Professional business leaders in boardroom" 
            className="w-full h-full object-cover object-center"
          />
          <div className="hero-overlay" />
          <div className="hero-gradient" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-white mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-secondary">Leadership</span> Team
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Meet the dedicated professionals guiding our association towards excellence, innovation, and community impact.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="py-24 bg-slate-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {members.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No leadership members found</h3>
              <p className="text-lg text-slate-500">The leadership team directory is currently empty.</p>
            </div>
          ) : (
            <div className="space-y-24">
              {sortedRoles.map((role, sectionIndex) => (
                <div key={role} className="space-y-10">
                  <div className="flex items-center gap-6">
                    <h2 className="text-3xl font-bold text-slate-900 shrink-0">{role}{groupedMembers[role].length > 1 ? 's' : ''}</h2>
                    <div className="h-px bg-slate-200 w-full" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {groupedMembers[role].map((member, index) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group bg-white rounded-3xl p-6 border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col items-center text-center"
                      >
                        {/* Photo */}
                        <div className="relative mb-6">
                          <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                          {member.show_photo !== false && member.image ? (
                            <img 
                              src={pb.files.getUrl(member, member.image)} 
                              alt={member.show_name !== false ? member.name : 'Leadership Member'} 
                              className="relative w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-md" 
                            />
                          ) : (
                            <div className="relative w-32 h-32 rounded-3xl bg-slate-50 border-4 border-white shadow-md flex items-center justify-center">
                              <User className="w-12 h-12 text-slate-300" />
                            </div>
                          )}
                        </div>
                        
                        {/* Role Badge */}
                        {member.show_role !== false && (
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-4">
                            {member.role}
                          </div>
                        )}
                        
                        {/* Name */}
                        {member.show_name !== false && (
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{member.name}</h3>
                        )}
                        
                        {/* Contact Info */}
                        <div className="flex flex-col gap-2 mt-2 w-full">
                          {member.show_phone !== false && member.phone && (
                            <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 py-2 px-3 rounded-xl">
                              <Phone className="w-4 h-4 text-slate-400" />
                              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{member.phone}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Bio */}
                        {member.show_phone !== false && member.bio && (
                          <p className="text-sm text-slate-500 mt-4 leading-relaxed line-clamp-3">
                            {member.bio}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ImportantMembersPage;
