import React, { useState } from 'react';
import {
  ChakraProvider,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  VStack,
  Box,
  Heading,
  useToast,
} from '@chakra-ui/react';

import { Sidebar } from './Sidebar';

import api from './api';
import { useParams } from 'react-router-dom';

const ApplyJob = () => {

  const { id } = useParams(); 

  const toast = useToast();

  const [resume, setResume] = useState(null);   
  const [email, setEmail] = useState('');  
  const [experience, setExperience] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [education, setEducation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobData = {
      jobinfo: id,    
      resume: null,
      email,
      experience,
      current_company: company,
      current_location: location,
      current_job_title: title,
      current_education: education,
    };

    try {
      const response = await api.post('apis/apply/', jobData);
      toast({
        title: 'Job Created',
        description: 'The job was successfully created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      console.log('Response:', response.data);

      // Clear the form after submission
      setTitle('');
      setExperience('');
      setCompany('');
      setLocation('');
      setEducation('');
      setEmail('');
      setResume(null);  
    } catch (error) {
      console.error('Error creating job:', error.response.data);
      toast({
        title: 'Error',
        description: 'There was an error creating the job.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <Box p="5" mx="auto" maxW="xl" mt={16}>
        <Sidebar isactive={'CJ'} header={"Create job"} />
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} mt={4}>
            <FormControl isRequired>
              <FormLabel>Current Job Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter job title"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
                <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Current Experience</FormLabel>
              <Input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Enter experience required (e.g., 2-4 years)"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Current Company</FormLabel>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enter company name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Current Location</FormLabel>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter job location"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Highest level of Education</FormLabel>
              <Input
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Enter required education"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Current Salary</FormLabel>
              <Input
                placeholder="Enter CTC (p.a)"
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" width="full">
              Create Job
            </Button>
          </VStack>
        </form>
      </Box>
    </ChakraProvider>
  );
};

export default ApplyJob;
