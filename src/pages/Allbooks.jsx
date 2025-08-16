import React from 'react'
import BookBanner from '../components/Home_Components/BookBanner'
import BookList from '../components/Home_Components/BookList'
import NewReleases from '../components/Home_Components/NewReleases'
import FindBookSection from '../components/Home_Components/FindBookSection'
const Allbooks = () => {
  return (
    <>
    <BookBanner/>
    <BookList/>
    <NewReleases/>
    <FindBookSection/>
    <BookList/>
    <NewReleases/>
    </>
  )
}

export default Allbooks