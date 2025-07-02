import SERVER_URL from "../../../serverConnection/IpAndPort";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, IconButton, TextField, Tooltip } from '@mui/material'
import AuthStore from "../../stores/UserAuthStore";
import changePassword from "../../fetches/changePassword";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
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

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error = new Error(errorData.message || "Failed to fetch user data")
        error.status = response.status
        throw error
    }

    const message = response.json()
    console.log(message)
}

const subscribeUserToPush = async (userId) => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BCj0rdS4ziUUDLy3pGa43D_D5Aau6ncPLQfJ5WV0WWBBtBEO-djbxphdExnW-G-LYCzaD0ztEUYsgzXP2nHZN4I'
    })

    const res = await fetch(`${SERVER_URL}/users/save-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, subscription })
    })
}

const UserPage = () => {
    const nav = useNavigate()
    const { user, login, logout } = AuthStore()
    const [passwordData, setPasswordData] = useState({ old: '', new: '', confirm: '' })
    const [editMode, setEditMode] = useState(false)
    const [editableData, setEditableData] = useState({ name: user.name, phone_number: user.phone_number })

    const handleSubmit = (e) => {
        e.preventDefault()
        const { old, new: new_password, confirm } = passwordData
        if (new_password !== confirm) {
            alert('New passwords do not match')
            return
        }
        changePassword(user.id, { password: old, new_password })
        nav('/')
    }

    const saveChanges = async () => {
        const response = await fetch(`${SERVER_URL}/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(editableData)
        })

        if (response.ok) {
            console.log(await response.json())
            login({
            ...user,
            name: editableData.name,
            phone_number: editableData.phone_number
            })
            setEditMode(false)
        } else {
            alert("Failed to update user info: ", await response.json())
        }                       
    }

    useEffect(() => {
        if (user) 
        {
            subscribeUserToPush(user.id).then(() => console.log("User subscribed to push notifications!"))
        }
    }, [])

    useEffect(() => {
        setEditableData({
            name: user.name,
            phone_number: user.phone_number
        });
    }, [user.name, user.phone_number])

    return (
        <Box maxWidth="600px" mx="auto" mt={5} px={2}>
            <Paper elevation={3} sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>User Account</Typography>
                <Divider sx={{ my: 2 }} />

                <Box mb={3}>
                    <Typography variant="subtitle1"><strong>Email:</strong> {user.email}</Typography>

                    {editMode ? (
                        <TextField sx={{ mb: 2, mt: 2 }} label="Name" value={editableData.name} fullWidth size="small"
                                   onChange={(e) => setEditableData({ ...editableData, name: e.target.value })} 
                        />
                    ) : (
                        <Typography variant="subtitle1"><strong>Name:</strong> {user.name}</Typography>
                    )}

                    {editMode ? (
                        <TextField sx={{ mb: 2 }} label="Phone Number" value={editableData.phone_number} fullWidth size="small"
                                   onChange={(e) => setEditableData({ ...editableData, phone_number: e.target.value })}
                         />
                    ) : (
                        <Typography variant="subtitle1"><strong>Phone Number:</strong> {user.phone_number}</Typography>
                    )}

                    <Typography variant="subtitle1"><strong>Role:</strong> {user.role}</Typography>

                    {user.role === 'agent' && (
                        <Typography variant="subtitle1">
                            <strong>Agent Status:</strong>{" "}
                            <span style={{
                                color: user.agentStatus === "pending" ? "orange" :
                                       user.agentStatus === "accepted" ? "green" :
                                       user.agentStatus === "rejected" ? "red" : "inherit"
                            }}>{user.agentStatus}</span>
                        </Typography>
                    )}

                    <Box mt={2}>
                        {editMode ? (
                            <>
                                <Tooltip title="Save"><IconButton onClick={saveChanges}><SaveIcon /></IconButton></Tooltip>
                                <Tooltip title="Cancel"><IconButton onClick={() => {
                                    setEditableData({ name: user.name, phone_number: user.phone_number })
                                    setEditMode(false)
                                }}><CancelIcon /></IconButton></Tooltip>
                            </>
                        ) : (
                            <Tooltip title="Edit"><IconButton onClick={() => setEditMode(true)}><EditIcon /></IconButton></Tooltip>
                        )}
                    </Box>
                </Box>

                <Stack direction="row" spacing={2} mb={3} justifyContent="center">
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
                        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField label="Old Password" type="password" fullWidth required size="small"
                                       value={passwordData.old} onChange={(e) => setPasswordData({ ...passwordData, old: e.target.value })} />
                            <TextField label="New Password" type="password" fullWidth required size="small"
                                       value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} />
                            <TextField label="Confirm New Password" type="password" fullWidth required size="small"
                                       value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} />
                            <Button variant="contained" color="primary" type="submit">Update Password</Button>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Divider sx={{ my: 3 }} />

                <Button variant="outlined" color="error" onClick={() => { clearTokenCookie(); logout(); nav('/'); }}>
                    Log Out
                </Button>
            </Paper>
        </Box>
    );
}

export default UserPage;
