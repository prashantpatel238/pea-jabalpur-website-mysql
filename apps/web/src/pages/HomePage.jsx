import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Calendar, Award, User, TrendingUp, Shield, Zap, Phone, ChevronRight } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
const HomePage = () => {
  const [leaders, setLeaders] = useState([]);
  const [orgTitle, setOrgTitle] = useState('Professional Engineers Association Jabalpur');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const titleRecord = await pb.collection('settings').getFirstListItem('setting_key="organization_title"', {
          $autoCancel: false
        }).catch(() => null);
        if (titleRecord) setOrgTitle(titleRecord.setting_value);
        const leadersData = await pb.collection('important_members').getList(1, 6, {
          sort: 'sort_order',
          filter: 'approval_status="approved"',
          $autoCancel: false
        });
        setLeaders(leadersData.items || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);
  const stats = [{
    label: 'Active Members',
    value: '500+',
    icon: Users
  }, {
    label: 'Events Hosted',
    value: '150+',
    icon: Calendar
  }, {
    label: 'Years of Excellence',
    value: '25+',
    icon: Award
  }, {
    label: 'Success Rate',
    value: '98%',
    icon: TrendingUp
  }];
  const features = [{
    icon: Users,
    title: 'Professional Network',
    description: 'Connect with experienced engineers across various disciplines and expand your professional circle.',
    image: 'https://images.unsplash.com/photo-1470781125250-124de17ebdea'
  }, {
    icon: Calendar,
    title: 'Events & Workshops',
    description: 'Participate in technical seminars, workshops, and networking events throughout the year.',
    image: 'https://images.unsplash.com/photo-1560849144-739435323954'
  }, {
    icon: Shield,
    title: 'Industry Advocacy',
    description: 'We represent the interests of engineering professionals at local and state levels.',
    image: 'https://images.unsplash.com/photo-1683199804561-ce75c2c7bf61'
  }, {
    icon: Award,
    title: 'Career Growth',
    description: 'Access exclusive resources, mentorship opportunities, and industry insights to advance your career.',
    image: 'https://images.unsplash.com/photo-1580894736036-7a68513983ec'
  }, {
    icon: Zap,
    title: 'Knowledge Sharing',
    description: 'Learn from industry experts through our comprehensive knowledge sharing programs.',
    image: 'https://images.unsplash.com/photo-1674403867232-9a278b2889ca'
  }, {
    icon: TrendingUp,
    title: 'Professional Development',
    description: 'Continuous learning opportunities to stay ahead in the rapidly evolving engineering field.',
    image: 'https://images.unsplash.com/photo-1699271772975-a4cf35547d37'
  }];
  return <>
      <Helmet>
        <title>{orgTitle} - Connecting Engineering Excellence</title>
        <meta name="description" content={`Join the ${orgTitle} to connect with fellow engineers, access resources, and advance your career.`} />
      </Helmet>
      <Header />

      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://horizons-cdn.hostinger.com/d67084a8-531d-4416-961e-74e9939fea26/hero-image-Y2ivQ.png" alt="Engineers collaborating" className="w-full h-full object-cover object-center" />
          <div className="hero-overlay" />
          <div className="hero-gradient" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          ease: "easeOut"
        }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
              <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-sm font-medium text-white tracking-wide">Empowering Engineering Excellence</span>
            </div>
            
            <h1 className="text-white mb-6">
              Building the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-secondary">Engineering</span> Together
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl">
              Join {orgTitle} to connect with industry leaders, access exclusive resources, and drive innovation in your professional journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-base rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1">
                <Link to="/register">
                  Become a Member
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base rounded-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1">
                <Link to="/about">Discover Our Mission</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white relative -mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }} className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <stat.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-4xl font-extrabold text-slate-900 mb-2" style={{
            fontVariantNumeric: 'tabular-nums'
          }}>{stat.value}</div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </motion.div>)}
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-slate-900 mb-4">Why Join Our Association?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We provide the platform, resources, and network you need to accelerate your engineering career and make a lasting impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-8">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {leaders.length > 0 && <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-slate-900 mb-4">Guided by Experience</h2>
                <p className="text-lg text-slate-600">
                  Meet the dedicated professionals and industry veterans guiding our association towards excellence.
                </p>
              </div>
              <Button asChild variant="ghost" className="hidden md:flex group text-primary hover:text-primary hover:bg-primary/5">
                <Link to="/important-members">
                  View Full Board <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leaders.map((leader, index) => <motion.div key={leader.id} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} className="group relative bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                      {leader.show_photo !== false && leader.image ? <img src={pb.files.getUrl(leader, leader.image)} alt={leader.show_name !== false ? leader.name : 'Leadership Member'} className="relative w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-md" /> : <div className="relative w-32 h-32 rounded-3xl bg-white border-4 border-slate-50 shadow-md flex items-center justify-center">
                          <User className="w-12 h-12 text-slate-300" />
                        </div>}
                    </div>
                    
                    {leader.show_role !== false && <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-4">
                        {leader.role}
                      </div>}
                    
                    {leader.show_name !== false && <h3 className="text-xl font-bold mb-2 text-slate-900">{leader.name}</h3>}
                    
                    {leader.show_phone !== false && leader.phone && <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mt-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span style={{
                  fontVariantNumeric: 'tabular-nums'
                }}>{leader.phone}</span>
                      </div>}
                  </div>
                </motion.div>)}
            </div>
            
            <div className="mt-10 text-center md:hidden">
              <Button asChild variant="outline" className="w-full rounded-full">
                <Link to="/important-members">View Full Board</Link>
              </Button>
            </div>
          </div>
        </section>}

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-primary/40 via-slate-950 to-slate-950 z-0" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-white mb-6">Take the Next Step in Your Career</h2>
            <p className="text-xl mb-10 text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Join a thriving community of engineers. Share knowledge, discover opportunities, and shape the future of our industry.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-base rounded-full bg-white text-slate-900 hover:bg-slate-100 hover:-translate-y-1 transition-all duration-300">
                <Link to="/register">
                  Apply for Membership
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base rounded-full border-slate-700 text-white hover:bg-slate-800 hover:text-white hover:-translate-y-1 transition-all duration-300">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>;
};
export default HomePage;