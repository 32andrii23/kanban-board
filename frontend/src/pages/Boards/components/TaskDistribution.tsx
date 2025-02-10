import { useMemo, type FC } from 'react';

interface TaskDistributionProps {
  toDo: number;
  inProgress: number;
  done: number;
}

const TaskDistribution: FC<TaskDistributionProps> = ({
  toDo,
  inProgress,
  done,
}) => {
  const total = useMemo(
    () => toDo + inProgress + done,
    [toDo, inProgress, done],
  );

  const toDoPercentage = useMemo(() => (toDo / total) * 100, [toDo, total]);
  const inProgressPercentage = useMemo(
    () => (inProgress / total) * 100,
    [inProgress, total],
  );

  const donePercentage = useMemo(() => (done / total) * 100, [done, total]);

  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className="bg-destructive transition-all duration-300 ease-in-out"
        style={{ width: `${toDoPercentage}%` }}
      />
      <div
        className="bg-warning transition-all duration-300 ease-in-out"
        style={{ width: `${inProgressPercentage}%` }}
      />
      <div
        className="bg-success transition-all duration-300 ease-in-out"
        style={{ width: `${donePercentage}%` }}
      />
    </div>
  );
};

export default TaskDistribution;
