import { Box, Heading, Text, VStack, Input, Textarea, Button, Container, HStack, Icon } from "@chakra-ui/react";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const ContactPage =()=>{
  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="center" textAlign="center">
        <Heading size="2xl" color="teal.500">Contact Us</Heading>
        <Text fontSize="lg" color="gray.600">
          Have any questions? Reach out to us, and we'll get back to you as soon as possible.
        </Text>

        {/* Contact Details Section */}
        <VStack spacing={4} align="start" w="full" bg="gray.100" p={6} borderRadius="lg" shadow="md">
          <HStack>
            <Icon as={MdEmail} color="teal.500" boxSize={6} />
            <Text fontSize="md" color="gray.700">support@jobportal.com</Text>
          </HStack>
          <HStack>
            <Icon as={MdPhone} color="teal.500" boxSize={6} />
            <Text fontSize="md" color="gray.700">+91 9789225837</Text>
          </HStack>
          <HStack>
            <Icon as={MdLocationOn} color="teal.500" boxSize={6} />
            <Text fontSize="md" color="gray.700">Chennai, India</Text>
          </HStack>
        </VStack>
      </VStack>
    </Container>
  );
}

export default ContactPage;