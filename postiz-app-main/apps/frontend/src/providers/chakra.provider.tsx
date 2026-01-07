'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ReactNode, useMemo } from 'react';

export function ChakraUIProvider({ children }: { children: ReactNode }) {
  // Mémoriser le système pour éviter les re-renders
  const system = useMemo(() => defaultSystem, []);
  
  return (
    <ChakraProvider value={system}>
      {children}
    </ChakraProvider>
  );
}

