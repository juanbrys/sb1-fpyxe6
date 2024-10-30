import { Layout } from '../components/Layout';
import {
  Box,
  Grid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
  Text,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Layout>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Bem-vindo, {user?.nome}!</Heading>
        
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
          <Box bg="white" p={6} borderRadius="lg" boxShadow="base">
            <Stat>
              <StatLabel>Total de Amigos</StatLabel>
              <StatNumber>0</StatNumber>
            </Stat>
          </Box>
          
          <Box bg="white" p={6} borderRadius="lg" boxShadow="base">
            <Stat>
              <StatLabel>Desafios Pendentes</StatLabel>
              <StatNumber>0</StatNumber>
            </Stat>
          </Box>
          
          <Box bg="white" p={6} borderRadius="lg" boxShadow="base">
            <Stat>
              <StatLabel>Mensagens Não Lidas</StatLabel>
              <StatNumber>0</StatNumber>
            </Stat>
          </Box>
        </Grid>

        <Box bg="white" p={6} borderRadius="lg" boxShadow="base">
          <Heading size="md" mb={4}>Atividade Recente</Heading>
          <Text color="gray.500">Nenhuma atividade recente para exibir.</Text>
        </Box>
      </VStack>
    </Layout>
  );
}