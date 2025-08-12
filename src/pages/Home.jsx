import React from 'react'
import Hero from '../components/Home_Components/Hero'
import BookList from '../components/Home_Components/BookList'
import FindBookSection from '../components/Home_Components/FindBookSection'
import AwardBanner from '../components/Home_Components/Banner'
import NewReleases from '../components/Home_Components/NewReleases'

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