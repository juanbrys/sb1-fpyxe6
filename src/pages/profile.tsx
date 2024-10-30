import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Heading,
  Button,
  Grid,
  Badge,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { format } from 'date-fns';

export default function Profile() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const toast = useToast();

  useEffect(() => {
    async function loadChallenges() {
      try {
        const response = await api.get('/mensagens/desafios');
        setChallenges(response.data);
      } catch (error) {
        toast({
          title: 'Erro ao carregar desafios',
          status: 'error',
          duration: 3000,
        });
      }
    }
    loadChallenges();
  }, [toast]);

  if (!user) return null;

  return (
    <Layout>
      <Grid templateColumns={{ base: '1fr', md: '300px 1fr' }} gap={8}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="base" height="fit-content">
          <VStack spacing={4} align="center">
            <Avatar size="2xl" name={user.nome} src={user.foto} />
            <Heading size="md">{user.nome}</Heading>
            <Text color="gray.600">@{user.apelido}</Text>
            <Divider />
            <VStack align="start" w="100%" spacing={2}>
              <Text><strong>Email:</strong> {user.email}</Text>
              <Text><strong>Cidade:</strong> {user.cidade}</Text>
              <Text><strong>Telefone:</strong> {user.telefone || 'Não informado'}</Text>
              <Text>
                <strong>Data de Nascimento:</strong>{' '}
                {format(new Date(user.dataNascimento), 'dd/MM/yyyy')}
              </Text>
            </VStack>
          </VStack>
        </Box>

        <VStack align="stretch" spacing={6}>
          <Box bg="white" p={6} borderRadius="lg" boxShadow="base">
            <Heading size="md" mb={4}>Desafios</Heading>
            <VStack align="stretch" spacing={4}>
              {challenges.map((challenge: any) => (
                <Box 
                  key={challenge.id} 
                  p={4} 
                  borderRadius="md" 
                  border="1px" 
                  borderColor="gray.200"
                >
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">
                        {challenge.remetente.id === user.id 
                          ? `Para: ${challenge.destinatario.nome}`
                          : `De: ${challenge.remetente.nome}`}
                      </Text>
                      <Text>{challenge.mensagem}</Text>
                      <Badge 
                        colorScheme={
                          challenge.status === 'aceito' 
                            ? 'green' 
                            : challenge.status === 'recusado' 
                            ? 'red' 
                            : 'yellow'
                        }
                      >
                        {challenge.status}
                      </Badge>
                    </VStack>
                    {challenge.status === 'pendente' && challenge.destinatario.id === user.id && (
                      <HStack>
                        <Button 
                          size="sm" 
                          colorScheme="green"
                          onClick={() => handleChallengeResponse(challenge.id, 'aceito')}
                        >
                          Aceitar
                        </Button>
                        <Button 
                          size="sm" 
                          colorScheme="red"
                          onClick={() => handleChallengeResponse(challenge.id, 'recusado')}
                        >
                          Recusar
                        </Button>
                      </HStack>
                    )}
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Grid>
    </Layout>
  );
}