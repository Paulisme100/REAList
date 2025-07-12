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
import AuthStore from './comps/stores/UserAuthStore'
import Favorites from './comps/User/UserFavorites/Favorites'
import MapWithDraw from './comps/Property/MapWithDraw/MapWithDraw'
import AgencyRegistration from './comps/Agency/AgencyRegistration/AgencyRegistration'
import AgencyPage from './comps/Agency/AgencyPage/AgencyPage'
import AgencyAuthStore from './comps/stores/AgencyAuthStore'
import agencyApi from './comps/fetches/agency/agencyApi'
import AgencyData from './comps/Agency/AgencyData/AgencyData'
import AgentProfile from './comps/Agency/AgentProfile/AgentProfile'
import UserPublicProfile from './comps/User/UserPublicProfile/UserPublicProfile'
import Footer from './comps/Footer/Footer'
import AgencyPublicProfile from './comps/Agency/AgencyPublicProfile/AgencyPublicProfile'

console.log(Notification.permission)

function App() {

  const {login : loginUser} = AuthStore()
  const {login: loginAgency} = AgencyAuthStore()
  
  useEffect(() => {


    // console.log(Notification.permission);



    const authenticate = async () => {

      try {
        const user = await getUserData();
        if(user) {
            if (user.accountType  == 'user') {
              loginUser(user);
              console.log('reg user logged: ' + user.accountType)
              return; 
            }

            if (user.accountType  == 'agency') {
              loginAgency(user)
              console.log('agency logged: ' + user.company_email)
              console.log(user)
              return; 
            }
        }

      } catch (userErr) {
        throw new Error(userErr)
      }

    };

    authenticate();
  }, [])

  

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path='/' element= {
            <>
              <Header></Header>
              <PropertyList></PropertyList>
              <Footer></Footer>
            </>
          }>
          </Route>
          <Route path='/listings' element= {
            <>
              <Header></Header>
              <PropertyList></PropertyList>
              <Footer></Footer>
            </>
          }>
          </Route>
          <Route path='/listings/:lid' element= {
            <>
              <Header></Header>
              <PropertyDetails></PropertyDetails>
              <Footer></Footer>
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
              <Footer></Footer>
            </>
            }>            
          </Route>
          <Route path='/users/:id' element = {
            <>
              <Header></Header>
              <UserPublicProfile></UserPublicProfile>
              <Footer></Footer>
            </>
            }>            
          </Route>
          <Route path='/agencies/:id' element = {
            <>
              <Header></Header>
              <AgencyPublicProfile></AgencyPublicProfile>
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
              <Footer></Footer>
            </>
            }>            
          </Route>
          <Route path='/favorites' element = {
            <>
              <Header></Header>
              <Favorites></Favorites>
              <Footer></Footer>
            </>
            }>            
          </Route>
          <Route path='/map' element = {
            <>
              <Header></Header>
              <MapWithDraw></MapWithDraw>
            </>
            }>            
          </Route>
          <Route path='/agency-registration' element = {
            <>
              <Header></Header>
              <AgencyRegistration></AgencyRegistration>
            </>
            }>            
          </Route>
          <Route path='/agency-main' element = {
            <>
              <Header></Header>
              <AgencyPage></AgencyPage>
              <Footer></Footer>
            </>
            }>            
          </Route>
          <Route path='/agency-data' element = {
            <>
              <Header></Header>
              <AgencyData></AgencyData>
              <Footer></Footer>
            </>
            }>            
          </Route>
          <Route path='/agents/:id' element= {
            <>
              <Header></Header>
              <AgentProfile></AgentProfile>
              <Footer></Footer>
            </>
          }>
          </Route>
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
