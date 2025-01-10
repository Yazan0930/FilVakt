import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import {
  Column as ColumnType,
  Task,
} from "../../../../interfaces/kanbanBoard.interface";
import { useTranslation } from "react-i18next";

type ColumnProps = {
  column: ColumnType;
  tasks: Task[];
  onTaskUpdate: (taskID: number, updateFn: () => Promise<void>) => void;
};

export function Column({ column, tasks, onTaskUpdate }: ColumnProps) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col rounded-2xl p-6 bg-neutral-100 dark:bg-neutral-900 shadow-lg">
      <h2 className="mb-4 text-xl font-bold">{column.title}</h2>
      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-4 rounded-lg border-1 p-4 ${
          isOver ? "border-blue-400 bg-neutral-200" : "border-neutral-700"
        } transition-all duration-200`}
      >
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.taskID}
              task={task}
              onTaskUpdate={onTaskUpdate}
            />
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center text-base italic text-neutral-400">
            {t("no_tasks_in_column")}
          </div>
        )}
      </div>
    </div>
  );
}
