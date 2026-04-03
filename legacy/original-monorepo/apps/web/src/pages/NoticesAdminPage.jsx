
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, FileText, Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';

const NoticesAdminPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    notice_type: 'notice',
    event_name: '',
    event_date: '',
    event_start_time: '',
    event_end_time: '',
    event_purpose: '',
    event_venue: '',
    publish_date: new Date().toISOString().split('T')[0],
    status: 'draft'
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const data = await pb.collection('notices').getList(1, 100, {
        sort: '-created',
        $autoCancel: false
      });
      setNotices(data.items);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleOpenModal = (notice = null) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title || '',
        description: notice.description || '',
        notice_type: notice.notice_type || 'notice',
        event_name: notice.event_name || '',
        event_date: notice.event_date ? notice.event_date.split('T')[0] : '',
        event_start_time: notice.event_start_time || '',
        event_end_time: notice.event_end_time || '',
        event_purpose: notice.event_purpose || '',
        event_venue: notice.event_venue || '',
        publish_date: notice.publish_date ? notice.publish_date.split('T')[0] : new Date().toISOString().split('T')[0],
        status: notice.status || 'draft'
      });
    } else {
      setEditingNotice(null);
      setFormData({
        title: '',
        description: '',
        notice_type: 'notice',
        event_name: '',
        event_date: '',
        event_start_time: '',
        event_end_time: '',
        event_purpose: '',
        event_venue: '',
        publish_date: new Date().toISOString().split('T')[0],
        status: 'draft'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }

    setSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        event_date: formData.event_date ? new Date(formData.event_date).toISOString() : null,
        publish_date: formData.publish_date ? new Date(formData.publish_date).toISOString() : null,
      };

      if (editingNotice) {
        await pb.collection('notices').update(editingNotice.id, dataToSave, { $autoCancel: false });
        toast.success('Notice updated successfully');
      } else {
        await pb.collection('notices').create(dataToSave, { $autoCancel: false });
        toast.success('Notice created successfully');
      }

      setIsModalOpen(false);
      fetchNotices();
    } catch (error) {
      console.error('Error saving notice:', error);
      toast.error('Failed to save notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await pb.collection('notices').delete(id, { $autoCancel: false });
        toast.success('Notice deleted successfully');
        fetchNotices();
      } catch (error) {
        console.error('Error deleting notice:', error);
        toast.error('Failed to delete notice');
      }
    }
  };

  const toggleStatus = async (notice) => {
    const newStatus = notice.status === 'published' ? 'draft' : 'published';
    try {
      await pb.collection('notices').update(notice.id, { status: newStatus }, { $autoCancel: false });
      toast.success(`Notice marked as ${newStatus}`);
      fetchNotices();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    }
  };

  return (
    <>
      <Helmet>
        <title>Notices Management - Admin</title>
      </Helmet>
      <Header />

      <main className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Notices & Events</h1>
            <p className="text-muted-foreground mt-1">Manage public notices and upcoming events.</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Add New Notice
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner /></div>
        ) : (
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Publish Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        No notices found. Click "Add New Notice" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    notices.map((notice) => (
                      <TableRow key={notice.id}>
                        <TableCell className="font-medium text-foreground">{notice.title}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            {notice.notice_type === 'event' ? <CalendarIcon className="w-3 h-3 mr-1" /> : <FileText className="w-3 h-3 mr-1" />}
                            {notice.notice_type}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {notice.publish_date ? new Date(notice.publish_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <button 
                            onClick={() => toggleStatus(notice)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              notice.status === 'published' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            }`}
                          >
                            {notice.status === 'published' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                            {notice.status}
                          </button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleOpenModal(notice)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(notice.id)}>
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNotice ? 'Edit Notice' : 'Add New Notice'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notice_type">Type</Label>
                <Select value={formData.notice_type} onValueChange={(val) => setFormData({...formData, notice_type: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notice">General Notice</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publish_date">Publish Date</Label>
                <Input id="publish_date" type="date" value={formData.publish_date} onChange={(e) => setFormData({...formData, publish_date: e.target.value})} />
              </div>
            </div>

            {formData.notice_type === 'event' && (
              <div className="border-t border-border pt-6 mt-6 space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="event_name">Event Name</Label>
                    <Input id="event_name" value={formData.event_name} onChange={(e) => setFormData({...formData, event_name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event_date">Event Date</Label>
                    <Input id="event_date" type="date" value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event_venue">Venue</Label>
                    <Input id="event_venue" value={formData.event_venue} onChange={(e) => setFormData({...formData, event_venue: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event_start_time">Start Time</Label>
                    <Input id="event_start_time" type="time" value={formData.event_start_time} onChange={(e) => setFormData({...formData, event_start_time: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event_end_time">End Time</Label>
                    <Input id="event_end_time" type="time" value={formData.event_end_time} onChange={(e) => setFormData({...formData, event_end_time: e.target.value})} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="event_purpose">Event Purpose</Label>
                    <Input id="event_purpose" value={formData.event_purpose} onChange={(e) => setFormData({...formData, event_purpose: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <><LoadingSpinner className="w-4 h-4 mr-2" /> Saving...</> : (editingNotice ? 'Update Notice' : 'Create Notice')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default NoticesAdminPage;
