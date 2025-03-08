import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";

const Logout = () => {

    const navigate = useNavigate();

    const logout = () => {

        //Deleting the tokens
        localStorage.clear();
        // After logged out navigating to Login page
        navigate('/');
    }
    
    return (
        <div>
            <br/>
            <p colorScheme="teal" width="10%" onClick={logout}>Logout</p>
        </div>
    );
}

export default Logout;