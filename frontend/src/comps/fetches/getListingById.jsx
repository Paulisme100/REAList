import SERVER_URL from "../../serverConnection/IpAndPort";

const getListingsById = async(id = '') => {

    const url = `${SERVER_URL}/listings/${id}`
    const res = await fetch(url)
    
    return res.json()
}

export default getListingsById