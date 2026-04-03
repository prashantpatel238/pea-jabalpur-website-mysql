
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, Settings, LogOut, FileText, Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';

const MemberDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const members = await pb.collection('members').getFullList({
          filter: `user_id = "${currentUser.id}"`,
          $autoCancel: false
        });
        if (members.length > 0) setMemberData(members[0]);
      } catch (error) {
        console.error('Failed to fetch member data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchMemberData();
  }, [currentUser]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Professional Engineers Association</title>
      </Helmet>
      <Header />

      <main className="section-spacing max-w-7xl mx-auto min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {memberData?.full_name || currentUser?.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Quick Nav */}
          <div className="lg:col-span-3 space-y-4">
            <div className="card-base p-4 flex flex-col gap-2">
              <Link to="/profile" className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] hover:bg-[var(--bg-light)] text-[var(--text-dark)] font-medium transition-colors">
                <span className="flex items-center gap-3"><User className="w-5 h-5 text-muted-foreground" /> My Profile</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link to="/directory" className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] hover:bg-[var(--bg-light)] text-[var(--text-dark)] font-medium transition-colors">
                <span className="flex items-center gap-3"><FileText className="w-5 h-5 text-muted-foreground" /> Directory</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link to="/noticeboard" className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] hover:bg-[var(--bg-light)] text-[var(--text-dark)] font-medium transition-colors">
                <span className="flex items-center gap-3"><Bell className="w-5 h-5 text-muted-foreground" /> Notice Board</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <div className="h-px bg-border my-2"></div>
              <Link to="/edit-profile" className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] hover:bg-[var(--bg-light)] text-[var(--text-dark)] font-medium transition-colors">
                <span className="flex items-center gap-3"><Settings className="w-5 h-5 text-muted-foreground" /> Settings</span>
              </Link>
              <button onClick={logout} className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] hover:bg-red-50 text-red-600 font-medium transition-colors w-full text-left">
                <span className="flex items-center gap-3"><LogOut className="w-5 h-5" /> Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Profile Summary Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-base flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-[var(--secondary-blue)] flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white shadow-sm">
                {memberData?.profile_photo ? (
                  <img src={pb.files.getUrl(memberData, memberData.profile_photo)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-[var(--primary-blue)]" />
                )}
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                  <h2 className="text-2xl font-bold">{memberData?.full_name}</h2>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${memberData?.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {memberData?.status || 'Pending'}
                  </span>
                </div>
                <p className="text-[var(--text-gray)] mb-1">{memberData?.profession_designation || 'Profession not set'}</p>
                <p className="text-[var(--text-gray)] text-sm">{memberData?.email}</p>
                <div className="mt-4 pt-4 border-t border-border flex gap-4 justify-center sm:justify-start">
                  <Link to="/edit-profile" className="btn-secondary text-sm py-2">Edit Profile</Link>
                </div>
              </div>
            </motion.div>

            {/* Stats / Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-base">
                <h3 className="font-bold mb-4 text-lg border-b border-border pb-2">Membership Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Category</span> <span className="font-medium">{memberData?.member_category || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Joined</span> <span className="font-medium">{memberData?.created ? new Date(memberData.created).toLocaleDateString() : 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Directory Visible</span> <span className="font-medium">{memberData?.directory_visible ? 'Yes' : 'No'}</span></div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-base bg-[var(--primary-blue)] text-white border-none">
                <h3 className="font-bold mb-2 text-lg text-white">Stay Connected</h3>
                <p className="text-white/80 text-sm mb-6">Check the notice board for upcoming events, technical seminars, and community announcements.</p>
                <Link to="/noticeboard" className="inline-block bg-white text-[var(--primary-blue)] font-semibold px-4 py-2 rounded-[var(--radius-sm)] text-sm hover:bg-gray-50 transition-colors">
                  View Notice Board
                </Link>
              </motion.div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MemberDashboard;
