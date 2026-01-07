'use client';

import { FC, useCallback, useState } from 'react';
import { Button } from '@gitroom/react/form/button';
import { Input } from '@gitroom/react/form/input';
import {
  useHashtagGroups,
  useCreateHashtagGroup,
  useUpdateHashtagGroup,
  useDeleteHashtagGroup,
  HashtagGroup,
} from './hashtag-groups.hooks';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { LoadingComponent } from '@gitroom/frontend/components/layout/loading';
import { useWorkspaces } from '../workspaces/workspaces.hooks';
import clsx from 'clsx';

const HashtagGroupForm: FC<{
  group?: HashtagGroup;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ group, onClose, onSuccess }) => {
  const t = useT();
  const [name, setName] = useState(group?.name || '');
  const [workspaceId, setWorkspaceId] = useState(group?.workspaceId || '');
  const [hashtags, setHashtags] = useState<string[]>(group?.hashtags || []);
  const [newHashtag, setNewHashtag] = useState('');
  const createGroup = useCreateHashtagGroup();
  const updateGroup = useUpdateHashtagGroup();
  const toaster = useToaster();
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
      toaster.show(t('name_required', 'Le nom est requis'), 'error');
      return;
    }
    if (hashtags.length === 0) {
      toaster.show(t('at_least_one_hashtag', 'Au moins un hashtag est requis'), 'error');
      return;
    }

    setLoading(true);
    try {
      if (group) {
        await updateGroup(group.id, { name, hashtags });
        toaster.show(t('hashtag_group_updated', 'Groupe de hashtags mis à jour'), 'success');
      } else {
        await createGroup({
          name,
          workspaceId: workspaceId || undefined,
          hashtags,
        });
        toaster.show(t('hashtag_group_created', 'Groupe de hashtags créé'), 'success');
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
    hashtags,
    group,
    createGroup,
    updateGroup,
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
          placeholder={t('group_name', 'Nom du groupe')}
        />
      </div>
      {!group && workspaces && workspaces.length > 0 && (
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
        <label className="text-[14px] font-medium">{t('hashtags', 'Hashtags')}</label>
        <div className="flex gap-[8px] flex-wrap">
          {hashtags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-[4px] px-[8px] py-[4px] bg-customColor6 rounded-[4px]"
            >
              <span className="text-[12px]">{tag}</span>
              <button
                onClick={() => removeHashtag(tag)}
                className="text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-[8px]">
          <Input
            value={newHashtag}
            onChange={(e) => setNewHashtag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
            placeholder="#hashtag"
            className="flex-1"
          />
          <Button onClick={addHashtag} variant="outline" size="sm">
            {t('add', 'Ajouter')}
          </Button>
        </div>
      </div>
      <div className="flex gap-[8px] justify-end mt-[16px]">
        <Button onClick={onClose} variant="outline">
          {t('cancel', 'Annuler')}
        </Button>
        <Button onClick={submit} loading={loading}>
          {group ? t('update', 'Mettre à jour') : t('create', 'Créer')}
        </Button>
      </div>
    </div>
  );
};

export const HashtagGroupsComponent: FC = () => {
  const t = useT();
  const { data: groups, mutate, isLoading } = useHashtagGroups();
  const modal = useModals();
  const toaster = useToaster();
  const deleteGroup = useDeleteHashtagGroup();

  const openCreateModal = useCallback(() => {
    modal.openModal({
      title: t('create_hashtag_group', 'Créer un Groupe de Hashtags'),
      withCloseButton: true,
      children: (
        <HashtagGroupForm
          onClose={() => modal.closeModal()}
          onSuccess={() => mutate()}
        />
      ),
    });
  }, [modal, mutate, t]);

  const openEditModal = useCallback(
    (group: HashtagGroup) => {
      modal.openModal({
        title: t('edit_hashtag_group', 'Modifier le Groupe de Hashtags'),
        withCloseButton: true,
        children: (
          <HashtagGroupForm
            group={group}
            onClose={() => modal.closeModal()}
            onSuccess={() => mutate()}
          />
        ),
      });
    },
    [modal, mutate, t]
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
          toaster.show(t('hashtag_group_deleted', 'Groupe de hashtags supprimé'), 'success');
          mutate();
        } catch (error) {
          toaster.show(t('error_occurred', 'Une erreur est survenue'), 'error');
        }
      }
    },
    [deleteGroup, mutate, toaster, t]
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[24px] font-semibold">{t('hashtag_groups', 'Groupes de Hashtags')}</h1>
          <p className="text-[14px] text-gray-400 mt-[4px]">
            {t('hashtag_groups_description', 'Organisez vos hashtags en groupes réutilisables')}
          </p>
        </div>
        <Button onClick={openCreateModal}>
          {t('create_hashtag_group', 'Créer un Groupe')}
        </Button>
      </div>

      {!groups || groups.length === 0 ? (
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
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <p className="text-[16px] font-medium mb-[8px]">{t('no_hashtag_groups', 'Aucun groupe')}</p>
          <p className="text-[14px] text-gray-400 mb-[16px]">
            {t('create_first_group', 'Créez votre premier groupe de hashtags')}
          </p>
          <Button onClick={openCreateModal}>{t('create_hashtag_group', 'Créer un Groupe')}</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {groups.map((group) => (
            <div
              key={group.id}
              className="border border-customColor6 rounded-[8px] bg-customColor3 p-[20px] hover:border-customColor5 transition-colors"
            >
              <div className="flex justify-between items-start mb-[12px]">
                <h3 className="text-[18px] font-semibold">{group.name}</h3>
                <div className="flex gap-[8px]">
                  <button
                    onClick={() => openEditModal(group)}
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
                    onClick={() => handleDelete(group)}
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
              <div className="flex flex-wrap gap-[6px]">
                {group.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="px-[8px] py-[4px] bg-customColor6 text-[12px] rounded-[4px] text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

