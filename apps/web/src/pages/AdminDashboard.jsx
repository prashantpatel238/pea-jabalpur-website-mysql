
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, FileText, Award, Bell } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LogoBrandingManager from '@/components/LogoBrandingManager.jsx';
import ContactInfoManager from '@/components/ContactInfoManager.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    denied: 0,
    total: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const allMembers = await pb.collection('members').getFullList({ $autoCancel: false });
        setStats({
          pending: allMembers.filter(m => m.approval_status === 'pending').length,
          approved: allMembers.filter(m => m.approval_status === 'approved').length,
          denied: allMembers.filter(m => m.approval_status === 'denied').length,
          total: allMembers.length
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Pending Approvals', value: stats.pending, icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Approved Members', value: stats.approved, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Members', value: stats.total, icon: UserX, color: 'text-muted-foreground', bg: 'bg-muted' }
  ];

  const quickActions = [
    { label: 'Manage Members', icon: Users, path: '/admin/members', description: 'View and manage member applications' },
    { label: 'Page Content', icon: FileText, path: '/admin/content', description: 'Edit website content and pages' },
    { label: 'Leadership Team', icon: Award, path: '/admin/important-members', description: 'Manage important members' },
    { label: 'Custom Fields', icon: FileText, path: '/admin/custom-fields', description: 'Configure member profile fields' },
    { label: 'Notice Board', icon: Bell, path: '/admin/notices', description: 'Manage notices and announcements' }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Professional Engineers Association</title>
      </Helmet>
      <Header />

      <div className="min-h-screen bg-secondary/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground text-lg">Manage your association, members, and website settings</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {statCards.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <span className="text-4xl font-bold tracking-tight">{stat.value}</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (index * 0.05) }}
                >
                  <Link
                    to={action.path}
                    className="block bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300 group h-full"
                  >
                    <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                      <action.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{action.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <LogoBrandingManager />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <ContactInfoManager />
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AdminDashboard;
