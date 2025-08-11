import React from 'react';

const BookCard = ({ book }) => {
  // Placeholder image for books without an image URL
  const placeholderImage = "https://placehold.co/300x400/E0E0E0/333333?text=Book+Cover";

  // Use book.imageUrl if available, otherwise fallback to book.image, then placeholder
  const imageUrl = book.imageUrl || book.image || placeholderImage;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden
                    hover:shadow-xl hover:border-indigo-400 transition-all duration-300
                    flex flex-col transform hover:-translate-y-1"> {/* Removed 'group' as hover popup is removed */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={book.title}
          className="w-full h-64 sm:h-72 object-cover rounded-t-xl" // Rounded top corners for image
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }} // Fallback on error
        />
        {/* Price tag (always visible at bottom-left, matching the new image style) */}
        {book.price && (
          <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-base font-bold px-3 py-1 rounded-md shadow-md">
            ₹{book.price.toFixed(2)}
          </div>
        )}
      </div>
      <div className="p-4 flex-grow text-left"> {/* Aligned text left as in new image */}
        {/* Book Title */}
        <h3 className="text-lg font-semibold text-gray-800 leading-tight">{book.title}</h3>
        {/* Author Name */}
        <p className="text-indigo-600 text-sm mt-1">{book.author}</p> {/* Changed to indigo-600 for author color */}

        {/* Star Ratings (matching the new image style) */}
        <div className="flex items-center mt-2">
          {/* Example: Render 5 stars, with some filled based on a 'rating' prop */}
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < (book.rating || 4) ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"> {/* Changed to yellow-500 */}
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.071 3.292a1 1 0 00.95.69h3.46c.969 0 1.371 1.24.588 1.81l-2.793 2.03a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.793-2.03a1 1 0 00-1.176 0l-2.793 2.03c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.25 8.719c-.783-.57-.381-1.81.588-1.81h3.46a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
          ))}
          {/* A small dot divider as shown in the image */}
          {book.author && <span className="text-gray-500 text-xs ml-1 mr-1">•</span>}
          {/* Language can be displayed here if you provide it in your book data */}
          {book.language && <span className="text-gray-500 text-xs">{book.language}</span>}
        </div>
        {/* Description (re-added as per new image) */}
        <p className="text-gray-700 text-sm mt-2 line-clamp-3">
          {book.description || 'Simple and delicious recipes for everyday cooking.'}
        </p>
      </div>
      <div className="p-4 border-t border-gray-100 mt-auto">
        <button className="w-full bg-black text-white py-2 px-4 rounded-lg
                           hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700
                           focus:ring-offset-2 transition duration-300 flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13v6a1 1 0 001 1h8a1 1 0 001-1v-6M7 13H5.4M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          <span>Add To Cart</span>
        </button>
      </div>
    </div>
  );
};

export default BookCard;
