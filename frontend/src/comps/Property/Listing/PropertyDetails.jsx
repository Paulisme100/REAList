import { useEffect, useState } from "react";
import SERVER_URL from "../../../serverConnection/IpAndPort";
import { useParams } from "react-router-dom";
import getListingsById from "../../fetches/getListingById";
import markedProperties from "../../fetches/markedProperties";
import AuthStore from "../../stores/UserAuthStore";
import {
    Box,
    Typography,
    Chip,
    Grid,
    Card,
    CardMedia,
    IconButton,
    Tooltip
  } from "@mui/material";
import { Bed, Bathtub, SquareFoot, CalendarMonth } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const PropertyDetails = () => {

    const {user} = AuthStore()

    const params = useParams()
    const [property, setProperty] = useState()
    const [isSaved, setIsSaved] = useState(false)

    useEffect(() => {
        getListingsById(params.lid).then(data => 
          {
            setProperty(data)
          }
        )
        // if(user)
        // {
        //   markedProperties.showSaved(user.id, params.lid).then(propArr => {
        //     if(propArr){
        //       setIsSaved(true)
        //       console.log('Property is saved')
        //     }
            
        //   })
        // }
    }, [])

    useEffect(() => {
      if (user && params.lid) {
        markedProperties.showSaved(user.id, params.lid).then(propArr => {
          if(Array.isArray(propArr))
          {
            setIsSaved(true);
            console.log("For userid: ", user.id)
            console.log(propArr) 
          }
        });
      }
    }, [user, params.lid]);

    useEffect(() => {
      console.log("isSaved: " + isSaved)
    }, [isSaved]);

    if (!property) {
        return <Typography variant="h6">Loading property details...</Typography>;
      }

    const imageGallery = property.Images?.map((image, idx) => (
        <Card key={idx} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <CardMedia
            component="img"
            image={`${SERVER_URL}${image.url}`}
            alt={`property-${idx}`}
            sx={{
              width: "100%",
              height: 200,
              objectFit: "cover"
            }}
          />
        </Card>
      ));
    
      return (
        <Box sx={{ maxWidth: "1200px", mx: "auto", p: 4
        }}>
          
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2
            }}
          >
            <Typography variant="h4" fontWeight={600}>
              {property.title}
            </Typography>
    
            {user && (
              <Tooltip title="Save to favorites">
                <IconButton color="error" onClick={() => {
                    markedProperties.manageSavedProperty(user.id, params.lid, isSaved)
                    setIsSaved(!isSaved)
                  }}>
                  {isSaved ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
            )}
          </Box>
    
          
          {property.Images?.[0] && (
            <Card sx={{ borderRadius: 3, mb: 3 }}>
              <CardMedia
                component="img"
                height="400"
                image={`${SERVER_URL}${property.Images[0].url}`}
                alt="Main Property Image"
                sx={{ objectFit: "cover" }}
              />
            </Card>
          )}
    
          
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 2,
              mb: 3
            }}
          >
            <Typography variant="h5" color="primary" fontWeight={500}>
              €{property.price.toLocaleString()}
            </Typography>
            <Chip label={property.transactionType} color="info" />
            <Chip label={property.propertyType} color="secondary" />
            <Chip label={`${property.squareMeters} m²`} icon={<SquareFoot />} />
          </Box>
    
          
          <Box
            sx={{
              display: "flex",
              gap: 4,
              mb: 3,
              flexWrap: "wrap"
            }}
          >
            <Chip
              icon={<Bed />}
              label={`${property.bedrooms} Bedroom${property.bedrooms !== 1 ? "s" : ""}`}
              variant="outlined"
            />
            <Chip
              icon={<Bathtub />}
              label={`${property.bathrooms} Bathroom${property.bathrooms !== 1 ? "s" : ""}`}
              variant="outlined"
            />
            <Chip
              icon={<CalendarMonth />}
              label={`Built in ${property.constructionYear}`}
              variant="outlined"
            />
          </Box>
    
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">Location</Typography>
            <Typography variant="body1" color="text.secondary">
              {property.address}
            </Typography>
            {property.Locality && (
              <Typography variant="body1" color="text.secondary">
                {property.Locality.name}, {property.Locality.county}
              </Typography>
            )}
          </Box>
    
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {property.description}
            </Typography>
          </Box>
    
          
          {property.Images?.length > 1 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Gallery
              </Typography>
              <Grid container spacing={2}>
                {imageGallery}
              </Grid>
            </Box>
          )}
    
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Posted by: <strong>{property.User.name}</strong>
            </Typography>
          </Box>
        </Box>
      );
};


export default PropertyDetails