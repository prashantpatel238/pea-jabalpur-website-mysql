
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Edit, Trash2, Plus, Download } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ConfirmDialog from '@/components/ConfirmDialog.jsx';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import { exportToExcel } from '@/lib/exportUtils.js';

const MemberManagement = () => {
  const { currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [exporting, setExporting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    member_category: 'General Member',
    approval_status: 'pending',
    gender: '',
    date_of_birth: '',
    marital_status: '',
    spouse_name: '',
    marriage_date: '',
    directory_visible: true
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    let filtered = members;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(m => m.approval_status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(m =>
        (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.phone || '').includes(searchTerm)
      );
    }

    setFilteredMembers(filtered);
  }, [searchTerm, statusFilter, members]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await pb.collection('members').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        member_category: member.member_category || 'General Member',
        approval_status: member.approval_status || 'pending',
        gender: member.gender || '',
        date_of_birth: member.date_of_birth ? member.date_of_birth.split('T')[0] : '',
        marital_status: member.marital_status || '',
        spouse_name: member.spouse_name || '',
        marriage_date: member.marriage_date ? member.marriage_date.split('T')[0] : '',
        directory_visible: member.directory_visible !== false
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '', email: '', phone: '', member_category: 'General Member',
        approval_status: 'approved', gender: '', date_of_birth: '',
        marital_status: '', spouse_name: '', marriage_date: '', directory_visible: true
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== '') {
          data.append(key, formData[key]);
        }
      });

      if (imageFile) {
        data.append('profile_photo', imageFile);
      }

      if (editingMember) {
        await pb.collection('members').update(editingMember.id, data, { $autoCancel: false });
        toast.success('Member updated successfully');
      } else {
        await pb.collection('members').create(data, { $autoCancel: false });
        toast.success('Member created successfully');
      }

      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error(error.message || 'Failed to save member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;
    try {
      await pb.collection('members').delete(memberToDelete.id, { $autoCancel: false });
      toast.success('Member deleted successfully');
      fetchMembers();
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  const toggleStatus = async (member) => {
    const newStatus = member.approval_status === 'approved' ? 'pending' : 'approved';
    try {
      await pb.collection('members').update(member.id, { approval_status: newStatus }, { $autoCancel: false });
      toast.success(`Member marked as ${newStatus}`);
      fetchMembers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleExport = () => {
    setExporting(true);
    try {
      const config = {
        show_email: true,
        show_phone: true,
        show_date_of_birth: true,
        custom_fields_visible: []
      };
      exportToExcel(filteredMembers, config, []);
      toast.success('Export successful');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Member Management - Admin Dashboard</title>
      </Helmet>
      <Header />

      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground tracking-tight">Member Management</h1>
              <p className="text-muted-foreground">Review, edit, and manage all association members.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExport} disabled={exporting || filteredMembers.length === 0}>
                {exporting ? <LoadingSpinner className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                Export to Excel
              </Button>
              <Button onClick={() => handleOpenModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white text-slate-900"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><LoadingSpinner /></div>
          ) : (
            <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          No members found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                                {member.profile_photo ? (
                                  <img src={pb.files.getUrl(member, member.profile_photo)} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-medium">
                                    {(member.name || 'U').charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="font-medium text-foreground">{member.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-foreground">{member.email}</div>
                            <div className="text-xs text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{member.phone}</div>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                              {member.member_category}
                            </span>
                          </TableCell>
                          <TableCell>
                            <button 
                              onClick={() => toggleStatus(member)}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                                member.approval_status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                                member.approval_status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 
                                'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {member.approval_status}
                            </button>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleOpenModal(member)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => {
                                setMemberToDelete(member);
                                setDeleteDialogOpen(true);
                              }}>
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
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="text-slate-900" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="text-slate-900" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="text-slate-900" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member_category">Category</Label>
                <Select value={formData.member_category} onValueChange={(val) => setFormData({...formData, member_category: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="President">President</SelectItem>
                    <SelectItem value="Vice President">Vice President</SelectItem>
                    <SelectItem value="Secretary">Secretary</SelectItem>
                    <SelectItem value="General Member">General Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="approval_status">Status</Label>
                <Select value={formData.approval_status} onValueChange={(val) => setFormData({...formData, approval_status: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Profile Photo</Label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <LoadingSpinner className="w-4 h-4 mr-2" /> : null}
                {editingMember ? 'Save Changes' : 'Add Member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Member"
        description="Are you sure you want to delete this member? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <Footer />
    </>
  );
};

export default MemberManagement;
