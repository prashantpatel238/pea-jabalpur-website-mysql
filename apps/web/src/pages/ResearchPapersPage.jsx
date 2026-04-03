
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, User } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';

const ResearchPapersPage = () => {
  const papers = [
    {
      title: 'Sustainable Infrastructure Development in Urban Areas',
      authors: 'Dr. Rajesh Kumar, Dr. Priya Sharma',
      date: '2026-02-15',
      category: 'Civil Engineering',
      abstract: 'This paper explores innovative approaches to sustainable infrastructure development in rapidly growing urban centers, focusing on resource optimization and environmental impact reduction.'
    },
    {
      title: 'Advanced Materials in Structural Engineering',
      authors: 'Prof. Anil Verma, Dr. Meera Patel',
      date: '2026-01-20',
      category: 'Materials Science',
      abstract: 'A comprehensive study on the application of advanced composite materials in modern structural engineering, including performance analysis and cost-benefit evaluation.'
    },
    {
      title: 'Smart Grid Technologies and Implementation',
      authors: 'Dr. Suresh Reddy, Eng. Kavita Singh',
      date: '2025-12-10',
      category: 'Electrical Engineering',
      abstract: 'An in-depth analysis of smart grid technologies, their implementation challenges, and potential solutions for efficient energy distribution in developing regions.'
    },
    {
      title: 'AI-Driven Predictive Maintenance Systems',
      authors: 'Dr. Amit Joshi, Dr. Neha Gupta',
      date: '2025-11-05',
      category: 'Mechanical Engineering',
      abstract: 'This research presents a novel AI-based framework for predictive maintenance in industrial machinery, demonstrating significant improvements in operational efficiency.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Research Papers - Professional Engineers Association</title>
        <meta name="description" content="Access cutting-edge research papers and publications from engineering professionals." />
      </Helmet>
      <Header />

      <section className="relative min-h-[50vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?q=80&w=2940&auto=format&fit=crop" 
            alt="Research and documentation" 
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
              Research <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-secondary">Papers</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Explore cutting-edge research and innovations from our community of engineering professionals.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {papers.map((paper, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <h3 className="text-2xl font-bold text-slate-900">{paper.title}</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary shrink-0">
                        {paper.category}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 mb-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{paper.authors}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{paper.date}</span>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 mb-6 leading-relaxed">{paper.abstract}</p>
                    
                    <Button variant="outline" className="rounded-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Full Paper
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 bg-primary rounded-2xl p-12 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Submit Your Research</h2>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Share your research with the engineering community. We welcome submissions from all engineering disciplines.
            </p>
            <Button variant="secondary" size="lg" className="h-14 px-8 rounded-full">
              Submission Guidelines
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ResearchPapersPage;
