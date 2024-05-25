import React, { useState, useRef, useEffect } from 'react';
import { Box, Heading, FormControl, FormLabel, Textarea, Select, Button, Flex, useToast } from '@chakra-ui/react';
import { decryotAES, encryptAES } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getData, redToast, yellowToast } from '../utils/helpers';

const EncryptDecryptForm = ({keys, setKeys}) => {
    const {token, setToken, name} = useAuth();
    const [plainText, setPlainText] = useState('');
    const [selectedKey, setSelectedKey] = useState('');
    console.log(selectedKey)
    const [result, setResult] = useState('');
    const toast = useToast();

    const divRef = useRef(null);

    const autoResizeDiv = () => {
        if (divRef.current) {
            divRef.current.style.height = 'auto';
            divRef.current.style.height = divRef.current.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        autoResizeDiv();
    }, [result]);

    useEffect(() => {
        setSelectedKey(keys[keys.length - 1] || '');
    }, [keys]);

    const handleEncryptDecrypt = (op) => {
        if(!selectedKey){
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            yellowToast(toast, "You need to generate a key first.");
        }
        else if(!plainText){
            yellowToast(toast, "Enter the text to encrypt/decrypt.");
        }
        else if(op === 'encrypt'){
            encryptAES(token, plainText, selectedKey, name).then((res1) => {
                let res = getData(res1);
                setResult(res);
            }).catch((error) => {
                redToast(toast, "Error encrypting text.");
                setResult("Error encrypting text.");
            });
            setResult("Loading...");
        }
        else {
            decryotAES(token, plainText, selectedKey, name).then((res1) => {
                let res = getData(res1);
                setResult(res);
            }).catch((error) => {
                redToast(toast, "Error! Please check the key, or the ciphertext.");
                setResult("Error decrypting text.");
            });
            setResult("Loading...");
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPlainText(e.target.result);
            };
            reader.readAsText(file);
            setPlainText(file);
        }
    };

    const handleFileDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([result], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "result.txt";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <Box p={8} textAlign="center">
            <Heading as="h1" mb={6}>Encrypt/Decrypt Text</Heading>
            <Box width="80%" margin="0 auto">
                <Flex justifyContent="space-between">
                    <Box width="45%">
                        <FormControl id="plainText" mb={4}>
                            <FormLabel>Text</FormLabel>
                            <Textarea 
                                value={plainText} 
                                onChange={(e) => setPlainText(e.target.value)} 
                                placeholder="Enter your text here..." 
                                size="md"
                                resize="vertical"
                            />
                        </FormControl>
                        <Button
                            colorScheme="teal"
                            variant="outline"
                            as="label"
                            htmlFor="file-upload"
                            mt={2}
                        >
                            Upload Text File
                            <input
                                type="file"
                                id="file-upload"
                                style={{ display: "none" }}
                                accept=".txt"
                                onChange={handleFileUpload}
                            />
                        </Button>
                        <FormControl id="selectedKey" mb={4} mt={4}>
                            <FormLabel>Select Key</FormLabel>
                            <Select 
                                value={selectedKey} 
                                onChange={(e) => setSelectedKey(e.target.value)}
                            >
                                {keys.length > 0 ? (
                                    keys.map((key) => (
                                        <option key={key} value={key}>{key}</option>
                                    ))
                                ) : (
                                    <option value="">No keys available</option>
                                )}
                            </Select>
                        </FormControl>
                        <Flex justifyContent="space-between" mt={4}>
                            <Button 
                                colorScheme="teal" 
                                onClick={() => handleEncryptDecrypt('encrypt')}
                                flex="1"
                                mr={2}
                            >
                                Encrypt
                            </Button>
                            <Button 
                                colorScheme="teal" 
                                onClick={() => handleEncryptDecrypt('decrypt')}
                                flex="1"
                                ml={2}
                            >
                                Decrypt
                            </Button>
                        </Flex>
                    </Box>
                    <Box width="45%">
                        <FormControl mb={4}>
                            <FormLabel>Result</FormLabel>
                            <div 
                                ref={divRef}
                                contentEditable={true} // Disable content editing
                                style={{
                                    border: '1px solid #CBD5E0', // Border color
                                    borderRadius: '0.25rem', // Border radius
                                    padding: '0.5rem', // Padding
                                    minHeight: '10rem', // Minimum height
                                    overflow: 'auto', // Enable scrolling if content overflows
                                    resize: 'none', // Disable resizing
                                    width: '100%', // Full width
                                    color: result ? '#000' : '#CBD5E0', // Text color
                                    textAlign: 'left' // Align text to the left
                                }}
                            >
                                {result ? result : 'View the result here...'}
                            </div>
                        </FormControl>
                        <Button
                            colorScheme="teal"
                            variant="outline"
                            onClick={handleFileDownload}
                            mt={2}
                        >
                            
                            Download Result
                        </Button>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};

export default EncryptDecryptForm;
