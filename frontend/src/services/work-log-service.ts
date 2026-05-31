import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './api-client';
import { WorkLog, ApiError } from '@/types';

export interface WorkLogsQueryParams {
  startDate?: string;
  endDate?: string;
  workTypeId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const workLogKeys = {
  all: ['work-logs'] as const,
  lists: () => [...workLogKeys.all, 'list'] as const,
  list: (params: WorkLogsQueryParams) => [...workLogKeys.lists(), params] as const,
};

export const useWorkLogs = (params: WorkLogsQueryParams) => {
  return useQuery<WorkLog[]>({
    queryKey: workLogKeys.list(params),
    queryFn: async () => {
      const response = await apiClient.get<WorkLog[]>('/work-logs', { params });
      return response.data;
    },
  });
};

export const useCreateWorkLog = () => {
  const queryClient = useQueryClient();

  return useMutation<
    WorkLog,
    ApiError,
    { date: string; volume: number; unit: string; workerName: string; workTypeId: string }
  >({
    mutationFn: async (payload) => {
      const response = await apiClient.post<WorkLog>('/work-logs', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workLogKeys.all });
    },
  });
};

export const useUpdateWorkLog = () => {
  const queryClient = useQueryClient();

  return useMutation<
    WorkLog,
    ApiError,
    { id: string; payload: Partial<{ date: string; volume: number; unit: string; workerName: string; workTypeId: string }> }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await apiClient.patch<WorkLog>(`/work-logs/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workLogKeys.all });
    },
  });
};

export const useDeleteWorkLog = () => {
  const queryClient = useQueryClient();

  return useMutation<WorkLog, ApiError, string>({
    mutationFn: async (id) => {
      const response = await apiClient.delete<WorkLog>(`/work-logs/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workLogKeys.all });
    },
  });
};
