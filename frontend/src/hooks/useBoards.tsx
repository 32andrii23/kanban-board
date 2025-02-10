import { BackendRoute, QueryKey } from '@/constants';
import { apiService } from '@/services/api.service';
import { BoardDto } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useBoards = (search: string) => {
  const getAllBoards = async (search: string) => {
    const response = await apiService.get<BoardDto[]>(BackendRoute.BOARDS, {
      params: { search },
    });
    return response.data;
  };

  return useQuery({
    queryKey: [QueryKey.BOARDS, search],
    queryFn: () => getAllBoards(search),
    placeholderData: keepPreviousData,
  });
};
