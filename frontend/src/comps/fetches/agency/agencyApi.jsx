import SERVER_URL from "../../../serverConnection/IpAndPort";

const registerAgency = async (agencyData) => {


    const url = `${SERVER_URL}/agencies`
    const res = await fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(agencyData)
    })

    console.log(await res.json())
}

const logInAsAgency = async (agencyData) => {

    const url = `${SERVER_URL}/agencies/login`
    const res = await fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(agencyData),
        credentials: 'include'
    })

    return await res.json()
}

const fetchProfile = async () => {
    const res = await fetch(`${SERVER_URL}/agencies/profile`, {
        credentials: 'include'
    })

    return await res.json()

}

export default {
    registerAgency,
    logInAsAgency,
    fetchProfile
}