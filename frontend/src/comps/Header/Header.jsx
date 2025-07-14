import "./Header.css"
import {AiFillPlusCircle, AiOutlineUser} from 'react-icons/ai'
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import AuthStore from '../stores/UserAuthStore'
import AgencyAuthStore from "../stores/AgencyAuthStore"
import { useState } from "react"
import { useEffect } from "react"
import { Drawer, IconButton, Box, Typography, Divider } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"

const Header = () => {

    const {user, login, logout} = AuthStore()
    const {agency, login: loginAgency, logout: logoutAgency} = AgencyAuthStore()
    const [userName, setUserName] = useState('')

    const [drawerOpen, setDrawerOpen] = useState(false)

    let path = '/'
    if(user || agency)
    {
        path = '/add-property'
    }
    else {
        path = '/login'
    }

    useEffect(() => {
        
    }, [])

    useEffect(() => {

        if(user) {
            setUserName(user.name)
        } else if(agency) {
            setUserName(agency.company_name)
        }
    }, [user, agency])

    const AdvertiseProperty = ({onClick}) => {
        if(agency) {
            return null;
        }

        return(
            <Link to={path} onClick={onClick}>
                <div style={{textAlign: 'center'}}>
                    <p>
                        <AiFillPlusCircle style={{margin: '0 auto', fontSize: '1.5em', cursor: 'pointer'}}></AiFillPlusCircle>
                    </p>
                </div>
                <div style={{color: '#333'}}>
                    Advertise <br/> Property
                </div>
            </Link>
        )
    }

    const UserPageLink = ({onClick}) => {
        if (!user && !agency) {
            return(
                <Link to={"/login"} onClick={onClick}>
                    <AiOutlineUser />
                    <p style={{color: '#333'}}>{"No user"}</p>
                </Link>
            )
        }

        return (
            <Link to={user ? "/profile" : agency ? "/agency-main" : "login"} onClick={onClick}>
                <AiOutlineUser />
                <p>{userName}</p>
            </Link>
        )
    }

    return(
        <>
            <header className='navbar'>
                <div className='navbar-content'>
                    <div className="logo">
                        <Link to='/'>
                            <h1>REAList</h1>
                        </Link>
                    </div>

                    <div className='ad-prop action desktop-only'>  

                        <AdvertiseProperty/>
                            
                    </div>

                    <div className='userArea action desktop-only' style={{cursor: 'pointer'}}>
                        
                        <UserPageLink/>
                        
                    </div>
                   
                   <div className="mobile-only">
                        <IconButton onClick={() => setDrawerOpen(true)}>
                            <MenuIcon fontSize="large"/>
                        </IconButton>
                   </div>

                   <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                        <Box sx={{ width: 250, p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <IconButton onClick={() => setDrawerOpen(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <Divider sx={{my: 1}}></Divider>

                            <Box sx={{ mb: 2, textAlign: 'center' }}>
                                <AdvertiseProperty onClick={() => setDrawerOpen(false)} />
                            </Box>

                            <Divider sx={{my: 1}}></Divider>

                            <Box sx={{ mb: 2, textAlign: 'center' }}>
                                <UserPageLink onClick={() => setDrawerOpen(false)}></UserPageLink>
                            </Box>

                            <Divider sx={{my: 1}}></Divider>
                        </Box>
                   </Drawer>
                </div>
            </header>
        </>
    )

}

export default Header