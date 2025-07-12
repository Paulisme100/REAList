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

        if(user) {
            setUserName(user.name)
        } else if(agency) {
            setUserName(agency.company_name)
        }
    }, [user, agency])

    return(
        <>
            <header className='navbar'>
                <div className='navbar-content'>
                    <div className="logo">
                        <Link to='/'>
                            <h1>REAList</h1>
                        </Link>
                    </div>

                    {!agency && (
                        <div className='ad-prop action'>                   
                            <Link to={path}>
                                <div style={{textAlign: 'center'}}>
                                    <p>
                                        <AiFillPlusCircle style={{margin: '0 auto', fontSize: '1.5em', cursor: 'pointer'}}></AiFillPlusCircle>
                                    </p>
                                </div>
                                <div>
                                    Advertise <br/> Property
                                </div>
                            </Link>
                            
                        </div>
                        )
                    }

                    <div className='userArea action' style={{cursor: 'pointer'}}>
                        {
                            user ? (
                                <Link to='/profile'>
                                    <AiOutlineUser />
                                    <p>{userName}</p>
                                </Link>
                                ) : agency ? (
                                <Link to='/agency-main'>
                                    <AiOutlineUser />
                                    <p>{userName}</p>
                                </Link>
                                ) : (
                                <Link to='/login'>
                                    <AiOutlineUser />
                                    <p>No user</p>
                                </Link>
                                )                            
                        }
                        
                    </div>
                   
                   <div className="mobile-only">
                        <IconButton>
                            <MenuIcon fontSize="large"/>
                        </IconButton>
                   </div>
                </div>
            </header>
        </>
    )

}

export default Header