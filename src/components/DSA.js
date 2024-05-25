import React, { useState, useRef, useEffect } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Select, Button, Flex, useToast } from '@chakra-ui/react';
import DSAVerify from './DSAVerify';
import DSASign from './DSASign';
import { generateDSAKey, getFilteredAliases, getDSAPrivateKey, getDSAPublicKey, getPublicKeys } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getData, redToast, yellowToast } from '../utils/helpers';

const DSA = () => {
    const { token, name } = useAuth();
    const [keyAlias, setKeyAlias] = useState('');
    const [keySize, setKeySize] = useState('');
    const [randomnessSource, setRandomnessSource] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [selectedKey, setSelectedKey] = useState('');
    const [keys, setKeys] = useState([]);
    const [publicKeys, setPublicKeys] = useState([]);
    const toast = useToast();

    const privateDivRef = useRef(null);
    const publicDivRef = useRef(null);

    const autoResizeDiv = (ref) => {
        if (ref.current) {
            ref.current.style.height = 'auto';
            ref.current.style.height = ref.current.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        autoResizeDiv(privateDivRef);
        autoResizeDiv(publicDivRef);
    }, [privateKey, publicKey]);

    useEffect(() => {
        getFilteredAliases(token, "dsa_", name).then((keys1) => {
            let keys = getData(keys1);
            setKeys(keys);
        }).catch((error) => {
            redToast(toast, "Error fetching keys.");
        });

        getPublicKeys().then((keys1) => {
            let keys = getData(keys1);
            setPublicKeys(keys.map((key) => key.replace('_public', '')).filter((key) => key.startsWith('dsa_')));
        });
    }, [token]);

    const handleGenerateKeys = () => {
        if (!keyAlias) {
            yellowToast(toast, "Please give the key a name.");
            return;
        }
        else if (!keySize) {
            yellowToast(toast, "Please select a key size.");
            return;
        }
        else if ([...keys, ...publicKeys].includes("dsa_" + keyAlias)) {
            yellowToast(toast, "Name already Exists. Please choose another name.");
            return;
        }
        
        const thisKeyAlias = "dsa_" + keyAlias;
        generateDSAKey(token, keySize, keyAlias, randomnessSource, name).then(() => {
            setSelectedKey(thisKeyAlias);
            setKeys([thisKeyAlias, ...keys]);
            getDSAPrivateKey(token, thisKeyAlias, name).then((key1) => {
                let key = getData(key1);
                setPrivateKey(key);
            }).catch((error) => {
                redToast(toast, "Error fetching private key.");
                setPrivateKey("Error fetching private key.");
            });
            getDSAPublicKey(thisKeyAlias).then((key1) => {
                let key = getData(key1);
                setPublicKey(key);
            }).catch((error) => {
                redToast(toast, "Error fetching public key.");
                setPublicKey("Error fetching public key.");
            });
        }).catch((error) => {
            redToast(toast, "Please, try another randomnessSource or try again later.");
            setPrivateKey("Error generating key");
            setPublicKey("Error generating key");
        });
        setPrivateKey("Loading...");
        setPublicKey("Loading...");
    };

    const handleSelectKey = (key) => {
        setSelectedKey(key);
        getDSAPrivateKey(token, key, name).then((key1) => {
            let key = getData(key1);
            setPrivateKey(key);
        }).catch((error) => {
            redToast(toast, "Error fetching private key.");
            setPrivateKey("Error fetching private key. Try again later.");
        });
        getDSAPublicKey(key).then((key1) => {
            let key = getData(key1);
            setPublicKey(key);
        }).catch((error) => {
            redToast(toast, "Error fetching public key.");
            setPublicKey("Error fetching public key. Try again later");
        });
    };

    return (
        <>
            <Box p={8} textAlign="center">
                <Heading as="h1" mb={6}>DSA Encryption</Heading>
                <Box width="80%" margin="0 auto">
                    <Flex justifyContent="space-between">
                        <Box width="48%">
                            <form>
                                <FormControl id="keyAlias" mb={4}>
                                    <FormLabel>Key Name</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder='Enter the key name...'
                                        value={keyAlias}
                                        onChange={(e) => setKeyAlias(e.target.value)} />
                                </FormControl>
                                <FormControl id="keySize" mb={4}>
                                    <FormLabel>Key Size</FormLabel>
                                    <Select value={keySize} onChange={(e) => setKeySize(e.target.value)}>
                                        <option value="">Select key size</option>
                                        <option value="512">512 bits</option>
                                        <option value="1024">1024 bits</option>
                                        <option value="2048">2048 bits</option>
                                    </Select>
                                </FormControl>
                                <FormControl id="randomnessSource" mb={4}>
                                    <FormLabel>Randomness Source</FormLabel>
                                    <Select value={randomnessSource} onChange={(e) => setRandomnessSource(e.target.value)}>
                                        <option value="">Select randomness</option>
                                        <option value="DRBG">DRBG</option>
                                        <option value="NONCEANDIV">NONCEANDIV</option>
                                        <option value="SHA1PRNG">SHA1PRNG</option>
                                    </Select>
                                </FormControl>
                                <Button colorScheme="teal" onClick={handleGenerateKeys} mb={4} mt={4}>Generate Keys</Button>
                            </form>

                        </Box>
                        <Box width="48%">
                            <FormControl mb={4}>
                                <FormLabel>Select Key</FormLabel>
                                <Select value={selectedKey} onChange={(e) => handleSelectKey(e.target.value)}>
                                    <option value="">No keys available</option>
                                    {keys.map((key) => (
                                        <option key={key} value={key}>{key}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Private Key</FormLabel>
                                <div
                                    ref={privateDivRef}
                                    contentEditable={false}
                                    style={{
                                        border: '1px solid #CBD5E0',
                                        borderRadius: '0.25rem',
                                        padding: '0.5rem',
                                        minHeight: '7rem',
                                        maxHeight: '10rem',
                                        overflow: 'auto',
                                        resize: 'none',
                                        width: '100%',
                                        color: privateKey ? '#000' : '#CBD5E0',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    {privateKey ? privateKey : 'View the private key here...'}
                                </div>
                                <FormLabel>Public Key</FormLabel>
                                <div
                                    ref={publicDivRef}
                                    contentEditable={false}
                                    style={{
                                        border: '1px solid #CBD5E0',
                                        borderRadius: '0.25rem',
                                        padding: '0.5rem',
                                        minHeight: '7rem',
                                        maxHeight: '10rem',
                                        overflow: 'auto',
                                        resize: 'none',
                                        width: '100%',
                                        color: publicKey ? '#000' : '#CBD5E0'
                                    }}
                                >
                                    {publicKey ? publicKey : 'View the public key here...'}
                                </div>
                            </FormControl>
                        </Box>
                    </Flex>
                </Box>
            </Box>
            <DSASign keys={keys} />
            <DSAVerify keys={keys}/>
        </>
    );
};

export default DSA;
