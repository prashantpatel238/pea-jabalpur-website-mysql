
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Lightbulb, Target, Zap, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const BestPracticesPage = () => {
  const practices = [
    {
      category: 'Design Phase',
      items: [
        'Conduct thorough requirement analysis before starting design',
        'Use standardized design patterns and methodologies',
        'Implement peer review processes for all design documents',
        'Maintain comprehensive design documentation'
      ]
    },
    {
      category: 'Development Phase',
      items: [
        'Follow coding standards and style guides consistently',
        'Implement version control for all project files',
        'Conduct regular code reviews and quality checks',
        'Document all major decisions and changes'
      ]
    },
    {
      category: 'Testing Phase',
      items: [
        'Develop comprehensive test plans early in the project',
        'Perform both unit and integration testing',
        'Maintain detailed test documentation and results',
        'Implement automated testing where applicable'
      ]
    },
    {
      category: 'Deployment Phase',
      items: [
        'Create detailed deployment checklists',
        'Perform staged rollouts to minimize risk',
        'Maintain rollback procedures for critical systems',
        'Document all deployment configurations'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Best Practices - Professional Engineers Association</title>
        <meta name="description" content="Learn industry best practices for engineering excellence." />
      </Helmet>
      <Header />

      <section className="relative min-h-[50vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop" 
            alt="Team collaboration and planning" 
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
              Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-secondary">Best Practices</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Proven methodologies and approaches that drive successful engineering outcomes.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {practices.map((practice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{practice.category}</h3>
                </div>
                <ul className="space-y-4">
                  {practice.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-slate-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Target, title: 'Clear Objectives', desc: 'Define measurable goals and success criteria for every project phase.' },
              { icon: Zap, title: 'Continuous Improvement', desc: 'Regularly review and refine processes based on lessons learned.' },
              { icon: CheckCircle2, title: 'Quality First', desc: 'Prioritize quality over speed to ensure long-term project success.' }
            ].map((principle, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <principle.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-900">{principle.title}</h3>
                <p className="text-slate-600 leading-relaxed">{principle.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default BestPracticesPage;
