import AllFiles from "../../components/Templates/Home/AllFiles";
import KanbanBoard from "../../components/Templates/Home/KanbanBoard/KanbanBoard";
import UnReadFiles from "../../components/Templates/Home/UnReadFiles";
import { useSidebarStore } from "../../stores/useSidebar";

export default function Home() {
  const { isSidebarExpanded } = useSidebarStore();
  return (
    <div className="mt-5 grid grid-cols-1 gap-8">
      <UnReadFiles />
      <KanbanBoard />
      <AllFiles />
      <div
        className={`grid ${
          isSidebarExpanded ? "md:grid-cols-1" : "md:grid-cols-2"
        } mdb:grid-cols-2 xl:grid-cols-3 gap-8`}
      ></div>
    </div>
  );
}
