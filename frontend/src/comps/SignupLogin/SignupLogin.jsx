import { useState } from "react"
import AuthStore from "../stores/AuthStore"
import {
    Box,
    Card,
    Tabs,
    Tab,
    TextField,
    Button,
    MenuItem,
    Typography,
  } from '@mui/material'
import SERVER_URL from "../../serverConnection/IpAndPort"
import { useNavigate } from "react-router-dom"

const SignupLogin = () => {

    const {user, isConnected, login} = AuthStore()
    const [tab, setTab] = useState(0)
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'regular'
    })
    const nav = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const logIn = async (e) => {
        e.preventDefault()
        
        try {
            const response = await fetch(`${SERVER_URL}/users/login`,
                {
                    method: 'post',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: 'include',
                    body: JSON.stringify(form)
                }
            )
    
            if(!response.ok){
                throw response;
            }
    
            const userData = await response.json()
            login(userData)
            nav('/profile') 
        } catch (err) {
            throw new Error(err.message)
            console.warn(err)
        }
    }

    const registerUser = async (e) => {
        e.preventDefault()
        
        try {
            const response = await fetch(`${SERVER_URL}/users/register`,
                {
                    method: 'post',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                }
            )

            if(!response.ok){
                throw response;
            }

            const userData = await response.json()
            // login(userData)
            nav('/') 
            
        } catch (err) {
            throw new Error(err.message)
            console.warn(err)
        }
    }

    return(
        <>
            <Box
                sx={{
                    height: '100vh',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >

                <Card sx={{ width: 400, p: 4, borderRadius: 4, boxShadow: 6 }}>
                    <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)} centered>
                        <Tab label="Login" />
                        <Tab label="Sign Up" />
                    </Tabs>

                    {tab === 0 && (
                        <Box component="form" onSubmit={logIn} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            fullWidth
                            />
                            <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            fullWidth
                            />
                            <Button variant="contained" color="primary" type="submit" fullWidth>
                            Login
                            </Button>
                        </Box>
                    )}

                    {tab === 1 && (
                        <Box component="form" onSubmit={registerUser} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Full Name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                select
                                label="User type"
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value="regular">Owner</MenuItem>
                                <MenuItem value="agent">Agent</MenuItem>
                            </TextField>
                            <Button variant="contained" color="primary" type="submit" fullWidth>
                                Sign Up
                            </Button>
                        </Box>

                    )}

                </Card>

            </Box>
        </>
    )
}

export default SignupLogin