import SERVER_URL from "../../../serverConnection/IpAndPort";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {Button} from '@mui/material'
import AuthStore from "../../stores/AuthStore";
import changePassword from "../../fetches/changePassword";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Typography,
    Box
  } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'


const clearTokenCookie = async () => {

    const url = `${SERVER_URL}/users/logout`
    const response = await fetch(url, {
        method: 'post',
        credentials: 'include'
    })

    if(!response.ok) {
        const errorData = await response.json().catch(()=>({}))
        const error = new Error(errorData.message || "Failed to fetch user data")
        error.status = response.status
        throw error
    }

    const message = response.json()
    console.log(message)
}

const UserPage = () => {

    const nav = useNavigate()
    const {user, logout} = AuthStore()
    const [passwordData, setPasswordData] = useState({
        old: '',
        new: '',
        confirm: ''
      })

    const handleSubmit = (e) => {
        e.preventDefault()
        
        const { old, new: new_password, confirm } = passwordData
        
        if (new_password !== confirm) {
            console.warn('New passwords do not match')
            return
        }
        
        let fields = {
            password: old,
            new_password: new_password
        }
        
        changePassword(user.id, fields)

        nav('/')
    }
    

    return(
        <>
            { user ? (
                <div>
                    <h2>User Page</h2>
                    <div>{user.email}</div>
                    <div>{user.name}</div>
                    <div>{user.role}</div>
                    <Link to='/user-listings'>
                        <Button style={{cursor: 'pointer'}}>
                            Your listings
                        </Button>
                        <br />
                    </Link>
                    <Link to='/favorites'>
                        <Button style={{cursor: 'pointer'}}>
                            Favorites
                        </Button>
                        <br />
                    </Link>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Change Password</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box
                            component="form"
                            noValidate
                            autoComplete="off"
                            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                            onSubmit={handleSubmit}
                            >
                            <TextField
                                label="Old Password"
                                type="password"
                                fullWidth
                                required
                                size="small"
                                value={passwordData.old}
                                onChange={(e) => {setPasswordData({ ...passwordData, old: e.target.value })}}
                            />
                            <TextField
                                label="New Password"
                                type="password"
                                fullWidth
                                required
                                size="small"
                                value={passwordData.new}
                                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                            />
                            <TextField
                                label="Confirm New Password"
                                type="password"
                                fullWidth
                                required
                                size="small"
                                value={passwordData.confirm}
                                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                            />
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                            </Box>
                        </AccordionDetails>
                    </Accordion>


                    <Button style={{cursor: 'pointer'}} onClick={() => {clearTokenCookie(); logout(); nav('/user-listings')}}>Log out</Button>
                </div>
                ) : (
                    <div>
                        User not connected
                    </div>
                )
            }
        </>
    )
}

export default UserPage
