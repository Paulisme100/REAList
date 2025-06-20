import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SERVER_URL from "../../../serverConnection/IpAndPort";
import {
  Typography,
  Avatar,
  Grid,
  Divider,
  Paper,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import PersonOffIcon from '@mui/icons-material/PersonOff';

import Listing from "../../Property/Listing/ListingPreview";

const calcAge = (birthDateString) => {
    if (!birthDateString) 
    {
        return null;
    }

    const birthDate = new Date(birthDateString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const hadBirthdayThisYear =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hadBirthdayThisYear) {
        age -= 1;
    }

    return age;
};

const AgentProfile = () => {

    const {id } = useParams();

    const [agent, setAgent] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const nav = useNavigate()

    const deleteAgent = async (agentId) => {

        try {
            const res = await fetch(`${SERVER_URL}/users/${agentId}`, {
                method: 'delete',
                credentials: 'include'
            })

            if (res.ok) {
                nav("/agency-main"); 
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.message}`);
            }
            
        } catch (err) {
            throw new Error(err.message)
        }
    }

    useEffect(() => {
        const fetchAgentAndListings = async () => {
            try {
                const agentResp =  await fetch(`${SERVER_URL}/users?filterField=id&filterValue=${id}`);
                const listResp = await fetch(`${SERVER_URL}/listings?UserId=${id}`);

                if (!agentResp.ok || !listResp.ok) 
                    {
                        throw new Error("Fetch failed");
                    }
                const agentData = await agentResp.json()
                const listtingsData = await listResp.json()

                setAgent(agentData[0])
                setListings(Array.isArray(listtingsData) ? listtingsData : []);

            } catch (err) {
                console.error("Error loading agent or listings:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchAgentAndListings()
    }, [id])

    if (loading) {
        return <CircularProgress sx={{ m: 4 }} />
    }

    if (!agent) 
    {
        return <Typography color="error">Agent not found.</Typography>
    }

    return (
        <>
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 1200, margin: "2rem auto" }}>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4">Agent Profile</Typography>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<PersonOffIcon />}
                        onClick={() => setConfirmOpen(true)}
                    >
                        Fire Agent
                    </Button>
                </Box>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Avatar
                            alt={agent.name}
                            sx={{ width: 160, height: 160, fontSize: 32 }}
                        >
                            {agent.name?.[0] || "A"}
                        </Avatar>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="h4">
                            {agent.name}
                        </Typography>
                        <Typography>Email: {agent.email || "Not provided"}</Typography>
                        <Typography>Phone: {agent.phone || "Not provided"}</Typography>
                        <Typography>Hire date: {agent.hire_date || "Unknown"}</Typography>
                        <Typography>Age: {calcAge(agent.birth_date) || "Unknown"}</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom>
                    Listings ({listings.length})
                </Typography>

                <Grid container spacing={2}>
                    {listings.length === 0 ? (
                        <Typography>No listings available.</Typography>
                        ) : (
                            listings.map((listing) => (
                                <Grid item key={listing.id} xs={12} sm={6} md={4}>
                                <Listing listing={listing} />
                                </Grid>
                            ))
                        )}
                </Grid>
            </Paper>

            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(close)}
            >

                <DialogTitle>Confirm Firing Process</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove this agent? This action is irreversible and will delete all their records.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => deleteAgent(id)}  color="error" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>

            </Dialog>
        </>
    )
}

export default AgentProfile;