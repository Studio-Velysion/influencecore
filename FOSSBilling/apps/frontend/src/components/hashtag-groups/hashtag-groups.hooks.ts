'use client';

import { useCallback } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';

export interface HashtagGroup {
  id: string;
  name: string;
  organizationId: string;
  workspaceId?: string;
  hashtags: string[];
  createdAt: string;
  updatedAt: string;
}

export const useHashtagGroups = (workspaceId?: string) => {
  const fetch = useFetch();
  
  const load = useCallback(async () => {
    const url = workspaceId ? `/hashtag-groups?workspaceId=${workspaceId}` : '/hashtag-groups';
    const response = await fetch(url);
    const data = await response.json();
    return data.hashtagGroups || [];
  }, [fetch, workspaceId]);

  return useSWR<HashtagGroup[]>(`hashtag-groups-${workspaceId || 'all'}`, load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });
};

export const useCreateHashtagGroup = () => {
  const fetch = useFetch();
  
  return useCallback(async (data: {
    name: string;
    workspaceId?: string;
    hashtags: string[];
  }) => {
    const response = await fetch('/hashtag-groups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return await response.json();
  }, [fetch]);
};

export const useUpdateHashtagGroup = () => {
  const fetch = useFetch();
  
  return useCallback(async (id: string, data: {
    name?: string;
    hashtags?: string[];
  }) => {
    const response = await fetch(`/hashtag-groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return await response.json();
  }, [fetch]);
};

export const useDeleteHashtagGroup = () => {
  const fetch = useFetch();
  
  return useCallback(async (id: string) => {
    const response = await fetch(`/hashtag-groups/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  }, [fetch]);
};

