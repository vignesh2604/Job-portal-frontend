import React, { useEffect, useState } from 'react';
import {
    Flex,
    Text,
    IconButton,
    Divider,
    Avatar,
    Heading,
    Box
} from '@chakra-ui/react';
import {
    FiMenu,
    FiHome,
    FiUser,
    FiLogOut,
    FiBriefcase,
} from 'react-icons/fi';

import NavItem from './NavItem';
import Logout from './Logout';
import api from './api';
import { useNavigate } from 'react-router-dom';


export function Sidebar({isactive, header}) {
    
    const [navSize, changeNavSize] = useState("large");

    const [userName, setuserName] = useState('');

    const [usertype, setUserType] = useState('');

    const navigate = useNavigate();

    const logout = () => {

        //Deleting the tokens
        localStorage.clear();
        // After logged out navigating to Login page
        navigate('/');
    }

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await api.get('users/fetchUser/');
                const { username, email, user_id, usertype } = response.data;
                console.log(response.data);
                setuserName(username);
                localStorage.setItem('user_id', user_id);
                localStorage.setItem('usertype', usertype);
                setUserType(usertype);
            }
            catch(error) {
                console.log(error.response.data);
            }
        }
        fetchUserDetails();
    }, []);
    
    return (
        <Box>
  {/* Fixed Header */}
  <Box
    as="header"
    position="fixed"
    top="0"
    left="0"
    width="100%"
    background="teal.100"
    color="black"
    p="4"
    boxShadow="sm"
    zIndex="1000"
  >
    <Heading as="h1" size="lg" textAlign="center">
      {header}
    </Heading>
  </Box>

  {/* Sidebar and Content */}
  <Flex>
    {/* Sidebar */}
    <Flex
      pos="fixed"
      top="60px" /* Adjust to match header height */
      left="0"
      h="calc(100vh - 60px)" /* Full height minus header height */
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      borderRadius={navSize === "small" ? "10px" : "15px"}
      w={navSize === "small" ? "75px" : "200px"}
      flexDir="column"
      justifyContent="space-between"
      background="teal.100"
      
    >
      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize === "small" ? "center" : "flex-start"}
        as="nav"
      >
        <IconButton
          background="none"
          mt={5}
          _hover={{ background: "none" }}
          icon={<FiMenu />}
          onClick={() => {
            if (navSize === "small") changeNavSize("large");
            else changeNavSize("small");
          }}
        />
        {usertype == "jobseeker" && <NavItem navSize={navSize} icon={FiHome} title="Dasboard" path="/home" active={isactive === 'D'} />}
        {usertype == "recruiter" && <NavItem navSize={navSize} icon={FiHome} title="Dasboard" path="/home" active={isactive==='D'} />}      
        {usertype=="jobseeker" && (<NavItem navSize={navSize} icon={FiBriefcase} title="Search for jobs"  path="/joblist" active={isactive==='S'}/>)}
        {usertype=="recruiter" && (<NavItem navSize={navSize} icon={FiBriefcase} title="Post jobs"  path="/createjobform" active={isactive==='CJ'}/>)}
        <NavItem navSize={navSize} icon={FiUser} title="Account" path="/Profile" active={isactive==='P'}/>
        {/* <NavItem navSize={navSize} icon={FiLogOut} title="Logout" onClick={logout}/> */}
        <Logout/>      
      </Flex>

      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize === "small" ? "center" : "flex-start"}
        mb={4}
      >
        <Divider display={navSize === "small" ? "none" : "flex"} />
        <Flex mt={4} align="center">
          <Avatar size="sm" src="avatar-1.jpg" />
          <Flex flexDir="column" ml={4} display={navSize === "small" ? "none" : "flex"}>
            <Heading as="h3" size="sm">
              {userName}
            </Heading>
            <Text color="gray">Admin</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  </Flex>
</Box>
    )
}


