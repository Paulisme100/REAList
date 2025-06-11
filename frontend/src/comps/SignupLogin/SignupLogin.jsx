import { useState } from "react"
import AuthStore from "../stores/UserAuthStore"
import {
    Box,
    Card,
    Tabs,
    Tab,
    TextField,
    Button,
    MenuItem,
    Typography,
    Link as MuiLink 
  } from '@mui/material'
import SERVER_URL from "../../serverConnection/IpAndPort"
import { useNavigate, Link } from "react-router-dom"

const SignupLogin = () => {

    const {user, isConnected, login} = AuthStore()
    const [tab, setTab] = useState(0)
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'regular'
    })
    const [birthDateError, setBirthDateError] = useState('');
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

        if (form.role === 'agent' && form.birth_date) {
            const birthDate = new Date(form.birth_date);
            const today = new Date();

            const ageDiff = today.getFullYear() - birthDate.getFullYear();

            if(ageDiff < 18)
            {
                setBirthDateError("You must be at least 18 years old.");
                return;
            }
        }
        
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

                            <Box mt={2} textAlign="center">
                                <Typography variant="body2">
                                        Do you have an agency account?{' '}
                                    <MuiLink component={Link} to="/agency-registration" underline="hover" color="primary">
                                        Login here!
                                    </MuiLink>
                                </Typography>
                            </Box>

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

            
                            {form.role === "agent" && (
                                <>
                                    <TextField
                                        label="Birth Date"
                                        name="birth_date"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        value={form.birth_date || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        error={!!birthDateError}
                                        helperText={birthDateError}
                                    />
                                    <TextField
                                        label="Agency ID"
                                        name="AgencyId"
                                        type="number"
                                        value={form.AgencyId || ''}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </>
                            )}

                            <Box mt={2} textAlign="center">
                                <Typography variant="body2">
                                        Do you have an agency?{' '}
                                    <MuiLink component={Link} to="/agency-registration" underline="hover" color="primary">
                                        Register it here!
                                    </MuiLink>
                                </Typography>
                            </Box>

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