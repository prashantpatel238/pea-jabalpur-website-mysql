
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';

const LeadershipManagementPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    role: 'Core Member',
    phone: '',
    sort_order: 0,
    show_photo: true,
    show_name: true,
    show_role: true,
    show_phone: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await pb.collection('important_members').getFullList({
        sort: 'sort_order',
        $autoCancel: false
      });
      setMembers(data);
    } catch (error) {
      console.error('Error fetching leadership members:', error);
      toast.error('Failed to load leadership members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || '',
        role: member.role || 'Core Member',
        phone: member.phone || '',
        sort_order: member.sort_order || 0,
        show_photo: member.show_photo !== false,
        show_name: member.show_name !== false,
        show_role: member.show_role !== false,
        show_phone: member.show_phone !== false
      });
      setImagePreview(member.photo ? pb.files.getUrl(member, member.photo) : null);
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role: 'Core Member',
        phone: '',
        sort_order: members.length > 0 ? Math.max(...members.map(m => m.sort_order || 0)) + 1 : 0,
        show_photo: true,
        show_name: true,
        show_role: true,
        show_phone: true
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
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
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('role', formData.role);
      data.append('phone', formData.phone);
      data.append('sort_order', formData.sort_order);
      data.append('show_photo', formData.show_photo);
      data.append('show_name', formData.show_name);
      data.append('show_role', formData.show_role);
      data.append('show_phone', formData.show_phone);
      data.append('is_important_member', true);
      data.append('approval_status', 'approved');

      if (imageFile) {
        data.append('photo', imageFile);
      }

      if (editingMember) {
        await pb.collection('important_members').update(editingMember.id, data, { $autoCancel: false });
        toast.success('Member updated successfully');
      } else {
        await pb.collection('important_members').create(data, { $autoCancel: false });
        toast.success('Member added successfully');
      }

      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error('Failed to save member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this leadership member?')) {
      try {
        await pb.collection('important_members').delete(id, { $autoCancel: false });
        toast.success('Member deleted successfully');
        fetchMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
        toast.error('Failed to delete member');
      }
    }
  };

  const toggleVisibility = async (id, field, currentValue) => {
    try {
      await pb.collection('important_members').update(id, {
        [field]: !currentValue
      }, { $autoCancel: false });
      
      setMembers(members.map(m => m.id === id ? { ...m, [field]: !currentValue } : m));
      toast.success('Visibility updated');
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  return (
    <>
      <Helmet>
        <title>Leadership Management - Admin</title>
      </Helmet>
      <Header />

      <main className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Leadership Management</h1>
            <p className="text-slate-500 mt-1">Manage the important members displayed on the public leadership page.</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Add New Member
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner /></div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[80px]">Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-center">Order</TableHead>
                    <TableHead className="text-center">Visibility</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                        No leadership members found. Click "Add New Member" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                            {member.photo ? (
                              <img src={pb.files.getUrl(member, member.photo)} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <ImageIcon className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-slate-900">{member.name}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {member.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">{member.phone || '-'}</TableCell>
                        <TableCell className="text-center font-mono text-sm">{member.sort_order}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => toggleVisibility(member.id, 'show_photo', member.show_photo !== false)}
                              className={`p-1.5 rounded-md transition-colors ${member.show_photo !== false ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-100'}`}
                              title="Toggle Photo"
                            >
                              {member.show_photo !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                            <button 
                              onClick={() => toggleVisibility(member.id, 'show_name', member.show_name !== false)}
                              className={`p-1.5 rounded-md transition-colors ${member.show_name !== false ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-100'}`}
                              title="Toggle Name"
                            >
                              <span className="text-[10px] font-bold">N</span>
                            </button>
                            <button 
                              onClick={() => toggleVisibility(member.id, 'show_role', member.show_role !== false)}
                              className={`p-1.5 rounded-md transition-colors ${member.show_role !== false ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-100'}`}
                              title="Toggle Role"
                            >
                              <span className="text-[10px] font-bold">R</span>
                            </button>
                            <button 
                              onClick={() => toggleVisibility(member.id, 'show_phone', member.show_phone !== false)}
                              className={`p-1.5 rounded-md transition-colors ${member.show_phone !== false ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-100'}`}
                              title="Toggle Phone"
                            >
                              <span className="text-[10px] font-bold">P</span>
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleOpenModal(member)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit Leadership Member' : 'Add Leadership Member'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="President">President</SelectItem>
                    <SelectItem value="Vice President">Vice President</SelectItem>
                    <SelectItem value="Secretary">Secretary</SelectItem>
                    <SelectItem value="Joint Secretary">Joint Secretary</SelectItem>
                    <SelectItem value="Treasurer">Treasurer</SelectItem>
                    <SelectItem value="Core Member">Core Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Optional" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sort_order">Display Order</Label>
                <Input id="sort_order" type="number" value={formData.sort_order} onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} />
                <p className="text-xs text-slate-500">Lower numbers appear first</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                  <p className="text-xs text-slate-500 mt-1">Recommended: Square image, max 2MB</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h3 className="text-sm font-medium text-slate-900 mb-4">Visibility Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <Label htmlFor="show_photo" className="cursor-pointer text-sm">Show Photo</Label>
                  <Switch id="show_photo" checked={formData.show_photo} onCheckedChange={(val) => setFormData({...formData, show_photo: val})} />
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <Label htmlFor="show_name" className="cursor-pointer text-sm">Show Name</Label>
                  <Switch id="show_name" checked={formData.show_name} onCheckedChange={(val) => setFormData({...formData, show_name: val})} />
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <Label htmlFor="show_role" className="cursor-pointer text-sm">Show Role</Label>
                  <Switch id="show_role" checked={formData.show_role} onCheckedChange={(val) => setFormData({...formData, show_role: val})} />
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <Label htmlFor="show_phone" className="cursor-pointer text-sm">Show Phone</Label>
                  <Switch id="show_phone" checked={formData.show_phone} onCheckedChange={(val) => setFormData({...formData, show_phone: val})} />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <><LoadingSpinner className="w-4 h-4 mr-2" /> Saving...</> : (editingMember ? 'Update Member' : 'Add Member')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default LeadershipManagementPage;
