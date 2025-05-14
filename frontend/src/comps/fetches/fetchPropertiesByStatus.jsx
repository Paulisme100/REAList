import SERVER_URL from "../../serverConnection/IpAndPort";

const fetchPropertiesByStatus = async (ad_status = '') => {

    const url = `${SERVER_URL}/users/user-listings?ad_status=${ad_status}`
    const res = await fetch(url, 
        {
            method: 'get',
            credentials: 'include'
        }
    )

    const data = await res.json()
    return data
}

export default fetchPropertiesByStatus