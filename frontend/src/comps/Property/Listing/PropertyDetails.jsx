import { useEffect, useState } from "react";
import SERVER_URL from "../../../serverConnection/IpAndPort";
import { useParams, useNavigate } from "react-router-dom";
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
    Tooltip,
    Button

  } from "@mui/material";
import { Bed, Bathtub, SquareFoot, CalendarMonth } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";

const PropertyDetails = () => {

    const {user} = AuthStore()

    const params = useParams()
    const nav = useNavigate()
    const [property, setProperty] = useState()
    const [isSaved, setIsSaved] = useState(false)
    const [agency, setAgency] = useState()

    const [showPhone, setShowPhone] = useState(false);

    const getAgency = async (userId) => {
      const res = await fetch(`${SERVER_URL}/agencies?userId=${userId}`)
      return res.json()
    }

    const maskPhone = (number) => {
      if (!number) 
      {
        return "Not provided";
      }

      return number.replace(/(\d{3})\d{3}(\d{3})/, "$1***$2");
    };

    useEffect(() => {
        getListingsById(params.lid).then(data => 
          {
            setProperty(data)
          }
        )
        
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

         if(property) {
          getAgency(property.User.id).then(agencies => {
            console.log(agencies[0])
            setAgency(agencies[0])
          })
        }
        console.log("the third use effect is executed: ", property)

    }, [property])


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
              justifyContent: 'center',
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
              flexWrap: "wrap",
              justifyContent: 'center'
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
    
          
          <Box sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
            {/* <Typography variant="body2" color="text.secondary"> */}
              {
                property.User.role == 'regular' && (
                 
                  <Box
                    sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 4,
                    padding: 3,
                    backgroundColor: "#fafafa",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    mt: 4,
                    minWidth: {
                      xs: "360px",
                      sm: "600px"
                    },
                    maxWidth: {
                      lg: "768px",  
                    }
                  }}
                  >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {property.User.name || "Unnamed User"}
                        </Typography>

                        <Tooltip title="Direct Owner">
                          <PersonIcon color="success" fontSize="small" />
                        </Tooltip>

                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        <strong>Email:</strong> {property.User.email || "N/A"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        <strong>Phone:</strong>{" "}
                        {
                          showPhone ? property.User.phone_number : maskPhone(property.User.phone_number)
                        }
                      </Typography>

                      {!showPhone && property.User.phone_number && (
                        <Button
                          size="small"
                          variant="text"
                          sx={{ alignSelf: "center" }}
                          onClick={() => setShowPhone(true)}
                        >
                          Show Phone
                        </Button>
                      )}

                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ alignSelf: "flex-start", mt: 1 }}
                        onClick={() => nav(`/users/${property.UserId}`)}
                      >
                        More
                      </Button>

                  </Box>
                )
              }

              {
                property.User.role == 'agent' && (
                  
                  <Box
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 4,
                      padding: 3,
                      backgroundColor: "#f4f4f4",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      mt: 4,
                      width: "100%",
                      maxWidth: 500,
                    }}
                  >
                    <div>Posted by:</div>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {property.User.name}
                      </Typography>
                      <Tooltip title="Real Estate Agent">
                        <WorkIcon color="primary" fontSize="small" />
                      </Tooltip>
                    </Box>

                    {
                      agency ? (
                        <>
                          {agency.logo_url && (
                            <CardMedia
                              component="img"
                              height="140"
                              image={`${SERVER_URL}${agency.logo_url}`}
                              alt="Agency Logo"
                              sx={{
                                objectFit: "contain",
                                borderRadius: 2,
                                maxHeight: 100,
                                maxWidth: "100%",
                              }}
                            />
                          )}
                          <Typography variant="body2" color="text.secondary">
                            Agent at <strong>{agency.company_name}</strong>
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2" color="error">
                          Agency not found
                        </Typography>
                      )
                    }

                    <Typography variant="body2" color="text.secondary">
                      <strong>Email:</strong> {property.User.email || "N/A"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <strong>Phone:</strong>{" "}
                      {
                        showPhone ? property.User.phone_number : maskPhone(property.User.phone_number)
                      }
                    </Typography>

                    {
                      !showPhone && property.User.phone_number && (
                          <Button
                            size="small"
                            variant="text"
                            sx={{ alignSelf: "center" }}
                            onClick={() => setShowPhone(true)}
                          >
                            Show Phone
                          </Button>
                      )
                    }

                    <Box sx={{ display: "flex", justifyContent: 'space-between', gap: 2, mt: 1 }}>
                       <Button
                          variant="outlined"
                          size="small"
                          onClick={() => nav(`/users/${property.User.id}`)}
                        >
                          See agent
                        </Button>

                        {
                          agency?.id && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => navigate(`/agency/${agency.id}`)}
                            >
                              See agency
                            </Button>
                          )
                        }
                    
                    </Box>

                  </Box>
                )
              }
              
            {/* </Typography> */}
          </Box>
        </Box>
      );
};


export default PropertyDetails