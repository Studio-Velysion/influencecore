# 🎯 Guide Complet - Chakra UI v3 - Méthodes Correctes

## ⚠️ IMPORTANT : Ce guide liste TOUTES les méthodes correctes pour Chakra UI v3

---

## 1. 🎨 Icônes (react-icons)

### ❌ NE JAMAIS UTILISER
```tsx
import { Icon } from '@chakra-ui/react'
import { FiVideo } from 'react-icons/fi'

<Icon as={FiVideo} h="24px" w="24px" color="white" />
```

### ✅ MÉTHODE CORRECTE - Option 1 (Directe)
```tsx
import { FiVideo } from 'react-icons/fi'

<FiVideo size={24} color="white" />
```

### ✅ MÉTHODE CORRECTE - Option 2 (Dynamique avec React.createElement)
```tsx
import React from 'react'
import { FiVideo } from 'react-icons/fi'

const IconComponent = FiVideo
{React.createElement(IconComponent, { size: 24, color: 'white' })}
```

**Quand utiliser Option 2 ?** Quand vous stockez les icônes dans un tableau/objet et les utilisez dynamiquement.

---

## 2. 🔗 Liens avec Next.js

### ❌ NE JAMAIS UTILISER
```tsx
import { Link, BreadcrumbLink } from '@chakra-ui/react'
import NextLink from 'next/link'

<BreadcrumbLink as={Link} href="/dashboard">
  Dashboard
</BreadcrumbLink>
```

### ✅ MÉTHODE CORRECTE - Option 1 (useRouter)
```tsx
import { useRouter } from 'next/navigation'
import { Text } from '@chakra-ui/react'

<Text
  color="text.secondary"
  _hover={{ color: 'purple.400', cursor: 'pointer' }}
  onClick={() => router.push('/dashboard')}
>
  Dashboard
</Text>
```

### ✅ MÉTHODE CORRECTE - Option 2 (NextLink wrapper)
```tsx
import NextLink from 'next/link'
import { Text } from '@chakra-ui/react'

<NextLink href="/dashboard" style={{ textDecoration: 'none' }}>
  <Text color="text.secondary" _hover={{ color: 'purple.400' }}>
    Dashboard
  </Text>
</NextLink>
```

---

## 3. 🎴 Cards avec Navigation

### ❌ NE JAMAIS UTILISER
```tsx
import { Card } from '@chakra-ui/react'
import NextLink from 'next/link'

<Card as={NextLink} href="/ideas">
  Contenu
</Card>
```

### ✅ MÉTHODE CORRECTE
```tsx
import { Card, CardBody } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

<Card
  cursor="pointer"
  onClick={() => router.push('/ideas')}
  _hover={{ transform: 'translateY(-4px)' }}
>
  <CardBody>Contenu</CardBody>
</Card>
```

---

## 4. 🎛️ Hooks et Composants Remplacés

### useColorModeValue
```tsx
// ❌ NE PLUS UTILISER
const color = useColorModeValue('white', 'black')

// ✅ UTILISER DES VALEURS DIRECTES
const color = 'white' // ou utiliser les tokens de couleur Chakra
const bgColor = 'bg.primary' // tokens personnalisés
```

### useDisclosure
```tsx
// ❌ NE PLUS UTILISER
const { isOpen, onOpen, onClose } = useDisclosure()

// ✅ UTILISER useState
const [isOpen, setIsOpen] = useState(false)
const onOpen = () => setIsOpen(true)
const onClose = () => setIsOpen(false)
```

### Stack
```tsx
// ❌ NE PLUS UTILISER
<Stack direction="column" spacing={4}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Stack>

// ✅ UTILISER Flex
<Flex direction="column" gap={4}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Flex>
```

### Drawer
```tsx
// ❌ NE PLUS UTILISER
<Drawer isOpen={isOpen} onClose={onClose}>
  <DrawerOverlay />
  <DrawerContent>...</DrawerContent>
</Drawer>

// ✅ UTILISER UNE IMPLÉMENTATION PERSONNALISÉE
{isOpen && (
  <>
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.5)"
      onClick={onClose}
    />
    <Box position="fixed" top={0} left={0} w="275px" h="100vh">
      Contenu
    </Box>
  </>
)}
```

### MenuButton / MenuList
```tsx
// ❌ NE PLUS UTILISER
<Menu>
  <MenuButton>Actions</MenuButton>
  <MenuList>
    <MenuItem>Option 1</MenuItem>
  </MenuList>
</Menu>

// ✅ UTILISER UNE IMPLÉMENTATION PERSONNALISÉE
const [isMenuOpen, setIsMenuOpen] = useState(false)

<Box position="relative">
  <Button onClick={() => setIsMenuOpen(!isMenuOpen)}>Actions</Button>
  {isMenuOpen && (
    <Box
      position="absolute"
      top="100%"
      bg="bg.secondary"
      border="1px solid"
      borderColor="rgba(255,255,255,0.1)"
    >
      <Box onClick={handleOption1}>Option 1</Box>
    </Box>
  )}
</Box>
```

### useToast
```tsx
// ❌ NE PLUS UTILISER
const toast = useToast()
toast({ title: 'Succès', status: 'success' })

// ✅ UTILISER react-hot-toast
import toast from 'react-hot-toast'

toast.success('Succès')
toast.error('Erreur')
```

### CircularProgress
```tsx
// ❌ NE PLUS UTILISER
<CircularProgress value={60} />

// ✅ UTILISER Spinner ou Progress
<Spinner size="xl" color="purple.500" />
// ou
<Progress value={60} />
```

---

## 5. 📦 Imports Corrects

### Composants de Base
```tsx
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  Spinner,
  Progress,
  Badge,
  Avatar,
  Card,
  CardBody,
  CardHeader,
} from '@chakra-ui/react'
```

### Ne PLUS Importer
```tsx
// ❌ NE PLUS IMPORTER
import {
  Icon,
  Stack,
  useColorModeValue,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  MenuButton,
  MenuList,
  MenuItem,
  CircularProgress,
  useToast,
  BreadcrumbLink,
} from '@chakra-ui/react'
```

---

## 6. ✅ Checklist de Vérification

Avant de commiter, vérifiez :

- [ ] Pas d'import de `Icon` de Chakra UI
- [ ] Pas d'utilisation de `Icon as={...}`
- [ ] Pas d'utilisation de `useColorModeValue`
- [ ] Pas d'utilisation de `useDisclosure` (utiliser `useState`)
- [ ] Pas d'utilisation de `Stack` (utiliser `Flex`)
- [ ] Pas d'utilisation de `Drawer` (implémentation personnalisée)
- [ ] Pas d'utilisation de `MenuButton`/`MenuList` (implémentation personnalisée)
- [ ] Pas d'utilisation de `useToast` (utiliser `react-hot-toast`)
- [ ] Pas d'utilisation de `CircularProgress` (utiliser `Spinner`)
- [ ] Pas d'utilisation de `BreadcrumbLink as={Link}` (utiliser `useRouter` ou `NextLink` wrapper)
- [ ] Pas d'utilisation de `Card as={NextLink}` (utiliser `onClick` avec `router.push`)

---

## 7. 🔍 Recherche d'Erreurs

Pour trouver les problèmes dans votre code :

```bash
# Chercher les imports problématiques
grep -r "Icon.*from '@chakra-ui/react'" components/
grep -r "useColorModeValue" components/
grep -r "useDisclosure" components/
grep -r "Stack" components/
grep -r "Drawer" components/
grep -r "MenuButton" components/
grep -r "useToast" components/
grep -r "CircularProgress" components/

# Chercher les utilisations problématiques
grep -r "Icon as=" components/
grep -r "as={NextLink}" components/
grep -r "as={Link}" components/
```

---

## 8. 📚 Ressources

- [Chakra UI v3 Documentation](https://chakra-ui.com/)
- [react-icons Documentation](https://react-icons.github.io/react-icons/)
- [react-hot-toast Documentation](https://react-hot-toast.com/)

---

**Dernière mise à jour :** 2024-12-21

