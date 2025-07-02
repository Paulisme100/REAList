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
  TextField,
  Collapse,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  Divider
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close"
import MapIcon from '@mui/icons-material/Map';

const propertyTypeOptions = ['house', 'apartment', 'commercial space', 'industrial space', 'land']

const PropertyList = () => {

    const [listings, setListings] = useState([])

    const [counties, setCounties] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [selectedCounty, setSelectedCounty] = useState("");
    const [selectedLocality, setSelectedLocality] = useState("");
    const [searchText, setSearchText] = useState("");
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState("");
    const [constructionYear, setConstructionYear] = useState("");
    const [minSquareMeters, setMinSquareMeters] = useState('');
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [showPropertyTypes, setShowPropertyTypes] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const listingsPerPage = 6;

    useEffect(() => {
        
        fetchCounties().then(data => setCounties(data))
        fetchPropertiesByFields(selectedCounty, selectedLocality).then(listings => {
          setListings(listings)
          // console.log(listings)
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
      fetchPropertiesByFields(selectedCounty, selectedLocality, searchText, '', transactionType, minPrice, maxPrice, bedrooms, bathrooms, constructionYear, minSquareMeters, propertyTypes).then(data => setListings(data));
    };

    return (
        <>

          <Box sx={{ p: 4 }}>
            
            <Box sx={{ mb: 3 }}>

              <Button
                variant="outlined"
                onClick={() => setShowPropertyTypes((prev) => !prev)}
              >
                {showPropertyTypes ? 'Close' : 'Choose Type of Property'}
              </Button>

              <Collapse in={showPropertyTypes} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                  mt: 2,
                }}
              >
                {propertyTypeOptions.map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={propertyTypes.includes(type)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setPropertyTypes((prev) =>
                            prev.includes(value)
                              ? prev.filter((t) => t !== value)
                              : [...prev, value]
                          );
                        }}
                        value={type}
                        size="small"
                      />
                    }
                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                    sx={{
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      padding: '4px 12px',
                      backgroundColor: '#f9f9f9',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                    }}
                  />
                ))}
              </Box>
            </Collapse>

            </Box>

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

              <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Transaction Type</InputLabel>
                    <Select
                      value={transactionType}
                      label="Transaction Type"
                      onChange={(e) => setTransactionType(e.target.value)}
                    >
                      <MenuItem value=""><em>Any</em></MenuItem>
                      <MenuItem value="sale">Sale</MenuItem>
                      <MenuItem value="rent">Rent</MenuItem>
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


            <Button
              variant="outlined"
              startIcon={<TuneIcon sx={{ transform: showAdvanced ? "rotate(90deg)" : "rotate(0deg)", transition: "0.3s" }} />}
              onClick={() => setShowAdvanced((prev) => !prev)}
            >
              Advanced Filters
            </Button>

            <Collapse in={showAdvanced} timeout="auto" unmountOnExit>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2, mt: 2 }}>

                  <FormControl sx={{ minWidth: 140 }}>
                    <TextField
                      label="Min Price"
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </FormControl>

                  <FormControl sx={{ minWidth: 140 }}>
                    <TextField
                      label="Max Price"
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </FormControl>

                  <FormControl sx={{ minWidth: 140 }}>
                    <TextField
                      label="Number of Bedrooms"
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                    />
                  </FormControl>

                  <FormControl sx={{ minWidth: 140 }}>
                    <TextField
                      label="Number of Bathrooms"
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                    />
                  </FormControl>

                  <FormControl sx={{ minWidth: 180 }}>
                    <TextField
                      label="Construction Year (Starting From)"
                      type="number"
                      value={constructionYear}
                      onChange={(e) => setConstructionYear(e.target.value)}
                    />
                  </FormControl>

                  <FormControl sx={{ minWidth: 180 }}>
                    <TextField
                      label="Min Sq Meters"
                      type="number"
                      value={minSquareMeters}
                      onChange={(e) => setMinSquareMeters(e.target.value)}
                    />
                  </FormControl>

                </Box>
              </Collapse>
              <br/>

          
          <Link to="map" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              startIcon={<MapIcon />}
              sx={{
                mt: 2,
                px: 3,
                py: 1.5,
                backgroundColor: "#2e7d32",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "16px",
                borderRadius: "12px",
                textTransform: "none",
                '&:hover': {
                  backgroundColor: "#1b5e20",
                }
              }}
            >
                Search on Map
            </Button>
          </Link>

            <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                  mt: 2,
                }}
            >
              {
                Array.isArray(listings) && listings.length > 0 ? (
                  listings
                    .slice((currentPage - 1) * listingsPerPage, currentPage * listingsPerPage)
                    .map((listing) => (
                      <Listing key={listing.id} listing={listing} />
                    ))
                ) : (
                  <div>No listings found.</div>
                )
              }
            </Box>

              <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <Typography variant="body1" sx={{ lineHeight: "40px" }}>
                  Page {currentPage} of {Math.ceil(listings.length / listingsPerPage)}
                </Typography>

                <Button
                  variant="outlined"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev < Math.ceil(listings.length / listingsPerPage)
                        ? prev + 1
                        : prev
                    )
                  }
                  disabled={currentPage >= Math.ceil(listings.length / listingsPerPage)}
                >
                  Next
                </Button>
              </Box>

          </Box>

        </>
    )
}

export default PropertyList