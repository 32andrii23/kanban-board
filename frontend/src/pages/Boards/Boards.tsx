import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Frown, Kanban, PlusCircle, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BoardCard } from './components/BoardCard';
import AddBoardDialog from './components/AddBoardDialog';
import { RouterKey } from '@/constants';
import { useBoards } from '@/hooks/useBoards';
import { useBoard } from '@/hooks/useBoard';

export const Boards = () => {
  const [search, setSearch] = useState('');
  const [isAddBoardOpen, setIsAddBoardOpen] = useState(false);

  const boards = useBoards(search);
  const boardsLength = useMemo(
    () => (boards.data ? boards.data.length : 0),
    [boards],
  );

  const { createBoard } = useBoard();
  const addBoard = useCallback((name: string) => {
    createBoard({ name });
  }, []);

  return (
    <div className="min-h-screen bg-background p-8 transition-colors duration-300 container">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-foreground flex items-center">
          My Boards [{boardsLength} <Kanban className="h-8 w-8 mt-2" /> ]
        </h1>
      </div>
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search boards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsAddBoardOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Board
        </Button>
      </div>
      <div className="grid-masonry grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {boardsLength === 0 && (
          <div className="text-center font-semibold text-foreground w-[calc(100vw-32px)] h-[calc(100vh-400px)] flex items-center justify-center gap-2">
            No boards found
            <Frown />
          </div>
        )}
        {boards.data &&
          boards.data.map((board) => (
            <Link
              to={RouterKey.BOARD_PROFILE.replace(
                ':boardId',
                board.id.toString(),
              )}
              key={board.id}
            >
              <BoardCard board={board} />
            </Link>
          ))}
      </div>
      <AddBoardDialog
        isOpen={isAddBoardOpen}
        onClose={() => setIsAddBoardOpen(false)}
        onAdd={addBoard}
      />
    </div>
  );
};
