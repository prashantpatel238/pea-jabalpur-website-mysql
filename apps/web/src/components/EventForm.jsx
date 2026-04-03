
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, AlignLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const EventForm = ({ event, onSuccess, onCancel }) => {
  const { currentUser } = useAuth();
  const isEditing = !!event;
  
  const [formData, setFormData] = useState({
    event_name: event?.event_name || '',
    event_date: event?.event_date ? event.event_date.split('T')[0] : '',
    event_time: event?.event_time || '',
    venue: event?.venue || '',
    description: event?.description || '',
    notify_members: event?.notify_members ?? true,
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (checked) => {
    setFormData(prev => ({ ...prev, notify_members: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.event_name || !formData.event_date || !formData.venue || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Ensure date is properly formatted for PocketBase (append time if needed, or just use YYYY-MM-DD 12:00:00Z)
      const dateObj = new Date(formData.event_date);
      const formattedDate = dateObj.toISOString();

      const payload = {
        ...formData,
        event_date: formattedDate,
        created_by: currentUser.id
      };

      if (isEditing) {
        await pb.collection('events').update(event.id, payload, { $autoCancel: false });
        toast.success('Event updated successfully');
      } else {
        await pb.collection('events').create(payload, { $autoCancel: false });
        toast.success('Event created successfully');
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error(error.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="event_name">Event Name <span className="text-destructive">*</span></Label>
          <Input
            id="event_name"
            name="event_name"
            value={formData.event_name}
            onChange={handleChange}
            placeholder="e.g., Annual General Meeting"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="event_date">Date <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="event_date"
                name="event_date"
                type="date"
                value={formData.event_date}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="event_time">Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="event_time"
                name="event_time"
                type="time"
                value={formData.event_time}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue">Venue <span className="text-destructive">*</span></Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g., Community Hall, Main Street"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
          <div className="relative">
            <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about the event..."
              className="pl-10 min-h-[100px]"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
          <div className="space-y-0.5">
            <Label className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Notify Members
            </Label>
            <p className="text-sm text-muted-foreground">
              Send an email notification to all approved members about this event.
            </p>
          </div>
          <Switch
            checked={formData.notify_members}
            onCheckedChange={handleToggle}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
