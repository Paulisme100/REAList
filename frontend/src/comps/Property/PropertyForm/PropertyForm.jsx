
import React, { useEffect, useState } from 'react'
import {
  TextField,
  Button,
  MenuItem,
  Box,
  FormControl,
  FormHelperText,
  Typography
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

  const [formData, setFormData] = useState({
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

  const [counties, setCounties] = useState([])
  const [localities, setLocalities] = useState([])
  const [selectedCounty, setSelectedCounty] = useState(editingListing?.Locality?.county || '')
  const [images, setImages] = useState([])
  const [existingImages, setExistingImages] = useState(editingListing?.Images || [])

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => form.append(key, value))
    images.forEach(image => form.append('images', image))

    try {
      const method = editingListing ? 'PUT' : 'POST'
      const url = editingListing
        ? `${SERVER_URL}/listings/${editingListing.id}`
        : `${SERVER_URL}/listings`

      const res = await fetch(url, {
        method,
        credentials: 'include',
        body: form
      })

      if (!res.ok) throw new Error('Failed to submit listing')

      const data = await res.json()
      console.log('Submitted:', data)
      nav('/user-listings')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, margin: '0 auto' }}
    >
      <Typography variant="h5">
        {editingListing ? 'Edit Your Listing' : 'Post Your Property'}
      </Typography>

      {/* Form fields */}
      <TextField name="title" label="Title" value={formData.title} onChange={handleChange} required />
      <TextField name="address" label="Address" value={formData.address} onChange={handleChange} required />
      <TextField name="price" label="Price €" type="number" value={formData.price} onChange={handleChange} required />
      <TextField name="propertyType" label="Property Type" select value={formData.propertyType} onChange={handleChange} required>
        {['house', 'apartment', 'condo', 'commercial space'].map(type => (
          <MenuItem key={type} value={type}>{type}</MenuItem>
        ))}
      </TextField>
      <TextField name="transactionType" label="Transaction Type" select value={formData.transactionType} onChange={handleChange} required>
        {['sale', 'rent'].map(type => (
          <MenuItem key={type} value={type}>{type}</MenuItem>
        ))}
      </TextField>
      <TextField name="description" label="Description" multiline minRows={3} value={formData.description} onChange={handleChange} />
      <TextField name="bedrooms" label="Bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} />
      <TextField name="bathrooms" label="Bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} />
      <TextField name="squareMeters" label="Square Meters" type="number" value={formData.squareMeters} onChange={handleChange} />
      <TextField name="constructionYear" label="Construction Year" type="number" value={formData.constructionYear} onChange={handleChange} />

      <TextField label="County" select value={selectedCounty} onChange={e => {
        setSelectedCounty(e.target.value)
        setFormData({ ...formData, locality: '' })
      }} required>
        {counties.map(county => (
          <MenuItem key={county} value={county}>{county}</MenuItem>
        ))}
      </TextField>

      {selectedCounty && (
        <TextField
          label="Locality"
          select
          name="locality"
          value={formData.locality}
          onChange={handleChange}
          required
        >
          {localities.map(locality => (
            <MenuItem key={locality} value={locality}>{locality}</MenuItem>
          ))}
        </TextField>
      )}

      {/* Image Upload & Preview */}
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
        {existingImages.map((img, idx) => (
          <img
            key={`existing-${idx}`}
            src={`${SERVER_URL}${img.url}`}
            alt={`existing-${idx}`}
            width={100}
            height="auto"
            style={{ borderRadius: '8px', border: '1px solid #ccc' }}
          />
        ))}
        {images.map((img, idx) => (
          <img
            key={`new-${idx}`}
            src={URL.createObjectURL(img)}
            alt="preview"
            width={100}
            height="auto"
            style={{ borderRadius: '8px' }}
          />
        ))}
      </Box>

      <FormHelperText>Up to 7 images allowed</FormHelperText>

      <Button variant="contained" color="primary" type="submit">
        {editingListing ? 'Update Listing' : 'Submit Listing'}
      </Button>
    </Box>
  )
}

export default PropertyForm
