import { useState, useEffect } from "react";
import { Column } from "./Colomn";
import {
  Column as ColumnType,
  Task,
} from "../../../interfaces/kanbanBoard.interface";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { getAllTasks, updateTaskStatus } from "../../../services/api/authApi";

const COLUMNS: ColumnType[] = [
  { id: "To-Do", title: "To Do" },
  { id: "In Progress", title: "In Progress" },
  { id: "Done", title: "Done" },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (): Promise<void> => {
    try {
      const response = await getAllTasks();
      const formattedTasks = response.data.map((task: any) => ({
        taskID: task.TaskID,
        fileID: task.FileID,
        status: task.Status,
        assignedTo: task.AssignedTo,
        assignedToName: task.AssignedToName,
        updatedAt: task.UpdatedAt,
        fileName: task.FileName,
      }));
      console.log("Formatted Tasks:", formattedTasks); // Debugging
      setTasks(formattedTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = over.id as Task["status"];

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskID === taskId ? { ...task, status: newStatus } : task
      )
    );

    // Send updated status to backend
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  }

  const handleUpdateTask = async (
    taskID: number,
    updateFn: () => Promise<void>
  ) => {
    try {
      await updateFn();
      await fetchTasks(); // Re-fetch tasks after update
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-full rounded-4xl p-8 bg-white dark:bg-black shadow-lg dark:shadow-primaryGreen">
      <h1 className="text-center dark:text-white text-3xl font-bold text-black mb-8">
        Kanban Board
      </h1>
      <h2 className="text-xl dark:text-white font-semibold text-darkPrimaryBg mb-4">
        Drag and drop tasks between columns
      </h2>
      <h2 className="text-lg dark:text-white font-medium text-darkPrimaryBg mb-8">
        Click on a task to assign/unassign
      </h2>
      <div className="flex justify-center">
        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-3 gap-10">
            {COLUMNS.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.status === column.id)}
                onTaskUpdate={(taskID, updateFn) => handleUpdateTask(taskID, updateFn)}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}  