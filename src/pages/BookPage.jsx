import React from "react";
import BooksList from "../components/BooksList";

const BooksPage = () => {
  return (
    <section className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold my-6">All Books</h1>
      <BooksList />
    </section>
  );
};

export default BooksPage;
