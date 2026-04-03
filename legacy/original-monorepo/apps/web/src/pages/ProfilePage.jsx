
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Mail, Phone, Calendar, Heart } from 'lucide-react';

const ProfilePage = () => {
  const { memberId } = useParams();
  const { memberData: currentUserMember, isAdmin, isMemberManager } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');

  const isOwnProfile = !memberId || (currentUserMember && memberId === currentUserMember.id);
  const targetMemberId = isOwnProfile ? currentUserMember?.id : memberId;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!targetMemberId) {
        setLoading(false);
        return;
      }
      try {
        const record = await pb.collection('members').getOne(targetMemberId, { $autoCancel: false });
        setProfile(record);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [targetMemberId]);

  if (loading) return <><Header /><div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div><Footer /></>;
  if (!profile) return <><Header /><div className="min-h-screen flex items-center justify-center">Profile not found</div><Footer /></>;

  const canEdit = isOwnProfile || isAdmin || isMemberManager;
  const avatarUrl = profile.profile_photo ? pb.files.getUrl(profile, profile.profile_photo) : null;
  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  return (
    <>
      <Helmet><title>{profile.name} - Profile</title></Helmet>
      <Header />

      <main className="section-spacing max-w-4xl mx-auto min-h-screen">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-base mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-[var(--secondary-blue)]"></div>
          <div className="relative pt-12 flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <Avatar className="w-28 h-28 border-4 border-white shadow-md bg-white flex-shrink-0">
              <AvatarImage src={avatarUrl} alt={profile.name} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-[var(--text-dark)]">{profile.name}</h1>
              <p className="text-[var(--text-gray)] font-medium">{profile.member_category || 'Member'}</p>
            </div>
            {canEdit && (
              <Link to={isOwnProfile ? '/edit-profile' : `/profile/${profile.id}/edit`} className="btn-secondary text-sm">
                <Edit className="w-4 h-4 mr-2" /> Edit Profile
              </Link>
            )}
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-2 mb-6 border-b border-border pb-2">
          <button onClick={() => setActiveTab('personal')} className={`px-4 py-2 font-medium text-sm rounded-[var(--radius-sm)] transition-colors ${activeTab === 'personal' ? 'bg-[var(--primary-blue)] text-white' : 'text-[var(--text-gray)] hover:bg-[var(--bg-light)]'}`}>Personal Info</button>
          <button onClick={() => setActiveTab('professional')} className={`px-4 py-2 font-medium text-sm rounded-[var(--radius-sm)] transition-colors ${activeTab === 'professional' ? 'bg-[var(--primary-blue)] text-white' : 'text-[var(--text-gray)] hover:bg-[var(--bg-light)]'}`}>Professional Info</button>
          <button onClick={() => setActiveTab('contact')} className={`px-4 py-2 font-medium text-sm rounded-[var(--radius-sm)] transition-colors ${activeTab === 'contact' ? 'bg-[var(--primary-blue)] text-white' : 'text-[var(--text-gray)] hover:bg-[var(--bg-light)]'}`}>Contact Info</button>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={activeTab} className="card-base">
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div><label className="text-sm text-muted-foreground block mb-1">Date of Birth</label><div className="font-medium flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400"/> {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'N/A'}</div></div>
              <div><label className="text-sm text-muted-foreground block mb-1">Gender</label><div className="font-medium">{profile.gender || 'N/A'}</div></div>
              <div><label className="text-sm text-muted-foreground block mb-1">Marital Status</label><div className="font-medium flex items-center gap-2"><Heart className="w-4 h-4 text-gray-400"/> {profile.marital_status || 'N/A'}</div></div>
              {profile.marital_status === 'Married' && (
                <>
                  <div><label className="text-sm text-muted-foreground block mb-1">Spouse Name</label><div className="font-medium">{profile.spouse_name || 'N/A'}</div></div>
                  <div><label className="text-sm text-muted-foreground block mb-1">Marriage Date</label><div className="font-medium">{profile.marriage_date ? new Date(profile.marriage_date).toLocaleDateString() : 'N/A'}</div></div>
                </>
              )}
            </div>
          )}

          {activeTab === 'professional' && (
            <div className="grid grid-cols-1 gap-6">
              <div><label className="text-sm text-muted-foreground block mb-1">Member Category</label><div className="font-medium">{profile.member_category || 'General Member'}</div></div>
              <div><label className="text-sm text-muted-foreground block mb-1">Status</label><div className="font-medium capitalize">{profile.approval_status || 'Pending'}</div></div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div><label className="text-sm text-muted-foreground block mb-1">Email Address</label><div className="font-medium flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400"/> {profile.email}</div></div>
              <div><label className="text-sm text-muted-foreground block mb-1">Mobile Number</label><div className="font-medium flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400"/> {profile.phone || 'N/A'}</div></div>
            </div>
          )}
        </motion.div>

      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;
