import React, { useEffect, useState } from "react";
import {
  Box, Input, VStack, Text, Button,
  useColorModeValue, IconButton, Tooltip, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, useDisclosure, Select, Switch,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import JobCreationForm from "./JobCreation";
import api from "./api";
import { useNavigate } from "react-router-dom";

const JobSearch = () => {
  const [checked, setChecked] = useState(false); // to see personalised recommendation
  const [checked2, setChecked2] = useState(false); // to see the list of jobs posted by a recruiter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobType, setSelectedJobType] = useState(""); // Job Type filter
  const [selectedLocation, setSelectedLocation] = useState(""); // Location filter
  const [selectedSalary, setSelectedSalary] = useState(null); // Salary filter (store as object with min/max)
  const [selectedCompany, setSelectedCompany] = useState(""); // Company filter
  const [selectedIndustry, setSelectedIndustry] = useState(""); // Industry filter
  const [jobList, setJobList] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const bg = useColorModeValue("gray.100", "gray.700");
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal controls
  const navigate = useNavigate();
  const usertype = localStorage.getItem("usertype");

  // Fetch jobs and filter data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobResponse = await api.get('/apis/jobs/');
        setJobList(jobResponse.data);

        // Fetch filter options from API
        const filtersResponse = await api.get('/apis/filters/');
        setJobTypes(filtersResponse.data.jobTypes);
        setLocations(filtersResponse.data.locations);
        setSalaryRanges(filtersResponse.data.salaryRanges);
        setIndustries(filtersResponse.data.industries);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch jobs posted by that particular recruiter
  useEffect(() => {
    const fetchJobsPostedbyRecruiter = async () => {
      if (checked2) {
        try {
          const Response = await api.get('/apis/jobsbyrecruiter/');
          console.log("List of jobs posted by the recruiter:", Response.data);
          setJobList(Response.data); // Update job list with personalized recommendations
        }
        catch (error) {
          console.error("Error fetching jobs posted by the recruiter:", error);
        }
      }
      else {
        // Fetch all jobs if the switch is off
        const Response = await api.get('/apis/jobs/');
        setJobList(Response.data);
      }
    };
    fetchJobsPostedbyRecruiter();
  }, [checked2]);  
    
  // Fetch personalized recommendations when switch is toggled
  useEffect(() => {
    const fetchPersonalizedRecommendations = async () => {
      if (checked) {
        try {
          const Response = await api.get('/apis/jobrecommendation/');
          const { recommended_jobs } = Response.data;
          console.log("Recommended jobs:", recommended_jobs);
          setJobList(recommended_jobs); // Update job list with personalized recommendations
        }
        catch (error) {
          console.error("Error fetching personalized recommendations:", error);
        }
      }
      else {
        // Fetch all jobs if the switch is off
        const Response = await api.get('/apis/jobs/');
        setJobList(Response.data);
      }
    };
    fetchPersonalizedRecommendations();
  }, [checked]);


  const handleApplicantList = (job) => {
    if (usertype==='recruiter') {
      navigate('/applicantList', {
        state: {
          jobTitle: job.title,
          companyName: job.company,
          jobId: job.id,
          jobSeekers: job.jobseekers,
        }
      })
    }
  }

  const handleApplyJob = (job) => {
    if (usertype) {
      navigate('/applyjobs', {
        state: {
          jobTitle: job.title,
          companyName: job.company,
          jobId: job.id
        }
      });
    } else {
      onOpen(); // Show login modal if not logged in
    }
  };

  // Handle filtering jobs based on selected filters
  const filteredJobs = jobList.filter((job) => {
    const isJobInSalaryRange =
      selectedSalary &&
      job.salary >= selectedSalary.min &&
      job.salary <= selectedSalary.max;

    return (
      (job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedJobType ? job.job_type === selectedJobType : true) &&
      (selectedLocation ? job.location === selectedLocation : true) &&
      (selectedSalary ? isJobInSalaryRange : true) &&
      (selectedCompany ? job.company === selectedCompany : true) &&
      (selectedIndustry ? job.industry === selectedIndustry : true)
    );
  });

  // Date format handling
  const formatDate = (createdTs) => {
    const postDate = new Date(createdTs);
    const today = new Date();
  
    // Check if the date is today
    const isToday = postDate.toDateString() === today.toDateString();
  
    if (isToday) {
      return "Posted today";
    } else {
      // Format the date as "Posted on 23rd Feb"
      const options = { day: 'numeric', month: 'short' };
      const formattedDate = postDate.toLocaleDateString('en-GB', options); // 'en-GB' gives '23 Feb' format
      return `Posted on ${formattedDate}`;
    }
  };
  
  

  return (
    <VStack spacing={4} align="center" bg={bg} py={6}>
      {/* Search Bar */}
      {!isFormVisible && (
        <Box width="100%" maxWidth="700px" mx="auto">
          <Input
            placeholder="Search for a job title, company, or location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="lg"
            borderRadius="md"
            boxShadow="sm"
            mb={4}
            _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.6)" }}
          />

          {/* Filter Dropdowns */}
          <Box width="100%" maxWidth="700px" mx="auto" mt={4} display="flex" justifyContent="space-between" flexWrap="wrap" gap="4">
            <Select
              placeholder="Select Job Type"
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              size="lg"
              width="48%"
              mb={4}
              _focus={{ borderColor: "teal.500" }}
            >
              {jobTypes.map((jobType) => (
                <option key={jobType} value={jobType}>
                  {jobType}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Select Location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              size="lg"
              width="48%"
              mb={4}
              _focus={{ borderColor: "teal.500" }}
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Select Salary Range"
              value={selectedSalary ? selectedSalary.max : ""}
              onChange={(e) => {
                const selectedSalaryValue = e.target.value;
                const selectedSalaryRange = salaryRanges.find(
                  (range) => range.max === parseInt(selectedSalaryValue)
                );
                setSelectedSalary(selectedSalaryRange || null); // Set selected salary range
              }}
              size="lg"
              width="48%"
              mb={4}
              _focus={{ borderColor: "teal.500" }}
            >
              {salaryRanges.map((salary) => (
                <option key={salary.max} value={salary.max}>
                  {salary.min} LPA - {salary.max} LPA
                </option>
              ))}
            </Select>

            <Select
              placeholder="Select Industry"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              size="lg"
              width="48%"
              mb={4}
              _focus={{ borderColor: "teal.500" }}
            >
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </Select>
          </Box>

          {/* Personalized Recommendations Switch */}
          {usertype === "jobseeker" && (
          <Box mt={4} display="flex" justifyContent="space-between" alignItems="center" width="100%" maxWidth="700px" mx="auto">
            <Text fontSize="lg" fontWeight="bold">Personalized Recommendations</Text>
            <Switch
              isChecked={checked}
              onChange={() => setChecked(!checked)}
              size="lg"
              colorScheme="teal"
            />
          </Box>)}

          {/* SHow jobs posted by recruiter */}
          {usertype === "recruiter" && (
          <Box mt={4} display="flex" justifyContent="space-between" alignItems="center" width="100%" maxWidth="700px" mx="auto">
            <Text fontSize="lg" fontWeight="bold">Show jobs posted by me</Text>
            <Switch
              isChecked={checked2}
              onChange={() => setChecked2(!checked2)}
              size="lg"
              colorScheme="teal"
            />
          </Box>)}        

          {/* Job Listings */}
          <Box width="100%" maxWidth="700px" mx="auto" mt={6}>
            {filteredJobs.length > 0 ? (
              <Accordion allowToggle>
                {filteredJobs.map((job, index) => (
                  <AccordionItem key={index}>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Text fontWeight="bold" fontSize="lg" color="teal.600">{job.title}</Text>
                          <Text color="gray.500">{job.company} | {job.location}</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>

                    <AccordionPanel pb={4}>
                      <Text mt={2}>{job.job_description}</Text>
                      <Text mt={1} color="gray.500">{job.job_type}</Text>
                      <Text mt={2}>Skills preferred: {job.skills_preferred}</Text>
                      <Text mt={2}>Educational Qualification: {job.education_preferred}</Text>
                      <Text mt={2}>Salary: ₹ {job.salary} LPA</Text>
                      <Text mt={1}>{formatDate(job.created_ts)}</Text>
                      {usertype !== 'recruiter' &&
                        <Button
                          mt={4}
                          colorScheme="blue"
                          size="sm"
                          onClick={() => handleApplyJob(job)}
                          _hover={{ bg: "blue.500", transform: "scale(1.05)" }}
                        >
                          Apply
                        </Button>}
                        {(usertype === 'recruiter' && checked2) &&
                        <Button
                          mt={4}
                          colorScheme="blue"
                          size="sm"
                          onClick={() => handleApplicantList(job)}
                          _hover={{ bg: "blue.500", transform: "scale(1.05)" }}
                        >
                          View applicants
                        </Button>}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Text>No jobs found with the selected filters.</Text>
            )}
          </Box>
        </Box>)}

      {/* Floating Icon for Create Job (for recruiters only) */}
      {usertype === "recruiter" && (
        <Tooltip label="Create a Job" fontSize="md">
          <IconButton
            icon={<AddIcon />}
            aria-label="Create a Job"
            position="fixed"
            bottom="30px"
            right="30px"
            borderRadius="full"
            boxShadow="lg"
            colorScheme="teal"
            size="lg"
            _hover={{ bg: "teal.500", transform: "scale(1.1)" }}
            onClick={() => setIsFormVisible(true)} // Show the job creation form when clicked
          />
        </Tooltip>
      )}

      {/* Conditional Rendering of Job Creation Form */}
      {isFormVisible && (
        <Box mt={6} width="100%" maxWidth="500px" mx="auto">
          <JobCreationForm onJobPosted={() => setIsFormVisible(false)} />
          <Button
            colorScheme="red"
            width="100%"
            mt={4}
            onClick={() => setIsFormVisible(false)}
          >
            Cancel
          </Button>
        </Box>
      )}

      {/* Modal for Login or Sign up */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login or Sign Up</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>To apply for a job, you need to be logged in. Please log in or sign up.</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => navigate('/')}>
              Login
            </Button>
            <Button variant="ghost" onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default JobSearch;
