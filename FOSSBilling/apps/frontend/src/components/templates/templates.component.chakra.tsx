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
} from '@chakra-ui/react';
import {
  useTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  Template,
} from './templates.hooks';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useWorkspaces } from '../workspaces/workspaces.hooks';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const TemplateForm: FC<{
  template?: Template;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ template, isOpen, onClose, onSuccess }) => {
  const t = useT();
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [workspaceId, setWorkspaceId] = useState(template?.workspaceId || '');
  const [content, setContent] = useState(
    template?.content ? JSON.stringify(template.content, null, 2) : '{\n  "body": "",\n  "media": []\n}'
  );
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
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

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (error) {
      toast({
        title: t('invalid_json', 'JSON invalide'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      if (template) {
        await updateTemplate(template.id, {
          name,
          description,
          content: parsedContent,
        });
        toast({
          title: t('template_updated', 'Template mis à jour'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createTemplate({
          name,
          description,
          workspaceId: workspaceId || undefined,
          content: parsedContent,
        });
        toast({
          title: t('template_created', 'Template créé'),
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
    description,
    workspaceId,
    content,
    template,
    createTemplate,
    updateTemplate,
    onSuccess,
    onClose,
    toast,
    t,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {template ? t('edit_template', 'Modifier le Template') : t('create_template', 'Créer un Template')}
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
                placeholder={t('template_name', 'Nom du template')}
              />
            </Box>
            {!template && workspaces && workspaces.length > 0 && (
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
                {t('description', 'Description')}
              </Text>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('template_description', 'Description du template')}
                rows={2}
              />
            </Box>
            <Box>
              <Text mb={2} fontSize="sm" fontWeight="medium">
                {t('content', 'Contenu')} (JSON)
              </Text>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='{"body": "", "media": []}'
                rows={8}
                fontFamily="mono"
                fontSize="xs"
              />
            </Box>
            <HStack justify="flex-end" spacing={3}>
              <Button onClick={onClose} variant="outline">
                {t('cancel', 'Annuler')}
              </Button>
              <Button onClick={submit} isLoading={loading} colorScheme="blue">
                {template ? t('update', 'Mettre à jour') : t('create', 'Créer')}
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const TemplatesComponent: FC = () => {
  const t = useT();
  const { data: templates, mutate, isLoading } = useTemplates();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>();
  const toast = useToast();
  const deleteTemplate = useDeleteTemplate();

  const handleEdit = useCallback(
    (template: Template) => {
      setSelectedTemplate(template);
      onEditOpen();
    },
    [onEditOpen]
  );

  const handleDelete = useCallback(
    async (template: Template) => {
      if (
        await deleteDialog(
          t('are_you_sure_delete_template', `Êtes-vous sûr de vouloir supprimer ${template.name}?`, {
            name: template.name,
          })
        )
      ) {
        try {
          await deleteTemplate(template.id);
          toast({
            title: t('template_deleted', 'Template supprimé'),
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
    [deleteTemplate, mutate, toast, t]
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
            <Heading size="lg">{t('templates', 'Templates')}</Heading>
            <Text color="gray.400" mt={1}>
              {t('templates_description', 'Créez et réutilisez des templates de posts')}
            </Text>
          </Box>
          <Button onClick={onCreateOpen} colorScheme="blue">
            {t('create_template', 'Créer un Template')}
          </Button>
        </HStack>

        {!templates || templates.length === 0 ? (
          <Card>
            <CardBody>
              <VStack spacing={4} py={12}>
                <Box fontSize="4xl">📄</Box>
                <Heading size="md">{t('no_templates', 'Aucun template')}</Heading>
                <Text color="gray.400" textAlign="center">
                  {t('create_first_template', 'Créez votre premier template pour commencer')}
                </Text>
                <Button onClick={onCreateOpen} colorScheme="blue">
                  {t('create_template', 'Créer un Template')}
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
            {templates.map((template) => (
              <Card key={template.id} _hover={{ borderColor: 'blue.500' }} transition="all 0.2s">
                <CardHeader>
                  <HStack justify="space-between">
                    <Heading size="md">{template.name}</Heading>
                    <HStack>
                      <IconButton
                        aria-label={t('edit', 'Modifier')}
                        icon={<EditIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(template)}
                      />
                      <IconButton
                        aria-label={t('delete', 'Supprimer')}
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(template)}
                      />
                    </HStack>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  {template.description && (
                    <Text color="gray.400" mb={4} fontSize="sm" noOfLines={2}>
                      {template.description}
                    </Text>
                  )}
                  <Text fontSize="xs" color="gray.400">
                    {t('created', 'Créé')} {new Date(template.createdAt).toLocaleDateString()}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </VStack>

      <TemplateForm
        template={selectedTemplate}
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          setSelectedTemplate(undefined);
        }}
        onSuccess={() => {
          mutate();
          onEditClose();
          setSelectedTemplate(undefined);
        }}
      />

      <TemplateForm
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

