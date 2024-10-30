import { Box, Flex, Button, Text, Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <Box bg="white" boxShadow="sm">
      <Flex
        maxW="1200px"
        mx="auto"
        px={4}
        h="64px"
        align="center"
        justify="space-between"
      >
        <Link href="/dashboard" passHref>
          <Text fontSize="xl" fontWeight="bold" color="brand.500">
            Friends App
          </Text>
        </Link>

        {user && (
          <Flex align="center" gap={4}>
            <Link href="/friends" passHref>
              <Button variant="ghost">Amigos</Button>
            </Link>
            <Link href="/messages" passHref>
              <Button variant="ghost">Mensagens</Button>
            </Link>
            
            <Menu>
              <MenuButton>
                <Avatar size="sm" name={user.nome} src={user.foto} />
              </MenuButton>
              <MenuList>
                <Link href="/profile" passHref>
                  <MenuItem>Perfil</MenuItem>
                </Link>
                <Link href="/settings" passHref>
                  <MenuItem>Configurações</MenuItem>
                </Link>
                <MenuItem onClick={signOut}>Sair</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}