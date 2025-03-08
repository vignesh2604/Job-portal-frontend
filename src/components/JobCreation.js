import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  VStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Select,
  Textarea,
  useColorModeValue,
  useToast, // Import useToast
} from "@chakra-ui/react";
import AsyncSelect from 'react-select/async-creatable';
import api from "./api";
import JobSearch from "./JobSearch";
import { useNavigate } from "react-router-dom";

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

const industryOptions = [
  { value: "Technology", label: "Technology" },
  { value: "Finance", label: "Finance" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Marketing", label: "Marketing" },
  { value: "Education", label: "Education" },
];

const JobCreationForm = () => {
  const [salary, setSalary] = useState(50000);
  const [experience, setExperience] = useState(2);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [industry, setIndustry] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  
  const navigate = useNavigate();
    
  // Adding the toast hook
  const toast = useToast();

  const handleSkillSelect = (selectedOption) => {
    if (!skills.some((skill) => skill.value === selectedOption.value)) {
      setSkills([...skills, selectedOption]);
    }
  };

  const handleEducationSelect = (selectedOption) => {
    if (!education.some((edu) => edu.value === selectedOption.value)) {
      setEducation([...education, selectedOption]);
    }
  };

  const handleIndustrySelect = (selectedOption) => {
    if (!industry.some((ind) => ind.value === selectedOption.value)) {
      setIndustry([...industry, selectedOption]);
    }
  };

  const handleRemove = (setState, value) => {
    setState((prevState) => prevState.filter((item) => item.value !== value));
  };

  const handleSubmit = async () => {
    const jobData = {
      title: jobTitle,
      experience: experience.toString(),
      company,
      industry: industry.map(i => i.label).join(', '),
      location,
      job_description: jobDescription,
      job_type: jobType,
      skills_preferred: skills.map(skill => skill.label).join(', '),
      education_preferred: education.map(edu => edu.label).join(', '),
      salary: salary,
    };

    try {
      const response = await api.post("/apis/jobs/", jobData); // Replace with your actual endpoint
      console.log("Job posted successfully:", response.data);

      // Show success toast
      toast({
        title: "Job Posted",
        description: "Your job has been posted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 2000); 
        
    } catch (error) {
      console.error("Error posting job:", error);

      // Show error toast if posting fails
      toast({
        title: "Error",
        description: "There was an error posting the job. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const formBg = useColorModeValue("white", "gray.700");
  const inputBg = useColorModeValue("gray.100", "gray.600");
  const inputColor = useColorModeValue("black", "white");
  const buttonColorScheme = useColorModeValue("teal", "blue");

  // Filter options based on input
  const filterOptions = (inputValue, options) => {
    return options.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  // Load options with a delay
  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterOptions(inputValue, [...skillsOptions, ...educationOptions, ...industryOptions]));
    }, 500);
  };

  return (
    <Box p={6} maxW="lg" mx="auto" boxShadow="lg" borderRadius="lg" bg={formBg}>
      <VStack spacing={4}>
        {/* Job Title */}    
        <FormControl>
          <FormLabel>Job Title</FormLabel>
          <Input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Enter job title"
            bg={inputBg}
            color={inputColor}
          />
        </FormControl>

        {/* Company */}
        <FormControl>
          <FormLabel>Company</FormLabel>
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company name"
            bg={inputBg}
            color={inputColor}
          />
        </FormControl>

        {/* Location */}
        <FormControl>
          <FormLabel>Location</FormLabel>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Job location"
            bg={inputBg}
            color={inputColor}
          />
        </FormControl>

        {/* Salary Slider */}
        <FormControl>
          <FormLabel>Salary (₹{salary})</FormLabel>
          <Slider min={10000} max={20000000} step={5000} value={salary} onChange={setSalary}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </FormControl>

        {/* Experience Slider */}
        <FormControl>
          <FormLabel>Experience (Years: {experience})</FormLabel>
          <Slider min={0} max={20} step={1} value={experience} onChange={setExperience}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </FormControl>

        {/* Job Description */}
        <FormControl>
          <FormLabel>Job Description</FormLabel>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Enter job description"
            size="md"
            bg={inputBg}
            color={inputColor}
          />
        </FormControl>

        {/* Job Type */}
        <FormControl>
          <FormLabel>Job Type</FormLabel>
          <Select value={jobType} onChange={(e) => setJobType(e.target.value)} bg={inputBg} color={inputColor}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </Select>
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
            bg={inputBg}
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

        {/* Education Preferred */}
        <FormControl>
          <FormLabel>Education Preferred</FormLabel>
          <AsyncSelect
            cacheOptions
            loadOptions={loadOptions} // Pass loadOptions directly here
            defaultOptions={educationOptions}
            onChange={handleEducationSelect}
            placeholder="Search and add education..."
            bg={inputBg}
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

        {/* Industry */}
        <FormControl>
          <FormLabel>Industry</FormLabel>
          <AsyncSelect
            cacheOptions
            loadOptions={loadOptions} // Pass loadOptions directly here
            defaultOptions={industryOptions}
            onChange={handleIndustrySelect}
            placeholder="Search and add industry..."
            bg={inputBg}
          />
          <Box mt={2}>
            {industry.map((ind) => (
              <Tag key={ind.value} m={1} size="md" variant="solid" colorScheme="purple">
                <TagLabel>{ind.label}</TagLabel>
                <TagCloseButton onClick={() => handleRemove(setIndustry, ind.value)} />
              </Tag>
            ))}
          </Box>
        </FormControl>

        {/* Post Job Button */}
        <Button colorScheme="teal" width="full" onClick={handleSubmit}>
          Post Job
        </Button>
      </VStack>
    </Box>
  );
};

export default JobCreationForm;
