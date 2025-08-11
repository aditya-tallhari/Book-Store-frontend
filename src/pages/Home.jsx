import React from 'react'
import Hero from '../components/Hero'
import BookList from '../components/BookList'
import FindBookSection from '../components/FindBookSection'
import AwardBanner from '../components/Banner'
import NewReleases from '../components/NewReleases'

const Home = () => {
  return (
    <>
       <Hero/>
       <BookList/> 
       <FindBookSection/>
       <AwardBanner/>
        <NewReleases/>
    </>
  )
}

export default Home