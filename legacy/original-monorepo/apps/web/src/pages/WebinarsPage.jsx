
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Video, Calendar, Clock, Users, Play } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';

const WebinarsPage = () => {
  const upcomingWebinars = [
    {
      title: 'Future of Sustainable Engineering',
      speaker: 'Dr. Rajesh Kumar',
      date: '2026-04-15',
      time: '3:00 PM IST',
      duration: '90 minutes',
      attendees: 247,
      description: 'Explore emerging trends in sustainable engineering practices and their impact on future infrastructure development.'
    },
    {
      title: 'AI in Structural Analysis',
      speaker: 'Prof. Meera Patel',
      date: '2026-04-22',
      time: '4:00 PM IST',
      duration: '60 minutes',
      attendees: 189,
      description: 'Learn how artificial intelligence is revolutionizing structural analysis and design optimization.'
    },
    {
      title: 'Smart Grid Technologies',
      speaker: 'Eng. Suresh Reddy',
      date: '2026-04-29',
      time: '2:30 PM IST',
      duration: '75 minutes',
      attendees: 312,
      description: 'Deep dive into smart grid implementation, challenges, and solutions for modern power distribution.'
    }
  ];

  const pastWebinars = [
    {
      title: 'Advanced Materials in Construction',
      speaker: 'Dr. Anil Verma',
      date: '2026-03-18',
      views: 1847
    },
    {
      title: 'IoT in Industrial Automation',
      speaker: 'Eng. Priya Sharma',
      date: '2026-03-11',
      views: 2134
    },
    {
      title: 'Renewable Energy Integration',
      speaker: 'Dr. Amit Joshi',
      date: '2026-03-04',
      views: 1623
    }
  ];

  return (
    <>
      <Helmet>
        <title>Webinars - Professional Engineers Association</title>
        <meta name="description" content="Join our expert-led webinars on cutting-edge engineering topics." />
      </Helmet>
      <Header />

      <section className="relative min-h-[50vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=2940&auto=format&fit=crop" 
            alt="Online webinar presentation" 
            className="w-full h-full object-cover object-center"
          />
          <div className="hero-overlay" />
          <div className="hero-gradient" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-white mb-6">
              Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-secondary">Webinars</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Learn from industry leaders through our interactive webinar series on cutting-edge engineering topics.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-slate-900">Upcoming Webinars</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {upcomingWebinars.map((webinar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <Video className="w-7 h-7 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{webinar.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{webinar.description}</p>
                  
                  <div className="space-y-3 mb-6 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>{webinar.speaker}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{webinar.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{webinar.time} • {webinar.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <span className="text-sm text-slate-500" style={{ fontVariantNumeric: 'tabular-nums' }}>{webinar.attendees} registered</span>
                    <Button size="sm" className="rounded-full">Register Now</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 text-slate-900">Past Webinars</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pastWebinars.map((webinar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Play className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-2 text-slate-900">{webinar.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">{webinar.speaker}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{webinar.date}</span>
                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{webinar.views} views</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default WebinarsPage;
