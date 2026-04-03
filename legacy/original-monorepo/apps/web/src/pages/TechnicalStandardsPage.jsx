
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, Download, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TechnicalStandardsPage = () => {
  const standards = [
    {
      title: 'Structural Engineering Standards',
      description: 'Comprehensive guidelines for structural design, analysis, and construction practices.',
      category: 'Civil Engineering',
      lastUpdated: '2026-02-15'
    },
    {
      title: 'Electrical Safety Standards',
      description: 'Safety protocols and best practices for electrical installations and maintenance.',
      category: 'Electrical Engineering',
      lastUpdated: '2026-01-20'
    },
    {
      title: 'Mechanical Design Standards',
      description: 'Industry standards for mechanical component design and manufacturing processes.',
      category: 'Mechanical Engineering',
      lastUpdated: '2025-12-10'
    },
    {
      title: 'Software Development Standards',
      description: 'Coding standards, documentation practices, and quality assurance guidelines.',
      category: 'Software Engineering',
      lastUpdated: '2026-03-01'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Technical Standards - Professional Engineers Association</title>
        <meta name="description" content="Access comprehensive technical standards and guidelines for engineering professionals." />
      </Helmet>
      <Header />

      <section className="relative min-h-[50vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2940&auto=format&fit=crop" 
            alt="Technical documentation and standards" 
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
              Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-secondary">Standards</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Industry-approved technical standards and guidelines to ensure excellence in engineering practice.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {standards.map((standard, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold text-slate-900">{standard.title}</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary shrink-0">
                          {standard.category}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-4 leading-relaxed">{standard.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Updated: {standard.lastUpdated}</span>
                        <Button variant="outline" size="sm" className="rounded-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-8 border border-slate-200"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Why Standards Matter</h3>
                <ul className="space-y-3">
                  {[
                    'Ensure safety and reliability',
                    'Maintain quality consistency',
                    'Facilitate collaboration',
                    'Meet regulatory requirements'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-primary rounded-2xl p-8 text-white"
              >
                <h3 className="text-xl font-bold mb-4">Need Custom Standards?</h3>
                <p className="text-primary-foreground/90 mb-6 leading-relaxed">
                  Contact our technical committee for organization-specific standard development.
                </p>
                <Button asChild variant="secondary" className="w-full rounded-full">
                  <Link to="/contact">
                    Get in Touch
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default TechnicalStandardsPage;
