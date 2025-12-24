'use client';

import { FC, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  IconButton,
  useToast,
  Spinner,
  Center,
  Badge,
} from '@chakra-ui/react';
import { usePostVersions, useDeletePostVersion, PostVersion } from './post-versions.hooks';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { DeleteIcon } from '@chakra-ui/icons';

interface PostVersionsComponentProps {
  postId: string;
  onVersionSelect?: (version: PostVersion) => void;
  selectedVersionId?: string;
}

export const PostVersionsComponent: FC<PostVersionsComponentProps> = ({
  postId,
  onVersionSelect,
  selectedVersionId,
}) => {
  const t = useT();
  const { data: versions, mutate, isLoading } = usePostVersions(postId);
  const deleteVersion = useDeletePostVersion();
  const toast = useToast();

  const handleDelete = useCallback(
    async (version: PostVersion) => {
      if (
        await deleteDialog(
          t('are_you_sure_delete_version', 'Êtes-vous sûr de vouloir supprimer cette version?')
        )
      ) {
        try {
          await deleteVersion(version.id);
          toast({
            title: t('version_deleted', 'Version supprimée'),
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
    [deleteVersion, mutate, toast, t]
  );

  if (isLoading) {
    return (
      <Center h="200px">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <Card>
        <CardBody>
          <VStack spacing={4} py={8}>
            <Box fontSize="3xl">📄</Box>
            <Text color="gray.400" fontSize="sm">
              {t('no_versions', 'Aucune version')}
            </Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        {t('post_versions', 'Versions du Post')}
      </Heading>
      <VStack spacing={3} align="stretch">
        {versions.map((version) => {
          const content = Array.isArray(version.content) ? version.content[0] : version.content;
          const preview = content?.body?.substring(0, 100) || '';

          return (
            <Card
              key={version.id}
              cursor="pointer"
              onClick={() => onVersionSelect?.(version)}
              borderColor={selectedVersionId === version.id ? 'blue.500' : 'gray.200'}
              borderWidth={selectedVersionId === version.id ? 2 : 1}
              bg={selectedVersionId === version.id ? 'blue.50' : 'white'}
              _hover={{ borderColor: 'blue.500' }}
              transition="all 0.2s"
            >
              <CardBody>
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={2} flex={1}>
                    <HStack spacing={2}>
                      {version.isOriginal && (
                        <Badge colorScheme="blue" fontSize="xs">
                          {t('original', 'Original')}
                        </Badge>
                      )}
                      {version.accountId && (
                        <Text fontSize="xs" color="gray.400">
                          {t('account', 'Compte')}: {version.accountId.substring(0, 8)}...
                        </Text>
                      )}
                    </HStack>
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {preview}...
                    </Text>
                  </VStack>
                  {!version.isOriginal && (
                    <IconButton
                      aria-label={t('delete', 'Supprimer')}
                      icon={<DeleteIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(version);
                      }}
                    />
                  )}
                </HStack>
              </CardBody>
            </Card>
          );
        })}
      </VStack>
    </Box>
  );
};

