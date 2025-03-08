import React, { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Heading, Input, Button, VStack, Text, Select, IconButton } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

import Logout from './Logout';
import api from './api';
import { Sidebar } from './Sidebar';
import { useNavigate } from 'react-router-dom';


const JobList =()=> {
  const [jobs, setJobs] = useState([]);  // All fetched jobs
  const [filteredJobs, setFilteredJobs] = useState([]);  // Jobs after filtering
  const [search, setSearch] = useState('');  // Search input
  const [jobType, setJobType] = useState('');  // Selected job type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // const [user, setUser] = useState(null); // To handle user data from backend

  useEffect(() => {
    
    const fecthJobs = async () => {

      try {
        const response = await api.get('/apis/jobs/');
        console.log(response.data);
        setJobs(response.data);
        setFilteredJobs(response.data);
        setLoading(false);
      }

      catch {
        setError('Unauthorized entry please login..');
        setLoading(false);
      }
    }
    
    fecthJobs();

  }, []);

  //handle Apply when submit

  const handleSubmit = (jobid) => {
    navigate(`/applyjob/${jobid}`);

  }

  // Filter jobs based on search text and job type
  const filterJobs = () => {
    const filtered = jobs.filter(job => {
      return (
        (job.title.toLowerCase().includes(search.toLowerCase()) || 
         job.company.toLowerCase().includes(search.toLowerCase())) &&
        (jobType ? job.job_type === jobType : true)
      );
    });
    setFilteredJobs(filtered);  // Update the filtered jobs
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    filterJobs();  // Reapply the filter whenever the search query changes
  };

  // Handle job type change
  const handleJobTypeChange = (e) => {
    setJobType(e.target.value);
    filterJobs();  // Reapply the filter whenever the job type changes
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <Box
      p="5"
      mx="auto"
      maxW="xl"
      mt={16}>
      <Sidebar isactive={'S'} header={'List of jobs'} />
      
      {/* Search and Filter Section */}
      <VStack spacing={4} align="stretch" mb="6">
        <Input
          placeholder="Search for jobs (title or company)"
          value={search}
          onChange={handleSearchChange}  // Call filterJobs on change
        />
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <Select placeholder="Select Job Type" onChange={handleJobTypeChange}>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
            </Select>
          </GridItem>
          <GridItem>
            <IconButton
              icon={<SearchIcon />}
              aria-label="Search"
              colorScheme="teal"
              onClick={filterJobs}  // Apply the filter when button is clicked
              width="100%"
            />
          </GridItem>
        </Grid>
      </VStack>

      {/* Job Listings */}
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <GridItem key={job.id} p="5" borderWidth="2px" borderRadius="md" boxShadow="sm" >
              <Heading as="h3" size="lg" mb="2">{job.title}</Heading>
              <Text fontSize="md" mb="2" color="gray.600">Company: {job.company}</Text>
              <Text fontSize="md" mb="2" color="gray.600">Location: {job.location}</Text>
              <Text fontSize="md" mb="4" color="gray.600">Job Description: {job.job_description}</Text>
              <Text fontSize="md" mb="4" color="gray.600">Experience: {job.experience}</Text>
              <Text fontSize="md" mb="4" color="gray.600">Job type: {job.job_type}</Text>
              <Text fontSize="md" mb="4" color="gray.600">Salary: ${job.salary} per annum</Text>
              
              <Button colorScheme="teal" width="100%" onClick={() => handleSubmit(job.id) }>Apply Now</Button>
            </GridItem>
          ))
        ) : (
          <Text>No jobs found matching your criteria.</Text>
        )}
      </Grid>
      <Logout/>
    </Box>
  );
}

export default JobList;
