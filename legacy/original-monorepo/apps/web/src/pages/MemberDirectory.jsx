
import React, { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Filter, Users, Mail, Phone } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useDirectoryConfig } from '@/hooks/useDirectoryConfig.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const MemberDirectory = () => {
  const { memberData, loading: authLoading } = useAuth();
  const { config, loading: configLoading } = useDirectoryConfig();
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchDirectoryData = async () => {
      if (!memberData || memberData.approval_status !== 'approved') {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const membersData = await pb.collection('members').getFullList({
          filter: 'approval_status = "approved" && directory_visible = true',
          sort: 'name',
          $autoCancel: false
        });
        setMembers(membersData);
      } catch (err) {
        console.error('Failed to fetch directory data:', err);
        setError('Failed to load member directory. Please try again later.');
        toast.error('Failed to load member directory');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && !configLoading) {
      fetchDirectoryData();
    }
  }, [memberData, authLoading, configLoading]);

  const { filteredMembers, categories } = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const filtered = members.filter(member => {
      const matchesSearch = 
        (member.name || '').toLowerCase().includes(term) ||
        (member.member_category || '').toLowerCase().includes(term);
      const matchesCategory = selectedCategory === 'all' || member.member_category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const uniqueCategories = [...new Set(members.map(m => m.member_category || 'General Member'))].sort();
    
    return { filteredMembers: filtered, categories: uniqueCategories };
  }, [members, searchTerm, selectedCategory]);

  if (authLoading || configLoading || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>
        <Footer />
      </>
    );
  }

  if (memberData?.approval_status !== 'approved') {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="card-base max-w-md text-center p-8">
            <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground mb-6">Your profile is pending approval. Directory access will be granted once approved.</p>
            <a href="/dashboard" className="btn-primary w-full inline-block text-center">Return to Dashboard</a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Member Directory - Professional Engineers Association</title>
      </Helmet>
      <Header />

      <main className="section-spacing max-w-7xl mx-auto min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Member Directory</h1>
            <p className="text-muted-foreground">Connect with {members.length} engineering professionals</p>
          </div>
        </div>

        <div className="card-base mb-10 flex flex-col sm:flex-row gap-4 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-sm)] border border-border focus:outline-none focus:border-[var(--primary-blue)] bg-[var(--bg-light)]"
            />
          </div>
          <div className="relative sm:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-[var(--radius-sm)] border border-border focus:outline-none focus:border-[var(--primary-blue)] bg-[var(--bg-light)] appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <div className="text-center py-20 card-base">
            <p className="text-destructive mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-secondary">Try Again</button>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-20 card-base">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No members found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member, index) => {
              const avatarUrl = member.profile_photo ? pb.files.getUrl(member, member.profile_photo) : null;
              const initials = member.name ? member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
                  className="card-base flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4 border-b border-border pb-4">
                    {config?.show_profile_photo !== false && (
                      <Avatar className="w-16 h-16 border border-border shadow-sm">
                        <AvatarImage src={avatarUrl} alt={member.name} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold truncate" title={member.name}>{member.name}</h3>
                      <span className="inline-block px-2 py-0.5 bg-[var(--bg-light)] text-[var(--text-gray)] text-xs rounded-full border border-border mt-1 truncate max-w-full">
                        {member.member_category || 'Member'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm flex-grow">
                    {config?.show_email !== false && member.email && (
                      <div className="flex items-center gap-2 text-[var(--text-gray)]">
                        <Mail className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                        <a href={`mailto:${member.email}`} className="truncate hover:text-[var(--primary-blue)] transition-colors">{member.email}</a>
                      </div>
                    )}
                    {config?.show_phone !== false && member.phone && (
                      <div className="flex items-center gap-2 text-[var(--text-gray)]">
                        <Phone className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border">
                    <a href={`/profile/${member.id}`} className="text-[var(--primary-blue)] text-sm font-medium hover:underline flex items-center justify-center w-full">
                      View Full Profile
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default MemberDirectory;
