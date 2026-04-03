
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Save, X, Upload, User } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const EditProfilePage = () => {
  const { currentUser, isAdmin, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    marital_status: '',
    spouse_name: '',
    marriage_date: '',
    member_category: 'General Member'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      
      try {
        const result = await pb.collection('members').getList(1, 1, {
          filter: `userId="${currentUser.id}"`,
          $autoCancel: false
        });
        
        if (result.items.length > 0) {
          const member = result.items[0];
          setMemberId(member.id);
          setFormData({
            name: member.name || '',
            email: member.email || '',
            phone: member.phone || '',
            gender: member.gender || '',
            date_of_birth: member.date_of_birth ? member.date_of_birth.split('T')[0] : '',
            marital_status: member.marital_status || '',
            spouse_name: member.spouse_name || '',
            marriage_date: member.marriage_date ? member.marriage_date.split('T')[0] : '',
            member_category: member.member_category || 'General Member'
          });
          
          if (member.profile_photo) {
            setImagePreview(pb.files.getUrl(member, member.profile_photo));
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!memberId) return;
    
    setSaving(true);
    try {
      const data = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });
      
      if (imageFile) {
        data.append('profile_photo', imageFile);
      }

      await pb.collection('members').update(memberId, data, { $autoCancel: false });
      
      toast.success('Profile updated successfully');
      await refreshUser();
      navigate('/profile');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[70vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Profile - Professional Engineers Association</title>
      </Helmet>
      <Header />
      
      <main className="py-12 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Profile</h1>
            <p className="text-slate-500 mt-2">Update your personal and professional information.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-slate-100">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 shadow-sm">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Label className="text-base font-semibold mb-2 block">Profile Photo</Label>
                  <div className="flex items-center gap-4">
                    <Input 
                      type="file" 
                      accept="image/jpeg,image/png,image/webp" 
                      onChange={handleImageChange} 
                      className="max-w-xs cursor-pointer"
                    />
                  </div>
                  <p className="text-sm text-slate-500 mt-2">Recommended: Square image, max 5MB. Formats: JPG, PNG, WebP.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(val) => handleSelectChange('gender', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input id="date_of_birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marital_status">Marital Status</Label>
                    <Select value={formData.marital_status} onValueChange={(val) => handleSelectChange('marital_status', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.marital_status === 'Married' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="spouse_name">Spouse Name</Label>
                        <Input id="spouse_name" name="spouse_name" value={formData.spouse_name} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="marriage_date">Marriage Date</Label>
                        <Input id="marriage_date" name="marriage_date" type="date" value={formData.marriage_date} onChange={handleChange} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Professional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="member_category">Member Category</Label>
                    <Select 
                      value={formData.member_category} 
                      onValueChange={(val) => handleSelectChange('member_category', val)}
                      disabled={!isAdmin}
                    >
                      <SelectTrigger className={!isAdmin ? "bg-slate-50 text-slate-500" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="President">President</SelectItem>
                        <SelectItem value="Vice President">Vice President</SelectItem>
                        <SelectItem value="Secretary">Secretary</SelectItem>
                        <SelectItem value="Joint Secretary">Joint Secretary</SelectItem>
                        <SelectItem value="Treasurer">Treasurer</SelectItem>
                        <SelectItem value="Media Prabhari">Media Prabhari</SelectItem>
                        <SelectItem value="Core Committee Member">Core Committee Member</SelectItem>
                        <SelectItem value="General Member">General Member</SelectItem>
                      </SelectContent>
                    </Select>
                    {!isAdmin && <p className="text-xs text-slate-500">Only administrators can change member categories.</p>}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate('/profile')} disabled={saving} className="w-full sm:w-auto">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                  {saving ? (
                    <><LoadingSpinner className="w-4 h-4 mr-2" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                  )}
                </Button>
              </div>

            </form>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default EditProfilePage;
