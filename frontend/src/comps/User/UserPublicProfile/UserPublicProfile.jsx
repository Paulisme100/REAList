import { useEffect, useState } from "react"
import SERVER_URL from "../../../serverConnection/IpAndPort"
import { useParams } from "react-router-dom"
import { Box, Typography, Divider, CircularProgress, Avatar, Paper, Grid, Tooltip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import Listing from "../../Property/Listing/ListingPreview"

const UserPublicProfile = () => {

    const {id} = useParams()
    const [poster, setPoster] = useState()
    const [userListings, setUserListings] = useState([])

    useEffect(() => {
        async function getPoster(id) {
            try {               
                const res = await fetch(`${SERVER_URL}/users?filterField=id&filterValue=${id}`)
                return await res.json()

            } catch (err) {
                throw new Error(err.message)
            }
            
        }

        getPoster(id).then(data => setPoster(data[0]))
        

    }, [])

    useEffect(() => {

        async function getUserListings(id) {
            try {               
                const res = await fetch(`${SERVER_URL}/listings?UserId=${id}`)
                return await res.json()

            } catch (err) {
                throw new Error(err.message)
            }
            
        }

        if(poster?.id)
        {
            getUserListings(poster.id).then(data => setUserListings(data))
        }

    }, [poster])

    return(
        <>
            <Box sx={{ px: 4, py: 5, maxWidth: 1000, mx: "auto" }}>
            {poster ? (
                <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    padding: 3,
                    border: "1px solid #e0e0e0",
                    borderRadius: 3,
                    mb: 5,
                    backgroundColor: "#fafafa",
                }}
                >
                    <Avatar sx={{ width: 72, height: 72, fontSize: 32 }}>
                        {poster.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                        <Box>
                            <Typography variant="body1" sx={{ color: "#333", fontWeight: 500 }}>
                                {poster.name || "Unnamed User"}
                            </Typography>
                            
                            {poster.role == 'regular' && (
                                <>
                                    <Typography variant="body2" color="text.secondary">
                                        Direct owner
                                    </Typography>
                                    <Tooltip title="Direct Owner">
                                        <PersonIcon color="success" fontSize="small" />
                                    </Tooltip>
                                </>
                            )}
                            {poster.role == 'agent' && (
                                <>
                                    <Typography variant="body2" color="text.secondary">
                                        Agent
                                    </Typography>
                                    <Tooltip title="Agent">
                                        <WorkIcon color="primary" fontSize="small" />
                                    </Tooltip>
                                </>
                            )}
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                                <EmailIcon fontSize="small" color="action"/> {poster.email || "Not provided"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <PhoneIcon fontSize="small" color="action" /> {poster.phone_number || "Not provided"}
                            </Typography>
                        </Box>
                    </Box>
            </Box>
            ) : (
                <Typography>Loading user info...</Typography>
            )}

            
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                All listings
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {userListings.length > 0 ? (
                <Grid container spacing={3}>
                {userListings.map((listing) => (
                    <Grid item xs={12} sm={6} key={listing.id}>
                    <Listing listing={listing} />
                    </Grid>
                ))}
                </Grid>
            ) : (
                <Typography color="text.secondary">No listings found for this user.</Typography>
            )}
            </Box>
        </>
    )
}

export default UserPublicProfile