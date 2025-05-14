import { use } from "react"
import SERVER_URL from "../../serverConnection/IpAndPort"

const saveProperty = async (userid = '', listingid = '') => {

    const url = `${SERVER_URL}/saved-properties`
    const res = await fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            UserId: userid,
            ListingId: listingid
        })
    })

    if(!res.ok){
        const errorData = await response.json().catch(()=>({}))
        const error = new Error(errorData.message || "Failed to fetch user data")
        error.status = response.status
        throw error
    }

    console.log(await res.json())

}

const unSaveProperty  = async (userid = '', listingid = '') => {

    const url = `${SERVER_URL}/saved-properties`
    const res = await fetch(url, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            UserId: userid,
            ListingId: listingid
        })
    })

    if(!res.ok){
        const errorData = await response.json().catch(()=>({}))
        const error = new Error(errorData.message || "Failed to fetch user data")
        error.status = response.status
        throw error
    }

    console.log(await res.json())

}

const showSaved = async (userid = '', listingid = '') => {

    const url = `${SERVER_URL}/saved-properties?UserId=${userid}&ListingId=${listingid}`
    const res = await fetch(url, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    if(!res.ok){
        const errorData = await response.json().catch(()=>({}))
        const error = new Error(errorData.message || "Failed to fetch user data")
        error.status = response.status
        throw error
    }

    return await res.json()

}

const manageSavedProperty  = async (userid = '', listingid = '', isSaved = false) => {

    if(!isSaved){
        saveProperty(userid, listingid)
    } else {
        unSaveProperty(userid, listingid)
    }
}

export default {
    manageSavedProperty,
    showSaved
}