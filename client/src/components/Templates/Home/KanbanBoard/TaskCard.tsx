import { useDraggable } from "@dnd-kit/core";
import { Task } from "../../../../interfaces/kanbanBoard.interface";
import { assignTaskToUser, unAssignTask } from "../../../../services/api/authApi";
import { useState } from "react";
import { Button } from "@nextui-org/react";
import PdfViewer from "../../../Modules/Pdf/PdfViewer";

type TaskCardProps = {
  task: Task;
  onTaskUpdate: (taskID: number, updateFn: () => Promise<void>) => void;
};

export function TaskCard({ task, onTaskUpdate }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.taskID.toString(),
    });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  async function handleAssignUnassign() {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Task:", task); // Debugging
      const updateFn =
        task.assignedTo === null
          ? () => assignTaskToUser(task.taskID)
          : () => unAssignTask(task.taskID);
      onTaskUpdate(task.taskID, updateFn);
    } catch (err) {
      setError("Failed to update assignment.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <div className="bg-zinc-700 dark:bg-neutral-800 p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-neutral-100 truncate">
          {task.fileName}
        </h3>
        <div className="mt-2 flex flex-col gap-1">
          <p className="text-xl text-neutral-400">
            <span className="font-medium text-neutral-300">Assigned to:</span>{" "}
            {task.assignedToName || "Unassigned"}
          </p>
          <p className="text-sm text-neutral-400">
            <span className="font-medium text-neutral-300">Updated At:</span>{" "}
            {new Date(task.updatedAt).toLocaleString()}
          </p>
        </div>
        <Button
          className={`mt-4 rounded px-4 py-2 text-sm font-medium ${
            task.assignedTo
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          onPress={handleAssignUnassign}
          disabled={isLoading}
        >
          {isLoading
            ? "Processing..."
            : task.assignedTo === null
              ? "Assign to Me"
              : "Unassign Me"}
        </Button>
        <PdfViewer fileID={task.fileID} />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
