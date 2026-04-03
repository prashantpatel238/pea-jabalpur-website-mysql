
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';

const CaseStudiesPage = () => {
  const caseStudies = [
    {
      title: 'Smart City Infrastructure Project',
      client: 'Municipal Corporation',
      challenge: 'Modernizing aging infrastructure while minimizing disruption to daily operations',
      solution: 'Implemented phased deployment with IoT sensors and real-time monitoring systems',
      results: ['42% reduction in maintenance costs', '67% improvement in response time', '89% citizen satisfaction rate'],
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2940&auto=format&fit=crop'
    },
    {
      title: 'Industrial Automation Upgrade',
      client: 'Manufacturing Facility',
      challenge: 'Increasing production efficiency without replacing existing machinery',
      solution: 'Retrofitted legacy equipment with modern control systems and predictive analytics',
      results: ['38% increase in production output', '52% reduction in downtime', '31% energy savings'],
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2940&auto=format&fit=crop'
    },
    {
      title: 'Renewable Energy Integration',
      client: 'Power Distribution Company',
      challenge: 'Integrating renewable energy sources into existing grid infrastructure',
      solution: 'Developed hybrid grid management system with advanced load balancing',
      results: ['45% renewable energy integration', '28% reduction in carbon emissions', '99.8% grid reliability'],
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2940&auto=format&fit=crop'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Case Studies - Professional Engineers Association</title>
        <meta name="description" content="Explore real-world engineering case studies and success stories." />
      </Helmet>
      <Header />

      <section className="relative min-h-[50vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2940&auto=format&fit=crop" 
            alt="Engineering project planning" 
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
              Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-secondary">Case Studies</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Real-world examples of engineering excellence and innovative problem-solving.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="relative h-80 lg:h-auto overflow-hidden">
                    <img 
                      src={study.image} 
                      alt={study.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-8 lg:p-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{study.client}</span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900">{study.title}</h3>
                    
                    <div className="space-y-6 mb-8">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Challenge</h4>
                        <p className="text-slate-600 leading-relaxed">{study.challenge}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Solution</h4>
                        <p className="text-slate-600 leading-relaxed">{study.solution}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Results</h4>
                        <ul className="space-y-2">
                          {study.results.map((result, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                              <span className="text-slate-600">{result}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="rounded-full">
                      Read Full Case Study
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CaseStudiesPage;
