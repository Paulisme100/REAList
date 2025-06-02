import SERVER_URL from "../../serverConnection/IpAndPort";

const fetchPropertiesByFields = async (county='', locality = '', title = '', lid = '', transactionType = '', minPrice = '', maxPrice  = '',  bedrooms = '', bathrooms = '', constructionYear  = '', minSquareMeters) => {

    try {
        const response = await fetch(`${SERVER_URL}/listings?county=${county}&locality=${locality}&title=${title}&lid=${lid}&transactionType=${transactionType}&minPrice=${minPrice}&maxPrice=${maxPrice}&bedrooms=${bedrooms}&bathrooms=${bathrooms}&constructionYear=${constructionYear}&minSquareMeters=${minSquareMeters}`)
        const data = await response.json()
        return data
    } catch (err) {
        throw new Error(err.message)
    }
}

export default fetchPropertiesByFields