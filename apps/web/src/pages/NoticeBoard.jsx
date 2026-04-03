
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Calendar, Gift, Heart, MapPin, Clock, FileText, Bell } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const NoticeBoard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('notices');
  
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [anniversaries, setAnniversaries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const today = new Date();
        const currentMonth = today.getMonth();
        
        // Fetch published notices
        const noticesData = await pb.collection('notices').getList(1, 50, {
          sort: '-created',
          filter: 'status="published"',
          $autoCancel: false
        });
        
        const fetchedNotices = noticesData.items.filter(n => n.notice_type === 'notice' || !n.notice_type);
        const fetchedEvents = noticesData.items.filter(n => n.notice_type === 'event');
        
        setNotices(fetchedNotices);
        setEvents(fetchedEvents);

        // Fetch members for birthdays and anniversaries
        const members = await pb.collection('members').getFullList({
          filter: 'approval_status="approved"',
          $autoCancel: false
        });

        const bdays = [];
        const annivs = [];

        members.forEach(m => {
          if (m.date_of_birth && new Date(m.date_of_birth).getMonth() === currentMonth) {
            bdays.push(m);
          }
          if (m.marriage_date && new Date(m.marriage_date).getMonth() === currentMonth) {
            annivs.push(m);
          }
        });

        bdays.sort((a, b) => new Date(a.date_of_birth).getDate() - new Date(b.date_of_birth).getDate());
        annivs.sort((a, b) => new Date(a.marriage_date).getDate() - new Date(b.marriage_date).getDate());

        setBirthdays(bdays);
        setAnniversaries(annivs);
      } catch (err) {
        console.error('Failed to fetch notice board data:', err);
        setError('Failed to load notice board data. Please try again later.');
        toast.error('Failed to load notices');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Notice Board - Professional Engineers Association</title>
      </Helmet>
      <Header />

      <main className="section-spacing max-w-5xl mx-auto min-h-screen">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Notice Board</h1>
          <p className="text-lg text-muted-foreground">Stay updated with community announcements, events, and celebrations.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button 
            onClick={() => setActiveTab('notices')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${activeTab === 'notices' ? 'bg-[var(--primary-blue)] text-white shadow-md' : 'bg-white text-[var(--text-gray)] border border-border hover:bg-[var(--bg-light)]'}`}
          >
            <Bell className="w-4 h-4 inline-block mr-2 mb-0.5" /> Announcements
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${activeTab === 'events' ? 'bg-[var(--primary-blue)] text-white shadow-md' : 'bg-white text-[var(--text-gray)] border border-border hover:bg-[var(--bg-light)]'}`}
          >
            <Calendar className="w-4 h-4 inline-block mr-2 mb-0.5" /> Upcoming Events
          </button>
          <button 
            onClick={() => setActiveTab('birthdays')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${activeTab === 'birthdays' ? 'bg-[var(--primary-blue)] text-white shadow-md' : 'bg-white text-[var(--text-gray)] border border-border hover:bg-[var(--bg-light)]'}`}
          >
            <Gift className="w-4 h-4 inline-block mr-2 mb-0.5" /> Birthdays
          </button>
          <button 
            onClick={() => setActiveTab('anniversaries')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${activeTab === 'anniversaries' ? 'bg-[var(--primary-blue)] text-white shadow-md' : 'bg-white text-[var(--text-gray)] border border-border hover:bg-[var(--bg-light)]'}`}
          >
            <Heart className="w-4 h-4 inline-block mr-2 mb-0.5" /> Anniversaries
          </button>
        </div>

        {error ? (
          <div className="card-base text-center py-16">
            <p className="text-destructive mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-secondary">Try Again</button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {activeTab === 'notices' && (
              notices.length === 0 ? (
                <div className="card-base text-center py-16">
                  <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">No recent announcements.</p>
                </div>
              ) : (
                notices.map((notice, index) => (
                  <motion.div key={notice.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card-base p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-[var(--text-dark)]">{notice.title}</h3>
                      <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                        {new Date(notice.created).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[var(--text-dark)] leading-relaxed whitespace-pre-wrap">{notice.description}</p>
                  </motion.div>
                ))
              )
            )}

            {activeTab === 'events' && (
              events.length === 0 ? (
                <div className="card-base text-center py-16">
                  <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">No upcoming events scheduled.</p>
                </div>
              ) : (
                events.map((event, index) => (
                  <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card-base flex flex-col md:flex-row gap-6">
                    <div className="bg-[var(--secondary-blue)] rounded-[var(--radius-sm)] p-4 text-center min-w-[120px] flex flex-col justify-center border border-[var(--primary-blue)]/20">
                      <span className="text-[var(--primary-blue)] font-bold uppercase text-sm">
                        {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' }) : 'TBD'}
                      </span>
                      <span className="text-3xl font-bold text-[var(--text-dark)] my-1">
                        {event.event_date ? new Date(event.event_date).getDate() : '-'}
                      </span>
                      <span className="text-[var(--text-gray)] text-xs">
                        {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'short' }) : ''}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-[var(--text-dark)]">{event.title || event.event_name}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">Event</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-[var(--text-gray)] mb-4">
                        {event.event_start_time && <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {event.event_start_time} {event.event_end_time ? `- ${event.event_end_time}` : ''}</span>}
                        {event.event_venue && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.event_venue}</span>}
                      </div>
                      <p className="text-[var(--text-dark)] leading-relaxed whitespace-pre-wrap">{event.description}</p>
                    </div>
                  </motion.div>
                ))
              )
            )}

            {activeTab === 'birthdays' && (
              birthdays.length === 0 ? (
                <div className="card-base text-center py-16">
                  <Gift className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">No birthdays this month.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {birthdays.map((member, index) => (
                    <motion.div key={member.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className="card-base text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                      <div className="w-16 h-16 mx-auto bg-[var(--bg-light)] rounded-full flex items-center justify-center text-2xl mb-4 border border-border">🎂</div>
                      <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                      <p className="text-[var(--text-gray)] text-sm mb-3">{member.member_category || 'Member'}</p>
                      <div className="inline-block bg-[var(--secondary-blue)] text-[var(--primary-blue)] font-semibold px-3 py-1 rounded-full text-sm">
                        {new Date(member.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'anniversaries' && (
              anniversaries.length === 0 ? (
                <div className="card-base text-center py-16">
                  <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">No anniversaries this month.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {anniversaries.map((member, index) => (
                    <motion.div key={member.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className="card-base text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 to-red-500"></div>
                      <div className="w-16 h-16 mx-auto bg-[var(--bg-light)] rounded-full flex items-center justify-center text-2xl mb-4 border border-border">💍</div>
                      <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                      <p className="text-[var(--text-gray)] text-sm mb-3">with {member.spouse_name || 'Spouse'}</p>
                      <div className="inline-block bg-pink-50 text-pink-600 font-semibold px-3 py-1 rounded-full text-sm">
                        {new Date(member.marriage_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            )}

          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default NoticeBoard;
