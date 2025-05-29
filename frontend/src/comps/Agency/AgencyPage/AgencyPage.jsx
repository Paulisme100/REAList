import { useEffect, useState } from "react";
import SERVER_URL from "../../../serverConnection/IpAndPort";
import AgencyAuthStore from "../../stores/AgencyAuthStore";
import { Button } from "@mui/material";
import agencyApi from "../../fetches/agency/agencyApi";
import {useNavigate} from 'react-router-dom'

const AgencyPage = () => {

    const {agency, login: loginAgency, logout: logoutAgency} = AgencyAuthStore()
    const nav = useNavigate()

    const clearTokenCookie = async () => {

        const url = `${SERVER_URL}/agencies/logout`
        const response = await fetch(url, {
            method: 'post',
            credentials: 'include'
        })

        if(!response.ok) {
            const errorData = await response.json().catch(()=>({}))
            const error = new Error(errorData.message || "Failed to fetch user data")
            error.status = response.status
            throw error
        }

        const message = response.json()
        console.log(message)
    }

    return(
        <>
            {
                agency? (
                    <>
                        <div>{agency.company_email}</div>
                        <Button
                                    variant="outlined"
                                    color="error"
                                    onClick = {() => {
                                        clearTokenCookie();
                                        logoutAgency();
                                        nav('/');
                                    }}
                                >
                                    Log Out
                        </Button>
                    </>
                ) : (
                    <>No Agency Connected</>
                )
            }

        </>
    )

}

export default AgencyPage