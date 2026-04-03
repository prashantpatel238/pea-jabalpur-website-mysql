
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, Loader2, Upload, Eye, EyeOff, RefreshCw } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';

const ImportantMembersManager = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    role: 'Core Member',
    bio: '',
    sort_order: 0,
    show_photo: true,
    show_name: true,
    show_role: true,
    show_phone: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await pb.collection('important_members').getFullList({
        sort: 'sort_order',
        $autoCancel: false
      });
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      toast.error('Failed to load leadership team');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingId(member.id);
      setFormData({
        name: member.name || '',
        role: member.role || 'Core Member',
        bio: member.bio || '',
        sort_order: member.sort_order || 0,
        show_photo: member.show_photo !== false,
        show_name: member.show_name !== false,
        show_role: member.show_role !== false,
        show_phone: member.show_phone !== false
      });
      setPreviewUrl(member.image ? pb.files.getUrl(member, member.image) : null);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        role: 'Core Member',
        bio: '',
        sort_order: members.length > 0 ? Math.max(...members.map(m => m.sort_order || 0)) + 1 : 0,
        show_photo: true,
        show_name: true,
        show_role: true,
        show_phone: true
      });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('role', formData.role);
      data.append('bio', formData.bio);
      data.append('sort_order', formData.sort_order);
      data.append('show_photo', formData.show_photo);
      data.append('show_name', formData.show_name);
      data.append('show_role', formData.show_role);
      data.append('show_phone', formData.show_phone);
      
      if (selectedFile) {
        data.append('image', selectedFile);
      }

      if (editingId) {
        await pb.collection('important_members').update(editingId, data, { $autoCancel: false });
        toast.success('Member updated successfully');
      } else {
        await pb.collection('important_members').create(data, { $autoCancel: false });
        toast.success('Member added successfully');
      }

      setModalOpen(false);
      fetchMembers();
    } catch (error) {
      console.error('Failed to save member:', error);
      toast.error('Failed to save member details');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      await pb.collection('important_members').delete(id, { $autoCancel: false });
      toast.success('Member deleted successfully');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to delete member');
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

  const applyGlobalVisibility = async (field, value) => {
    if (!window.confirm(`Are you sure you want to set ${field} to ${value ? 'visible' : 'hidden'} for ALL members?`)) return;
    
    setLoading(true);
    try {
      const promises = members.map(m => 
        pb.collection('important_members').update(m.id, { [field]: value }, { $autoCancel: false })
      );
      await Promise.all(promises);
      toast.success(`Global visibility updated for ${field}`);
      fetchMembers();
    } catch (error) {
      console.error('Error updating global visibility:', error);
      toast.error('Failed to update global visibility');
      setLoading(false);
    }
  };

  if (loading && members.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Leadership Team Manager - Admin Dashboard</title>
      </Helmet>
      <Header />

      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900">Leadership Management</h1>
              <p className="text-slate-500">Manage important members, their roles, and visibility settings.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={fetchMembers} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => handleOpenModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-slate-700 mr-2">Global Visibility Overrides:</span>
            <Button variant="secondary" size="sm" onClick={() => applyGlobalVisibility('show_photo', true)}>Show All Photos</Button>
            <Button variant="secondary" size="sm" onClick={() => applyGlobalVisibility('show_name', true)}>Show All Names</Button>
            <Button variant="secondary" size="sm" onClick={() => applyGlobalVisibility('show_role', true)}>Show All Roles</Button>
            <Button variant="secondary" size="sm" onClick={() => applyGlobalVisibility('show_phone', true)}>Show All Phones</Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[80px]">Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">Order</TableHead>
                    <TableHead className="text-center">Visibility</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                        No leadership members found. Click "Add Member" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                            {member.image ? (
                              <img src={pb.files.getUrl(member, member.image)} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                N/A
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
                        <TableCell className="text-center">{member.sort_order}</TableCell>
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
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(val) => setFormData({...formData, role: val})}
                >
                  <SelectTrigger>
                    <SelectValue />
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

            <div className="space-y-2">
              <Label htmlFor="sort_order">Display Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
              />
              <p className="text-xs text-slate-500">Lower numbers appear first in the list.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biography / Details</Label>
              <Textarea
                id="bio"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Brief description or contact info..."
              />
            </div>

            <div className="space-y-2">
              <Label>Profile Image</Label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Upload className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input 
                    type="file" 
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-slate-500 mt-1">Max size: 20MB. Recommended: Square image.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h3 className="text-sm font-medium text-slate-900 mb-4">Visibility Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <Label htmlFor="show_photo" className="cursor-pointer text-sm">Show Photo</Label>
                  <Switch 
                    id="show_photo" 
                    checked={formData.show_photo} 
                    onCheckedChange={(val) => setFormData({...formData, show_photo: val})} 
                  />
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <Label htmlFor="show_name" className="cursor-pointer text-sm">Show Name</Label>
                  <Switch 
                    id="show_name" 
                    checked={formData.show_name} 
                    onCheckedChange={(val) => setFormData({...formData, show_name: val})} 
                  />
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <Label htmlFor="show_role" className="cursor-pointer text-sm">Show Role</Label>
                  <Switch 
                    id="show_role" 
                    checked={formData.show_role} 
                    onCheckedChange={(val) => setFormData({...formData, show_role: val})} 
                  />
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <Label htmlFor="show_phone" className="cursor-pointer text-sm">Show Phone/Bio</Label>
                  <Switch 
                    id="show_phone" 
                    checked={formData.show_phone} 
                    onCheckedChange={(val) => setFormData({...formData, show_phone: val})} 
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingId ? 'Save Changes' : 'Add Member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default ImportantMembersManager;
