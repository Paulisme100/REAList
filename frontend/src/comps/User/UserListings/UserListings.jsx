import { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Divider
} from "@mui/material";
import Listing from "../../Property/Listing/ListingPreview";
import AuthStore from "../../stores/AuthStore";
import fetchPropertiesByStatus from "../../fetches/fetchPropertiesByStatus";

const UserListings = () => {
  const { user } = AuthStore();
  const [tab, setTab] = useState(0);
  const [activeListings, setActiveListings] = useState([]);
  const [inactiveListings, setInactiveListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const [active, inactive] = await Promise.all([
        fetchPropertiesByStatus("active"),
        fetchPropertiesByStatus("inactive")
      ]);
      setActiveListings(active.filter(l => l.UserId === user.id));
      setInactiveListings(inactive.filter(l => l.UserId === user.id));
    } catch (err) {
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchListings();
    }
  }, [user]);

  if (!user) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        Please log in to view your listings.
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 2 }}>
      <Typography variant="h4" mb={2} textAlign="center">
        Your Listings
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        centered
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Active" />
        <Tab label="Inactive" />
      </Tabs>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Box textAlign="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {(tab === 0 ? activeListings : inactiveListings).map((listing) => (
            <Grid item key={listing.id}>
              <Listing listing={listing} />
            </Grid>
          ))}

          {(tab === 0 ? activeListings : inactiveListings).length === 0 && (
            <Typography variant="body1" mt={4} textAlign="center" width="100%">
              {tab === 0
                ? "You have no active listings."
                : "You have no inactive listings."}
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default UserListings;
