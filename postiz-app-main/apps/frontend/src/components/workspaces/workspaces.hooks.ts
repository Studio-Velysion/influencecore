'use client';

import { useCallback } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
    integrations: number;
    media: number;
  };
}

export const useWorkspaces = () => {
  const fetch = useFetch();
  
  const load = useCallback(async () => {
    const response = await fetch('/workspaces');
    const data = await response.json();
    return data.workspaces || [];
  }, [fetch]);

  return useSWR<Workspace[]>('workspaces', load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });
};

export const useWorkspace = (id: string | null) => {
  const fetch = useFetch();
  
  const load = useCallback(async () => {
    if (!id) return null;
    const response = await fetch(`/workspaces/${id}`);
    return await response.json();
  }, [fetch, id]);

  return useSWR<Workspace | null>(id ? `workspace-${id}` : null, load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });
};

export const useCreateWorkspace = () => {
  const fetch = useFetch();
  
  return useCallback(async (data: { name: string; description?: string }) => {
    const response = await fetch('/workspaces', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return await response.json();
  }, [fetch]);
};

export const useUpdateWorkspace = () => {
  const fetch = useFetch();
  
  return useCallback(async (id: string, data: { name?: string; description?: string }) => {
    const response = await fetch(`/workspaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return await response.json();
  }, [fetch]);
};

export const useDeleteWorkspace = () => {
  const fetch = useFetch();
  
  return useCallback(async (id: string) => {
    const response = await fetch(`/workspaces/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  }, [fetch]);
};

