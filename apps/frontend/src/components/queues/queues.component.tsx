'use client';

import { FC, useCallback, useState } from 'react';
import { Button } from '@gitroom/react/form/button';
import { Input } from '@gitroom/react/form/input';
import {
  useQueues,
  useCreateQueue,
  useUpdateQueue,
  useDeleteQueue,
  Queue,
} from './queues.hooks';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { LoadingComponent } from '@gitroom/frontend/components/layout/loading';
import { useWorkspaces } from '../workspaces/workspaces.hooks';
import clsx from 'clsx';

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
  onClose: () => void;
  onSuccess: () => void;
}> = ({ queue, onClose, onSuccess }) => {
  const t = useT();
  const [name, setName] = useState(queue?.name || '');
  const [workspaceId, setWorkspaceId] = useState(queue?.workspaceId || '');
  const [times, setTimes] = useState<string[]>(queue?.schedule?.times || ['09:00', '12:00', '15:00']);
  const [days, setDays] = useState<string[]>(queue?.schedule?.days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  const [isActive, setIsActive] = useState(queue?.isActive ?? true);
  const createQueue = useCreateQueue();
  const updateQueue = useUpdateQueue();
  const toaster = useToaster();
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
      toaster.show(t('name_required', 'Le nom est requis'), 'error');
      return;
    }
    if (times.length === 0) {
      toaster.show(t('at_least_one_time', 'Au moins un horaire est requis'), 'error');
      return;
    }
    if (days.length === 0) {
      toaster.show(t('at_least_one_day', 'Au moins un jour est requis'), 'error');
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
        toaster.show(t('queue_updated', 'Queue mise à jour'), 'success');
      } else {
        await createQueue({
          name,
          workspaceId: workspaceId || undefined,
          schedule: { times, days },
          isActive,
        });
        toaster.show(t('queue_created', 'Queue créée'), 'success');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toaster.show(t('error_occurred', 'Une erreur est survenue'), 'error');
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
    toaster,
    t,
  ]);

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[8px]">
        <label className="text-[14px] font-medium">{t('name', 'Nom')}</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('queue_name', 'Nom de la queue')}
        />
      </div>
      {!queue && workspaces && workspaces.length > 0 && (
        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium">{t('workspace', 'Workspace')}</label>
          <select
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
            className="w-full px-[12px] py-[8px] bg-customColor3 border border-customColor6 rounded-[4px] text-[14px]"
          >
            <option value="">{t('no_workspace', 'Aucun workspace')}</option>
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex flex-col gap-[8px]">
        <label className="text-[14px] font-medium">{t('times', 'Horaires')}</label>
        <div className="flex gap-[8px] flex-wrap">
          {times.map((time) => (
            <div
              key={time}
              className="flex items-center gap-[4px] px-[8px] py-[4px] bg-customColor6 rounded-[4px]"
            >
              <span className="text-[12px]">{time}</span>
              <button
                onClick={() => removeTime(time)}
                className="text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-[8px]">
          <Input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            placeholder="HH:MM"
            className="flex-1"
          />
          <Button onClick={addTime} variant="outline" size="sm">
            {t('add', 'Ajouter')}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-[8px]">
        <label className="text-[14px] font-medium">{t('days', 'Jours')}</label>
        <div className="flex gap-[8px] flex-wrap">
          {DAYS.map((day) => (
            <button
              key={day.value}
              onClick={() => toggleDay(day.value)}
              className={clsx(
                'px-[12px] py-[6px] rounded-[4px] text-[12px] transition-colors',
                days.includes(day.value)
                  ? 'bg-customColor5 text-white'
                  : 'bg-customColor6 text-gray-400 hover:bg-customColor5 hover:text-white'
              )}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-[8px]">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="w-[16px] h-[16px]"
        />
        <label htmlFor="isActive" className="text-[14px]">
          {t('active', 'Actif')}
        </label>
      </div>
      <div className="flex gap-[8px] justify-end mt-[16px]">
        <Button onClick={onClose} variant="outline">
          {t('cancel', 'Annuler')}
        </Button>
        <Button onClick={submit} loading={loading}>
          {queue ? t('update', 'Mettre à jour') : t('create', 'Créer')}
        </Button>
      </div>
    </div>
  );
};

export const QueuesComponent: FC = () => {
  const t = useT();
  const { data: queues, mutate, isLoading } = useQueues();
  const modal = useModals();
  const toaster = useToaster();
  const deleteQueue = useDeleteQueue();

  const openCreateModal = useCallback(() => {
    modal.openModal({
      title: t('create_queue', 'Créer une Queue'),
      withCloseButton: true,
      children: (
        <QueueForm
          onClose={() => modal.closeModal()}
          onSuccess={() => mutate()}
        />
      ),
    });
  }, [modal, mutate, t]);

  const openEditModal = useCallback(
    (queue: Queue) => {
      modal.openModal({
        title: t('edit_queue', 'Modifier la Queue'),
        withCloseButton: true,
        children: (
          <QueueForm
            queue={queue}
            onClose={() => modal.closeModal()}
            onSuccess={() => mutate()}
          />
        ),
      });
    },
    [modal, mutate, t]
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
          toaster.show(t('queue_deleted', 'Queue supprimée'), 'success');
          mutate();
        } catch (error) {
          toaster.show(t('error_occurred', 'Une erreur est survenue'), 'error');
        }
      }
    },
    [deleteQueue, mutate, toaster, t]
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[24px] font-semibold">{t('queues', 'Queues')}</h1>
          <p className="text-[14px] text-gray-400 mt-[4px]">
            {t('queues_description', 'Créez des queues de publication avec des horaires récurrents')}
          </p>
        </div>
        <Button onClick={openCreateModal}>{t('create_queue', 'Créer une Queue')}</Button>
      </div>

      {!queues || queues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[60px] border border-customColor6 rounded-[8px] bg-customColor3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 mb-[16px]"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p className="text-[16px] font-medium mb-[8px]">{t('no_queues', 'Aucune queue')}</p>
          <p className="text-[14px] text-gray-400 mb-[16px]">
            {t('create_first_queue', 'Créez votre première queue pour commencer')}
          </p>
          <Button onClick={openCreateModal}>{t('create_queue', 'Créer une Queue')}</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {queues.map((queue) => (
            <div
              key={queue.id}
              className={clsx(
                'border rounded-[8px] bg-customColor3 p-[20px] transition-colors',
                queue.isActive
                  ? 'border-customColor6 hover:border-customColor5'
                  : 'border-customColor6 opacity-60'
              )}
            >
              <div className="flex justify-between items-start mb-[12px]">
                <div className="flex items-center gap-[8px]">
                  <h3 className="text-[18px] font-semibold">{queue.name}</h3>
                  {queue.isActive && (
                    <span className="px-[6px] py-[2px] bg-green-500/20 text-green-400 text-[10px] rounded-[4px]">
                      {t('active', 'Actif')}
                    </span>
                  )}
                </div>
                <div className="flex gap-[8px]">
                  <button
                    onClick={() => openEditModal(queue)}
                    className="p-[4px] hover:bg-customColor6 rounded-[4px] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-400"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(queue)}
                    className="p-[4px] hover:bg-customColor6 rounded-[4px] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-red-400"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <div>
                  <span className="text-[12px] text-gray-400">{t('times', 'Horaires')}: </span>
                  <span className="text-[12px]">{queue.schedule.times.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[12px] text-gray-400">{t('days', 'Jours')}: </span>
                  <span className="text-[12px]">
                    {queue.schedule.days.map((d) => DAYS.find((day) => day.value === d)?.label).join(', ')}
                  </span>
                </div>
                <div className="text-[12px] text-gray-400">
                  {queue._count?.posts || 0} {t('posts', 'posts')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

