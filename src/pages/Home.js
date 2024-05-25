import React, { useState } from 'react';
import { Box, Heading, Button, Input, FormControl, FormLabel, VStack, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { createKeyStore, loginKeyStore } from '../services/api'; 
import { redToast } from '../utils/helpers';
import { useToast } from '@chakra-ui/react';

function Home() {
    const { setToken } = useAuth();
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [action, setAction] = useState('create'); 
    const toast = useToast();

    const handleLogin = () => {
        if (action === 'create') {
            createKeyStore(password, name).then((token) => {
                setToken(password, name);
            }).catch((error) => {
                redToast(toast, "Name already exists. Please use a different name.");
            }
            );
        } else {
            loginKeyStore(password, name).then((token) => { 
                setToken(password, name);
            }).catch((error) => {
                redToast(toast, "Invalid password or name.");
            });
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <VStack spacing={4} align="stretch" width="300px">
                <Heading as="h1" textAlign="center">Home Page</Heading>
                <RadioGroup onChange={setAction} value={action}>
                    <Stack direction="row">
                        <Radio value="create">Create Keystore</Radio>
                        <Radio value="use">Use Keystore</Radio>
                    </Stack>
                </RadioGroup>
                <FormControl>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="password">Key Store Password</FormLabel>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormControl>
                <Button colorScheme="teal" size="lg" onClick={handleLogin}>
                    {action === 'create' ? "Sign Up" : "Log In"}
                </Button>
            </VStack>
        </Box>
    );
}

export default Home;