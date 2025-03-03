import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Form,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { postCreateFile } from "../../../services/api/authApi";
import { useRefresh } from "../../../context/RefreshContext";
import PlusIcon from "../../../assets/icons/fill/Plus";
import { useTranslation } from "react-i18next";

function UploadFile() {
  const { t } = useTranslation()
  const [pdfData, setPdfData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("opaque");
  const { triggerRefresh } = useRefresh(); // Access the context function

  const backdrops = ["blur"];

  const handleOpen = (backdrop: string) => {
    setBackdrop(backdrop);
    onOpen();
  };

  const parseBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      if (e.target?.result) {
        const arrayBuffer = e.target.result as ArrayBuffer;
        
        // Correct encoding to handle special characters
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = "";
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        const base64String = btoa(binaryString);
        setPdfData(base64String);
      }
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected File Name:", file.name);
      parseBase64(file);
    }
  };

  const uploadFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // check that all required fields are filled
    if (!pdfData) {
      toast.error("Please select a PDF file", {
        duration: 5000,
      });
      return;
    }
  
    const form = e.currentTarget;
    const fileType = form.fileType.value;
    const targetRole = form.targetRole.value;
  
    if (!fileType || !targetRole) {
      toast.error("Please select a file type and target role");
      return;
    }
  
    const formData = new FormData(form);
    try {
      const response = await postCreateFile(formData); // Adjust API call to match your backend route
      console.log("File uploaded successfully:", response);
      toast.success(response.data.message);
      setPdfData(null);
      triggerRefresh(); // Trigger the context function
    } catch (error) {
      console.error("Error while uploading file:", error);
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };
  

  return (
    <>
      {backdrops.map((b) => (
        <Button
          key={b}
          color="primary"
          endContent={<PlusIcon />}
          onPress={() => handleOpen(b)}
        >
          {t("addNew")}
        </Button>
      ))}

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose} size={"2xl"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Upload File</ModalHeader>
              <ModalBody>
                <Form
                  className="my-10 form-group justify-center items-center "
                  method="post"
                  action="/uploadPdf"
                  onSubmit={uploadFile}
                >
                  {/* File Preview */}
                  <div className="flex flex-col gap-4 ">
                    {pdfData ? (
                      <div style={{ textAlign: "center" }}>
                        <p>Preview</p>
                        <embed
                          src={`data:application/pdf;base64,${pdfData}`}
                          width="500"
                          height="375"
                          type="application/pdf"
                        />
                      </div>
                    ) : (
                      <p>No PDF selected.</p>
                    )}
                    <Input type="hidden" value={pdfData || ""} name="pdfData" />
                    <Input
                      color="primary"
                      ref={fileInputRef}
                      id="pdfName"
                      type="file"
                      name="pdfName"
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                    <Select 
                        isRequired
                        label="File Type"
                        labelPlacement="outside"
                        name="fileType"
                        placeholder="Select fileType"
                        >
                      <SelectItem key="Info" value="Info">
                        Info
                      </SelectItem>
                      <SelectItem key="ToDo" value="ToDo">
                        ToDo
                      </SelectItem>
                    </Select>

                    <Select
                      isRequired
                      label="TargetRole"
                      labelPlacement="outside"
                      name="targetRole"
                      placeholder="Select targetRole"
                    >
                      <SelectItem key="1" value="1">
                        Workers
                      </SelectItem>
                      <SelectItem key="2" value="2">
                        Chef
                      </SelectItem>
                      <SelectItem key="3" value="3">
                        Nurs
                      </SelectItem>
                    </Select>
                  </div>

                  <div style={{ marginTop: "10px" }}>
                    <Button color="success" variant="light" type="submit">
                      Upload File
                    </Button>
                  </div>
                </Form>
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

export default UploadFile;
