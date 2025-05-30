import SERVER_URL from "../../serverConnection/IpAndPort";

const fetchPropertiesByFields = async (county='', locality = '', title = '', lid = '') => {

    try {
        const response = await fetch(`${SERVER_URL}/listings?county=${county}&locality=${locality}&title=${title}&lid=${lid}`)
        const data = await response.json()
        return data
    } catch (err) {
        throw new Error(err.message)
    }
}

export default fetchPropertiesByFields