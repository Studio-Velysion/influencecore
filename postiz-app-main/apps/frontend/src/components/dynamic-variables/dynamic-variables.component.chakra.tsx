'use client';

import { FC, useCallback, useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Grid,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Center,
  Select,
  Badge,
  Code,
} from '@chakra-ui/react';
import {
  useDynamicVariables,
  useCreateDynamicVariable,
  useUpdateDynamicVariable,
  useDeleteDynamicVariable,
  useResolveVariables,
  DynamicVariable,
} from './dynamic-variables.hooks';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useWorkspaces } from '../workspaces/workspaces.hooks';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const VARIABLE_TYPES = [
  { value: 'CUSTOM', label: 'Personnalisée' },
  { value: 'DATE', label: 'Date' },
  { value: 'TIME', label: 'Heure' },
  { value: 'USERNAME', label: "Nom d'utilisateur" },
  { value: 'HASHTAG', label: 'Hashtag' },
];

const VariableForm: FC<{
  variable?: DynamicVariable;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ variable, isOpen, onClose, onSuccess }) => {
  const t = useT();
  const [name, setName] = useState(variable?.name.replace(/[{}]/g, '') || '');
  const [workspaceId, setWorkspaceId] = useState(variable?.workspaceId || '');
  const [value, setValue] = useState(variable?.value || '');
  const [type, setType] = useState<string>(variable?.type || 'CUSTOM');
  const createVariable = useCreateDynamicVariable();
  const updateVariable = useUpdateDynamicVariable();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { data: workspaces } = useWorkspaces();

  const submit = useCallback(async () => {
    if (!name.trim()) {
      toast({
        title: t('name_required', 'Le nom est requis'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (type === 'CUSTOM' && !value.trim()) {
      toast({
        title: t('value_required', 'La valeur est requise pour les variables personnalisées'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const variableName = name.startsWith('{') ? name : `{${name}}`;
      if (variable) {
        await updateVariable(variable.id, {
          name: variableName,
          value: type === 'CUSTOM' ? value : undefined,
          type,
        });
        toast({
          title: t('variable_updated', 'Variable mise à jour'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createVariable({
          name: variableName,
          workspaceId: workspaceId || undefined,
          value: type === 'CUSTOM' ? value : undefined,
          type,
          isSystem: false,
        });
        toast({
          title: t('variable_created', 'Variable créée'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: t('error_occurred', 'Une erreur est survenue'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [
    name,
    workspaceId,
    value,
    type,
    variable,
    createVariable,
    updateVariable,
    onSuccess,
    onClose,
    toast,
    t,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {variable ? t('edit_variable', 'Modifier la Variable') : t('create_variable', 'Créer une Variable')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text mb={2} fontSize="sm" fontWeight="medium">
                {t('name', 'Nom')}
              </Text>
              <HStack>
                <Text fontSize="sm" color="gray.400">
                  {'{'}
                </Text>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value.replace(/[{}]/g, ''))}
                  placeholder="variable_name"
                  flex={1}
                />
                <Text fontSize="sm" color="gray.400">
                  {'}'}
                </Text>
              </HStack>
            </Box>
            {!variable && workspaces && workspaces.length > 0 && (
              <Box>
                <Text mb={2} fontSize="sm" fontWeight="medium">
                  {t('workspace', 'Workspace')}
                </Text>
                <Select
                  value={workspaceId}
                  onChange={(e) => setWorkspaceId(e.target.value)}
                  placeholder={t('no_workspace', 'Aucun workspace')}
                >
                  {workspaces.map((ws) => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name}
                    </option>
                  ))}
                </Select>
              </Box>
            )}
            <Box>
              <Text mb={2} fontSize="sm" fontWeight="medium">
                {t('type', 'Type')}
              </Text>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                {VARIABLE_TYPES.map((vt) => (
                  <option key={vt.value} value={vt.value}>
                    {vt.label}
                  </option>
                ))}
              </Select>
            </Box>
            {type === 'CUSTOM' && (
              <Box>
                <Text mb={2} fontSize="sm" fontWeight="medium">
                  {t('value', 'Valeur')}
                </Text>
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={t('variable_value', 'Valeur de la variable')}
                />
              </Box>
            )}
            <HStack justify="flex-end" spacing={3}>
              <Button onClick={onClose} variant="outline">
                {t('cancel', 'Annuler')}
              </Button>
              <Button onClick={submit} isLoading={loading} colorScheme="blue">
                {variable ? t('update', 'Mettre à jour') : t('create', 'Créer')}
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ResolveTest: FC = () => {
  const t = useT();
  const [content, setContent] = useState('');
  const [resolved, setResolved] = useState('');
  const resolveVariables = useResolveVariables();
  const [loading, setLoading] = useState(false);

  const handleResolve = useCallback(async () => {
    if (!content.trim()) {
      return;
    }
    setLoading(true);
    try {
      const result = await resolveVariables(content);
      setResolved(result);
    } catch (error) {
      // Ignore
    } finally {
      setLoading(false);
    }
  }, [content, resolveVariables]);

  return (
    <Card>
      <CardHeader>
        <Heading size="md">{t('test_resolution', 'Tester la Résolution')}</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <Box>
            <Text mb={2} fontSize="sm" fontWeight="medium">
              {t('content', 'Contenu')}
            </Text>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bonjour {username}, aujourd'hui c'est le {date}"
              rows={3}
            />
          </Box>
          <Button onClick={handleResolve} isLoading={loading} variant="outline" width="full">
            {t('resolve', 'Résoudre')}
          </Button>
          {resolved && (
            <Box>
              <Text mb={2} fontSize="sm" fontWeight="medium">
                {t('resolved', 'Résolu')}
              </Text>
              <Box p={3} bg="gray.100" borderRadius="md">
                <Text fontSize="sm">{resolved}</Text>
              </Box>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export const DynamicVariablesComponent: FC = () => {
  const t = useT();
  const { data, mutate, isLoading } = useDynamicVariables();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedVariable, setSelectedVariable] = useState<DynamicVariable | undefined>();
  const toast = useToast();
  const deleteVariable = useDeleteDynamicVariable();

  const variables = data?.variables || [];
  const systemVariables = data?.systemVariables || [];

  const handleEdit = useCallback(
    (variable: DynamicVariable) => {
      setSelectedVariable(variable);
      onEditOpen();
    },
    [onEditOpen]
  );

  const handleDelete = useCallback(
    async (variable: DynamicVariable) => {
      if (
        await deleteDialog(
          t('are_you_sure_delete_variable', `Êtes-vous sûr de vouloir supprimer ${variable.name}?`, {
            name: variable.name,
          })
        )
      ) {
        try {
          await deleteVariable(variable.id);
          toast({
            title: t('variable_deleted', 'Variable supprimée'),
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          mutate();
        } catch (error) {
          toast({
            title: t('error_occurred', 'Une erreur est survenue'),
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      }
    },
    [deleteVariable, mutate, toast, t]
  );

  if (isLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Box>
            <Heading size="lg">{t('dynamic_variables', 'Variables Dynamiques')}</Heading>
            <Text color="gray.400" mt={1}>
              {t('variables_description', 'Créez des variables dynamiques pour personnaliser vos posts')}
            </Text>
          </Box>
          <Button onClick={onCreateOpen} colorScheme="blue">
            {t('create_variable', 'Créer une Variable')}
          </Button>
        </HStack>

        <ResolveTest />

        {systemVariables.length > 0 && (
          <Box>
            <Heading size="md" mb={4}>
              {t('system_variables', 'Variables Système')}
            </Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={3}>
              {systemVariables.map((sv) => (
                <Card key={sv.name}>
                  <CardBody>
                    <HStack mb={2}>
                      <Code fontSize="sm" colorScheme="blue">
                        {sv.name}
                      </Code>
                      <Badge colorScheme="blue" fontSize="xs">
                        {t('system', 'Système')}
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.400">
                      {sv.description}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </Grid>
          </Box>
        )}

        <Box>
          <Heading size="md" mb={4}>
            {t('custom_variables', 'Variables Personnalisées')}
          </Heading>
          {variables.length === 0 ? (
            <Card>
              <CardBody>
                <VStack spacing={4} py={12}>
                  <Box fontSize="4xl">💲</Box>
                  <Heading size="md">{t('no_variables', 'Aucune variable')}</Heading>
                  <Text color="gray.400" textAlign="center">
                    {t('create_first_variable', 'Créez votre première variable personnalisée')}
                  </Text>
                  <Button onClick={onCreateOpen} colorScheme="blue">
                    {t('create_variable', 'Créer une Variable')}
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ) : (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
              {variables.map((variable) => (
                <Card key={variable.id} _hover={{ borderColor: 'blue.500' }} transition="all 0.2s">
                  <CardHeader>
                    <HStack justify="space-between">
                      <Code fontSize="md" colorScheme="blue">
                        {variable.name}
                      </Code>
                      <HStack>
                        <IconButton
                          aria-label={t('edit', 'Modifier')}
                          icon={<EditIcon />}
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(variable)}
                        />
                        <IconButton
                          aria-label={t('delete', 'Supprimer')}
                          icon={<DeleteIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDelete(variable)}
                        />
                      </HStack>
                    </HStack>
                  </CardHeader>
                  <CardBody pt={0}>
                    <VStack spacing={1} align="stretch">
                      <Text fontSize="xs" color="gray.400">
                        {t('type', 'Type')}: <Text as="span" color="gray.300">{variable.type}</Text>
                      </Text>
                      {variable.value && (
                        <Text fontSize="xs" color="gray.400">
                          {t('value', 'Valeur')}: <Text as="span" color="gray.300">{variable.value}</Text>
                        </Text>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </Grid>
          )}
        </Box>
      </VStack>

      <VariableForm
        variable={selectedVariable}
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          setSelectedVariable(undefined);
        }}
        onSuccess={() => {
          mutate();
          onEditClose();
          setSelectedVariable(undefined);
        }}
      />

      <VariableForm
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSuccess={() => {
          mutate();
          onCreateClose();
        }}
      />
    </Box>
  );
};

