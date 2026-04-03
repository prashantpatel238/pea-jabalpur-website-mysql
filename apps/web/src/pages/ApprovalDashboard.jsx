
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Edit, Trash2, Users, Clock } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import EditMemberModal from '@/components/EditMemberModal.jsx';

const ApprovalDashboard = () => {
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [denyDialogOpen, setDenyDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const pendingMembers = await pb.collection('members').getList(1, 100, {
        filter: 'approval_status = "pending"',
        sort: '-created',
        expand: 'userId',
        $autoCancel: false
      });

      const approvedCount = await pb.collection('members').getList(1, 1, {
        filter: 'approval_status = "approved"',
        $autoCancel: false
      });

      setMembers(pendingMembers.items);
      setStats({
        pending: pendingMembers.totalItems,
        approved: approvedCount.totalItems
      });
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleApprove = async (member) => {
    setActionLoading(true);
    try {
      await pb.collection('members').update(member.id, {
        approval_status: 'approved'
      }, { $autoCancel: false });

      toast.success('Member approved successfully');
      fetchMembers();
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Failed to approve member');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!selectedMember) return;

    setActionLoading(true);
    try {
      await pb.collection('members').update(selectedMember.id, {
        approval_status: 'denied'
      }, { $autoCancel: false });

      toast.success('Member denied');
      setDenyDialogOpen(false);
      setSelectedMember(null);
      fetchMembers();
    } catch (error) {
      console.error('Deny error:', error);
      toast.error('Failed to deny member');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) return;

    setActionLoading(true);
    try {
      if (selectedMember.userId) {
        await pb.collection('users').delete(selectedMember.userId, { $autoCancel: false });
      }

      await pb.collection('members').delete(selectedMember.id, { $autoCancel: false });

      toast.success('Member deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedMember(null);
      fetchMembers();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete member');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Member Approvals - Admin Dashboard</title>
        <meta name="description" content="Manage member approval requests" />
      </Helmet>
      <Header />
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Member Approvals</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Members</p>
                  <p className="text-3xl font-bold text-card-foreground">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved Members</p>
                  <p className="text-3xl font-bold text-card-foreground">{stats.approved}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-card-foreground">Pending Approvals</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading members...</p>
              </div>
            ) : members.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-card-foreground mb-2">All caught up</p>
                <p className="text-muted-foreground">No pending approvals at the moment</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Date of Birth</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell>{formatDate(member.date_of_birth)}</TableCell>
                        <TableCell>{formatDate(member.created)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(member)}
                              disabled={actionLoading}
                              className="transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedMember(member);
                                setEditModalOpen(true);
                              }}
                              disabled={actionLoading}
                              className="transition-all duration-200"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedMember(member);
                                setDenyDialogOpen(true);
                              }}
                              disabled={actionLoading}
                              className="transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Deny
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedMember(member);
                                setDeleteDialogOpen(true);
                              }}
                              disabled={actionLoading}
                              className="transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

      <EditMemberModal
        member={selectedMember}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedMember(null);
        }}
        onSuccess={fetchMembers}
      />

      <AlertDialog open={denyDialogOpen} onOpenChange={setDenyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deny Member Application</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the member as denied.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeny} disabled={actionLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {actionLoading ? 'Denying...' : 'Deny Application'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the member and their user account. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={actionLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {actionLoading ? 'Deleting...' : 'Delete Member'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ApprovalDashboard;
