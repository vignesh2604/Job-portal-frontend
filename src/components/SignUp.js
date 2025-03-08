import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Box, FormControl, FormLabel, Input, Button, Text,
    Radio, RadioGroup, FormErrorMessage,HStack, Alert,
    useColorModeValue, Heading, VStack, useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
const SignUp = () => {

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const bg = useColorModeValue("gray.100", "gray.900");
  const buttonColor = useColorModeValue("blue.500", "blue.300");
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8000";  

  // Form submission handler
  const onSubmit = async(data) => {
    if (data.userType === "Jobseeker")
    {
      data['is_jobseeker'] = true;
      data['is_recruiter'] = false;
    }
    else
    {
      data['is_jobseeker'] = false;
      data['is_recruiter'] = true;
    }

    delete data['userType'];
    console.log(data);
    
    try {
      const response = await axios.post(BASE_URL + '/users/user/', data);
      console.log("Response from server:" + response.status);
      toast({
        title: 'Registration success',
        description: `Routing to login..`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // After successful registration, navigate to login
      setTimeout(() => {
      navigate('/');
    }, 2000); 
    }
    
    catch (error) {
      if (error.response) {
        console.log(Object.values(error.response.data)[0]);
        setError(Object.values(error.response.data)[0]);
      }
      else
      {
        console.error(error.message);
        setError(error.message);
      }
    }
  };


  return (
    <Box bg={bg} minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
      <Box p={8} bg={useColorModeValue("white", "gray.800")} borderRadius="md" boxShadow="md" width="400px">
        <Heading as="h2" size="lg" textAlign="center" mb={6}>
          User Registration
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={4}>
                    {/* Username Input */}
                    <FormControl isInvalid={errors.username}>
                      <FormLabel htmlFor="username">Username</FormLabel>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        {...register("username", {
                          required: "Username is required",
                        })}
                      />
                      <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
                    </FormControl>
        
                    {/* Email Input */}
                    <FormControl isInvalid={errors.email}>
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
        
                    {/* Confirm Password Input */}
                    <FormControl isInvalid={errors.confirm_password}>
                      <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
                      <Input
                        id="confirm_password"
                        type="password"
                        placeholder="Confirm your password"
                        {...register("confirm_password", {
                          required: "Confirm Password is required",
                          validate: (value) =>
                            value === watch("password") || "Passwords do not match",
                        })}
                      />
                      <FormErrorMessage>{errors.confirm_password && errors.confirm_password.message}</FormErrorMessage>
                    </FormControl>
                    {/* Radio button */}
                    <FormControl as='fieldset'>
                      <FormLabel as='legend'>User type</FormLabel>
                      <RadioGroup defaultValue="Jobseeker">
                        <HStack spacing='24px'>
                          <Radio value="Jobseeker" {...register("userType", { required: "Please select a user type" })}>Job seeker</Radio>
                          <Radio value="Recruiter" {...register("userType")}>Recruiter</Radio>
                        </HStack>
                      </RadioGroup>
                      <FormErrorMessage>{errors.userType && errors.userType.message}</FormErrorMessage>
                    </FormControl>
                    
                    {/* Submit Button */}
                    <Button buttonColor={buttonColor}
                            colorScheme="blue"
                            size="lg"
                            mt={4}
                            isFullWidth type="submit">
                      Register
                    </Button>
                    
                    {/* Display any error from backend while user registration */}
                    {error && <Alert status="error">{error}</Alert>}
                  {/* Sign Up Link */}
                    <Text mt={4} textAlign="center">
                        Already have an account?{" "}
                        <Button variant="link" colorScheme="blue" onClick={() => navigate('/')}>
                        Sign in
                        </Button>
                    </Text>
                  </VStack>
        </form>    
      </Box>
    </Box>
  );
};

export default SignUp;

