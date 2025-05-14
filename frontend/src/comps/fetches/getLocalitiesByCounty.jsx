import SERVER_URL from "../../serverConnection/IpAndPort"

const fetchLocalitiesByCounty = async (selectedCounty = '') => {
    try {
        const res = await fetch(`${SERVER_URL}/localities/${encodeURIComponent(selectedCounty)}`)
        const data = await res.json()
        return data
    } catch (err) {
        throw new Error(err.message)
    }
}

export default fetchLocalitiesByCounty