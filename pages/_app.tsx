import React from 'react';

import { 
  ChakraProvider, 
  Container, 
  VStack, 
  Image, 
  Text, 
  Heading,
  Divider
 } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import theme from '../theme';
const App: React.FC<AppProps> = ({ Component, pageProps }) =>{
  return (
    <ChakraProvider theme={theme}>
      <Container
        backgroundColor='white'
        borderRadius='sm'
        boxShadow='md'
        marginY={4}
        maxWidth='container.xl'
        padding={4}
      >
        <VStack
          marginBottom={6}
        >
          <Image src='https://via.placeholder.com/128X128' />
          <Heading>Almacenag</Heading>
          <Text>El almacen en tu casa</Text>
        </VStack>
        <Divider marginY={6} />
        <Component {...pageProps} />
      </Container>
      
      
    </ChakraProvider>
  )
}
export default App