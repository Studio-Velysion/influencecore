'use client'

import {
  SimpleGrid,
  Flex,
  Box,
  Text,
} from '@chakra-ui/react'
import { FiUsers, FiTrendingUp } from 'react-icons/fi'

export default function AdminDashboardChakra() {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" color="text.primary" mb={6}>
        Tableau de bord Administrateur
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="24px" mb="24px">
        {/* Statistique Utilisateurs */}
        <Box
          bg="rgba(18, 18, 26, 0.6)"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)"
          borderRadius="16px"
          p={6}
        >
          <Flex flexDirection="row" align="center" justify="space-between" w="100%">
            <Box>
              <Text fontSize="sm" color="text.tertiary" fontWeight="bold" pb="2px">
                Utilisateurs
              </Text>
              <Text fontSize="2xl" color="text.primary" fontWeight="bold">
                0
              </Text>
              <Text color="green.400" fontWeight="bold" fontSize="md" m={0} mt={1}>
                +0%
              </Text>
            </Box>
            <Box
              h="45px"
              w="45px"
              bg="purple.400"
              borderRadius="12px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FiUsers size={24} color="white" />
            </Box>
          </Flex>
        </Box>

        {/* Statistique Croissance */}
        <Box
          bg="rgba(18, 18, 26, 0.6)"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)"
          borderRadius="16px"
          p={6}
        >
          <Flex flexDirection="row" align="center" justify="space-between" w="100%">
            <Box>
              <Text fontSize="sm" color="text.tertiary" fontWeight="bold" pb="2px">
                Croissance
              </Text>
              <Text fontSize="2xl" color="text.primary" fontWeight="bold">
                +0%
              </Text>
              <Text color="purple.400" fontWeight="bold" fontSize="md" m={0} mt={1}>
                Ce mois-ci
              </Text>
            </Box>
            <Box
              h="45px"
              w="45px"
              bg="purple.600"
              borderRadius="12px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FiTrendingUp size={24} color="white" />
            </Box>
          </Flex>
        </Box>
      </SimpleGrid>

      {/* Contenu additionnel peut être ajouté ici */}
      <SimpleGrid columns={{ base: 1, xl: 2 }} gap="24px">
        <Box
          bg="rgba(18, 18, 26, 0.6)"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)"
          borderRadius="16px"
          p={6}
        >
          <Box mb={4}>
            <Text fontSize="lg" fontWeight="bold" color="text.primary">
              Activité Récente
            </Text>
          </Box>
          <Box>
            <Text color="text.secondary" fontSize="sm">
              Aucune activité récente.
            </Text>
          </Box>
        </Box>

        <Box
          bg="rgba(18, 18, 26, 0.6)"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)"
          borderRadius="16px"
          p={6}
        >
          <Box mb={4}>
            <Text fontSize="lg" fontWeight="bold" color="text.primary">
              Statistiques
            </Text>
          </Box>
          <Box>
            <Text color="text.secondary" fontSize="sm">
              Les statistiques détaillées seront disponibles prochainement.
            </Text>
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  )
}

