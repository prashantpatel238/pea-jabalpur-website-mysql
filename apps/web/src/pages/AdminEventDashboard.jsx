
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Search, Calendar, MapPin, Edit, Trash2, Clock } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import EventForm from '@/components/EventForm.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const AdminEventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('events').getFullList({
        sort: 'event_date',
        $autoCancel: false
      });
      setEvents(records);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchEvents();
  };

  const confirmDelete = (event) => {
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;
    
    try {
      await pb.collection('events').delete(eventToDelete.id, { $autoCancel: false });
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
    } finally {
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const filteredEvents = events.filter(event => 
    event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Manage Events - Admin Dashboard</title>
      </Helmet>
      <Header />

      <main className="min-h-screen bg-secondary/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Calendar className="w-8 h-8 mr-3 text-primary" />
                Manage Events
              </h1>
              <p className="text-muted-foreground mt-1">Create and manage organization events and notifications.</p>
            </div>
            <Button onClick={handleOpenCreate} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Add New Event
            </Button>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search events by name or venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Total Events: {filteredEvents.length}
              </div>
            </div>

            {loading ? (
              <div className="p-12 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground">No events found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your search or create a new event.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 text-muted-foreground text-sm uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium">Event Details</th>
                      <th className="px-6 py-4 font-medium">Date & Time</th>
                      <th className="px-6 py-4 font-medium">Venue</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-foreground">{event.event_name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1 mt-1 max-w-xs">
                            {event.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-foreground">
                            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                            {formatDate(event.event_date)}
                          </div>
                          {event.event_time && (
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Clock className="w-4 h-4 mr-2" />
                              {event.event_time}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start text-sm text-foreground max-w-[200px]">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(event)}>
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => confirmDelete(event)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Event Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          </DialogHeader>
          <EventForm 
            event={editingEvent} 
            onSuccess={handleFormSuccess} 
            onCancel={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event "{eventToDelete?.event_name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminEventDashboard;
