import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {HashRouter, Routes, Route} from 'react-router-dom'
import PropertyList from './comps/Property/PropertyList/PropertyList'
import Header from './comps/Header/Header'
import SignupLogin from './comps/SignupLogin/SignupLogin'
import UserPage from './comps/User/UserPage/UserPage'
import UserListings from './comps/User/UserListings/UserListings'
import getUserData from './comps/fetches/getUserProfile'
import PropertyForm from './comps/Property/PropertyForm/PropertyForm'
import PropertyDetails from './comps/Property/Listing/PropertyDetails'
import AuthStore from './comps/stores/AuthStore'
import Favorites from './comps/User/UserFavorites/Favorites'

function App() {

  const {login} = AuthStore()
  
  useEffect(() => {
      getUserData().then(user => {
        try {
          if(user)
            login(user)
        } catch (error) {
            throw new Error(error)
        }
      })
  }, [])

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path='/' element= {
            <>
              <Header></Header>
              <PropertyList></PropertyList>
            </>
          }>
          </Route>
          <Route path='/listings' element= {
            <>
              <Header></Header>
              <PropertyList></PropertyList>
            </>
          }>
          </Route>
          <Route path='/listings/:lid' element= {
            <>
              <Header></Header>
              <PropertyDetails></PropertyDetails>
            </>
          }>
          </Route>
          <Route path='/login' element= {
            <>
              <Header></Header>
              <SignupLogin></SignupLogin>
            </>
          }>
          </Route>
          <Route path='/profile' element = {
            <>
              <Header></Header>
              <UserPage></UserPage>
            </>
            }>            
          </Route>
          <Route path='/add-property' element = {
            <>
              <Header></Header>
              <PropertyForm></PropertyForm>
            </>
          }>            
          </Route>
          <Route path='/user-listings' element = {
            <>
              <Header></Header>
              <UserListings></UserListings>
            </>
            }>            
          </Route>
          <Route path='/favorites' element = {
            <>
              <Header></Header>
              <Favorites></Favorites>
            </>
            }>            
          </Route>
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
