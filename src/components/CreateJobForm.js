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

const CreateJobForm = () => {
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobType, setJobType] = useState('');
  const [skillsPreferred, setSkillsPreferred] = useState('');
  const [education, setEducation] = useState('');
  const [salary, setSalary] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobData = {
      title,
      experience,
      company,
      location,
      job_description: jobDescription,
      job_type: jobType,
      skills_preferred: skillsPreferred,
      education,
      salary,
    };

    try {
      const response = await api.post('apis/jobs/', jobData);
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
      setJobDescription('');
      setJobType('');
      setSkillsPreferred('');
      setEducation('');
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
              <FormLabel>Job Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter job title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Experience</FormLabel>
              <Input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Enter experience required (e.g., 2-4 years)"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Company</FormLabel>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enter company name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter job location"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Job Description</FormLabel>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter job description"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Job Type</FormLabel>
              <Select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                placeholder="Select job type"
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Skills Preferred</FormLabel>
              <Input
                value={skillsPreferred}
                onChange={(e) => setSkillsPreferred(e.target.value)}
                placeholder="Enter preferred skills (comma-separated)"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Education</FormLabel>
              <Input
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Enter required education"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Salary</FormLabel>
              <Input
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
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

export default CreateJobForm;
