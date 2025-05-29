import SERVER_URL from "../../serverConnection/IpAndPort"

const fetchCounties = async () => {

    try {
        const response = await fetch(`${SERVER_URL}/localities/counties`)
        const data = await response.json()
        return data
    } catch (err) {
        throw new Error(err.message)
    }
    
}

export default fetchCounties