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
  Badge,
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
} from '@chakra-ui/react';
import { useWorkspaces, useCreateWorkspace, useUpdateWorkspace, useDeleteWorkspace, Workspace } from './workspaces.hooks';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const WorkspaceForm: FC<{
  workspace?: Workspace;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ workspace, isOpen, onClose, onSuccess }) => {
  const t = useT();
  const [name, setName] = useState(workspace?.name || '');
  const [description, setDescription] = useState(workspace?.description || '');
  const createWorkspace = useCreateWorkspace();
  const updateWorkspace = useUpdateWorkspace();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      if (workspace) {
        await updateWorkspace(workspace.id, { name, description });
        toast({
          title: t('workspace_updated', 'Workspace mis à jour'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createWorkspace({ name, description });
        toast({
          title: t('workspace_created', 'Workspace créé'),
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
  }, [name, description, workspace, createWorkspace, updateWorkspace, onSuccess, onClose, toast, t]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {workspace ? t('edit_workspace', 'Modifier le Workspace') : t('create_workspace', 'Créer un Workspace')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text mb={2} fontSize="sm" fontWeight="medium">
                {t('name', 'Nom')}
              </Text>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('workspace_name', 'Nom du workspace')}
              />
            </Box>
            <Box>
              <Text mb={2} fontSize="sm" fontWeight="medium">
                {t('description', 'Description')}
              </Text>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('workspace_description', 'Description du workspace')}
                rows={3}
              />
            </Box>
            <HStack justify="flex-end" spacing={3}>
              <Button onClick={onClose} variant="outline">
                {t('cancel', 'Annuler')}
              </Button>
              <Button onClick={submit} isLoading={loading} colorScheme="blue">
                {workspace ? t('update', 'Mettre à jour') : t('create', 'Créer')}
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const WorkspacesComponent: FC = () => {
  const t = useT();
  const { data: workspaces, mutate, isLoading } = useWorkspaces();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | undefined>();
  const toast = useToast();
  const deleteWorkspace = useDeleteWorkspace();

  const handleEdit = useCallback(
    (workspace: Workspace) => {
      setSelectedWorkspace(workspace);
      onEditOpen();
    },
    [onEditOpen]
  );

  const handleDelete = useCallback(
    async (workspace: Workspace) => {
      if (
        await deleteDialog(
          t('are_you_sure_delete_workspace', `Êtes-vous sûr de vouloir supprimer ${workspace.name}?`, {
            name: workspace.name,
          })
        )
      ) {
        try {
          await deleteWorkspace(workspace.id);
          toast({
            title: t('workspace_deleted', 'Workspace supprimé'),
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
    [deleteWorkspace, mutate, toast, t]
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
            <Heading size="lg">{t('workspaces', 'Workspaces')}</Heading>
            <Text color="gray.400" mt={1}>
              {t('workspaces_description', 'Organisez vos posts, intégrations et médias en espaces de travail dédiés')}
            </Text>
          </Box>
          <Button onClick={onCreateOpen} colorScheme="blue">
            {t('create_workspace', 'Créer un Workspace')}
          </Button>
        </HStack>

        {!workspaces || workspaces.length === 0 ? (
          <Card>
            <CardBody>
              <VStack spacing={4} py={12}>
                <Box fontSize="4xl">🏢</Box>
                <Heading size="md">{t('no_workspaces', 'Aucun workspace')}</Heading>
                <Text color="gray.400" textAlign="center">
                  {t('create_first_workspace', 'Créez votre premier workspace pour commencer')}
                </Text>
                <Button onClick={onCreateOpen} colorScheme="blue">
                  {t('create_workspace', 'Créer un Workspace')}
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
            {workspaces.map((workspace) => (
              <Card key={workspace.id} _hover={{ borderColor: 'blue.500' }} transition="all 0.2s">
                <CardHeader>
                  <HStack justify="space-between">
                    <Heading size="md">{workspace.name}</Heading>
                    <HStack>
                      <IconButton
                        aria-label={t('edit', 'Modifier')}
                        icon={<EditIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(workspace)}
                      />
                      <IconButton
                        aria-label={t('delete', 'Supprimer')}
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(workspace)}
                      />
                    </HStack>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  {workspace.description && (
                    <Text color="gray.400" mb={4} fontSize="sm">
                      {workspace.description}
                    </Text>
                  )}
                  <HStack spacing={4} fontSize="xs" color="gray.400">
                    <HStack>
                      <Text>📄</Text>
                      <Text>
                        {workspace._count?.posts || 0} {t('posts', 'posts')}
                      </Text>
                    </HStack>
                    <HStack>
                      <Text>🔗</Text>
                      <Text>
                        {workspace._count?.integrations || 0} {t('integrations', 'intégrations')}
                      </Text>
                    </HStack>
                    <HStack>
                      <Text>🖼️</Text>
                      <Text>
                        {workspace._count?.media || 0} {t('media', 'médias')}
                      </Text>
                    </HStack>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </VStack>

      <WorkspaceForm
        workspace={selectedWorkspace}
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          setSelectedWorkspace(undefined);
        }}
        onSuccess={() => {
          mutate();
          onEditClose();
          setSelectedWorkspace(undefined);
        }}
      />

      <WorkspaceForm
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

