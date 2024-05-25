import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Box, Heading, Flex, Text, Icon } from '@chakra-ui/react';
import { FaLock, FaKey, FaShieldAlt } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import AES from '../components/AES';
import RSA from '../components/RSA';
import DSA from '../components/DSA';

const Encrypt = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const Card = ({ title, icon, path }) => (
    <Box
      as="button"
      onClick={() => navigate(path)}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={6}
      m={4}
      textAlign="center"
      bg="teal.500"
      color="white"
      _hover={{ bg: "teal.600", transform: "scale(1.05)" }}
      transition="transform 0.2s"
      maxW="250px"
      boxShadow="lg"
    >
      <Icon as={icon} w={12} h={12} mb={4} />
      <Text fontSize="2xl" fontWeight="bold">{title}</Text>
    </Box>
  );

  return (
    <Box>
      <Navbar />
      {(location.pathname === '/encrypt' || location.pathname === '/encrypt/') && (
        <>
          <Box p={5} minH="100vh" display="flex" flexDirection="column" alignItems="center">
            <Heading as="h1" mb={8}>Select the algorithm you want to use:</Heading>
            <Flex justify="center" align="center" wrap="wrap">
              <Card title="AES" icon={FaLock} path="/encrypt/aes" />
              <Card title="RSA" icon={FaKey} path="/encrypt/rsa" />
              <Card title="DSA" icon={FaShieldAlt} path="/encrypt/dsa" />
            </Flex>
          </Box>
        </>
      )}
      <Box p={5}>
        <Routes>
          <Route path="aes" element={<AES />} />
          <Route path="rsa" element={<RSA />} />
          <Route path="dsa" element={<DSA />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Encrypt;
