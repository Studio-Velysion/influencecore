'use client';

import { useCallback } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';

export interface PostVersion {
  id: string;
  postId: string;
  accountId?: string;
  isOriginal: boolean;
  content: any;
  options?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export const usePostVersions = (postId: string | null) => {
  const fetch = useFetch();
  
  const load = useCallback(async () => {
    if (!postId) return [];
    const response = await fetch(`/post-versions/post/${postId}`);
    const data = await response.json();
    return data.versions || [];
  }, [fetch, postId]);

  return useSWR<PostVersion[]>(postId ? `post-versions-${postId}` : null, load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });
};

export const useCreatePostVersion = () => {
  const fetch = useFetch();
  
  return useCallback(async (data: {
    postId: string;
    accountId?: string;
    isOriginal?: boolean;
    content: any;
    options?: Record<string, any>;
  }) => {
    const response = await fetch('/post-versions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return await response.json();
  }, [fetch]);
};

export const useUpdatePostVersion = () => {
  const fetch = useFetch();
  
  return useCallback(async (id: string, data: {
    content?: any;
    options?: Record<string, any>;
  }) => {
    const response = await fetch(`/post-versions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return await response.json();
  }, [fetch]);
};

export const useDeletePostVersion = () => {
  const fetch = useFetch();
  
  return useCallback(async (id: string) => {
    const response = await fetch(`/post-versions/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  }, [fetch]);
};

