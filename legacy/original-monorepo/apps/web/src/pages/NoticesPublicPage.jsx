
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, FileText, Search, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';

const NoticesPublicPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, notice, event
  const [dateFilter, setDateFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const data = await pb.collection('notices').getList(1, 100, {
          filter: 'status="published"',
          sort: '-publish_date',
          $autoCancel: false
        });
        setNotices(data.items);
      } catch (err) {
        console.error('Failed to fetch notices:', err);
        setError('Failed to load notices. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (notice.description && notice.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab = activeTab === 'all' || notice.notice_type === activeTab;
    
    let matchesDate = true;
    if (dateFilter !== 'all' && notice.notice_type === 'event' && notice.event_date) {
      const eventDate = new Date(notice.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dateFilter === 'upcoming') {
        matchesDate = eventDate >= today;
      } else if (dateFilter === 'past') {
        matchesDate = eventDate < today;
      }
    }

    return matchesSearch && matchesTab && matchesDate;
  });

  // Sort: Upcoming events first, then by publish date descending
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.notice_type === 'event' && b.notice_type === 'event' && a.event_date && b.event_date) {
      const dateA = new Date(a.event_date);
      const dateB = new Date(b.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const aIsUpcoming = dateA >= today;
      const bIsUpcoming = dateB >= today;
      
      if (aIsUpcoming && !bIsUpcoming) return -1;
      if (!aIsUpcoming && bIsUpcoming) return 1;
      if (aIsUpcoming && bIsUpcoming) return dateA - dateB; // Sooner upcoming first
      return dateB - dateA; // More recent past first
    }
    return new Date(b.publish_date) - new Date(a.publish_date);
  });

  return (
    <>
      <Helmet>
        <title>Notices & Events - Professional Engineers Association</title>
        <meta name="description" content="Stay updated with the latest notices and upcoming events from the association." />
      </Helmet>
      <Header />

      <main className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground tracking-tight" style={{ letterSpacing: '-0.02em' }}>Notices & Events</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stay informed about our latest announcements, technical seminars, and community gatherings.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeTab === 'all' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('all')}
              className="rounded-full"
            >
              All Updates
            </Button>
            <Button 
              variant={activeTab === 'notice' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('notice')}
              className="rounded-full"
            >
              Notices
            </Button>
            <Button 
              variant={activeTab === 'event' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('event')}
              className="rounded-full"
            >
              Events
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            {activeTab !== 'notice' && (
              <select 
                className="flex h-10 w-full md:w-[140px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            )}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner />
            <p className="mt-4 text-muted-foreground">Loading updates...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/20">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive font-medium">{error}</p>
          </div>
        ) : sortedNotices.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-border border-dashed">
            <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No updates found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedNotices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col h-full"
              >
                <div className={`h-2 w-full ${notice.notice_type === 'event' ? 'bg-primary' : 'bg-secondary'}`} />
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      notice.notice_type === 'event' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {notice.notice_type === 'event' ? <Calendar className="w-3 h-3 mr-1" /> : <FileText className="w-3 h-3 mr-1" />}
                      {notice.notice_type === 'event' ? 'Event' : 'Notice'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notice.publish_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-tight">{notice.title}</h3>
                  
                  {notice.notice_type === 'event' && (
                    <div className="space-y-2 mb-4 bg-muted/50 p-3 rounded-lg">
                      {notice.event_date && (
                        <div className="flex items-center text-sm text-foreground">
                          <Calendar className="w-4 h-4 mr-2 text-primary" />
                          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {new Date(notice.event_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                      )}
                      {(notice.event_start_time || notice.event_end_time) && (
                        <div className="flex items-center text-sm text-foreground">
                          <Clock className="w-4 h-4 mr-2 text-primary" />
                          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {notice.event_start_time} {notice.event_end_time ? `- ${notice.event_end_time}` : ''}
                          </span>
                        </div>
                      )}
                      {notice.event_venue && (
                        <div className="flex items-start text-sm text-foreground">
                          <MapPin className="w-4 h-4 mr-2 text-primary shrink-0 mt-0.5" />
                          <span>{notice.event_venue}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4 mt-auto">
                    {notice.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default NoticesPublicPage;
