import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import LineChart from '../lineChart/Line.jsx';
import BarChart from '../barChart/bar.jsx';

const Row3 = () => {
    const theme = useTheme();
    return (
        <Stack gap={1.5} direction={'row'} flexWrap={'wrap'} mt={1.4}>
            <Paper sx={{ flexGrow: 1, minWidth: '500px', width: '33%' }}>
                <Typography
                    color={theme.palette.secondary.main}
                    sx={{ padding: '30px 30px 0 30px' }}
                    variant="h6"
                >
                    Engagement Metrics
                </Typography>
                <LineChart isDashboard={true} />
                <Typography variant="body2" px={0.7} pb={3} align="center">
                    Live session attendance rates over time.
                </Typography>
            </Paper>

            {/* Assessment Performance */}
            <Paper sx={{ flexGrow: 1, minWidth: '500px', width: '33%' }}>
                <Typography
                    color={theme.palette.secondary.main}
                    variant="h6"
                    sx={{ padding: '30px 30px 0 30px' }}
                >
                    Assessment Performance
                </Typography>
                <BarChart isDashboard={true} />
            </Paper>

        </Stack>
    );
};

export default Row3;
