import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  ChakraProvider,
  Box,
  Button,
  Input,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  useToast,
} from "@chakra-ui/react";

// To navigate to home page after succesful login
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";


const BASE_URL = "http://localhost:8000";


function Login() {

  const toast = useToast();

  const navigate = useNavigate();

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
    <ChakraProvider>
      <Box
        maxW="md"
        mx="auto"
        mt="100px"
        p="6"
        borderRadius="md"
        boxShadow="lg"
        bg="white"
      >
        <Heading as="h2" size="lg" textAlign="center" mb="6">
          Login
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            {/* Email Input */}
            {/* <FormControl isInvalid={errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
            </FormControl> */}

            {/* Username */}
            <FormControl isInvalid={errors.username}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...register("username", {
                  required: "username is required",
                  minLength: {
                    value: 3,
                    message: "username is too short",
                  },
                })}
              />
              <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
            </FormControl>
            
            {/* Password Input */}
            <FormControl isInvalid={errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
            </FormControl>
            {/* Display error from backend if any, */}
            {error && <Alert status="error">{ error }</Alert>}
            {/* Submit Button */}
            <Button colorScheme="teal" width="100%" mt="4" type="submit">
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </ChakraProvider>
  );
}

export default Login;
