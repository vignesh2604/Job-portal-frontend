import React, { useState } from "react";
import {
    Alert, Box, FormControl, FormLabel, FormErrorMessage,
    Input, Button, useColorModeValue, Heading,
    VStack, Text, useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; 
import { useForm } from "react-hook-form";

const SignIn = ({onLogin}) => {
  const bg = useColorModeValue("gray.100", "gray.900");
  const buttonColor = useColorModeValue("blue.500", "blue.300");
  const toast = useToast();
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8000";  
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  
  // Form submission handler
  const onSubmit = async(data) => {

    try {
        const response = await axios.post(BASE_URL + "/api/token/", data);
        const { refresh, access } = response.data;
        localStorage.setItem('accesstoken', access);
        localStorage.setItem('refreshtoken', refresh);
        localStorage.setItem('current_user', data.username);
        toast({
          title: 'Login success',
          description: `User logged in sucessfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate('/home');
        }, 2000);  
    }

    catch (error) {
      if (error.response) {
        console.log("Login error response from backend:",Object.values(error.response.data)[0]);
        setError(Object.values(error.response.data)[0]);
      }
      else {
        console.log(error);
        setError(error.message);
      }
    }
    console.log(data);
  };

  return (
    <Box bg={bg} minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
      <Box p={8} bg={useColorModeValue("white", "gray.800")} borderRadius="md" boxShadow="md" width="400px">
        <Heading as="h2" size="lg" textAlign="center" mb={6}>
          Login
        </Heading>
        <VStack spacing={4} align="stretch">
          {/* Username Input */}
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              size="lg"
              bg={useColorModeValue("gray.50", "gray.700")}
            />
          </FormControl>

          {/* Password Input */}
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              size="lg"
              bg={useColorModeValue("gray.50", "gray.700")}
            />
          </FormControl>

          {/* Sign In Button */}
          <Button
            buttonColor={buttonColor}
            colorScheme="blue"
            size="lg"
            onClick={handleSignIn}
            mt={4}
            isFullWidth
          >
            Sign In
          </Button>

          {/* Sign Up Link */}
          <Text mt={4} textAlign="center">
            Don't have an account?{" "}
            <Button variant="link" colorScheme="blue" onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default SignIn;
