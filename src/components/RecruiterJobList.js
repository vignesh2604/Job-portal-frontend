import React from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  VStack,
  Text,
  useToast,
  Avatar,
  HStack,
  Button,
  Tag,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
  useColorModeValue,
  Spacer,
} from "@chakra-ui/react";

import api from "./api";

const RecruiterJobList = () => {
  const datalocation = useLocation();
  const { jobTitle, companyName, jobSeekers } = datalocation.state || {};
  const toast = useToast();

  console.log("Jobseekers list:", jobSeekers);

  // Color mode handling
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const accordionBgColor = useColorModeValue("white", "gray.800");
  const accordionTextColor = useColorModeValue("gray.800", "white");
  const accordionBorderColor = useColorModeValue("gray.100", "gray.700");

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

  // Search filtering
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredJobSeekers = jobSeekers?.filter((seeker) =>
    seeker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seeker.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderJobSeekers = () => {
    if (!filteredJobSeekers || filteredJobSeekers.length === 0) {
      return <Text>No applicants found.</Text>;
    }

    return filteredJobSeekers.map((seeker, index) => {
      // Ensure seeker.skills is an array
      const skillsArray = Array.isArray(seeker.skills) ? seeker.skills : seeker.skills.split(',').map(skill => skill.trim());

      return (
        <Box
          key={index}
          p={6}
          bg={accordionBgColor}
          borderRadius="lg"
          boxShadow="lg"
          mb={4}
          width="100%"
        >
          <HStack align="center" mb={4} spacing={4} width="100%">
            <Avatar src={seeker.photo} size="lg" />

            <Box flex="1">
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                {seeker.name}
              </Text>
              <Text fontSize="md" color="gray.500">
                {seeker.location} | {seeker.job_title}
              </Text>
            </Box>

            <Spacer /> {/* Pushes button to the right */}

            <Button colorScheme="teal" onClick={() => handleInterestedClick(seeker.id)}>
              Interested
            </Button>
          </HStack>

          <HStack mt={3} spacing={2} wrap="wrap">
            {skillsArray.map((skill, idx) => (
              <Tag key={idx} colorScheme="teal" borderRadius="full">
                {skill}
              </Tag>
            ))}
          </HStack>

          {/* Accordion for Additional Info */}
          <Accordion allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton _expanded={{ bg: "teal.200", color: "black" }} _focus={{ boxShadow: "none" }}>
                  <Box flex="1" textAlign="left" fontSize="md" color={accordionTextColor}>
                    View Contact & More Info
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} bg={accordionBgColor} borderColor={accordionBorderColor}>
                <Text fontSize="sm" color={accordionTextColor}><strong>Email:</strong> {seeker.email}</Text>
                <Text fontSize="sm" color={accordionTextColor}><strong>Experience:</strong> {seeker.experience} years</Text>
                <Text fontSize="sm" color={accordionTextColor}><strong>Education:</strong> {seeker.education}</Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      );
    });
  };

  return (
    <VStack spacing={6} align="center" maxW="900px" mx="auto" p={4}>
      <Box width="100%" mb={4}>
        <Input
          placeholder="Search applicants by name or skill..."
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
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Applicants for {jobTitle} at {companyName}
        </Text>
        {renderJobSeekers()}
      </Box>
    </VStack>
  );
};

export default RecruiterJobList;
