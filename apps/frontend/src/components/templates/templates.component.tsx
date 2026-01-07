'use client';

import { FC, useCallback, useState } from 'react';
import { Button } from '@gitroom/react/form/button';
import { Input } from '@gitroom/react/form/input';
import { Textarea } from '@gitroom/react/form/textarea';
import {
  useTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  Template,
} from './templates.hooks';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { LoadingComponent } from '@gitroom/frontend/components/layout/loading';
import { useWorkspaces } from '../workspaces/workspaces.hooks';
import clsx from 'clsx';

const TemplateForm: FC<{
  template?: Template;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ template, onClose, onSuccess }) => {
  const t = useT();
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [workspaceId, setWorkspaceId] = useState(template?.workspaceId || '');
  const [content, setContent] = useState(
    template?.content ? JSON.stringify(template.content, null, 2) : '{\n  "body": "",\n  "media": []\n}'
  );
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const toaster = useToaster();
  const [loading, setLoading] = useState(false);
  const { data: workspaces } = useWorkspaces();

  const submit = useCallback(async () => {
    if (!name.trim()) {
      toaster.show(t('name_required', 'Le nom est requis'), 'error');
      return;
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (error) {
      toaster.show(t('invalid_json', 'JSON invalide'), 'error');
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
        toaster.show(t('template_updated', 'Template mis à jour'), 'success');
      } else {
        await createTemplate({
          name,
          description,
          workspaceId: workspaceId || undefined,
          content: parsedContent,
        });
        toaster.show(t('template_created', 'Template créé'), 'success');
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
    description,
    workspaceId,
    content,
    template,
    createTemplate,
    updateTemplate,
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
          placeholder={t('template_name', 'Nom du template')}
        />
      </div>
      {!template && workspaces && workspaces.length > 0 && (
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
        <label className="text-[14px] font-medium">{t('description', 'Description')}</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('template_description', 'Description du template')}
          rows={2}
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <label className="text-[14px] font-medium">{t('content', 'Contenu')} (JSON)</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='{"body": "", "media": []}'
          rows={8}
          className="font-mono text-[12px]"
        />
      </div>
      <div className="flex gap-[8px] justify-end mt-[16px]">
        <Button onClick={onClose} variant="outline">
          {t('cancel', 'Annuler')}
        </Button>
        <Button onClick={submit} loading={loading}>
          {template ? t('update', 'Mettre à jour') : t('create', 'Créer')}
        </Button>
      </div>
    </div>
  );
};

export const TemplatesComponent: FC = () => {
  const t = useT();
  const { data: templates, mutate, isLoading } = useTemplates();
  const modal = useModals();
  const toaster = useToaster();
  const deleteTemplate = useDeleteTemplate();

  const openCreateModal = useCallback(() => {
    modal.openModal({
      title: t('create_template', 'Créer un Template'),
      withCloseButton: true,
      children: (
        <TemplateForm
          onClose={() => modal.closeModal()}
          onSuccess={() => mutate()}
        />
      ),
    });
  }, [modal, mutate, t]);

  const openEditModal = useCallback(
    (template: Template) => {
      modal.openModal({
        title: t('edit_template', 'Modifier le Template'),
        withCloseButton: true,
        children: (
          <TemplateForm
            template={template}
            onClose={() => modal.closeModal()}
            onSuccess={() => mutate()}
          />
        ),
      });
    },
    [modal, mutate, t]
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
          toaster.show(t('template_deleted', 'Template supprimé'), 'success');
          mutate();
        } catch (error) {
          toaster.show(t('error_occurred', 'Une erreur est survenue'), 'error');
        }
      }
    },
    [deleteTemplate, mutate, toaster, t]
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[24px] font-semibold">{t('templates', 'Templates')}</h1>
          <p className="text-[14px] text-gray-400 mt-[4px]">
            {t('templates_description', 'Créez et réutilisez des templates de posts')}
          </p>
        </div>
        <Button onClick={openCreateModal}>{t('create_template', 'Créer un Template')}</Button>
      </div>

      {!templates || templates.length === 0 ? (
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <p className="text-[16px] font-medium mb-[8px]">{t('no_templates', 'Aucun template')}</p>
          <p className="text-[14px] text-gray-400 mb-[16px]">
            {t('create_first_template', 'Créez votre premier template pour commencer')}
          </p>
          <Button onClick={openCreateModal}>{t('create_template', 'Créer un Template')}</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border border-customColor6 rounded-[8px] bg-customColor3 p-[20px] hover:border-customColor5 transition-colors"
            >
              <div className="flex justify-between items-start mb-[12px]">
                <h3 className="text-[18px] font-semibold">{template.name}</h3>
                <div className="flex gap-[8px]">
                  <button
                    onClick={() => openEditModal(template)}
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
                    onClick={() => handleDelete(template)}
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
              {template.description && (
                <p className="text-[14px] text-gray-400 mb-[12px] line-clamp-2">{template.description}</p>
              )}
              <div className="text-[12px] text-gray-400">
                {t('created', 'Créé')} {new Date(template.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

