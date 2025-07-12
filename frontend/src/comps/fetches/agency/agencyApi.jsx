import SERVER_URL from "../../../serverConnection/IpAndPort";

const getAgencies = async (filterField = '', filterValue = '') => {

    const url = `${SERVER_URL}/agencies?filterField=${filterField}&filterValue=${filterValue}`
    const res = await fetch(url)

    return await res.json()
}

const getAllListings = async (agencyId = '') => {

    const url = `${SERVER_URL}/agencies/${agencyId}/listings`
    const res = await fetch(url)

    return await res.json()
}

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

    try {

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
        
    } catch (err) {

        throw new Error(err.message)
        
    }

}

const fetchProfile = async () => {
    const res = await fetch(`${SERVER_URL}/agencies/profile`, {
        credentials: 'include'
    })

    return await res.json()

}

const fetchAgents = async (AgencyId = '') => {
    try {

        const res = await fetch(`${SERVER_URL}/agencies/agents?AgencyId=${AgencyId}`, {
            credentials: 'include'
        })

        return await res.json()
        
    } catch (err) {
        throw new Error(err.message)
    }
        
}

const fetchAgentsByStatus = async (agentStatus  = '') => {
    const res = await fetch(`${SERVER_URL}/agencies/agents?agentStatus=${agentStatus}`, {
        credentials: 'include'
    })

    return await res.json()
}

const updateAgencyData  = async (formData) => {

    const res = await fetch(`${SERVER_URL}/agencies`, {
        method: 'PUT',
        body: formData,
        credentials: 'include'
    })

    if (res.ok) {
      const updatedAgency = await res.json();
      return updatedAgency
    } else {
      const error = await res.json();
      alert("Error updating agency: " + error.message);
    }
}

const changeAgentStatus = async (agentId = '', status = '') => {

    const queryBody = {
        agentStatus: status
    }

    const res = await fetch(`${SERVER_URL}/users/${agentId}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(queryBody)
    })

    return await res.json()
}

export default {
    registerAgency,
    logInAsAgency,
    fetchProfile,
    fetchAgents,
    fetchAgentsByStatus,
    updateAgencyData,
    changeAgentStatus,
    getAgencies,
    getAllListings
}