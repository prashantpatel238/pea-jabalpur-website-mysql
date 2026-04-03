
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Compass, TrendingUp, Shield, Users, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const IndustryGuidelinesPage = () => {
  const guidelines = [
    {
      icon: Shield,
      title: 'Safety Protocols',
      description: 'Comprehensive safety guidelines for construction sites, laboratories, and industrial facilities.',
      topics: ['Personal protective equipment', 'Hazard identification', 'Emergency procedures', 'Safety audits']
    },
    {
      icon: Users,
      title: 'Professional Conduct',
      description: 'Ethical guidelines and professional behavior standards for engineering practitioners.',
      topics: ['Code of ethics', 'Client relationships', 'Conflict resolution', 'Confidentiality']
    },
    {
      icon: TrendingUp,
      title: 'Project Management',
      description: 'Best practices for planning, executing, and delivering engineering projects successfully.',
      topics: ['Resource allocation', 'Timeline management', 'Quality control', 'Stakeholder communication']
    },
    {
      icon: Compass,
      title: 'Sustainability Practices',
      description: 'Guidelines for implementing sustainable and environmentally responsible engineering solutions.',
      topics: ['Green building standards', 'Energy efficiency', 'Waste reduction', 'Carbon footprint']
    }
  ];

  return (
    <>
      <Helmet>
        <title>Industry Guidelines - Professional Engineers Association</title>
        <meta name="description" content="Explore industry guidelines and best practices for engineering professionals." />
      </Helmet>
      <Header />

      <section className="relative min-h-[50vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2940&auto=format&fit=crop" 
            alt="Modern industrial facility" 
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
              Industry <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-secondary">Guidelines</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Comprehensive guidelines to navigate the complexities of modern engineering practice.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-slate-900 mb-4">Core Guidelines</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Essential frameworks and protocols that define excellence in engineering practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guidelines.map((guideline, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                  <guideline.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">{guideline.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{guideline.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Key Topics:</p>
                  <ul className="space-y-2">
                    {guideline.topics.map((topic, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 bg-slate-950 rounded-3xl p-12 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Industry guidelines evolve with technology and regulations. Join our community to receive the latest updates.
              </p>
              <Button asChild size="lg" className="h-14 px-8 rounded-full bg-white text-slate-900 hover:bg-slate-100">
                <Link to="/register">
                  Become a Member
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default IndustryGuidelinesPage;
