import DropzoneInput from "./dropzone-input";

export default function CVPreview() {
  return (
    <div className="flex h-full items-center justify-center">
      <DropzoneInput
        accept={{
          "application/pdf": [".pdf"],
          "application/msword": [".doc"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [".docx"],
        }}
        maxSize={1024 * 1024 * 50} // 50MB
      />
    </div>
  );
}
