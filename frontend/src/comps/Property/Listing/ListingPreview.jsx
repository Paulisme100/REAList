import SERVER_URL from "../../../serverConnection/IpAndPort"
import { Link, useNavigate } from "react-router-dom"
import AuthStore from "../../stores/UserAuthStore";
import AgencyAuthStore from "../../stores/AgencyAuthStore";
import changeListingStatus from "../../fetches/changeStatus";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Chip,
    Button,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
  } from "@mui/material";
import { useEffect, useState } from "react";
import agencyApi from "../../fetches/agency/agencyApi";

const Listing = ({listing}) => {

    const {user} = AuthStore()
    const {agency} = AgencyAuthStore()
    const nav = useNavigate()
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [agentIDs, setAgentIDs] = useState([])

    const furtherPath = `/listings/${listing.id}`
    const editPath = `/add-property`
    const imageUrl = listing.Images?.[0]?.url
    ? `${SERVER_URL}${listing.Images[0].url}` : ""
    
    useEffect(() => {

        async function getAgentIds() {
            const res = await fetch(`${SERVER_URL}/agencies/agent-ids`, {
                credentials: 'include'
            })
            return await res.json()
        }

        if(agency)
        {
            getAgentIds().then(data => {
                let ids = data.map(item => item.id)
                setAgentIDs(ids)
            })
        }

    }, [])

    const incrementListingViews = async () => {
        const url = `${SERVER_URL}/listings/${listing.id}/add-one-view`
        const res = await fetch(url, {
            method: 'put'
        })

        await res.json()
    }  

    return (
        <>
        {
            listing ? (
                <Card
                sx={{
                    width: 300,
                    borderRadius: 4,
                    boxShadow: 3,
                    m: 2,
                    overflow: "hidden",
                    transition: "none",
                    "&:hover": {
                    transform: "none"
                    }
                }}
                >
                    {
                        imageUrl ? (
                            <CardMedia
                                component="img"
                                height="200"
                                image={imageUrl}
                                alt={listing.title}
                            />
                        ) : (
                            <Box
                                height="200px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                bgcolor="#f0f0f0"
                                color="#aaa"
                                fontStyle="italic"
                            >
                                No Image Available
                            </Box>
                        )
                    }

                    <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                            {listing.title}
                        </Typography>

                        <Typography variant="h5" color="primary" gutterBottom>
                            €{listing.price.toLocaleString()}
                        </Typography>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                            <Chip label={listing.propertyType} variant="outlined" />
                            <Chip label={listing.transactionType} variant="outlined" />
                            <Chip
                                label={`${listing.squareMeters} m²`}
                                variant="outlined"
                                color="success"
                            />
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                            {listing.Locality?.name}, {listing.Locality?.county}
                        </Typography>
                    </CardContent>

                    <Stack spacing={1} direction="column" sx={{ px: 2, pb: 2 }}>
                        <Link to={furtherPath} style={{ textDecoration: "none" }}>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ borderRadius: 2, textTransform: "none" }}
                                onClick={() => {
                                    incrementListingViews()
                                    }
                                }
                            >
                                See details
                            </Button>
                        </Link>

                        {user?.id === listing.UserId && (
                        <>
                            <Link to={editPath} style={{ textDecoration: "none" }} state={{listing}}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                    sx={{ borderRadius: 2, textTransform: "none", mb: 1 }}
                                >
                                    Edit
                                </Button>
                            </Link>

                            <Button
                                variant="contained"
                                color="warning"
                                fullWidth
                                sx={{ borderRadius: 2, textTransform: "none" }}
                                onClick={() => {
                                    changeListingStatus(listing.id).then(data => console.log(data))
                                    nav('/profile')
                                }}
                                >
                                {
                                    listing.ad_status == "active" ? "Deactivate" : "Activate"
                                }
                            </Button>
                            </>
                        )}

                        { 
                            ((listing.ad_status == "inactive" && user?.id === listing.UserId)  || (agency && agentIDs.includes(listing.UserId))) && (
                            <Button
                                variant="contained"
                                color="error"
                                fullWidth
                                sx={{ borderRadius: 2, textTransform: "none" }}
                                onClick={() => setConfirmOpen(true)}
                                >
                                Delete
                            </Button>)
                        }
                    
                    </Stack>

                </Card>
           
            ) : (
                <Typography variant="body1" color="error">
                    This listing could not be displayed.
                </Typography>
            )
        }
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this listing? This action cannot be undone.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            const deleteListing = async () => {
                                const url = `${SERVER_URL}/listings/${listing.id}`
                                const res = await fetch(url, {
                                    method: 'delete',
                                    credentials: "include"
                                })
                                console.log(await res.json())
                                nav(user ? "/profile" : "/agency-main");
                            }

                            deleteListing()
                        }} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
            </Dialog>       
        </>
    )
}

export default Listing