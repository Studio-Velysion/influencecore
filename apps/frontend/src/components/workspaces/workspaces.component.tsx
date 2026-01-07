'use client';

import { FC, useCallback, useState } from 'react';
import { Button } from '@gitroom/react/form/button';
import { Input } from '@gitroom/react/form/input';
import { Textarea } from '@gitroom/react/form/textarea';
import { useWorkspaces, useCreateWorkspace, useUpdateWorkspace, useDeleteWorkspace, Workspace } from './workspaces.hooks';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import clsx from 'clsx';
import { LoadingComponent } from '@gitroom/frontend/components/layout/loading';
import useSWR from 'swr';

const WorkspaceForm: FC<{
  workspace?: Workspace;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ workspace, onClose, onSuccess }) => {
  const t = useT();
  const [name, setName] = useState(workspace?.name || '');
  const [description, setDescription] = useState(workspace?.description || '');
  const createWorkspace = useCreateWorkspace();
  const updateWorkspace = useUpdateWorkspace();
  const toaster = useToaster();
  const [loading, setLoading] = useState(false);

  const submit = useCallback(async () => {
    if (!name.trim()) {
      toaster.show(t('name_required', 'Le nom est requis'), 'error');
      return;
    }

    setLoading(true);
    try {
      if (workspace) {
        await updateWorkspace(workspace.id, { name, description });
        toaster.show(t('workspace_updated', 'Workspace mis à jour'), 'success');
      } else {
        await createWorkspace({ name, description });
        toaster.show(t('workspace_created', 'Workspace créé'), 'success');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toaster.show(t('error_occurred', 'Une erreur est survenue'), 'error');
    } finally {
      setLoading(false);
    }
  }, [name, description, workspace, createWorkspace, updateWorkspace, onSuccess, onClose, toaster, t]);

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[8px]">
        <label className="text-[14px] font-medium">{t('name', 'Nom')}</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('workspace_name', 'Nom du workspace')}
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <label className="text-[14px] font-medium">{t('description', 'Description')}</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('workspace_description', 'Description du workspace')}
          rows={3}
        />
      </div>
      <div className="flex gap-[8px] justify-end mt-[16px]">
        <Button onClick={onClose} variant="outline">
          {t('cancel', 'Annuler')}
        </Button>
        <Button onClick={submit} loading={loading}>
          {workspace ? t('update', 'Mettre à jour') : t('create', 'Créer')}
        </Button>
      </div>
    </div>
  );
};

export const WorkspacesComponent: FC = () => {
  const t = useT();
  const { data: workspaces, mutate, isLoading } = useWorkspaces();
  const modal = useModals();
  const toaster = useToaster();
  const deleteWorkspace = useDeleteWorkspace();

  const openCreateModal = useCallback(() => {
    modal.openModal({
      title: t('create_workspace', 'Créer un Workspace'),
      withCloseButton: true,
      children: (
        <WorkspaceForm
          onClose={() => modal.closeModal()}
          onSuccess={() => mutate()}
        />
      ),
    });
  }, [modal, mutate, t]);

  const openEditModal = useCallback(
    (workspace: Workspace) => {
      modal.openModal({
        title: t('edit_workspace', 'Modifier le Workspace'),
        withCloseButton: true,
        children: (
          <WorkspaceForm
            workspace={workspace}
            onClose={() => modal.closeModal()}
            onSuccess={() => mutate()}
          />
        ),
      });
    },
    [modal, mutate, t]
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
          toaster.show(t('workspace_deleted', 'Workspace supprimé'), 'success');
          mutate();
        } catch (error) {
          toaster.show(t('error_occurred', 'Une erreur est survenue'), 'error');
        }
      }
    },
    [deleteWorkspace, mutate, toaster, t]
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[24px] font-semibold">{t('workspaces', 'Workspaces')}</h1>
          <p className="text-[14px] text-gray-400 mt-[4px]">
            {t('workspaces_description', 'Organisez vos posts, intégrations et médias en espaces de travail dédiés')}
          </p>
        </div>
        <Button onClick={openCreateModal}>
          {t('create_workspace', 'Créer un Workspace')}
        </Button>
      </div>

      {!workspaces || workspaces.length === 0 ? (
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
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <p className="text-[16px] font-medium mb-[8px]">{t('no_workspaces', 'Aucun workspace')}</p>
          <p className="text-[14px] text-gray-400 mb-[16px]">
            {t('create_first_workspace', 'Créez votre premier workspace pour commencer')}
          </p>
          <Button onClick={openCreateModal}>{t('create_workspace', 'Créer un Workspace')}</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="border border-customColor6 rounded-[8px] bg-customColor3 p-[20px] hover:border-customColor5 transition-colors"
            >
              <div className="flex justify-between items-start mb-[12px]">
                <h3 className="text-[18px] font-semibold">{workspace.name}</h3>
                <div className="flex gap-[8px]">
                  <button
                    onClick={() => openEditModal(workspace)}
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
                    onClick={() => handleDelete(workspace)}
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
              {workspace.description && (
                <p className="text-[14px] text-gray-400 mb-[12px]">{workspace.description}</p>
              )}
              <div className="flex gap-[16px] text-[12px] text-gray-400">
                <div className="flex items-center gap-[4px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  {workspace._count?.posts || 0} {t('posts', 'posts')}
                </div>
                <div className="flex items-center gap-[4px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  {workspace._count?.integrations || 0} {t('integrations', 'intégrations')}
                </div>
                <div className="flex items-center gap-[4px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  {workspace._count?.media || 0} {t('media', 'médias')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

