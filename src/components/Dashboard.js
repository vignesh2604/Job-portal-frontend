import React, { useEffect, useState } from "react";
import api from "./api";
import { Box, Text, useColorModeValue, VStack, Button, HStack, Divider } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // For redirecting to login page
import JobSeekerProfiles from "./JobSeekerProfiles";
import { formatDistanceToNow } from 'date-fns'; // For formatting dates

const Dashboard = () => {
  const [jobList, setJobList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileExisting, setIsProfileExisting] = useState(false);
  const [userType, setUserType] = useState('');
  const bg = useColorModeValue("gray.100", "gray.700");
  const navigate = useNavigate(); // For redirecting to login page

  const fetchJobs = async () => {
    try {
      const response = await api.get("/apis/displayappliedjobs/");
      setJobList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    console.log("user profile:", localStorage.getItem("userphoto"));
    // Check if user is logged in (based on token in localStorage, for example)
    const token = localStorage.getItem("accesstoken");
    const usertype = localStorage.getItem("usertype");
    setUserType(usertype);
    // If the token exists, check if the user profile exists
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`users/${usertype}/`);
        if (response.data) {
          setIsProfileExisting(true);
          fetchJobs();
        }
      } catch (error) {
        console.error("Error checking user profile:", error);
        setIsProfileExisting(false);
      }
    };

    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile(); // Check for the user profile existence
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const formatAppliedDate = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true }); // Show "X days ago"
  };

  if (!isLoggedIn) {
    return (
      <VStack spacing={4} align="center">
        <Box width="100%" maxWidth="700px" mx="auto">
          <Text align="center" fontSize="2xl" fontWeight="bold">
            You are not logged in. Please log in to see your applied jobs.
          </Text>
        </Box>
      </VStack>
    );
  }

  if (!isProfileExisting) {
    return (
      <VStack spacing={4} align="center" justify="center">
          <Box width="100%" maxWidth="700px" mx="auto" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold">
              Complete your profile to view your dashboard.
            </Text>
            <Box mt={4} display="flex" justifyContent="center" alignItems="center">
              <Button
                colorScheme="teal"
                size="lg"
                onClick={() => navigate("/account")}
              >
                Go to Account Page
              </Button>
            </Box>
          </Box>
      </VStack>
    );
  }

  if (isProfileExisting && userType === 'jobseeker') {
    return (
      <VStack spacing={4} align="center">
        <Box width="100%" maxWidth="700px" mx="auto">
          <Text align="center" fontSize="2xl" fontWeight="bold" mb={4}>
            Applied Jobs
          </Text>

          {jobList.length > 0 ? (
            jobList.map((job, index) => (
              <Box key={index} p={6} bg={bg} boxShadow="md" borderRadius="md" my={4}>
                <HStack justify="space-between">
                  <Text fontWeight="bold" fontSize="lg">{job.title}</Text>
                  <Text fontSize="sm" color="gray.500">{formatAppliedDate(job.applied_ts)}</Text>
                </HStack>
                <Text color="gray.500">{job.company} | {job.location}</Text>
                <Text mt={2}>{job.job_description}</Text>
                <Text mt={1} color="gray.500">{job.job_type}</Text>
                <Text mt={2}>Salary: {job.salary} LPA</Text>
                <Divider mt={4} />
              </Box>
            ))
          ) : (
            <Text>No applied jobs found.</Text>
          )}
        </Box>
      </VStack>
    );
  }

  // For recruiter
  if (isProfileExisting && userType === 'recruiter') {
    return <JobSeekerProfiles />;
  }
};

export default Dashboard;
