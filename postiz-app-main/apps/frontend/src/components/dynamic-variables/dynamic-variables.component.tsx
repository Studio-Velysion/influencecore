'use client';

import { FC, useCallback, useState } from 'react';
import { Button } from '@gitroom/react/form/button';
import { Input } from '@gitroom/react/form/input';
import {
  useDynamicVariables,
  useCreateDynamicVariable,
  useUpdateDynamicVariable,
  useDeleteDynamicVariable,
  useResolveVariables,
  DynamicVariable,
} from './dynamic-variables.hooks';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { LoadingComponent } from '@gitroom/frontend/components/layout/loading';
import { useWorkspaces } from '../workspaces/workspaces.hooks';
import { Textarea } from '@gitroom/react/form/textarea';
import clsx from 'clsx';

const VARIABLE_TYPES = [
  { value: 'CUSTOM', label: 'Personnalisée' },
  { value: 'DATE', label: 'Date' },
  { value: 'TIME', label: 'Heure' },
  { value: 'USERNAME', label: "Nom d'utilisateur" },
  { value: 'HASHTAG', label: 'Hashtag' },
];

const VariableForm: FC<{
  variable?: DynamicVariable;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ variable, onClose, onSuccess }) => {
  const t = useT();
  const [name, setName] = useState(variable?.name.replace(/[{}]/g, '') || '');
  const [workspaceId, setWorkspaceId] = useState(variable?.workspaceId || '');
  const [value, setValue] = useState(variable?.value || '');
  const [type, setType] = useState<string>(variable?.type || 'CUSTOM');
  const createVariable = useCreateDynamicVariable();
  const updateVariable = useUpdateDynamicVariable();
  const toaster = useToaster();
  const [loading, setLoading] = useState(false);
  const { data: workspaces } = useWorkspaces();

  const submit = useCallback(async () => {
    if (!name.trim()) {
      toaster.show(t('name_required', 'Le nom est requis'), 'error');
      return;
    }
    if (type === 'CUSTOM' && !value.trim()) {
      toaster.show(t('value_required', 'La valeur est requise pour les variables personnalisées'), 'error');
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
        toaster.show(t('variable_updated', 'Variable mise à jour'), 'success');
      } else {
        await createVariable({
          name: variableName,
          workspaceId: workspaceId || undefined,
          value: type === 'CUSTOM' ? value : undefined,
          type,
          isSystem: false,
        });
        toaster.show(t('variable_created', 'Variable créée'), 'success');
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
    value,
    type,
    variable,
    createVariable,
    updateVariable,
    onSuccess,
    onClose,
    toaster,
    t,
  ]);

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[8px]">
        <label className="text-[14px] font-medium">{t('name', 'Nom')}</label>
        <div className="flex items-center gap-[8px]">
          <span className="text-[14px] text-gray-400">{'{'}</span>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value.replace(/[{}]/g, ''))}
            placeholder="variable_name"
            className="flex-1"
          />
          <span className="text-[14px] text-gray-400">{'}'}</span>
        </div>
      </div>
      {!variable && workspaces && workspaces.length > 0 && (
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
        <label className="text-[14px] font-medium">{t('type', 'Type')}</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-[12px] py-[8px] bg-customColor3 border border-customColor6 rounded-[4px] text-[14px]"
        >
          {VARIABLE_TYPES.map((vt) => (
            <option key={vt.value} value={vt.value}>
              {vt.label}
            </option>
          ))}
        </select>
      </div>
      {type === 'CUSTOM' && (
        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium">{t('value', 'Valeur')}</label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t('variable_value', 'Valeur de la variable')}
          />
        </div>
      )}
      <div className="flex gap-[8px] justify-end mt-[16px]">
        <Button onClick={onClose} variant="outline">
          {t('cancel', 'Annuler')}
        </Button>
        <Button onClick={submit} loading={loading}>
          {variable ? t('update', 'Mettre à jour') : t('create', 'Créer')}
        </Button>
      </div>
    </div>
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
    <div className="flex flex-col gap-[16px] p-[20px] border border-customColor6 rounded-[8px] bg-customColor3">
      <h3 className="text-[16px] font-semibold">{t('test_resolution', 'Tester la Résolution')}</h3>
      <div className="flex flex-col gap-[8px]">
        <label className="text-[14px] font-medium">{t('content', 'Contenu')}</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Bonjour {username}, aujourd'hui c'est le {date}"
          rows={3}
        />
      </div>
      <Button onClick={handleResolve} loading={loading} variant="outline">
        {t('resolve', 'Résoudre')}
      </Button>
      {resolved && (
        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium">{t('resolved', 'Résolu')}</label>
          <div className="p-[12px] bg-customColor6 rounded-[4px] text-[14px]">{resolved}</div>
        </div>
      )}
    </div>
  );
};

export const DynamicVariablesComponent: FC = () => {
  const t = useT();
  const { data, mutate, isLoading } = useDynamicVariables();
  const modal = useModals();
  const toaster = useToaster();
  const deleteVariable = useDeleteDynamicVariable();

  const variables = data?.variables || [];
  const systemVariables = data?.systemVariables || [];

  const openCreateModal = useCallback(() => {
    modal.openModal({
      title: t('create_variable', 'Créer une Variable'),
      withCloseButton: true,
      children: (
        <VariableForm
          onClose={() => modal.closeModal()}
          onSuccess={() => mutate()}
        />
      ),
    });
  }, [modal, mutate, t]);

  const openEditModal = useCallback(
    (variable: DynamicVariable) => {
      modal.openModal({
        title: t('edit_variable', 'Modifier la Variable'),
        withCloseButton: true,
        children: (
          <VariableForm
            variable={variable}
            onClose={() => modal.closeModal()}
            onSuccess={() => mutate()}
          />
        ),
      });
    },
    [modal, mutate, t]
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
          toaster.show(t('variable_deleted', 'Variable supprimée'), 'success');
          mutate();
        } catch (error) {
          toaster.show(t('error_occurred', 'Une erreur est survenue'), 'error');
        }
      }
    },
    [deleteVariable, mutate, toaster, t]
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[24px] font-semibold">{t('dynamic_variables', 'Variables Dynamiques')}</h1>
          <p className="text-[14px] text-gray-400 mt-[4px]">
            {t('variables_description', 'Créez des variables dynamiques pour personnaliser vos posts')}
          </p>
        </div>
        <Button onClick={openCreateModal}>{t('create_variable', 'Créer une Variable')}</Button>
      </div>

      <ResolveTest />

      {systemVariables.length > 0 && (
        <div className="flex flex-col gap-[16px]">
          <h2 className="text-[18px] font-semibold">{t('system_variables', 'Variables Système')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px]">
            {systemVariables.map((sv) => (
              <div
                key={sv.name}
                className="border border-customColor6 rounded-[8px] bg-customColor3 p-[16px]"
              >
                <div className="flex items-center gap-[8px] mb-[8px]">
                  <code className="text-[14px] font-mono text-customColor5">{sv.name}</code>
                  <span className="px-[6px] py-[2px] bg-blue-500/20 text-blue-400 text-[10px] rounded-[4px]">
                    {t('system', 'Système')}
                  </span>
                </div>
                <p className="text-[12px] text-gray-400">{sv.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-[16px]">
        <h2 className="text-[18px] font-semibold">{t('custom_variables', 'Variables Personnalisées')}</h2>
        {variables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[40px] border border-customColor6 rounded-[8px] bg-customColor3">
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
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <p className="text-[16px] font-medium mb-[8px]">{t('no_variables', 'Aucune variable')}</p>
            <p className="text-[14px] text-gray-400 mb-[16px]">
              {t('create_first_variable', 'Créez votre première variable personnalisée')}
            </p>
            <Button onClick={openCreateModal}>{t('create_variable', 'Créer une Variable')}</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {variables.map((variable) => (
              <div
                key={variable.id}
                className="border border-customColor6 rounded-[8px] bg-customColor3 p-[20px] hover:border-customColor5 transition-colors"
              >
                <div className="flex justify-between items-start mb-[12px]">
                  <code className="text-[16px] font-mono text-customColor5">{variable.name}</code>
                  <div className="flex gap-[8px]">
                    <button
                      onClick={() => openEditModal(variable)}
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
                      onClick={() => handleDelete(variable)}
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
                <div className="flex flex-col gap-[4px]">
                  <div className="text-[12px] text-gray-400">
                    {t('type', 'Type')}: <span className="text-gray-300">{variable.type}</span>
                  </div>
                  {variable.value && (
                    <div className="text-[12px] text-gray-400">
                      {t('value', 'Valeur')}: <span className="text-gray-300">{variable.value}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

