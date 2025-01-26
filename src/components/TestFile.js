import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  FormControl,
  FormLabel,
  Text,
  Button,
  Box,
  Input,
  VStack,
  Heading,
  useToast,
  Avatar,
  Image,
  HStack,
} from '@chakra-ui/react';

import { Sidebar } from './Sidebar';

import api from './api';

const Profile = () => {
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const toast = useToast();
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
        const { resume, photo, experience, company, location, job_title, education, skills } = response.data;

        setResume(resume);
        setPhoto(photo);
        setExperience(experience);
        setCompany(company);
        setLocation(location);
        setJobTitle(job_title);
        setEducation(education);
        setSkills(skills);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file));
      toast({
        title: 'Image selected',
        description: `Profile picture uploaded successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Invalid file type.',
        description: 'Please upload a valid image file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
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
    const updatedData = {
      resume: file,
      photo: selectedImage,
      experience,
      company,
      location,
      job_title: jobtitle,
      education,
      skills,
    };
    try {
      const id = localStorage.getItem('user_id');
      const usertype = localStorage.getItem('usertype');
      const response = await api.put(`users/${usertype}/${id}/`, updatedData);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: 'An error occurred while updating your profile.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <Box p="5" mx="auto" maxW="xl" mt={16}>
        <Sidebar isactive={'P'} header={'Account'} />
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <VStack spacing={4}>
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt="Profile Preview"
                  boxSize="150px"
                  objectFit="cover"
                  borderRadius="full"
                  border="2px solid teal"
                />
              ) : (
                <Avatar size="xl" src={photo} />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                display="none"
                id="profile-pic-input"
              />
              <HStack>
                <label htmlFor="profile-pic-input">
                  <Button as="span" colorScheme="teal">
                    Choose Image
                  </Button>
                </label>
              </HStack>
            </VStack>
            <FormControl>
              <FormLabel>Upload Your Resume</FormLabel>
              <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Experience</FormLabel>
              <Input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Company</FormLabel>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Job Title</FormLabel>
              <Input
                value={jobtitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Education</FormLabel>
              <Input
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Skills</FormLabel>
              <Input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </FormControl>
            <Button type="submit" colorScheme="teal">
              Update
            </Button>
          </VStack>
        </form>
      </Box>
    </ChakraProvider>
  );
};

export default Profile;
