import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SERVER_URL from "../../../serverConnection/IpAndPort";
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Avatar,
  Grid,
  Paper,
  Tooltip,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import Listing from "../../Property/Listing/ListingPreview";
import agencyApi from "../../fetches/agency/agencyApi";

const AgencyPublicProfile = () => { 

    const {id} = useParams();

    const [agency, setAgency] = useState(null);
    const [listings, setListings] = useState([]);
    
    useEffect(() => {

        agencyApi.getAgencies('id', id).then(data => setAgency(data[0]))
        agencyApi.getAllListings(id).then(data => setListings(data))

    }, [id])

    return(
        <Box sx={{ px: 4, py: 5, maxWidth: 1000, mx: "auto" }}>
            {
                agency ? (
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
                        <Avatar
                            src={`${SERVER_URL}${agency.logo_url}` || ""}
                            alt={agency.company_name}
                            sx={{ width: 72, height: 72 }}
                        >
                            {agency.company_name?.charAt(0).toUpperCase() || <BusinessIcon />}
                        </Avatar>

                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {agency.company_name}
                                </Typography>
                                <Tooltip title="Agency">
                                    <BusinessIcon color="primary" fontSize="small"/>
                                </Tooltip>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    CUI: {agency.cui}
                                </Typography>

                
                            </Box>
                                
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    <EmailIcon fontSize="small" color="action" /> {agency.company_email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{mt: 2.5}}>
                                    <PhoneIcon fontSize="small" color="action" /> {agency.company_phone}
                                </Typography>
                                {agency.head_office_address && (
                                    <Typography variant="body2" color="text.secondary">
                                    <PlaceIcon fontSize="small" sx={{ mr: 0.5, mt: 2.5 }} />
                                    {
                                        agency.head_office_address
                                    }
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                    </Box>

                )  : (
                    <Box textAlign="center" py={5}>
                        <CircularProgress />
                        <Typography variant="body2" color="text.secondary" mt={2}>
                            Loading agency info...
                        </Typography>
                    </Box>
                )
            }

            {agency && (
            <>
                <Paper sx={{ p: 3, mb: 5 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Commission Details
                    </Typography>
                    <Typography variant="body2">
                        <MonetizationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Sale: {agency.commission_at_sale + '%' || "Negotiable"}
                    </Typography>
                    <Typography variant="body2">
                        <MonetizationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Rent: {agency.commission_at_rent + '%' || "Negotiable"}
                    </Typography>
                </Paper>

                
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                    Properties For Sale
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {listings.filter(listing => listing.transactionType === "sale").length > 0 ? (
                <Grid container spacing={3} sx={{ mb: 5 }}>
                    {listings
                    .filter(listing => listing.transactionType === "sale")
                    .map((listing) => (
                        <Grid item xs={12} sm={6} key={listing.id}>
                        <Listing listing={listing} />
                        </Grid>
                    ))}
                </Grid>
                ) : (
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    No listings for sale.
                </Typography>
                )}

                
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                    Properties For Rent
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {listings.filter(listing => listing.transactionType === "rent").length > 0 ? (
                <Grid container spacing={3}>
                    {listings
                    .filter(listing => listing.transactionType === "rent")
                    .map((listing) => (
                        <Grid item xs={12} sm={6} key={listing.id}>
                        <Listing listing={listing} />
                        </Grid>
                    ))}
                </Grid>
                ) : (
                <Typography color="text.secondary">
                    No listings for rent.
                </Typography>
                )}
            </>
            )}

        </Box>
    )
}

export default AgencyPublicProfile