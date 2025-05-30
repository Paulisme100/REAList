import {Card, CardContent, Typography, Avatar, Box } from "@mui/material"

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

        </Card>
    )
}

export default AgentCard

