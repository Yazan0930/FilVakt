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

export default function PdfViewer(fileId: number) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("opaque");
  const [fileData, setFileData] = useState<string | null>(null);

  const backdrops = ["blur"];

  const handleOpen = (backdrop: string) => {
    setBackdrop(backdrop);
    onOpen();
  };

  const handleViewFile = async (fileId: number) => {
    try {
      const res = await getFileData(fileId);
      console.log("File Data:", res.data); // Debugging

      if (res.data.base64) {
        setFileData(res.data.base64);
      } else if (res.data.filePath) {
        setFileData(res.data.filePath);
      } else {
        console.error("File data is missing.");
      }
    } catch (error) {
      console.error("Error viewing file:", error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {backdrops.map((b) => (
          <Button
            key={b}
            className="capitalize mt-3 text-sm"
            color="default"
            variant="shadow"
            onPress={() => handleOpen(b)}
          >
            Viwe
          </Button>
        ))}
      </div>
      <Modal
        backdrop={backdrop}
        isOpen={isOpen}
        onClose={onClose}
        size={'5xl'}
        onOpen={handleViewFile(fileId.fileID)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">File</ModalHeader>
              <ModalBody>
                <div className="w-full h-full ">
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
