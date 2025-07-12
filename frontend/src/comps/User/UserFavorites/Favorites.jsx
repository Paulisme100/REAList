import AuthStore from '../../stores/UserAuthStore'
import Listing from '../../Property/Listing/ListingPreview'
import { useEffect, useState } from 'react'
import markedProperties from '../../fetches/markedProperties'
import getListingsByFields from '../../fetches/getListingsByFields'
import {

    Typography

  } from "@mui/material";
  import FavoriteIcon from '@mui/icons-material/Favorite'


const Favorites = () => {

    const {user} = AuthStore()
    const [favorites, setFavorites] = useState([])
    const [listings, setListings] = useState([])

    useEffect(() => {
        if(user){
            markedProperties.showSaved(user.id).then(data => setFavorites(data))
        }
        
    }, [user])

    useEffect(() => {

        const fetchListings = async () => {
            const promises = favorites.map(
                fav => getListingsByFields('', '', '', fav.ListingId).then(data => data[0])
            )
            const results = await Promise.all(promises)
            setListings(results)
        }

        if (favorites.length > 0) {
            fetchListings();
        }

    }, [favorites])

    if (!user) {
        return <Typography variant="h6">Loading user...</Typography>
    }

    if (favorites.length < 1) {
        return <Typography variant="h6">You have not saved any property.</Typography>
    }
    
    return (
        <>
            <Typography
                variant="h4"
                mt={4}
                mb={3}
                align="center"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, fontWeight: 600 }}
            >
                Saved Properties
            </Typography>
            {
                listings.length >=1 ? (
                    listings.map(listing => <Listing key={listing.id} listing={listing}></Listing>)
                ) : (
                    <Typography variant="h6" sx={{m: 4}}>You have not saved any property or you unsaved them.</Typography>
                )
            }
        </>
    )
}

export default Favorites
