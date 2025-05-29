import SERVER_URL from "../../serverConnection/IpAndPort";

const changeListingStatus = async (id = '') => {

    const url = `${SERVER_URL}/listings/status/${id}`
    const res = await fetch(url, 
        {
            method: 'put',
            credentials: 'include'
        }
    )

    const data = await res.json()
    if (Array.isArray(data)) {
        return data;
    }
    return []
}

export default changeListingStatus