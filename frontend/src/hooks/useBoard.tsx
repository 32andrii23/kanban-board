import { BackendRoute, QueryKey, RouterKey } from '@/constants';
import { apiService } from '@/services/api.service';
import { BoardDto } from '@/types';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useBoard = (boardId?: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createBoard = async (createBoardDto: { name: string }) => {
    const response = await apiService.post<BoardDto>(
      BackendRoute.BOARDS,
      createBoardDto,
    );

    queryClient.invalidateQueries({ queryKey: [QueryKey.BOARDS] });

    return response.data;
  };

  const createBoardMutation = useMutation({
    mutationFn: createBoard,
  });

  const getBoard = async () => {
    const response = await apiService.get<BoardDto>(
      BackendRoute.BOARD.replace(':boardId', boardId || ''),
    );

    return response.data;
  };

  const getBoardQuery = useQuery({
    queryKey: [QueryKey.BOARD, boardId],
    queryFn: getBoard,
    placeholderData: keepPreviousData,
    enabled: !!boardId,
  });

  const updateBoard = async (updateBoardDto: { name: string }) => {
    const response = await apiService.patch<BoardDto>(
      BackendRoute.BOARD.replace(':boardId', boardId || ''),
      updateBoardDto,
    );

    queryClient.invalidateQueries({ queryKey: [QueryKey.BOARDS] });
    queryClient.invalidateQueries({ queryKey: [QueryKey.BOARD] });

    return response.data;
  };

  const updateBoardMutation = useMutation({
    mutationFn: updateBoard,
  });

  const deleteBoard = async () => {
    await apiService.delete(
      BackendRoute.BOARD.replace(':boardId', boardId || ''),
    );

    queryClient.invalidateQueries({ queryKey: [QueryKey.BOARDS] });
    queryClient.invalidateQueries({ queryKey: [QueryKey.BOARD] });

    navigate(RouterKey.BOARDS);
  };

  const deleteBoardMutation = useMutation({
    mutationFn: deleteBoard,
  });

  return {
    createBoard: createBoardMutation.mutate,
    board: getBoardQuery.data,
    updateBoard: updateBoardMutation.mutate,
    deleteBoard: deleteBoardMutation.mutate,
  };
};
