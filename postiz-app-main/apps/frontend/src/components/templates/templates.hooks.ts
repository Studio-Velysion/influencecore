'use client';

import { useCallback } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';

export interface Template {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  workspaceId?: string;
  content: any;
  createdAt: string;
  updatedAt: string;
}

export const useTemplates = (workspaceId?: string) => {
  const fetch = useFetch();
  
  const load = useCallback(async () => {
    const url = workspaceId ? `/templates?workspaceId=${workspaceId}` : '/templates';
    const response = await fetch(url);
    const data = await response.json();
    return data.templates || [];
  }, [fetch, workspaceId]);

  return useSWR<Template[]>(`templates-${workspaceId || 'all'}`, load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });
};

export const useTemplate = (id: string | null) => {
  const fetch = useFetch();
  
  const load = useCallback(async () => {
    if (!id) return null;
    const response = await fetch(`/templates/${id}`);
    return await response.json();
  }, [fetch, id]);

  return useSWR<Template | null>(id ? `template-${id}` : null, load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });
};

export const useCreateTemplate = () => {
  const fetch = useFetch();
  
  return useCallback(async (data: {
    name: string;
    workspaceId?: string;
    content: any;
    description?: string;
  }) => {
    const response = await fetch('/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return await response.json();
  }, [fetch]);
};

export const useUpdateTemplate = () => {
  const fetch = useFetch();
  
  return useCallback(async (id: string, data: {
    name?: string;
    content?: any;
    description?: string;
  }) => {
    const response = await fetch(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return await response.json();
  }, [fetch]);
};

export const useDeleteTemplate = () => {
  const fetch = useFetch();
  
  return useCallback(async (id: string) => {
    const response = await fetch(`/templates/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  }, [fetch]);
};

