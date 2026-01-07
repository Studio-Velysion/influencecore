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
  Select,
  Checkbox,
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
  Wrap,
} from '@chakra-ui/react';
import {
  useQueues,
  useCreateQueue,
  useUpdateQueue,
  useDeleteQueue,
  Queue,
} from './queues.hooks';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useWorkspaces } from '../workspaces/workspaces.hooks';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const DAYS = [
  { value: 'monday', label: 'Lundi' },
  { value: 'tuesday', label: 'Mardi' },
  { value: 'wednesday', label: 'Mercredi' },
  { value: 'thursday', label: 'Jeudi' },
  { value: 'friday', label: 'Vendredi' },
  { value: 'saturday', label: 'Samedi' },
  { value: 'sunday', label: 'Dimanche' },
];

const QueueForm: FC<{
  queue?: Queue;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ queue, isOpen, onClose, onSuccess }) => {
  const t = useT();
  const [name, setName] = useState(queue?.name || '');
  const [workspaceId, setWorkspaceId] = useState(queue?.workspaceId || '');
  const [times, setTimes] = useState<string[]>(queue?.schedule?.times || ['09:00', '12:00', '15:00']);
  const [days, setDays] = useState<string[]>(queue?.schedule?.days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  const [isActive, setIsActive] = useState(queue?.isActive ?? true);
  const createQueue = useCreateQueue();
  const updateQueue = useUpdateQueue();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { data: workspaces } = useWorkspaces();
  const [newTime, setNewTime] = useState('');

  const addTime = useCallback(() => {
    if (newTime && !times.includes(newTime)) {
      setTimes([...times, newTime].sort());
      setNewTime('');
    }
  }, [newTime, times]);

  const removeTime = useCallback((time: string) => {
    setTimes(times.filter((t) => t !== time));
  }, [times]);

  const toggleDay = useCallback((day: string) => {
    if (days.includes(day)) {
      setDays(days.filter((d) => d !== day));
    } else {
      setDays([...days, day]);
    }
  }, [days]);

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
    if (times.length === 0) {
      toast({
        title: t('at_least_one_time', 'Au moins un horaire est requis'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (days.length === 0) {
      toast({
        title: t('at_least_one_day', 'Au moins un jour est requis'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      if (queue) {
        await updateQueue(queue.id, {
          name,
          schedule: { times, days },
          isActive,
        });
        toast({
          title: t('queue_updated', 'Queue mise à jour'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createQueue({
          name,
          workspaceId: workspaceId || undefined,
          schedule: { times, days },
          isActive,
        });
        toast({
          title: t('queue_created', 'Queue créée'),
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
    times,
    days,
    isActive,
    queue,
    createQueue,
    updateQueue,
    onSuccess,
    onClose,
    toast,
    t,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {queue ? t('edit_queue', 'Modifier la Queue') : t('create_queue', 'Créer une Queue')}
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
                placeholder={t('queue_name', 'Nom de la queue')}
              />
            </Box>
            {!queue && workspaces && workspaces.length > 0 && (
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
                {t('times', 'Horaires')}
              </Text>
              <Wrap spacing={2} mb={2}>
                {times.map((time) => (
                  <Tag key={time} size="md" colorScheme="blue">
                    <TagLabel>{time}</TagLabel>
                    <TagCloseButton onClick={() => removeTime(time)} />
                  </Tag>
                ))}
              </Wrap>
              <HStack>
                <Input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  flex={1}
                />
                <Button onClick={addTime} size="sm" variant="outline">
                  {t('add', 'Ajouter')}
                </Button>
              </HStack>
            </Box>
            <Box>
              <Text mb={2} fontSize="sm" fontWeight="medium">
                {t('days', 'Jours')}
              </Text>
              <Wrap spacing={2}>
                {DAYS.map((day) => (
                  <Button
                    key={day.value}
                    size="sm"
                    onClick={() => toggleDay(day.value)}
                    colorScheme={days.includes(day.value) ? 'blue' : 'gray'}
                    variant={days.includes(day.value) ? 'solid' : 'outline'}
                  >
                    {day.label}
                  </Button>
                ))}
              </Wrap>
            </Box>
            <Checkbox isChecked={isActive} onChange={(e) => setIsActive(e.target.checked)}>
              {t('active', 'Actif')}
            </Checkbox>
            <HStack justify="flex-end" spacing={3}>
              <Button onClick={onClose} variant="outline">
                {t('cancel', 'Annuler')}
              </Button>
              <Button onClick={submit} isLoading={loading} colorScheme="blue">
                {queue ? t('update', 'Mettre à jour') : t('create', 'Créer')}
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const QueuesComponent: FC = () => {
  const t = useT();
  const { data: queues, mutate, isLoading } = useQueues();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedQueue, setSelectedQueue] = useState<Queue | undefined>();
  const toast = useToast();
  const deleteQueue = useDeleteQueue();

  const handleEdit = useCallback(
    (queue: Queue) => {
      setSelectedQueue(queue);
      onEditOpen();
    },
    [onEditOpen]
  );

  const handleDelete = useCallback(
    async (queue: Queue) => {
      if (
        await deleteDialog(
          t('are_you_sure_delete_queue', `Êtes-vous sûr de vouloir supprimer ${queue.name}?`, {
            name: queue.name,
          })
        )
      ) {
        try {
          await deleteQueue(queue.id);
          toast({
            title: t('queue_deleted', 'Queue supprimée'),
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
    [deleteQueue, mutate, toast, t]
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
            <Heading size="lg">{t('queues', 'Queues')}</Heading>
            <Text color="gray.400" mt={1}>
              {t('queues_description', 'Créez des queues de publication avec des horaires récurrents')}
            </Text>
          </Box>
          <Button onClick={onCreateOpen} colorScheme="blue">
            {t('create_queue', 'Créer une Queue')}
          </Button>
        </HStack>

        {!queues || queues.length === 0 ? (
          <Card>
            <CardBody>
              <VStack spacing={4} py={12}>
                <Box fontSize="4xl">⏰</Box>
                <Heading size="md">{t('no_queues', 'Aucune queue')}</Heading>
                <Text color="gray.400" textAlign="center">
                  {t('create_first_queue', 'Créez votre première queue pour commencer')}
                </Text>
                <Button onClick={onCreateOpen} colorScheme="blue">
                  {t('create_queue', 'Créer une Queue')}
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
            {queues.map((queue) => (
              <Card
                key={queue.id}
                opacity={queue.isActive ? 1 : 0.6}
                _hover={{ borderColor: 'blue.500' }}
                transition="all 0.2s"
              >
                <CardHeader>
                  <HStack justify="space-between">
                    <HStack>
                      <Heading size="md">{queue.name}</Heading>
                      {queue.isActive && (
                        <Badge colorScheme="green">{t('active', 'Actif')}</Badge>
                      )}
                    </HStack>
                    <HStack>
                      <IconButton
                        aria-label={t('edit', 'Modifier')}
                        icon={<EditIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(queue)}
                      />
                      <IconButton
                        aria-label={t('delete', 'Supprimer')}
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(queue)}
                      />
                    </HStack>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={2} align="stretch">
                    <Box>
                      <Text fontSize="xs" color="gray.400">
                        {t('times', 'Horaires')}:
                      </Text>
                      <Text fontSize="sm">{queue.schedule.times.join(', ')}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.400">
                        {t('days', 'Jours')}:
                      </Text>
                      <Text fontSize="sm">
                        {queue.schedule.days.map((d) => DAYS.find((day) => day.value === d)?.label).join(', ')}
                      </Text>
                    </Box>
                    <Text fontSize="xs" color="gray.400">
                      {queue._count?.posts || 0} {t('posts', 'posts')}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </VStack>

      <QueueForm
        queue={selectedQueue}
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          setSelectedQueue(undefined);
        }}
        onSuccess={() => {
          mutate();
          onEditClose();
          setSelectedQueue(undefined);
        }}
      />

      <QueueForm
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

