import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, VStack, Heading, Textarea, Button, Text, SimpleGrid, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { Shuffle, Headset } from 'lucide-react';

function App() {
  const [studentInput, setStudentInput] = useState('');
  const [sampledStudents, setSampledStudents] = useState([]);
  const [animatingStudents, setAnimatingStudents] = useState([]);
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleInputChange = (event) => {
    setStudentInput(event.target.value);
    setError('');
  };

  const sampleStudents = () => {
    const students = studentInput.split('\n').map(name => name.trim()).filter(name => name);

    if (students.length < 40) {
      setError('Not enough participants. Please enter at least 40 student names for the VR experience.');
      return;
    }

    setIsAnimating(true);
    setAnimatingStudents(students);
    
    setTimeout(() => {
      const shuffled = [...students].sort(() => 0.5 - Math.random());
      setSampledStudents(shuffled.slice(0, 40));
      setIsAnimating(false);
    }, 3000);
  };

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setAnimatingStudents(prevStudents => {
          const shuffled = [...prevStudents].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, 40);
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  return (
    <ChakraProvider>
      <Box bgGradient="linear(to-r, purple.500, indigo.600)" minHeight="100vh" p={4}>
        <VStack spacing={4} align="stretch" maxWidth="4xl" margin="auto">
          <Box bg="white" borderRadius="md" p={4} boxShadow="xl">
            <Heading as="h1" size="xl" textAlign="center" mb={4} display="flex" alignItems="center" justifyContent="center">
              <Box as={Headset} mr={2} color="purple.600" />
              VR Experience Participant Selector
            </Heading>
            <VStack spacing={4}>
              <Textarea 
                placeholder="Enter student names (one per line) for VR experience participation"
                value={studentInput}
                onChange={handleInputChange}
                minHeight="200px"
              />
              <Button 
                onClick={sampleStudents}
                isDisabled={!studentInput.trim() || isAnimating}
                leftIcon={<Box as={Shuffle} className={isAnimating ? 'animate-spin' : ''} />}
                colorScheme="purple"
              >
                {isAnimating ? 'Launching VR...' : 'Select 40 VR Participants'}
              </Button>
            </VStack>
          </Box>

          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle mr={2}>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {(isAnimating || sampledStudents.length > 0) && (
            <Box bg="white" borderRadius="md" p={4} boxShadow="xl">
              <Heading as="h2" size="lg" mb={4} color="purple.700">
                {isAnimating ? 'Initializing VR Headsets...' : 'Selected VR Participants'}
              </Heading>
              <SimpleGrid columns={[2, null, 4]} spacing={2}>
                {(isAnimating ? animatingStudents : sampledStudents).map((student, index) => (
                  <Box key={index} display="flex" alignItems="center" className={isAnimating ? 'animate-pulse' : ''}>
                    <Box 
                      w="24px" 
                      h="24px" 
                      borderRadius="full" 
                      bg="purple.600" 
                      color="white" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center" 
                      mr={2}
                      fontSize="sm"
                    >
                      {index + 1}
                    </Box>
                    <Text color="purple.800">{student}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;