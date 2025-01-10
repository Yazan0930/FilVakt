import React, { useState, useEffect } from "react";
import { File } from "../../../interfaces/file.interface";
import {
  getAllUnreadFiles,
  markFileAsRead,
} from "../../../services/api/authApi";
import MainTable from "../../Modules/Table/MainTable";
import { format } from "date-fns"; // For date formatting
import { Button, Chip } from "@nextui-org/react"; // For role chip
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

function UnReadFiles() {
  const { t } = useTranslation();
  const { refreshFlag } = useRefresh();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all files from the API
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const filesResponse = await getAllUnreadFiles();
        setFiles(filesResponse.data);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError("Failed to fetch unread files.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshFlag]);

  const handleMarkAsRead = async (fileId: number) => {
    try {
      await markFileAsRead(fileId);
      // Optimistically update the list
      setFiles((prevFiles) =>
        prevFiles.filter((file) => file.FileID !== fileId)
      );
    } catch (err) {
      console.error("Error marking file as read:", err);
      setError("Failed to mark file as read.");
    }
  };

  if (isLoading) {
    return <div>Loading unread files...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
            {item.FileType}
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
          <div className="inline-flex items-center gap-2">
            <PdfViewer fileID={item.FileID.toString()} />
            <Button className="w-1/2 mt-2"
              color="success"
              size="sm"
              variant="ghost"
              onPress={() => handleMarkAsRead(item.FileID)}
            >
              {t("markAsRead")}
            </Button>
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
        title={t("yourUnreadFiles")}
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

export default UnReadFiles;
