import React from 'react'
import BookBanner from '../components/Home_Components/BookBanner'
import BookList from '../components/Home_Components/BookList'
import NewReleases from '../components/Home_Components/NewReleases'
import FindBookSection from '../components/Home_Components/FindBookSection'
import { motion } from 'framer-motion';

const Explore = () => {
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } },
  };

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
      {/* The main content area must flex-grow to push the footer down */}
      <main className="py-8 space-y-16">
        <motion.section variants={sectionVariants}>
          <BookList title="Popular Picks" />
        </motion.section>

        <motion.section variants={sectionVariants}>
          <NewReleases />
        </motion.section>

        <motion.section variants={sectionVariants}>
          <BookBanner />
        </motion.section>

        <motion.section variants={sectionVariants}>
          <FindBookSection />
        </motion.section>
        
        {/* You can add more sections here */}
      </main>
    </motion.div>
  );
};

export default Explore;
