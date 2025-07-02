import { useState } from "react"
import AuthStore from "../../stores/UserAuthStore"
import {
    Box,
    Card,
    Tabs,
    Tab,
    TextField,
    Button,
    Stack,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Alert
  } from '@mui/material'
import SERVER_URL from "../../../serverConnection/IpAndPort"
import { useNavigate, Link } from "react-router-dom"
import { useEffect } from "react"
import agencyApi from "../../fetches/agency/agencyApi"
import AgencyAuthStore from "../../stores/AgencyAuthStore"

const countryCodes = [
  { code: '+40', label: 'Romania' },
  { code: '+44', label: 'UK' },
  { code: '+91', label: 'India' },
  { code: '+61', label: 'Australia' },
  { code: '+81', label: 'Japan' }
];

const AgencyRegistration = () => {

    const {login: loginAgency} = AgencyAuthStore()
    const [loginError, setLoginError] = useState(false);

    const [tab, setTab] = useState(0)
    const [form, setForm] = useState({
        company_name: '',
        company_email: '',
        account_password: '',
        company_phone: '',
        cui: ''
    })
    const [prefix, setPrefix] = useState('+40');

    const nav = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }



    const registerCompany = async (e) => {
        e.preventDefault();

        const payload = {
            ...form, 
            company_phone :`${prefix}${form.company_phone}`
        }

        await agencyApi.registerAgency(payload)
        nav('/')
    }

    const logInAgency = async (e) => {

        e.preventDefault();

        const data = await agencyApi.logInAsAgency(form)

        if(data && data.company_email) {
            loginAgency(data)
            nav('/agency-main')
        }
        else {
            setLoginError(true)
        }
        
    }

    return(
        <div>
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
                    <Tabs value={tab} onChange={ (e, newVal) => setTab(newVal)} centered>
                        <Tab label="Login" />
                        <Tab label="Sign Up" />
                    </Tabs>

                    {tab === 0 && (
                        <Box component="form" onSubmit={logInAgency} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>

                            <TextField
                                label="Company Email"
                                name="company_email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                fullWidth
                            />

                            <TextField
                                label="Password"
                                name="account_password"
                                type="password"
                                value={form.account_password}
                                onChange={handleChange}
                                fullWidth
                            />

                            {
                                loginError && (
                                    <Alert severity="error" onClose={() => setLoginError(false)}>
                                        Incorrect email or password
                                    </Alert>
                                )
                            }

                            <Button variant="contained" color="primary" type="submit" fullWidth>
                                Enter agency account
                            </Button>
                        </Box>
                        
                    )}

                    {tab == 1 && (
                        <Box component="form" onSubmit={registerCompany} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Company Name"
                                name="company_name"
                                type="text"
                                value={form.company_name}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="CUI"
                                name="cui"
                                type="text"
                                value={form.cui}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="Company Email"
                                name="company_email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="Password"
                                name="account_password"
                                type="password"
                                value={form.account_password}
                                onChange={handleChange}
                                fullWidth
                            />

                            <Stack direction="row" spacing={2} alignItems="center">
                                <FormControl sx={{ minWidth: 120 }} size="small">
                                    <InputLabel id="prefix-label">Prefix</InputLabel>
                                    <Select
                                    labelId="prefix-label"
                                    value={prefix}
                                    label="Prefix"
                                    onChange={(e) => setPrefix(e.target.value)}
                                    >
                                    {countryCodes.map((country) => (
                                        <MenuItem key={country.code} value={country.code}>
                                        {country.code} ({country.label})
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Phone Number"
                                    name="company_phone"
                                    type="tel"
                                    size="small"
                                    fullWidth
                                    value={form.company_phone}
                                    onChange={handleChange}
                                    placeholder="213 334 790"
                                />
                            </Stack>

                            <Button variant="contained" color="primary" type="submit" fullWidth>
                                Register Agency
                            </Button>
                        </Box>
                        
                    )
                    }
                </Card>

            </Box>
        </div>
    )
}

export default AgencyRegistration