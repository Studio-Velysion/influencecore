# 🎨 Guide d'Utilisation des Icônes avec Chakra UI v3

## ⚠️ Méthode à NE JAMAIS utiliser

### ❌ Ancienne méthode (ne fonctionne PAS avec Chakra UI v3)

```tsx
import { Icon } from '@chakra-ui/react'
import { FiVideo } from 'react-icons/fi'

// ❌ NE PAS FAIRE CECI
<Icon as={FiVideo} h="24px" w="24px" color="white" />
```

**Pourquoi ça ne marche pas ?**
- Chakra UI v3 ne supporte plus `Icon` avec `as={...}` pour les icônes externes
- Cela génère l'erreur : `Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object`

---

## ✅ Méthode correcte pour Chakra UI v3

### Utiliser directement les composants react-icons

```tsx
import { FiVideo } from 'react-icons/fi'

// ✅ FAIRE CECI
<FiVideo size={24} color="white" />
```

### Exemple complet dans un composant

```tsx
'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import { Card, CardBody } from '@chakra-ui/react'
import { FiVideo, FiFileText, FiCalendar } from 'react-icons/fi'

export default function MonComposant() {
  return (
    <Card>
      <CardBody>
        <Flex align="center" gap={4}>
          <Box
            h="45px"
            w="45px"
            bg="purple.500"
            borderRadius="12px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {/* ✅ Méthode correcte */}
            <FiVideo size={24} color="white" />
          </Box>
          <Text>Ma carte</Text>
        </Flex>
      </CardBody>
    </Card>
  )
}
```

---

## 📚 Bibliothèques d'icônes supportées

### react-icons/fi (Feather Icons) - Recommandé

```tsx
import { FiHome, FiUser, FiSettings } from 'react-icons/fi'

<FiHome size={20} color="#9333EA" />
```

### Autres bibliothèques react-icons

```tsx
// Material Design Icons
import { MdHome, MdPerson } from 'react-icons/md'

// Font Awesome
import { FaHome, FaUser } from 'react-icons/fa'

// Bootstrap Icons
import { BsHouse, BsPerson } from 'react-icons/bs'
```

**Toutes fonctionnent de la même manière** : utiliser directement le composant avec `size` et `color`.

---

## 🎯 Propriétés disponibles

### Propriétés communes pour react-icons

- `size` : Taille de l'icône en pixels (number)
- `color` : Couleur de l'icône (string, ex: `"white"`, `"#9333EA"`)
- `className` : Classe CSS optionnelle (string)
- `style` : Styles inline optionnels (object)

### Exemples

```tsx
// Taille et couleur de base
<FiHome size={24} color="white" />

// Avec couleur Chakra UI
<FiHome size={24} color="purple.500" />

// Avec className
<FiHome size={24} color="white" className="my-icon" />

// Avec styles inline
<FiHome size={24} color="white" style={{ opacity: 0.8 }} />
```

---

## 🔍 Vérification rapide

Avant de commiter votre code, vérifiez que vous n'avez pas :

1. ❌ `import { Icon } from '@chakra-ui/react'` (sauf si vraiment nécessaire pour autre chose)
2. ❌ `<Icon as={...} />` avec des icônes react-icons
3. ✅ Utilisation directe : `<FiIconName size={...} color={...} />`

---

## 📝 Checklist

- [ ] Pas d'import de `Icon` de Chakra UI pour les icônes externes
- [ ] Utilisation directe des composants react-icons
- [ ] Propriété `size` au lieu de `h` et `w`
- [ ] Propriété `color` au lieu de `color` dans `Icon`

---

## 🆘 En cas d'erreur

Si vous voyez cette erreur :
```
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.
```

**Solution** :
1. Cherchez `Icon as={...}` dans votre code
2. Remplacez par l'utilisation directe du composant d'icône
3. Supprimez l'import `Icon` s'il n'est plus utilisé

---

## 📖 Ressources

- [Documentation react-icons](https://react-icons.github.io/react-icons/)
- [Chakra UI v3 Migration Guide](https://chakra-ui.com/getting-started/migration)

