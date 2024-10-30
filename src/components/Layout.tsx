import { Box, Flex } from '@chakra-ui/react';
import { Navbar } from './Navbar';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box minH="100vh">
      <Navbar />
      <Flex
        as="main"
        maxW="1200px"
        mx="auto"
        px={4}
        py={8}
      >
        {children}
      </Flex>
    </Box>
  );
}