
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const MemberApprovalModal = ({ open, onOpenChange, member, onApprove, onDeny }) => {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(member);
      onOpenChange(false);
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = async () => {
    setLoading(true);
    try {
      await onDeny(member.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Denial failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review Member Application</DialogTitle>
          <DialogDescription>
            Review the applicant's details before approving or denying their membership.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Full Name</Label>
            <p className="font-medium text-base">{member.full_name}</p>
          </div>
          
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Email Address</Label>
            <p className="font-medium text-base">{member.email}</p>
          </div>
          
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Mobile Number</Label>
            <p className="font-medium text-base">{member.mobile_number}</p>
          </div>
        </div>

        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeny} disabled={loading}>
            Deny
          </Button>
          <Button onClick={handleApprove} disabled={loading}>
            {loading ? 'Processing...' : 'Approve'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MemberApprovalModal;
