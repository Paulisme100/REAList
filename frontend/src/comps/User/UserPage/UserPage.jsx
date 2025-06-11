import SERVER_URL from "../../../serverConnection/IpAndPort";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {Button} from '@mui/material'
import AuthStore from "../../stores/UserAuthStore";
import changePassword from "../../fetches/changePassword";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Typography,
    Box,
    Paper,
    Stack,
    Divider
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
            alert('New passwords do not match')
            return
        }
        
        let fields = {
            password: old,
            new_password: new_password
        }
        
        changePassword(user.id, fields)

        nav('/')
    }
    
    
    return (
    <Box maxWidth="600px" mx="auto" mt={5} px={2}>

        <Paper elevation={3} sx={{ padding: 4 }}>

        <Typography variant="h4" gutterBottom>
            User Account
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box mb={3}>
            <Typography variant="subtitle1">
                <strong>Email:</strong> {user.email}
            </Typography>

            <Typography variant="subtitle1">
                <strong>Name:</strong> {user.name}
            </Typography>

            <Typography variant="subtitle1">
                <strong>Role:</strong> {user.role}
            </Typography>
            {
            user.role === 'agent' && 
            (<Typography variant="subtitle1">
                <strong>Agent Status:</strong> {user.agentStatus}
            </Typography>)
            }
        </Box>

        <Stack direction="row" spacing={2} mb={3}>

            <Link to="/user-listings" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">Your Listings</Button>
            </Link>

            <Link to="/favorites" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="secondary">Favorites</Button>
            </Link>

        </Stack>

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
                    
                    <TextField label="Old Password" type="password" fullWidth required size="small"
                        value={passwordData.old}
                        onChange={(e) => setPasswordData({ ...passwordData, old: e.target.value })}
                    />

                    <TextField label="New Password" type="password" fullWidth required size="small"
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                    />

                    <TextField label="Confirm New Password" type="password" fullWidth required size="small"
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    />

                    <Button variant="contained" color="primary" type="submit">
                        Update Password
                    </Button>

                </Box>
            </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />

        <Button
            variant="outlined"
            color="error"
            onClick = {() => {
                clearTokenCookie();
                logout();
                nav('/');
            }}
        >
            Log Out
        </Button>
        </Paper>
    </Box>
    );
}

export default UserPage
