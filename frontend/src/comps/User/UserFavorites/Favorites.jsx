import AuthStore from '../../stores/AuthStore'
import Listing from '../../Property/Listing/ListingPreview'
import { useEffect, useState } from 'react'
import markedProperties from '../../fetches/markedProperties'
import getListingsByFields from '../../fetches/getListingsByFields'
import {

    Typography

  } from "@mui/material";

const Favorites = () => {

    const {user} = AuthStore()
    const [favorites, setFavorites] = useState([])
    const [listings, setListings] = useState([])

    useEffect(() => {
        markedProperties.showSaved(user.id).then(data => setFavorites(data))
    }, [])

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

    if (!user.id) {
        return <Typography variant="h6">No user connected</Typography>;
    }

    if (favorites.length < 1) {
            return <Typography variant="h6">You have not saved any property.</Typography>;
    }
    
    return (
        <>
            {
                listings ? (
                    listings.map(listing => <Listing key={listing.id} listing={listing}></Listing>)
                ) : (
                    <div>
                        No listings available. Users may have been deleted them.
                    </div>
                )
            }
        </>
    )
}

export default Favorites
