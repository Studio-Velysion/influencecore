'use client';

import { useCallback } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';

export interface Queue {
  id: string;
  name: string;
  organizationId: string;
  workspaceId?: string;
  schedule: {
    times: string[];
    days: string[];
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export const useQueues = (workspaceId?: string) => {
  const fetch = useFetch();
  
  const load = useCallback(async () => {
    const url = workspaceId ? `/queues?workspaceId=${workspaceId}` : '/queues';
    const response = await fetch(url);
    const data = await response.json();
    return data.queues || [];
  }, [fetch, workspaceId]);

  return useSWR<Queue[]>(`queues-${workspaceId || 'all'}`, load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });
};

export const useQueue = (id: string | null) => {
  const fetch = useFetch();
  
  const load = useCallback(async () => {
    if (!id) return null;
    const response = await fetch(`/queues/${id}`);
    return await response.json();
  }, [fetch, id]);

  return useSWR<Queue | null>(id ? `queue-${id}` : null, load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });
};

export const useCreateQueue = () => {
  const fetch = useFetch();
  
  return useCallback(async (data: {
    name: string;
    workspaceId?: string;
    schedule: { times: string[]; days: string[] };
    isActive?: boolean;
  }) => {
    const response = await fetch('/queues', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return await response.json();
  }, [fetch]);
};

export const useUpdateQueue = () => {
  const fetch = useFetch();
  
  return useCallback(async (id: string, data: {
    name?: string;
    schedule?: { times: string[]; days: string[] };
    isActive?: boolean;
  }) => {
    const response = await fetch(`/queues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return await response.json();
  }, [fetch]);
};

export const useDeleteQueue = () => {
  const fetch = useFetch();
  
  return useCallback(async (id: string) => {
    const response = await fetch(`/queues/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  }, [fetch]);
};

export const useAssignPostToQueue = () => {
  const fetch = useFetch();
  
  return useCallback(async (queueId: string, postId: string) => {
    const response = await fetch(`/queues/${queueId}/assign-post/${postId}`, {
      method: 'POST',
    });
    return await response.json();
  }, [fetch]);
};

export const useUnassignPostFromQueue = () => {
  const fetch = useFetch();
  
  return useCallback(async (postId: string) => {
    const response = await fetch(`/queues/unassign-post/${postId}`, {
      method: 'POST',
    });
    return await response.json();
  }, [fetch]);
};

