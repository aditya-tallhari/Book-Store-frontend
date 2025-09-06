import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Home_Components/Hero';
import BookList from '../components/Home_Components/BookList';
import FindBookSection from '../components/Home_Components/FindBookSection';
import AwardBanner from '../components/Home_Components/Banner';
import NewReleases from '../components/Home_Components/NewReleases';

const Home = () => {
  // Animation variants for the entire page
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  // Animation variants for each main section
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="w-full"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <main className="space-y-16 py-8">
        <motion.section variants={sectionVariants}>
          <Hero />
        </motion.section>

        <motion.section variants={sectionVariants}>
          <BookList />
        </motion.section>

        <motion.section variants={sectionVariants}>
          <FindBookSection />
        </motion.section>

        <motion.section variants={sectionVariants}>
          <AwardBanner />
        </motion.section>

        <motion.section variants={sectionVariants}>
          <NewReleases />
        </motion.section>
      </main>
    </motion.div>

  );
};

export default Home;
