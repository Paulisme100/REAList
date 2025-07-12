
import React, { useEffect, useState } from 'react'
import {
  TextField,
  Button,
  MenuItem,
  Box,
  FormControl,
  FormHelperText,
  Typography,
  Snackbar,
  Alert
} from '@mui/material'
import SERVER_URL from '../../../serverConnection/IpAndPort'
import AuthStore from '../../stores/UserAuthStore'
import { useNavigate, useLocation } from 'react-router-dom'
import fetchCounties from '../../fetches/getCounties'
import fetchLocalitiesByCounty from '../../fetches/getLocalitiesByCounty'

const PropertyForm = () => {
  const { user } = AuthStore()
  const nav = useNavigate()
  const location = useLocation()
  const editingListing = location.state?.listing || null

  const [formData, setFormData] = useState(null)


  const [counties, setCounties] = useState([])
  const [localities, setLocalities] = useState([])
  const [selectedCounty, setSelectedCounty] = useState(editingListing?.Locality?.county || '')
  const [images, setImages] = useState([])
  const [existingImages, setExistingImages] = useState(editingListing?.Images || [])

  const [priceIsValid, setPriceIsValid] = useState(true)
  const [bedNumIsValid, setBedNumIsValid] = useState(true)
  const [bathNumIsValid, setBathNumIsValid] = useState(true)
  const [surfaceIsValid, setSurfaceIsValid] = useState(true)
  const [yearIsValid, setYearIsValid] = useState(true)

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('error')

  const handleSnackbarClose = (event, reason) => {

    if (reason === 'clickaway') {

      return
    }
    setSnackbarOpen(false)
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + existingImages.length > 7) {
      alert('You can upload up to 7 images in total')
      return
    }
    setImages(prev => [...prev, ...files])
  }

  useEffect(() => {
    fetchCounties().then(data => setCounties(data))
  }, [])

  useEffect(() => {
    if (selectedCounty) {
      fetchLocalitiesByCounty(selectedCounty).then(data => setLocalities(data))
    } else {
      setLocalities([])
    }
  }, [selectedCounty])

  useEffect(() => {

    if (user) {
      setFormData({
        title: editingListing?.title || '',
        propertyType: editingListing?.propertyType || '',
        transactionType: editingListing?.transactionType || '',
        description: editingListing?.description || '',
        price: editingListing?.price || '',
        address: editingListing?.address || '',
        bedrooms: editingListing?.bedrooms || '',
        bathrooms: editingListing?.bathrooms || '',
        squareMeters: editingListing?.squareMeters || '',
        constructionYear: editingListing?.constructionYear || '',
        locality: editingListing?.Locality?.name || '',
        ad_status: editingListing?.ad_status || 'active',
        UserId: user.id
      })
    }
  }, [user, editingListing])

  const inputDataIsValid = () => {

    let isOk = true
    
    if(parseFloat(formData.price) < 0)
    {
        isOk = false
        setPriceIsValid(false)       
    }

    if(parseInt(formData.bedrooms) < 0)
    {
        isOk = false
        setBedNumIsValid(false)       
    }

    if(parseInt(formData.bathrooms) < 0)
    {
        isOk = false
        setBathNumIsValid(false)       
    }

    if(parseInt(formData.squareMeters) < 0)
    {
        isOk = false
        setSurfaceIsValid(false)      
    }

    if(parseInt(formData.constructionYear) < 1000)
    {
        isOk = false
        setYearIsValid(false)       
    }

    return isOk;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(inputDataIsValid())  {

      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => form.append(key, value))
      images.forEach(image => form.append('images', image))

      try {
        const method = editingListing ? 'PUT' : 'POST'
        const url = editingListing ? `${SERVER_URL}/listings/${editingListing.id}`
          : `${SERVER_URL}/listings`

        const res = await fetch(url, {
          method,
          credentials: 'include',
          body: form
        })

        if (!res.ok)  {
          
            if(res.status == 422) {
              const data = await res.json()
              setSnackbarMessage(data.moderationMessage || "Your content is inadmisible!")
              setSnackbarSeverity('error')
              setSnackbarOpen(true)
              return
            }

            let err = await res.json()
            throw new Error(err.message)
        }

        const data = await res.json()
        // console.log('Submitted:', data)
        setSnackbarMessage('Listing submitted successfully!')
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
        nav('/user-listings')

      } catch (err) {
        setSnackbarMessage(err.message)
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
        console.error(err)
      }

    }

  }

  return (
    (user && formData) && (
      <>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, margin: '0 auto', padding: 3 }}
        >
          <Typography variant="h5">
            {editingListing ? 'Edit Your Listing' : 'Post Your Property'}
          </Typography>

          
          <TextField name="title" label="Title" value={formData.title} onChange={handleChange} required />
          <TextField name="address" label="Address" value={formData.address} onChange={handleChange} required />
          <TextField name="price" label="Price €" type="number" value={formData.price} 
                    onChange={(e) => {
                      handleChange(e)
                      setPriceIsValid(true)
                    }} 
                    required error={!priceIsValid} helperText={ !priceIsValid ? "Price value is out of range." : ""}
          />

          <TextField name="propertyType" label="Property Type" select value={formData.propertyType} onChange={handleChange} required>
            {
              ['house', 'apartment', 'commercial space', 'industrial space', 'land'].map(type => (
                <MenuItem key={type} value={type}>
                    
                    {type}

                </MenuItem>
              ))
            }
          </TextField>

          <TextField name="transactionType" label="Transaction Type" select value={formData.transactionType} onChange={handleChange} required>
            {
              ['sale', 'rent'].map(type => (
                <MenuItem key={type} value={type}>

                  {type}

                </MenuItem>
              ))
            }
          </TextField>

          <TextField name="description" label="Description" multiline minRows={3} value={formData.description} onChange={handleChange} />

          <TextField name="bedrooms" label="Bedrooms" type="number" value={formData.bedrooms} onChange={
            (e) => {
              handleChange(e)
              setBedNumIsValid(true)
            }
          } error = {!bedNumIsValid} helperText={ !bedNumIsValid ? "Beds number is out of range" : ""}/>

          <TextField name="bathrooms" label="Bathrooms" type="number" value={formData.bathrooms} onChange={(e) => {
              handleChange(e)
              setBathNumIsValid(true)
            }
          } error={!bathNumIsValid} helperText={!bathNumIsValid ? "Baths number is out of range" : ""}
          />

          <TextField name="squareMeters" label="Square Meters" type="number" value={formData.squareMeters} onChange={(e) => {
              handleChange(e)
              setSurfaceIsValid(true)
            }
          } error={!surfaceIsValid} helperText={!surfaceIsValid ? "Surface value is out of range" : ""}
          />

          <TextField name="constructionYear" label="Construction Year" type="number" value={formData.constructionYear} onChange={(e) => {
                handleChange(e)
                setYearIsValid(true)
              }
            } error={!yearIsValid} helperText={!yearIsValid ? "Value for year is out of range" : ""}
          />

          <TextField label="County" select value={selectedCounty} onChange={e => {
              setSelectedCounty(e.target.value)
              setFormData({ ...formData, locality: '' })
            }
          } required>
            {
              counties.map(county => (
                <MenuItem key={county} value={county}>

                  {county}

                </MenuItem>
              ))
            }
          </TextField>

          {
            selectedCounty && (
              <TextField
                label="Locality"
                select
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                required
              >
                {
                  localities.map(locality => (

                    <MenuItem key={locality} value={locality}>
                        {locality}
                    </MenuItem>

                  ))
                }
              </TextField>
            )
          }

          
          <Button
            variant="outlined"
            component="label"
            sx={{ borderRadius: 2, textTransform: 'none', borderStyle: 'dashed' }}
          >
            Upload Images
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageChange}
            />
          </Button>

          <Box display="flex" flexWrap="wrap" gap={1}>
            {
              existingImages.map((img, idx) => (
                <img
                  key={`existing-${idx}`}
                  src={`${SERVER_URL}${img.url}`}
                  alt={`existing-${idx}`}
                  width={100}
                  height="auto"
                  style={{ borderRadius: '8px', border: '1px solid #ccc' }}
                />
              ))
            }
            {
              images.map((img, idx) => (
                <img
                  key={`new-${idx}`}
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  width={100}
                  height="auto"
                  style={{ borderRadius: '8px' }}
                />
              ))
            }
          </Box>

          <FormHelperText>Up to 7 images allowed</FormHelperText>

          <Button variant="contained" color="primary" type="submit">
            {editingListing ? 'Update Listing' : 'Submit Listing'}
          </Button>
        </Box>

        <Snackbar
          open = {snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </>)
  )
}

export default PropertyForm
