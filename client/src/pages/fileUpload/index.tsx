import { Button, Form, Input, Select, SelectItem } from '@nextui-org/react';
import React, { useRef, useState } from 'react';
import { postCreateFile } from "../../services/api/authApi";
import toast from "react-hot-toast";


function FileUpload() {
  const [pdfData, setPdfData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      if (e.target?.result) {
        const arrayBuffer = e.target.result as ArrayBuffer;
        const base64String = btoa(
          new Uint8Array(arrayBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        setPdfData(base64String);
      }
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseBase64(file);
    }
  };

  const uploadFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const response = await postCreateFile(formData);
      console.log('File uploaded successfully:', response);
      toast.success(response.data.message);

      setPdfData(null);
    } catch (error) {
      console.log('Error while uploading file:', error);
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };


  return (
    <Form className="my-10 form-group justify-center items-center w-full space-y-4" method="post" action="/uploadPdf" onSubmit={uploadFile}>

      {/* File Preview */}
      <div className="flex flex-col gap-4 max-w-sm">
      <label htmlFor="file">Upload PDF</label>
        {pdfData ? (
          <div style={{ textAlign: 'center' }}>
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
        <Input type="hidden" value={pdfData || ''} name="pdfData" />
        <Input
          color="primary"
          ref={fileInputRef}
          id="pdfName"
          type="file"
          name="pdfName"
          accept="application/pdf"
          onChange={handleFileChange}
          
        />
      
      {/* Title Field */}
      {/* <label htmlFor="title">Title</label>
      <Input id="title" name="title" type="text" required /> */}

      {/* File Type Field */}
        <label htmlFor="fileType">File Type</label>
        <Select id="fileType" name="fileType" required>
          <SelectItem key="Info" value="Info">
            Info
          </SelectItem>
          <SelectItem key="ToDo" value="ToDo">
            ToDo
          </SelectItem>
        </Select>

      {/* Target Role Field */}
        {/* <Select 
         id="targetRole"
         name="targetRole"
         required
         > */}
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

      {/* Submit Button */}
      <div style={{ marginTop: '10px' }}>
        <Button color="success" type="submit">
          Upload File
        </Button>
      </div>
    </Form>
  );
}

export default FileUpload;
