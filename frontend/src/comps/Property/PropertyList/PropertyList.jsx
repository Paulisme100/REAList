import { useEffect, useState } from "react";
import SERVER_URL from "../../../serverConnection/IpAndPort";
import Listing from "../Listing/ListingPreview";
import fetchPropertiesByFields from "../../fetches/getListingsByFields";
import fetchCounties from "../../fetches/getCounties";
import fetchLocalitiesByCounty from "../../fetches/getLocalitiesByCounty";
import { Link } from "react-router-dom";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  TextField
} from "@mui/material";


const PropertyList = () => {

    const [listings, setListings] = useState([])

    const [counties, setCounties] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [selectedCounty, setSelectedCounty] = useState("");
    const [selectedLocality, setSelectedLocality] = useState("");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        
        fetchCounties().then(data => setCounties(data))
        fetchPropertiesByFields(selectedCounty, selectedLocality).then(listings => {
          setListings(listings)
          console.log(listings)
        })
    }, [])

    useEffect(() => {
      if (selectedCounty) {

        fetchLocalitiesByCounty(selectedCounty).then(data => {
          setLocalities(data)
        })
        
      } else {
        setLocalities([]);
        setSelectedLocality("");
      }
    }, [selectedCounty]);
    
    const handleSearchChange = (e) => {
      const value = e.target.value;
      setSearchText(value);
    }

    const handleFilterChange = () => {
      fetchPropertiesByFields(selectedCounty, selectedLocality, searchText).then(data => setListings(data));
    };

    return (
        <>

          <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Filter Properties
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>

              <TextField
                fullWidth
                label="Search by title"
                variant="outlined"
                value={searchText}
                onChange={handleSearchChange}
              />

              <FormControl fullWidth>
                <InputLabel id="county-label">County</InputLabel>
                <Select
                  labelId="county-label"
                  value={selectedCounty}
                  label="County"
                  onChange={(e) => setSelectedCounty(e.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {counties.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth disabled={!localities.length}>
                <InputLabel id="locality-label">Locality</InputLabel>
                <Select
                  labelId="locality-label"
                  value={selectedLocality}
                  label="Locality"
                  onChange={(e) => setSelectedLocality(e.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {localities.map((l) => (
                    <MenuItem key={l} value={l}>
                      {l}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                onClick={handleFilterChange}
                sx={{ whiteSpace: "nowrap" }}
              >
                Apply
              </Button>
            </Box>
          
          <Link to='map'>
            <Button>
              Draw area on map
            </Button>
          </Link>

            {
              Array.isArray(listings) && listings.length > 0 ? (
                listings.map((listing) => (
                  <Listing key={listing.id} listing={listing} />
                ))
              ) : (
                <div>No listings found.</div>
              )
            }
          </Box>

        </>
    )
}

export default PropertyList