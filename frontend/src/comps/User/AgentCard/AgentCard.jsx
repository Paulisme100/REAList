import {Card, CardContent, Typography, Avatar, Box, Button, Stack } from "@mui/material"
import { useNavigate, Link } from "react-router-dom"
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteIcon from '@mui/icons-material/Delete'
import agencyApi from "../../fetches/agency/agencyApi"
import SERVER_URL from "../../../serverConnection/IpAndPort"


const AgentCard = ({agent, refreshAgents}) => {

    const nav = useNavigate()

    const deleteAgent = async (agentId) => {
        const res = await fetch(`${SERVER_URL}/users/${agentId}`, {
            method: 'delete',
            credentials: 'include'
        })

    }

    return(
        <Card elevation={2} sx={{ padding: 2, position: "relative" }}>

            <Box position="absolute" top={8} right={8}>
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                        deleteAgent(agent.id)
                    }}
                >
                    Fire
                </Button>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ width: 56, height: 56 }}>
                    {
                        agent.name.charAt(0).toUpperCase()
                    }
                </Avatar>
            </Box>
            <Box>
                <Typography variant="h6">{agent.name}</Typography>
                <Typography variant="body2">{agent.email}</Typography>
            </Box>
            <Box>
                {
                    agent.agentStatus === "accepted" && (<Button
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                        component={Link}
                        to={`/agents/${agent.id}`}
                    >
                        View Profile
                    </Button>)
                }   
            </Box>

            {
                agent.agentStatus === "pending" && (
                    <Box mt={2} display="flex" justifyContent="space-between" gap={1}>
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            startIcon={<CheckCircleIcon />}
                            onClick={() => {
                                agencyApi.changeAgentStatus(agent.id, "accepted").then(res => console.log(res))
                                refreshAgents();
                                nav('/')
                            }}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            startIcon={<CancelIcon />}
                            onClick={() => {
                                agencyApi.changeAgentStatus(agent.id, "rejected").then(res => console.log(res))
                                refreshAgents();
                                nav('/')
                            }}
                        >
                            Reject
                        </Button>
                    </Box>
            )}

        </Card>
    )
}

export default AgentCard

