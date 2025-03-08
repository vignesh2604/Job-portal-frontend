import React from "react";
import {
  Box,
  Flex,
  Button,
  useColorMode,
  useColorModeValue,
  Avatar,
  Spacer,
  Image,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom"; // Import Link from react-router-dom for navigation
import { NavLink } from "react-router-dom"; // Import NavLink for active state
import "./Navbar.css"; // Import custom CSS file
import { useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.900");
  const navigate = useNavigate();
  const toast = useToast();
  const username = localStorage.getItem('username');
  const profilePic = localStorage.getItem('userphoto');

  console.log("Current username:"+username);
  const logout = () => {
    //Deleting the tokens
    localStorage.clear();
    // After logged out navigating to Login page
    toast({
      title: 'Logging out..',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });

    setTimeout(() => {
      navigate('/');
    }, 2000);

  }

  const IMAGE =
    "https://img.freepik.com/premium-vector/find-job-logo-template-design_316488-888.jpg?w=740";

  return (
    <Box>
      {/* Navbar */}
      <Box
        bg={bg}
        px={8}
        py={2}
        boxShadow="md"
        position="fixed"
        top={0}
        width="100%"
        zIndex={10} // Make sure it appears on top of other content
      >
        <Flex h={20} alignItems="center" justifyContent="space-between">
            <Image
              rounded={"lg"}
              height={100}
              width={110}
              objectFit={"cover"}
              src={IMAGE}
              alt="#"
            />
            <Spacer/>
            <Flex alignItems="center" justifyContent="center" fontSize="lg" align="center" fontWeight="bold">
            <NavLink
              to="/home"
              className={({ isActive }) => 
                isActive ? "nav-link active-nav-link" : "nav-link"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/jobs"
              className={({ isActive }) => 
                isActive ? "nav-link active-nav-link" : "nav-link"
              }
            >
              Jobs
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => 
                isActive ? "nav-link active-nav-link" : "nav-link"
              }
            >
              Contact
            </NavLink>
          </Flex>
          <Spacer />
          <Flex alignItems="center">
            <Button onClick={toggleColorMode} mr={6} p={3} fontSize="xl">
              {colorMode === "light" ? <SunIcon /> : <MoonIcon />}
            </Button>
            {/* User Info and Avatar */}
            <Flex alignItems="center">
              {(username) ? (
                <Menu>
                  <MenuButton>
                    <Flex alignItems="center" cursor="pointer">
                      <Avatar name={username} src={profilePic} size="md" mr={3} />
                      <Text mr={4}>{username}</Text>
                    </Flex>
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={()=>{navigate('/account')}}>Account</MenuItem>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <>
                  <Button as={RouterLink} to="/" colorScheme="blue" mr={6} variant="solid" fontSize="lg">
                    Sign in
                  </Button>
                  <Button as={RouterLink} to="/signup" colorScheme="blue" variant="outline" fontSize="lg">
                    Sign Up
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Box>

      {/* Section Content */}
      <Box p={8} mt={20}> {/* mt={20} is added to avoid content being hidden behind fixed navbar */} </Box>
    </Box>
  );
};

export default Navbar;
