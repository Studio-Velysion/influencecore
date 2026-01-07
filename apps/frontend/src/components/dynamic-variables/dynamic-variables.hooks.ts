'use client';

import { useCallback } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';

export interface DynamicVariable {
  id: string;
  name: string;
  organizationId: string;
  workspaceId?: string;
  value?: string;
  isSystem: boolean;
  type: 'SYSTEM' | 'CUSTOM' | 'DATE' | 'TIME' | 'USERNAME' | 'HASHTAG';
  createdAt: string;
  updatedAt: string;
}

export interface SystemVariable {
  name: string;
  type: string;
  isSystem: boolean;
  description: string;
}

export const useDynamicVariables = (workspaceId?: string) => {
  const fetch = useFetch();
  
  const load = useCallback(async () => {
    const url = workspaceId ? `/dynamic-variables?workspaceId=${workspaceId}` : '/dynamic-variables';
    const response = await fetch(url);
    const data = await response.json();
    return {
      variables: data.variables || [],
      systemVariables: data.systemVariables || [],
    };
  }, [fetch, workspaceId]);

  return useSWR<{ variables: DynamicVariable[]; systemVariables: SystemVariable[] }>(
    `dynamic-variables-${workspaceId || 'all'}`,
    load,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );
};

export const useCreateDynamicVariable = () => {
  const fetch = useFetch();
  
  return useCallback(async (data: {
    name: string;
    workspaceId?: string;
    value?: string;
    type: string;
    isSystem?: boolean;
  }) => {
    const response = await fetch('/dynamic-variables', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return await response.json();
  }, [fetch]);
};

export const useUpdateDynamicVariable = () => {
  const fetch = useFetch();
  
  return useCallback(async (id: string, data: {
    name?: string;
    value?: string;
    type?: string;
  }) => {
    const response = await fetch(`/dynamic-variables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return await response.json();
  }, [fetch]);
};

export const useDeleteDynamicVariable = () => {
  const fetch = useFetch();
  
  return useCallback(async (id: string) => {
    const response = await fetch(`/dynamic-variables/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  }, [fetch]);
};

export const useResolveVariables = () => {
  const fetch = useFetch();
  
  return useCallback(async (content: string, workspaceId?: string) => {
    const response = await fetch('/dynamic-variables/resolve', {
      method: 'POST',
      body: JSON.stringify({ content, workspaceId }),
    });
    const data = await response.json();
    return data.resolvedContent;
  }, [fetch]);
};

