import React, { useEffect, useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Select, Button, Flex, Textarea, useToast } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { getFilteredAliases, getPublicKeys, verifySignature } from '../services/api';
import { getData, redToast, yellowToast } from '../utils/helpers';

const RSACVerify = ({ keys }) => {
    const { token, name } = useAuth();
    const [textToVerify, setTextToVerify] = useState('');
    const [signature, setSignature] = useState('');
    const [selectedKey, setSelectedKey] = useState('');
    const [allKeys, setAllKeys] = useState([]);
    const [currentKeys, setCurrentKeys] = useState([]); // [key1, key2, key3]
    const toast = useToast();

    const getAllKeys = () => {
        const combined = [...keys, ...allKeys];
        const unique = [...new Set(combined)];
        return unique;
    }

    useEffect(() => {
        setCurrentKeys([...getAllKeys()]);
        setSelectedKey(keys[0]);
    }, [keys, allKeys]);

    useEffect(() => {
        getPublicKeys().then((keys1) => {
            let keys = getData(keys1);
            const mapped = keys.map((key) => key.replace('_public', ''));
            setAllKeys(mapped.filter((key) => key.startsWith('dsa_')));
        }).catch((error) => {
            redToast(toast, "Network error. Please try again later");
        });
        setSelectedKey(keys[0] || '');
    }, [token]);


    const handleUploadText = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => setTextToVerify(e.target.result);
        reader.readAsText(file);
    };

    const handleUploadSignature = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => setSignature(e.target.result);
        reader.readAsText(file);
    };

    const handleVerify = () => {
        // Replace with actual verification logic
        if(!selectedKey){
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            yellowToast(toast, "You need to generate a key first.");
            return;
        }
        else if(!textToVerify || !signature){
            yellowToast(toast, "Text and signature are required.");
            return;
        }
        verifySignature(selectedKey, textToVerify, signature).then((isVerified) => {
            toast({
                title: isVerified ? 'Verification Successful' : 'Verification Failed',
                description: isVerified ? 'The signature is verified.' : 'The signature could not be verified.',
                status: isVerified ? 'success' : 'error',
                duration: 5000,
                isClosable: true,
            });
        }).catch((error) => {
            redToast(toast, "Not the correct key OR invalid signature.");
        });
    };

    return (
        <Box p={8} textAlign="center">
            <Heading as="h1" mb={6}>Signature Verification</Heading>
            <Box width="80%" margin="0 auto">
                <Flex justifyContent="space-between" mb={4}>
                    <Box width="48%">
                        <FormControl id="textToVerify" mb={4}>
                            <FormLabel>Text to Verify</FormLabel>
                            <Textarea 
                                value={textToVerify}
                                onChange={(e) => setTextToVerify(e.target.value)}
                                placeholder="Enter the text to verify..."
                                size="md"
                                resize="vertical"
                            />
                        </FormControl>
                        <Button as="label" htmlFor="upload-text" colorScheme="teal" mb={4}>
                            Upload Text
                        </Button>
                        <Input type="file" id="upload-text" display="none" onChange={handleUploadText} />
                    </Box>
                    <Box width="48%">
                        <FormControl id="signature" mb={4}>
                            <FormLabel>Signature</FormLabel>
                            <Textarea
                                value={signature}
                                onChange={(e) => setSignature(e.target.value)}
                                placeholder="Enter the signature..."
                                size="md"
                                resize="vertical"
                            />
                        </FormControl>
                        <Button as="label" htmlFor="upload-signature" colorScheme="teal" mb={4}>
                            Upload Signature
                        </Button>
                        <Input type="file" id="upload-signature" display="none" onChange={handleUploadSignature} />
                    </Box>
                </Flex>
                <FormControl mb={4}>
                    <FormLabel>Select Key</FormLabel>
                    <Select value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)}>
                        {currentKeys.length > 0 ?
                            currentKeys.map((key) => (
                                <option key={key} value={key}>{key}</option>
                            ))
                            : <option value="">No keys available</option>
                        }
                    </Select>
                </FormControl>
                <Button colorScheme="teal" onClick={handleVerify} mb={4}>Verify</Button>
            </Box>
        </Box>
    );
};

export default RSACVerify;
