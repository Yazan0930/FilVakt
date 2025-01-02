import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { getFileData } from "../../../services/api/authApi";

interface PdfViewerProps {
  fileID: number;
}

export default function PdfViewer({ fileID }: PdfViewerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fileData, setFileData] = useState<string | null>(null);

  const handleOpenModal = async () => {
    try {
      const res = await getFileData(fileID);
      console.log("File Data:", res.data); // Debugging

      if (res.data.base64) {
        setFileData(res.data.base64);
      } else if (res.data.filePath) {
        setFileData(res.data.filePath);
      } else {
        console.error("File data is missing.");
      }

      onOpen(); // Open the modal only after fetching the data
    } catch (error) {
      console.error("Error viewing file:", error);
    }
  };

  return (
    <>
      <Button
        className="capitalize mt-3 text-sm"
        color="default"
        variant="shadow"
        onPress={handleOpenModal}
      >
        View
      </Button>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">File</ModalHeader>
              <ModalBody>
                <div className="w-full h-full">
                  <div className="flex justify-center">
                    {fileData ? (
                      <embed
                        src={
                          fileData.startsWith("data:")
                            ? fileData
                            : `data:application/pdf;base64,${fileData}`
                        }
                        className="w-full min-h-[550px]"
                        type="application/pdf"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        No file selected for preview.
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
