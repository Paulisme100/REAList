import { useEffect, useState } from "react";
import SERVER_URL from "../../../serverConnection/IpAndPort";
import AgencyAuthStore from "../../stores/AgencyAuthStore";
import agencyApi from "../../fetches/agency/agencyApi";
import {useNavigate, Link} from 'react-router-dom'
import {
  Typography,
  Grid,
  Button,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Box,
  Paper,
  Tooltip,
  Alert
} from "@mui/material";
import Leaderboard from '@mui/icons-material/Leaderboard';
import AgentCard from "../../User/AgentCard/AgentCard";
import Listing from "../../Property/Listing/ListingPreview";


const AgencyPage = () => {


    const [acceptedAgents, setAcceptedAgents] = useState([])
    const [pendingAgents, setPendingAgents] = useState([])
    const [mostViewedListings, setMostViewedListings] = useState([])
    const {agency, login: loginAgency, logout: logoutAgency} = AgencyAuthStore()
    const nav = useNavigate()

    const clearTokenCookie = async () => {

        const url = `${SERVER_URL}/agencies/logout`
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

    async function ensureNotificationPermission() {
        if (Notification.permission === 'granted') return true;

        if (Notification.permission === 'default') {
            const result = await Notification.requestPermission();
            return result === 'granted';
        }

        return false;
    }

    const subscribeAgencyToPush = async (agencyId) => {
        const registration = await navigator.serviceWorker.ready;
        const subscription =  await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BCj0rdS4ziUUDLy3pGa43D_D5Aau6ncPLQfJ5WV0WWBBtBEO-djbxphdExnW-G-LYCzaD0ztEUYsgzXP2nHZN4I'
        })

        const res = await fetch(`${SERVER_URL}/agencies/save-subscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                agencyId, 
                subscription
            })
        })

    }

    const fetchAgents = () => {
        agencyApi.fetchAgentsByStatus("accepted").then(agentsArray => setAcceptedAgents(agentsArray));
        agencyApi.fetchAgentsByStatus("pending").then(agentsArray => setPendingAgents(agentsArray));
    };

    const getMostViewed =async () => {
        try {

            const res = await fetch(`${SERVER_URL}/agencies/${agency.id}/listings?orderField=views`, {
                credentials: 'include'
            })

            return await res.json()
        } catch(err) {
            throw new Error(err.message)
        }
    }

    useEffect(() => {
        if (agency) {
            fetchAgents();
            subscribeAgencyToPush(agency.id);

            getMostViewed().then(listings => {
                if(Array.isArray(listings))
                {
                    setMostViewedListings(listings)
                    console.log(listings)
                }
            })
        }
    }, [agency])

    if (!agency) {
        return (
            <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
                Loading agency data...
            </Typography>
        );
    }

    return(
        <Paper elevation={3} style={{ padding: "2rem", margin: "2rem auto", maxWidth: "1200px" }}>
            <Grid container spacing={4} alignItems="center" justifyContent='center'sx={{pr: 5}}>
                <Grid item xs={12} sm={4}>
                    {(agency && agency.logo_url) ? (
                        <CardMedia
                            component="img"
                            height="160"
                            image={`${SERVER_URL}${agency.logo_url}`}
                            alt="Agency Logo"
                            style={{ objectFit: "contain", borderRadius: 12 }}
                        />
                    ) : (
                        <Avatar
                            variant="rounded"
                            sx={{ width: 160, height: 160, fontSize: 32 }}
                        >
                            No Logo
                        </Avatar>
                    )}
                </Grid>

                <Grid item xs={12} sm={8}>

                    <Typography variant="h4">{agency.company_name}</Typography>
                    <Typography variant="subtitle1">{agency.company_email}</Typography>
                    <Typography variant="body1">Phone: {agency.company_phone}</Typography>
                    <Typography variant="body1">CUI: {agency.cui}</Typography>
                    <Typography variant="body1">
                        Address: {agency.head_office_address || "Not Set"}
                    </Typography>
                    <Typography variant="body1">
                        Sale Commission: {agency.commission_at_sale || "N/A"}%
                    </Typography>
                    <Typography variant="body1">
                        Rent Commission: {agency.commission_at_rent || "N/A"}%
                    </Typography>

                    <Box mt={2}>
                        <Button
                            variant="contained"
                            onClick={() => nav("/agency-data")}
                            sx={{ marginRight: 2 }}
                        >
                            Manage Company Data
                        </Button>
                        <Button
                            sx={{mt: 1}}
                            variant="outlined"
                            color="error"
                            onClick={() => {
                                clearTokenCookie();
                                logoutAgency();
                                nav("/");
                            }}
                        >
                            Log Out
                        </Button>
                        <Button
                            onClick={() => {
                                if (!agency) 
                                    return;

                                const setupPush = async () => {
                                    const granted = await ensureNotificationPermission();
                                    if (granted) {
                                        // await subscribeAgencyToPush(agency.id);
                                        alert("You subscribed to push notifications")
                                    }
                                };

                                setupPush();
                            }}
                        >
                            Enable notifications
                        </Button>
                    </Box>
                </Grid>

                
            </Grid>

            <Divider sx={{ marginY: 4 }} />
                
            <Typography variant="h5" gutterBottom>
                Your Agents ({acceptedAgents.length})
            </Typography>

            {
                acceptedAgents.length === 0 ? (
                    <Typography>No agents registered to your agency yet.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {
                            acceptedAgents.map(agent => (
                                <Grid item key={agent.id} xs={12} sm={6} md={4}>
                                    <AgentCard key={agent.id} agent={agent}></AgentCard>
                                </Grid>
                            ))
                        }
                    </Grid>
                )
            }

            {pendingAgents.length > 0 && (
                <>
                    <Divider sx={{ my: 4 }} />
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        You have {pendingAgents.length} agent{pendingAgents.length > 1 ? 's' : ''} awaiting approval.
                    </Alert>
                    <Typography variant="h5" gutterBottom color="error">
                        Pending Agent Requests
                    </Typography>
                    <Grid container spacing={2}>
                        {
                            pendingAgents.map(agent => (
                                <Grid item key={agent.id} xs={12} sm={6} md={4}>
                                    <AgentCard
                                        agent={agent} refreshAgents={fetchAgents}/>
                                </Grid>
                            ))
                        }
                    </Grid>
                </>
            )}

            <Divider sx={{ my: 4 }} />

            <Box sx={{ backgroundColor: '#f5f7fa', borderRadius: 4, padding: 3, boxShadow: 3, mt: 5 }}>
                <Box display="flex" alignItems="center" justifyContent='center' mb={2} width='100%'>
                    <Leaderboard sx={{ color: 'error.main', mr: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                        Most Viewed Listings
                    </Typography>
                </Box>

                {mostViewedListings.length === 0 ? (
                    <Typography variant="body1" color="text.secondary">
                    No listing views to display yet.
                    </Typography>
                ) : (
                    <Grid container spacing={2}>
                    {mostViewedListings.map(listing => (
                        <Grid item key={listing.id} xs={12} sm={6} md={4}>
                            <Listing listing={listing} />
                        </Grid>
                    ))}
                    </Grid>
                )}
            </Box>


        </Paper>
    )

}

export default AgencyPage