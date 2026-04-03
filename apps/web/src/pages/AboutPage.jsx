
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Target, Eye, Users, BookOpen, Award, Shield, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  const values = [
    { 
      icon: Users, 
      title: 'Collaboration', 
      desc: 'Fostering teamwork and knowledge sharing among peers across all engineering disciplines.',
      image: 'https://images.unsplash.com/photo-1565841327798-694bc2074762'
    },
    { 
      icon: BookOpen, 
      title: 'Continuous Learning', 
      desc: 'Promoting ongoing education, skill development, and adaptation to new technologies.',
      image: 'https://images.unsplash.com/photo-1695370992939-be4eb6fddf35'
    },
    { 
      icon: Award, 
      title: 'Excellence', 
      desc: 'Striving for the highest standards in engineering practice and project execution.',
      image: 'https://images.unsplash.com/photo-1620928491723-e1a4f8222181'
    },
    { 
      icon: Shield, 
      title: 'Integrity', 
      desc: 'Upholding strict ethical standards and transparency in all professional endeavors.',
      image: 'https://images.unsplash.com/photo-1573951265735-7f377a9455a0'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Professional Engineers Association Jabalpur</title>
        <meta name="description" content="Learn about the Professional Engineers Association Jabalpur, our mission, vision, and values." />
      </Helmet>
      <Header />

      <section className="relative min-h-[60vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1531497258014-b5736f376b1b?q=80&w=2940&auto=format&fit=crop" 
            alt="Professional team in corporate office" 
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
              Advancing Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-secondary">Excellence</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              A premier organization dedicated to uniting, empowering, and advancing the engineering community in Jabalpur and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white relative z-20 -mt-10 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-slate-50 rounded-3xl p-8 lg:p-12 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                To create a dynamic platform that empowers engineering professionals through knowledge sharing, networking opportunities, and collaborative initiatives. We aim to foster innovation, promote best practices, and contribute to the advancement of engineering excellence in our region.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-slate-50 rounded-3xl p-8 lg:p-12 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-8">
                <Eye className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Our Vision</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                To be recognized as the leading professional association for engineers, known for our commitment to excellence, innovation, and community development. We envision a future where every engineering professional has access to resources, mentorship, and opportunities for continuous growth.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">Our Legacy of Impact</h2>
              <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                <p>
                  The Professional Engineers Association was founded with a clear purpose: to bridge the gap between various engineering disciplines and create a unified voice for professionals in the region.
                </p>
                <p>
                  Over the years, we have grown from a small group of passionate engineers into a robust network of industry leaders, innovators, and young professionals. Our journey is marked by numerous successful technical seminars, impactful community projects, and the continuous professional development of our members.
                </p>
                <p>
                  Today, we stand as a pillar of the engineering community, committed to upholding the highest standards of the profession while adapting to the ever-changing technological landscape.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {[
                { year: '1998', text: 'Association Founded' },
                { year: '500+', text: 'Active Members' },
                { year: '50+', text: 'Corporate Partners' },
                { year: '150+', text: 'Technical Seminars' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div className="text-4xl font-bold text-primary-foreground mb-2">{item.year}</div>
                  <div className="text-slate-400 font-medium">{item.text}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The fundamental principles that guide our association, shape our culture, and drive our members towards excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={value.image} 
                    alt={value.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <value.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-slate-900 mb-6">Ready to join our community?</h2>
            <p className="text-xl mb-10 text-slate-600 max-w-2xl mx-auto">
              Connect with peers, access exclusive resources, and take your engineering career to the next level.
            </p>
            <Button asChild size="lg" className="h-14 px-8 text-base rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1">
              <Link to="/register">
                Become a Member
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AboutPage;
