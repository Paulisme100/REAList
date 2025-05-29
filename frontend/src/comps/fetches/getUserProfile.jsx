import SERVER_URL from "../../serverConnection/IpAndPort"

const getUserData = async () => {
    try {
        const url = `${SERVER_URL}/users/profile`
        const response = await fetch(url, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        if(!response.ok){
          const errorData = await response.json().catch(()=>({}))
          const error = new Error(errorData.message || "Failed to fetch user data")
          error.status = response.status
          throw error
        } 

        return response.json()
  
      } catch (err) {
          console.warn(err)
      }
}

export default getUserData