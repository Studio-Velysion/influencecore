'use client';

import { FC, useCallback } from 'react';
import { usePostVersions, PostVersion } from './post-versions.hooks';
import { LoadingComponent } from '@gitroom/frontend/components/layout/loading';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import clsx from 'clsx';
import { Button } from '@gitroom/react/form/button';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useDeletePostVersion } from './post-versions.hooks';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';

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
  const toaster = useToaster();

  const handleDelete = useCallback(
    async (version: PostVersion) => {
      if (
        await deleteDialog(
          t('are_you_sure_delete_version', 'Êtes-vous sûr de vouloir supprimer cette version?')
        )
      ) {
        try {
          await deleteVersion(version.id);
          toaster.show(t('version_deleted', 'Version supprimée'), 'success');
          mutate();
        } catch (error) {
          toaster.show(t('error_occurred', 'Une erreur est survenue'), 'error');
        }
      }
    },
    [deleteVersion, mutate, toaster, t]
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!versions || versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-[40px] border border-customColor6 rounded-[8px] bg-customColor3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-400 mb-[8px]"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <p className="text-[14px] text-gray-400">{t('no_versions', 'Aucune version')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px]">
      <h3 className="text-[16px] font-semibold">{t('post_versions', 'Versions du Post')}</h3>
      <div className="flex flex-col gap-[8px]">
        {versions.map((version) => {
          const content = Array.isArray(version.content) ? version.content[0] : version.content;
          const preview = content?.body?.substring(0, 100) || '';
          
          return (
            <div
              key={version.id}
              className={clsx(
                'border rounded-[8px] p-[12px] cursor-pointer transition-colors',
                selectedVersionId === version.id
                  ? 'border-customColor5 bg-customColor5/10'
                  : 'border-customColor6 bg-customColor3 hover:border-customColor5'
              )}
              onClick={() => onVersionSelect?.(version)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-[8px] mb-[4px]">
                    {version.isOriginal && (
                      <span className="px-[6px] py-[2px] bg-blue-500/20 text-blue-400 text-[10px] rounded-[4px]">
                        {t('original', 'Original')}
                      </span>
                    )}
                    {version.accountId && (
                      <span className="text-[12px] text-gray-400">
                        {t('account', 'Compte')}: {version.accountId.substring(0, 8)}...
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-300 line-clamp-2">{preview}...</p>
                </div>
                {!version.isOriginal && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(version);
                    }}
                    className="p-[4px] hover:bg-customColor6 rounded-[4px] transition-colors ml-[8px]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
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
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

