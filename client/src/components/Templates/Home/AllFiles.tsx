import React, { useState, useEffect } from "react";
import { File } from "../../../interfaces/file.interface";
import { getAllFiles } from "../../../services/api/authApi";
import MainTable from "../../Modules/Table/MainTable";
import { format } from "date-fns"; // For date formatting
import { Chip } from "@nextui-org/react"; // For role chip
import PdfViewer from "../../Modules/Pdf/PdfViewer";
import { useRefresh } from "../../../context/RefreshContext";
import { useTranslation } from "react-i18next";

const columns = [
  { name: "Title", uid: "title" },
  { name: "FileType", uid: "fileType" },
  { name: "Uploaded By", uid: "uploadedBy" },
  { name: "Role", uid: "role" },
  { name: "Created At", uid: "createdAt" },
  { name: "Actions", uid: "actions" },
];

const initialVisibleColumns = [
  "title",
  "fileType",
  "uploadedBy",
  "role",
  "createdAt",
  "actions",
];

// Color map for roles and file types
const statusColorMap: Record<
  string,
  "success" | "danger" | "warning" | "primary" | "secondary"
> = {
  Worker: "primary",
  Chef: "secondary",
  Nurse: "warning",
  Info: "primary", // Color for Info file type
  ToDo: "danger", // Color for ToDo file type
};

function AllFiles() {
  const { t } = useTranslation();
  const { refreshFlag } = useRefresh();
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    // Fetch all files from the API
    const fetchData = async () => {
      try {
        const filesResponse = await getAllFiles();
        setFiles(filesResponse.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchData();
  }, [refreshFlag]);

  const renderCell = (item: File, columnKey: React.Key) => {
    switch (columnKey) {
      case "title":
        return item.Title;
      case "fileType":
        return (
          <Chip
            className="file-type-chip"
            color={statusColorMap[item.FileType]}
            size="sm"
            variant="flat"
          >
            {t(item.FileType)}
          </Chip>
        );
      case "uploadedBy":
        return item.CreatedByName;
      case "role":
        return (
          <Chip
            className="role-chip"
            color={statusColorMap[item.TargetRoleName]}
            size="sm"
            variant="flat"
          >
            {item.TargetRoleName}
          </Chip>
        );
      case "createdAt":
        return format(new Date(item.CreatedAt), "PPP p"); // Format date to "Dec 27, 2024 9:42 PM"
      case "actions":
        return (
          <div>
            <PdfViewer fileID={item.FileID} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-auto justify-between">
      <MainTable
        columns={columns}
        title={t("all_files")}
        data={files.map((file) => ({
          ...file,
          id: file.FileID.toString(),
          status: statusColorMap[file.TargetRoleName] || "success",
        }))}
        initialVisibleColumns={initialVisibleColumns}
        renderCell={renderCell}
      />
    </div>
  );
}

export default AllFiles;
