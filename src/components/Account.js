import React, { useEffect, useState } from 'react';
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tag,
  TagLabel,
  TagCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  HStack,
  VStack,
  useToast,
  Avatar,
  Image,
} from '@chakra-ui/react';
import AsyncSelect from 'react-select/async-creatable';
import api from './api';

const skillsOptions = [
  { value: "JavaScript", label: "JavaScript" },
  { value: "Python", label: "Python" },
  { value: "React", label: "React" },
  { value: "Django", label: "Django" },
  { value: "Node.js", label: "Node.js" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Data Science", label: "Data Science" },
];

const educationOptions = [
  { value: "Bachelor's Degree", label: "Bachelor's Degree" },
  { value: "Master's Degree", label: "Master's Degree" },
  { value: "PhD", label: "PhD" },
  { value: "Diploma", label: "Diploma" },
  { value: "High School", label: "High School" },
];

const locationOptions = [
  { value: "New York", label: "New York" },
  { value: "San Francisco", label: "San Francisco" },
  { value: "Los Angeles", label: "Los Angeles" },
  { value: "Chicago", label: "Chicago" },
  { value: "Austin", label: "Austin" },
  { value: "Seattle", label: "Seattle" },
  { value: "Boston", label: "Boston" },
];

const Account = () => {
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProfileExisting, setIsProfileExisting] = useState(false);
  const [photoFlag, setPhotoFlag] = useState(false);
  const toast = useToast();
  const [resume, setResume] = useState('');
  const [photo, setPhoto] = useState('');
  const [experience, setExperience] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState(null);
  const [jobtitle, setJobTitle] = useState('');
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]); // skills as an array

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const usertype = localStorage.getItem('usertype');
        const response = await api.get(`users/${usertype}/`);
        
        if (response.data) {
          setIsProfileExisting(true);
          const { resume, photo, experience, company, location, job_title, education, skills } = response.data;

          // Split skills string into an array
          setResume(resume);
          setPhoto(photo);
          setExperience(experience);
          setCompany(company);
          setLocation(location ? { value: location, label: location } : null);
          setJobTitle(job_title);
          setEducation(education ? education.split(',').map((edu) => ({ value: edu.trim(), label: edu.trim() })) : []);
          setSkills(skills ? skills.split(',').map((skill) => ({ value: skill.trim(), label: skill.trim() })) : []); // Convert comma-separated string to array
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        setPhoto(file); // Store the actual file
        setSelectedImage(URL.createObjectURL(file)); // For preview only
        setPhotoFlag(true);
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
    if (photo) {
      if (photoFlag) formData.append("photo", photo); // Append image file
    }
    if (file) formData.append("resume", file);  // Append resume file
    formData.append("experience", experience);
    formData.append("company", company);
    formData.append("location", location ? location.value : "");
    formData.append("job_title", jobtitle);
    // formData.append("education", education);
    formData.append("education", education.map(education => education.value).join(','));

    // Join skills array into a comma-separated string
    formData.append("skills", skills.map(skill => skill.value).join(','));

    try {
        const id = localStorage.getItem('user_id');
        const usertype = localStorage.getItem('usertype');

        let response;
        if (isProfileExisting) {
            // Update profile
            response = await api.put(`users/${usertype}/${id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast({
                title: 'Profile updated',
                description: 'Your profile has been successfully updated.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setTimeout(() => {
              window.location.reload(); // This will refresh the page after 3 seconds
            }, 3000); // 3000 milliseconds = 3 seconds
        } else {
            // Create profile
            response = await api.post(`users/${usertype}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast({
                title: 'Profile created',
                description: 'Your profile has been successfully created.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setIsProfileExisting(true);
            setTimeout(() => {
              window.location.reload(); // This will refresh the page after 3 seconds
            }, 3000); // 3000 milliseconds = 3 seconds
        }
        console.log('Server response:', response.data);
    } catch (error) {
        console.error('Error updating/creating profile:', error);
        toast({
            title: 'Error',
            description: 'The file type is either too big or the format is unsupported.',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
};

  const handleRemove = (setState, value) => {
    setState((prevState) => prevState.filter((item) => item.value !== value));
  };

  const handleSkillSelect = (selectedOption) => {
    if (selectedOption && !skills.some((skill) => skill.value === selectedOption.value)) {
      setSkills([...skills, selectedOption]); // Add selected skill to the array
    }
  };
  
  const handleEducationSelect = (selectedOption) => {
    if (selectedOption && !education.some((edu) => edu.value === selectedOption.value)) {
      setEducation([...education, selectedOption]);
    }
  };

  const handleLocationSelect = (selectedOption) => {
    setLocation(selectedOption); // Only one location can be selected
  };

  // Filter options based on input
  const filterOptions = (inputValue, options) => {
    return options.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  // Load options with a delay
  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterOptions(inputValue, [...skillsOptions, ...educationOptions]));
    }, 500);
  };

  return (
    <Box p="5" mx="auto" maxW="xl" mt={16}>
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
            {/* Display the selected file name */}
            {resume && (
              <Box mt={2} fontSize="sm" color="gray.600">
                <strong>Selected Resume: <a href={resume}>{resume.split('/').pop()}</a></strong>
              </Box>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Experience (Years: {experience})</FormLabel>
            <Slider min={0} max={20} step={1} value={experience} onChange={setExperience}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </FormControl>
          <FormControl>
            <FormLabel>Company</FormLabel>
            <Input
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </FormControl>
          {/* Location Select */}
          <FormControl>
            <FormLabel>Location</FormLabel>
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions}
              defaultOptions={locationOptions}
              onChange={handleLocationSelect}
              placeholder="Search and select a location..."
              isClearable // Allow clearing the location
            />
            <Box mt={2}>
              {location && (
                <Tag m={1} size="md" variant="solid" colorScheme="purple">
                  <TagLabel>{location.label}</TagLabel>
                  <TagCloseButton onClick={() => setLocation(null)} />
                </Tag>
              )}
            </Box>
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
          <FormLabel>Education Preferred</FormLabel>
          <AsyncSelect
            cacheOptions
            loadOptions={loadOptions} // Pass loadOptions directly here
            defaultOptions={educationOptions}
            onChange={handleEducationSelect}
            placeholder="Search and add education..."
          />
          <Box mt={2}>
            {education.map((edu) => (
              <Tag key={edu.value} m={1} size="md" variant="solid" colorScheme="green">
                <TagLabel>{edu.label}</TagLabel>
                <TagCloseButton onClick={() => handleRemove(setEducation, edu.value)} />
              </Tag>
            ))}
          </Box>
        </FormControl>
          {/* Required Skills */}
          <FormControl>
            <FormLabel>Required Skills</FormLabel>
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions} // Pass loadOptions directly here
              defaultOptions={skillsOptions}
              onChange={handleSkillSelect}
              placeholder="Search and add skills..."
            />
            <Box mt={2}>
              {skills.map((skill) => (
                <Tag key={skill.value} m={1} size="md" variant="solid" colorScheme="blue">
                  <TagLabel>{skill.label}</TagLabel>
                  <TagCloseButton onClick={() => handleRemove(setSkills, skill.value)} />
                </Tag>
              ))}
            </Box>
          </FormControl>
          <Button type="submit" colorScheme="teal">
            {isProfileExisting ? 'Update Profile' : 'Create Profile'}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Account;
