import React from 'react';
import { motion } from 'framer-motion';

const BookStack = ({ bookData, slotPositions, bookStackContainerVariants, currentBookOrder, autoShuffle }) => {
  // Use the currentBookOrder from props (Hero component) instead of local state
  const bookOrder = currentBookOrder || [0, 1, 2];

  return (
    <div className="md:w-1/2 flex justify-center md:justify-end relative pt-12 md:pt-0">
      <motion.div
        className={`relative w-[250px] h-[400px] flex items-center justify-center ${!autoShuffle ? 'cursor-pointer' : ''}`}
        whileHover={{ scale: 1.05, rotate: 3 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        initial="hidden"
        animate="visible"
        variants={bookStackContainerVariants}
        viewport={{ once: true, amount: 0.5 }}
      >
        {/* Author and Title for the top book, positioned above the stack */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-center z-40 w-full">
          <motion.p 
            className="text-sm font-semibold text-gray-700"
            key={`author-${bookOrder[0]}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {bookData[bookOrder[0]].author}
          </motion.p>
          <motion.h2 
            className="text-xl font-bold text-gray-900"
            key={`title-${bookOrder[0]}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {bookData[bookOrder[0]].title}
          </motion.h2>
        </div>

        {/* Render books based on the current order mapping to slots */}
        {bookOrder.map((bookIdx, slotIdx) => {
          const book = bookData[bookIdx];
          const targetStyle = slotPositions[slotIdx];

          return (
            <motion.img
              key={book.id}
              src={book.src}
              alt={book.alt}
              className="absolute object-cover rounded-lg shadow-xl w-[200px] h-[300px]"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{
                top: targetStyle.top,
                left: targetStyle.left,
                rotate: targetStyle.rotate,
                zIndex: targetStyle.zIndex,
                opacity: 1,
                y: 0,
                scale: 1
              }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20,
                duration: autoShuffle ? 0.8 : 0.5 // Smoother animation for auto-shuffle
              }}
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x300?text=Error"; }}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

export default BookStack;
