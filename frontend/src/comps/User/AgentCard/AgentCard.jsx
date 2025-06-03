import {Card, CardContent, Typography, Avatar, Box, Button } from "@mui/material"
import { Link } from "react-router-dom"

const AgentCard = ({agent}) => {

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
                <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    component={Link}
                    to={`/agents/${agent.id}`}
                >
                    View Profile
                </Button>
            </Box>

        </Card>
    )
}

export default AgentCard

