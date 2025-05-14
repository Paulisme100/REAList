import SERVER_URL from "../../../serverConnection/IpAndPort"
import { Link, useNavigate } from "react-router-dom"
import AuthStore from "../../stores/AuthStore";
import changeListingStatus from "../../fetches/changeStatus";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Chip,
    Button,
    Stack
  } from "@mui/material";

const Listing = ({listing}) => {

    const {user} = AuthStore()
    const nav = useNavigate()

    const furtherPath = `/listings/${listing.id}`
    const editPath = `/add-property`
    const imageUrl = listing.Images?.[0]?.url
    ? `${SERVER_URL}${listing.Images[0].url}` : ""
    

    return (
        <>
        {
            listing ? (
                <Card
                sx={{
                    maxWidth: 345,
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
                    <CardMedia
                        component="img"
                        height="200"
                        image={imageUrl}
                        alt={listing.title}
                    />

                    <CardContent>
                        <Typography variant="h6" component="div" gutterBottom> {/**se poate adauga nowrap daca e titlul prea lung */}
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
                            { listing.ad_status == "inactive" && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    sx={{ borderRadius: 2, textTransform: "none" }}
                                    onClick={() => {

                                        const deleteListing = async () => {
                                            const url = `${SERVER_URL}/listings/${listing.id}`
                                            const res = await fetch(url, {
                                                method: 'delete',
                                                credentials: "include"
                                            })
                                            console.log(await res.json())
                                        }


                                        deleteListing()
                                    }}
                                    >
                                    Delete
                                </Button>)
                            }
                        </>
                        )}
                    </Stack>

                </Card>
           
            ) : (
                <Typography variant="body1" color="error">
                    This listing could not be displayed.
                </Typography>
            )
        }
        </>
    )
}

export default Listing