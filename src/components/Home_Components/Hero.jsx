// --- Main HeroSection Component --- // Orchestrates HeroContent and BookStack.
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroContent from "./HeroContent"
import BookStack from "./BookStack"

const Hero = () => {
  // State to track current book order for auto-shuffling
  const [currentBookOrder, setCurrentBookOrder] = useState([0, 1, 2]);

  // Define animation variants for text elements (left column)
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const childTextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Define the static properties for each visual slot on the stack
  const slotPositions = [
    { top: '0px', left: '0px', rotate: '0deg', zIndex: 30 },
    { top: '25px', left: '20px', rotate: '-5deg', zIndex: 20 },
    { top: '50px', left: '40px', rotate: '-10deg', zIndex: 10 }
  ];

  // Data for the three books, including title and author
  const bookData = [
    { id: 'book1', title: 'The Lorem Ipsum', author: 'A. Bookman', src: "https://m.media-amazon.com/images/I/81l3rZK4lnL._SY385_.jpg", alt: "Book cover: The Librarian" },
    { id: 'book2', title: 'Curious Tales', author: 'B. Storyteller', src: "https://m.media-amazon.com/images/I/41T7PTxb+6L._SY445_SX342_.jpg", alt: "Book cover: Curious Tales" },
    { id: 'book3', title: 'Digital Dreams', author: 'C. Reader', src: "https://m.media-amazon.com/images/I/41FKKgpdjwL._SY445_SX342_.jpg", alt: "Book cover: Digital Dreams" },
  ];

  // Define variants for the book stack container, specifically for its initial appearance
  const bookStackContainerVariants = {
    hidden: { opacity: 0, y: 50, rotate: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  // Auto-shuffle functionality - runs every 1 second
  useEffect(() => {
    const shuffleInterval = setInterval(() => {
      setCurrentBookOrder(prevOrder => {
        // Move the top book (first element) to the bottom
        const newOrder = [...prevOrder];
        const topBook = newOrder.shift(); // Remove first element
        newOrder.push(topBook); // Add it to the end
        return newOrder;
      });
    }, 1000); // 1 second

    // Cleanup interval on component unmount
    return () => clearInterval(shuffleInterval);
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center py-12 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto md:flex md:items-center md:space-x-12">
        <HeroContent textVariants={textVariants} childTextVariants={childTextVariants} />
        <BookStack
          bookData={bookData}
          slotPositions={slotPositions}
          bookStackContainerVariants={bookStackContainerVariants}
          currentBookOrder={currentBookOrder}
          autoShuffle={true}
        />
      </div>
    </section>
  );
};

export default Hero;