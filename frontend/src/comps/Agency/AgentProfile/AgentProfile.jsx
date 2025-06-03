import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SERVER_URL from "../../../serverConnection/IpAndPort";
import {
  Typography,
  Avatar,
  Grid,
  Divider,
  Paper,
  CircularProgress,
  Box
} from "@mui/material";

import Listing from "../../Property/Listing/ListingPreview";

const AgentProfile = () => {

    const {id } = useParams();

    const [agent, setAgent] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

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
                setListings(listtingsData)

            } catch (err) {
                console.error("Error loading agent or listings:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchAgentAndListings()
    }, [id])

    if (loading) return <CircularProgress sx={{ m: 4 }} />;

    if (!agent) return <Typography color="error">Agent not found.</Typography>;

    return (
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 1200, margin: "2rem auto" }}>
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
                    <Typography>Phone: {agent.phone || "Not provided"}</Typography>
                    <Typography>Hire date: {agent.Agency?.company_name || "Unknown"}</Typography> 
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
        
    )
}

export default AgentProfile;