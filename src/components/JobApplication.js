import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  Text,
  Button,
  Box,
  Input,
  VStack,
  useToast,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import api from './api';
import { useNavigate, useLocation } from "react-router-dom";

const JobApplication = () => {
   
  const datalocation = useLocation();
  const navigate = useNavigate();
  // Retrieve the job title and company name from the state
  const { jobTitle, companyName, jobId } = datalocation.state || {};

  console.log("Job details:",datalocation.state);

  const [file, setFile] = useState(null);
  const [isProfileExisting, setIsProfileExisting] = useState(false);
  const toast = useToast();
  const [name, setName] = useState(localStorage.getItem("username"));
  const [email, setEmail] = useState(localStorage.getItem("useremail"));
  const [resume, setResume] = useState('');
  const [photo, setPhoto] = useState('');
  const [experience, setExperience] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [jobtitle, setJobTitle] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const usertype = localStorage.getItem('usertype');
        const response = await api.get(`users/${usertype}/`);
        
        if (response.data) {
          setIsProfileExisting(true);
          const { resume, photo, experience, company, location, job_title, education, skills } = response.data;
          setResume(resume);
          setPhoto(photo);
          setExperience(experience);
          setCompany(company);
          setLocation(location);
          setJobTitle(job_title);
          setEducation(education);
          setSkills(skills);
          console.log('get response' + response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setIsProfileExisting(false); // Profile doesn't exist
        } else {
          console.error('Error fetching profile data:', error);
        }
      }
    };
    fetchProfileData();
  }, []);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResume(selectedFile.name);
      toast({
        title: 'File selected',
        description: `${selectedFile.name} uploaded successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    if (file) formData.append("resume", file);  // Append resume file
    formData.append("experience", experience);
    formData.append("company", company);
    formData.append("location", location);
    formData.append("job_title", jobtitle);
    formData.append("education", education);
    formData.append("skills", skills);
    formData.append("jobinfo", jobId); // particular job id
    formData.append("email",email);
    console.log('photo::' + photo);
    console.log('Resume::' +file);  
      
    try {
      const response = await api.post('/apis/apply/', formData);
      console.log("response from server for job application", response.data);
      toast({
        title: 'Job Application',
        description: `Applied successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setTimeout(() => {
        navigate('/home');
      }, 2000);

    }
    catch (error) {
      console.log("Error response from server", Object.values(error.response.data)[0]);
      toast({
        title: "Error",
        description: `${Object.values(error.response.data)[0]}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
};

  return (
      <Box p="5" mx="auto" maxW="xl" mt={16}>
        <Box 
            spacing={2} 
            align="center" 
            bg={useColorModeValue("blue.400", "blue.600")} // A blue color that adapts to light and dark mode
            p={3} // Padding for better spacing
            borderRadius="md" // Rounded corners
            boxShadow="lg" // Soft shadow for a more polished look
            maxWidth="500px" // Max width to avoid too wide a box
            mx="auto" // Center the box horizontally
            >
            <Text fontSize="2xl" fontWeight="bold" color="white">
                Apply for Job: {jobTitle} at {companyName}
            </Text>
        </Box>
        <br/>
        <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input type='text' value={name}
              onChange={(e) => setName(e.target.value)} required/>
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type='email' value={email}
              onChange={(e) => setEmail(e.target.value)} required/>
            </FormControl>
            <FormControl>
                <FormLabel>Upload Your Resume</FormLabel>
                  <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                    {/* Display the selected file name */}
                    {resume && (
                      <Box mt={2} fontSize="sm" color="gray.600">
                        <strong>Selected Resume: <a href={resume}>{resume.split('/').pop()}</a></strong>
                      </Box>
                    )}
            </FormControl>
            <FormControl>
              <FormLabel>Experience</FormLabel>
                <Input
                required
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Company</FormLabel>
                <Input
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Location</FormLabel>
                <Input
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Job Title</FormLabel>
                <Input
                required
                value={jobtitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Education</FormLabel>
                <Input
                required
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Skills</FormLabel>
                <Input
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </FormControl>
            <HStack>
              <Button type="submit" colorScheme="teal">
                Apply
              </Button>
              <Button onClick={()=>{navigate('/jobs')}} colorScheme="red">
                Cancel
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
  );
};

export default JobApplication;
