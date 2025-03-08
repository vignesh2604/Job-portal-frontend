import React, { useState } from "react";
import {
    Alert, Box, FormControl, FormLabel, FormErrorMessage,
    Input, Button, useColorModeValue, Heading,
    VStack, Text, useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; 
import { useForm } from "react-hook-form";
import axios from "axios";
import api from "./api";

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
        
        const response2 = await api.get('users/fetchUser/');
        const { username, email, user_id, usertype, photo } = response2.data;
        console.log("Current user data: ",response2.data);
        localStorage.setItem('username', username);
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('usertype', usertype);
        localStorage.setItem('userphoto', photo);
        localStorage.setItem('useremail', email);

        const userDetails = {
            username: username,
            profilePic: photo
            };
        
        onLogin(userDetails);
        
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
        setError(Object.values("Incorrect username or password"));
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
        <form onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={4} align="stretch">
                    {/* Username */}
                    <FormControl isInvalid={errors.username}>
                      <FormLabel htmlFor="username">Username</FormLabel>
                      <Input
                        id="username"
                        type="text"
                        size="lg"
                        bg={useColorModeValue("gray.50", "gray.700")}
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
                        size="lg"
                        bg={useColorModeValue("gray.50", "gray.700")}      
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
                      <Button
                          buttonColor={buttonColor}
                          colorScheme="blue"
                          size="lg"
                          mt={4}
                          isFullWidth
                          type="submit">
                      Login
                    </Button>
                    {/* Sign Up Link */}
                    <Text mt={4} textAlign="center">
                      Don't have an account?{" "}
                      <Button variant="link" colorScheme="blue" onClick={() => navigate('/signup')}>
                            Sign Up
                      </Button>
                    </Text>  
                  </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default SignIn;
