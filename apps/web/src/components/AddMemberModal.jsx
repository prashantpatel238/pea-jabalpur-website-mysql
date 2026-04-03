
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';

const AddMemberModal = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Name, email, and phone are required');
      return;
    }

    setLoading(true);

    try {
      const response = await apiServerClient.fetch('/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          admin: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add member');
      }

      toast.success('Member added successfully');
      
      setFormData({
        name: '', email: '', phone: '', gender: '', date_of_birth: '',
        marital_status: '', spouse_name: '', marriage_date: '', member_category: 'General Member'
      });
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error(error.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="member_category">Category</Label>
              <Select value={formData.member_category} onValueChange={(val) => handleSelectChange('member_category', val)}>
                <SelectTrigger>
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <><LoadingSpinner className="w-4 h-4 mr-2" /> Saving...</> : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberModal;
