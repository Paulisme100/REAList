import SERVER_URL from "../../serverConnection/IpAndPort"

const changePassword = async(userId = '', fields = {}) => {

    try {
        const url = `${SERVER_URL}/users/${userId}`
        const response = await fetch(url, {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(fields),
          credentials: 'include'
        })
        if(!response.ok){
          const errorData = await response.json().catch(()=>({}))
          const error = new Error(errorData.message || "Failed to fetch user data")
          error.status = response.status
          throw error
        } 

        response.json().then(message => {console.log(message)})
  
      } catch (err) {
          console.warn(err)
      }
}

export default changePassword