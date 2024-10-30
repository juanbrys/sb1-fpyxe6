import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { Layout } from '../components/Layout';
import { api } from '../services/api';

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [challengeText, setChallengeText] = useState('');
  const toast = useToast();

  useEffect(() => {
    loadFriends();
  }, []);

  async function loadFriends() {
    try {
      const response = await api.get('/amizades');
      setFriends(response.data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar amigos',
        status: 'error',
        duration: 3000,
      });
    }
  }

  async function handleSendChallenge() {
    try {
      await api.post('/mensagens', {
        destinatarioId: selectedFriend.id,
        mensagem: challengeText,
        tipo: 'desafio',
      });

      toast({
        title: 'Desafio enviado com sucesso!',
        status: 'success',
        duration: 3000,
      });

      onClose();
      setChallengeText('');
    } catch (error) {
      toast({
        title: 'Erro ao enviar desafio',
        status: 'error',
        duration: 3000,
      });
    }
  }

  function handleOpenChallengeModal(friend) {
    setSelectedFriend(friend);
    onOpen();
  }

  return (
    <Layout>
      <Box bg="white" p={6} borderRadius="lg" boxShadow="base">
        <VStack spacing={4} align="stretch">
          {friends.map((friend: any) => (
            <HStack key={friend.id} justify="space-between" p={4} borderRadius="md" borderWidth={1}>
              <HStack spacing={4}>
                <Avatar name={friend.nome} src={friend.foto} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{friend.nome}</Text>
                  <Text color="gray.600">@{friend.apelido}</Text>
                </VStack>
              </HStack>
              <Button
                colorScheme="blue"
                onClick={() => handleOpenChallengeModal(friend)}
              >
                Desafiar
              </Button>
            </HStack>
          ))}
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enviar Desafio</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Desafio para {selectedFriend?.nome}</FormLabel>
              <Textarea
                value={challengeText}
                onChange={(e) => setChallengeText(e.target.value)}
                placeholder="Descreva seu desafio..."
              />
            </FormControl>
            <Button
              mt={4}
              colorScheme="blue"
              onClick={handleSendChallenge}
              isDisabled={!challengeText.trim()}
            >
              Enviar Desafio
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
}