// Update BadgeAward.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Stack, Typography, FormControl, Select, 
  MenuItem, Button, CircularProgress, Alert, 
  Paper, Divider
} from '@mui/material';
import DashHeader from '../../../components/TeacherDashboard/DashHeader';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const BadgeAward = () => {
  const [students, setStudents] = useState([]);
  const [badges, setBadges] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('');
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    Promise.all([fetchStudents(), fetchBadges()])
      .finally(() => setFetchingData(false));
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/teacher/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setMessage({ text: 'Error fetching students', type: 'error' });
    }
  };

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/teacher/badges');
      const data = await response.json();
      setBadges(data);
    } catch (error) {
      setMessage({ text: 'Error fetching badges', type: 'error' });
    }
  };

  const handleAwardBadge = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/teacher/award-badge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: selectedStudent,
          badge_id: selectedBadge,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        setSelectedStudent('');
        setSelectedBadge('');
      } else {
        setMessage({ text: data.error, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error awarding badge', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box spacing={5}>
      <Stack 
  direction="column" 
  justifyContent="center" 
  alignItems="center"
  spacing={3}
    
>
  <DashHeader title="Award Badge"  />
  <Typography variant="subtitle1" color="text.secondary" fontStyle={'italic'} >
    Recognize student achievements
  </Typography>
</Stack>

      <Paper elevation={3} sx={{ mt: 10, maxWidth: 600, mx: 'auto', p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EmojiEventsIcon sx={{ fontSize: 40, color: '#ff9800', mr: 2 }} />
          <Typography variant="h5" component="h2">
            Award New Badge
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {message.text && (
          <Alert 
            severity={message.type} 
            sx={{ mb: 3 }}
            onClose={() => setMessage({ text: '', type: 'success' })}
          >
            {message.text}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select Student
          </Typography>
          <Select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">
              <em>Choose a student</em>
            </MenuItem>
            {students.map((student) => (
              <MenuItem key={student.student_id} value={student.student_id}>
                {student.name} ({student.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select Badge
          </Typography>
          <Select
            value={selectedBadge}
            onChange={(e) => setSelectedBadge(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">
              <em>Choose a badge</em>
            </MenuItem>
            {badges.map((badge) => (
              <MenuItem key={badge.badge_id} value={badge.badge_id}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography>{badge.badge_name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {badge.badge_description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          onClick={handleAwardBadge}
          disabled={!selectedStudent || !selectedBadge || loading}
          sx={{
            bgcolor: '#ff9800',
            '&:hover': { bgcolor: '#f57c00' },
            height: 48
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Award Badge'
          )}
        </Button>
      </Paper>
    </Box>
  );
};

export default BadgeAward;
