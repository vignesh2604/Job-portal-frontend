import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  VStack,
  HStack,
  Text,
  Tag,
  Avatar,
  Flex,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useBreakpointValue,
  useColorModeValue,
  Button
} from "@chakra-ui/react";
import api from "./api";

const JobSeekerProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await api.get("/users/getJobseekers/");
        console.log("API Response:", response.data); // Log the response to check
        // Check if response.data is an array
        if (Array.isArray(response.data.data)) {
          // Handle response and split skills into an array if it's an array
          const updatedProfiles = response.data.data.map(profile => ({
            ...profile,
            skills: profile.skills ? profile.skills.split(",").map(skill => skill.trim()) : [],
          }));
          setProfiles(updatedProfiles);
          const response2 = await api.get("/apis/jobsbyrecruiter/");
          console.log('Job data for recruiters: ', response2.data);
        } else {
          console.error("Expected an array, but got:", response.data);
        }
      } catch (error) {
        console.error("Error fetching job seekers:", error);
      }
    };

    fetchProfiles();
  }, []);

  const handleInterestedClick = async (profileId) => {
    try {
      const response = await api.post("/users/notify/", { job_seeker_id: profileId });
      toast({
        title: "Interest Expressed",
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Color mode handling
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const accordionBgColor = useColorModeValue("white", "gray.800");
  const accordionTextColor = useColorModeValue("gray.800", "white");
  const accordionBorderColor = useColorModeValue("gray.100", "gray.700");

  return (
    <VStack spacing={6} align="center" maxW="900px" mx="auto" p={4}>
      <Box width="100%" mb={4}>
        <Input
          placeholder="Search job seekers by name, skill, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mb={4}
          bg={useColorModeValue("white", "gray.800")}
          color={useColorModeValue("gray.800", "white")}
          borderColor={useColorModeValue("gray.300", "gray.600")}
          focusBorderColor="teal.500"
        />
      </Box>

      <Box width="100%" spacing={4} align="stretch">
        {filteredProfiles.length === 0 ? (
          <Text>No job seekers found matching your search criteria.</Text>
        ) : (
          filteredProfiles.map((profile) => (
            <Box
              key={profile.id}
              p={6}
              bg={accordionBgColor}
              borderRadius="lg"
              boxShadow="lg"
              mb={4}
              width="100%"
            >
              <Flex alignItems="center" mb={4}>
                <Avatar src={profile.photo} size="lg" mr={6} />
                <Box flex="1">
                  <Text fontSize="xl" fontWeight="bold" color={textColor}>
                    {profile.username}
                  </Text>
                  <Text fontSize="md" color="gray.500">{profile.location} | {profile.job_title}</Text>
                  <HStack mt={3} spacing={2} wrap="wrap">
                    {profile.skills.map((skill, index) => (
                      <Tag key={index} colorScheme="teal" borderRadius="full">
                        {skill}
                      </Tag>
                    ))}
                  </HStack>
                </Box>
                <Button colorScheme="teal" onClick={() => handleInterestedClick(profile.id)}>Interested</Button>
              </Flex>

              {/* Accordion for Additional Info */}
              <Accordion allowToggle>
                <AccordionItem>
                  <h2>
                    <AccordionButton
                      _expanded={{ bg: "teal.200", color: "black" }}
                      _focus={{ boxShadow: "none" }}
                    >
                      <Box flex="1" textAlign="left" fontSize="md" color={accordionTextColor}>
                        View Contact & More Info
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} bg={accordionBgColor} borderColor={accordionBorderColor}>
                    <Text fontSize="sm" color={accordionTextColor}><strong>Email:</strong> {profile.email}</Text>
                    <Text fontSize="sm" color={accordionTextColor}><strong>Company:</strong> {profile.company}</Text>
                    <Text fontSize="sm" color={accordionTextColor}><strong>Experience:</strong> {profile.experience} years</Text>
                    <Text fontSize="sm" color={accordionTextColor}><strong>Education:</strong> {profile.education}</Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          ))
        )}
      </Box>
    </VStack>
  );
};

export default JobSeekerProfiles;
