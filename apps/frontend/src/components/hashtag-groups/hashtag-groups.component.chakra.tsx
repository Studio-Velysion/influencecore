'use client';

import { FC, useCallback, useState } from 'react';
import {
  Button,
  Input,
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
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
} from '@chakra-ui/react';
import {
  useHashtagGroups,
  useCreateHashtagGroup,
  useUpdateHashtagGroup,
  useDeleteHashtagGroup,
  HashtagGroup,
} from './hashtag-groups.hooks';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useWorkspaces } from '../workspaces/workspaces.hooks';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const HashtagGroupForm: FC<{
  group?: HashtagGroup;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ group, isOpen, onClose, onSuccess }) => {
  const t = useT();
  const [name, setName] = useState(group?.name || '');
  const [workspaceId, setWorkspaceId] = useState(group?.workspaceId || '');
  const [hashtags, setHashtags] = useState<string[]>(group?.hashtags || []);
  const [newHashtag, setNewHashtag] = useState('');
  const createGroup = useCreateHashtagGroup();
  const updateGroup = useUpdateHashtagGroup();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { data: workspaces } = useWorkspaces();

  const addHashtag = useCallback(() => {
    const tag = newHashtag.trim().replace(/^#/, '');
    if (tag && !hashtags.includes(`#${tag}`)) {
      setHashtags([...hashtags, `#${tag}`]);
      setNewHashtag('');
    }
  }, [newHashtag, hashtags]);

  const removeHashtag = useCallback((tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  }, [hashtags]);

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
    if (hashtags.length === 0) {
      toast({
        title: t('at_least_one_hashtag', 'Au moins un hashtag est requis'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      if (group) {
        await updateGroup(group.id, { name, hashtags });
        toast({
          title: t('hashtag_group_updated', 'Groupe de hashtags mis à jour'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createGroup({
          name,
          workspaceId: workspaceId || undefined,
          hashtags,
        });
        toast({
          title: t('hashtag_group_created', 'Groupe de hashtags créé'),
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
    hashtags,
    group,
    createGroup,
    updateGroup,
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
          {group ? t('edit_hashtag_group', 'Modifier le Groupe de Hashtags') : t('create_hashtag_group', 'Créer un Groupe de Hashtags')}
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
                placeholder={t('group_name', 'Nom du groupe')}
              />
            </Box>
            {!group && workspaces && workspaces.length > 0 && (
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
                {t('hashtags', 'Hashtags')}
              </Text>
              <Wrap spacing={2} mb={2}>
                {hashtags.map((tag) => (
                  <Tag key={tag} size="md" colorScheme="purple">
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => removeHashtag(tag)} />
                  </Tag>
                ))}
              </Wrap>
              <HStack>
                <Input
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                  placeholder="#hashtag"
                  flex={1}
                />
                <Button onClick={addHashtag} size="sm" variant="outline">
                  {t('add', 'Ajouter')}
                </Button>
              </HStack>
            </Box>
            <HStack justify="flex-end" spacing={3}>
              <Button onClick={onClose} variant="outline">
                {t('cancel', 'Annuler')}
              </Button>
              <Button onClick={submit} isLoading={loading} colorScheme="blue">
                {group ? t('update', 'Mettre à jour') : t('create', 'Créer')}
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const HashtagGroupsComponent: FC = () => {
  const t = useT();
  const { data: groups, mutate, isLoading } = useHashtagGroups();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedGroup, setSelectedGroup] = useState<HashtagGroup | undefined>();
  const toast = useToast();
  const deleteGroup = useDeleteHashtagGroup();

  const handleEdit = useCallback(
    (group: HashtagGroup) => {
      setSelectedGroup(group);
      onEditOpen();
    },
    [onEditOpen]
  );

  const handleDelete = useCallback(
    async (group: HashtagGroup) => {
      if (
        await deleteDialog(
          t('are_you_sure_delete_group', `Êtes-vous sûr de vouloir supprimer ${group.name}?`, {
            name: group.name,
          })
        )
      ) {
        try {
          await deleteGroup(group.id);
          toast({
            title: t('hashtag_group_deleted', 'Groupe de hashtags supprimé'),
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
    [deleteGroup, mutate, toast, t]
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
            <Heading size="lg">{t('hashtag_groups', 'Groupes de Hashtags')}</Heading>
            <Text color="gray.400" mt={1}>
              {t('hashtag_groups_description', 'Organisez vos hashtags en groupes réutilisables')}
            </Text>
          </Box>
          <Button onClick={onCreateOpen} colorScheme="blue">
            {t('create_hashtag_group', 'Créer un Groupe')}
          </Button>
        </HStack>

        {!groups || groups.length === 0 ? (
          <Card>
            <CardBody>
              <VStack spacing={4} py={12}>
                <Box fontSize="4xl">🏷️</Box>
                <Heading size="md">{t('no_hashtag_groups', 'Aucun groupe')}</Heading>
                <Text color="gray.400" textAlign="center">
                  {t('create_first_group', 'Créez votre premier groupe de hashtags')}
                </Text>
                <Button onClick={onCreateOpen} colorScheme="blue">
                  {t('create_hashtag_group', 'Créer un Groupe')}
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
            {groups.map((group) => (
              <Card key={group.id} _hover={{ borderColor: 'blue.500' }} transition="all 0.2s">
                <CardHeader>
                  <HStack justify="space-between">
                    <Heading size="md">{group.name}</Heading>
                    <HStack>
                      <IconButton
                        aria-label={t('edit', 'Modifier')}
                        icon={<EditIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(group)}
                      />
                      <IconButton
                        aria-label={t('delete', 'Supprimer')}
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(group)}
                      />
                    </HStack>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <Wrap spacing={2}>
                    {group.hashtags.map((tag) => (
                      <Tag key={tag} size="sm" colorScheme="purple">
                        {tag}
                      </Tag>
                    ))}
                  </Wrap>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </VStack>

      <HashtagGroupForm
        group={selectedGroup}
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          setSelectedGroup(undefined);
        }}
        onSuccess={() => {
          mutate();
          onEditClose();
          setSelectedGroup(undefined);
        }}
      />

      <HashtagGroupForm
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

