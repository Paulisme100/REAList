import {Card, CardContent, Typography, Avatar, Box, Button, Stack } from "@mui/material"
import { useNavigate, Link } from "react-router-dom"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import agencyApi from "../../fetches/agency/agencyApi";

const AgentCard = ({agent, refreshAgents}) => {

    const nav = useNavigate()

    return(
        <Card elevation={2} sx={{padding: 2}}>
            <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ width: 56, height: 56 }}>
                    {agent.name.charAt(0).toUpperCase()}
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

