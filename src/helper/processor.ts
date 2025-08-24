import pdf from "pdf-parse";
import mammoth from "mammoth";

export interface ProcessedDocument {
  text: string;
  pageCount: number;
  fileType: string;
}

export class DocumentProcessor {
  async processDocument(file: File): Promise<ProcessedDocument> {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "pdf") {
      return this.processPDF(file);
    } else if (fileExtension === "docx") {
      return this.processDOCX(file);
    } else if (fileExtension === "doc") {
      return this.processDOC(file);
    } else {
      throw new Error(`Unsupported file type: ${fileExtension}`);
    }
  }

  private async processPDF(file: File): Promise<ProcessedDocument> {
    try {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Parse PDF using pdf-parse
      const data = await pdf(buffer);

      console.log(
        `PDF processed: ${data.numpages} pages, ${data.text.length} characters`,
      );

      return {
        text: data.text,
        pageCount: data.numpages,
        fileType: "pdf",
      };
    } catch (error) {
      console.error("Error processing PDF:", error);
      throw new Error(
        `Failed to process PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async processDOCX(file: File): Promise<ProcessedDocument> {
    try {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Convert DOCX to HTML using mammoth
      const result = await mammoth.extractRawText({ buffer });

      console.log(`DOCX processed: ${result.value.length} characters`);

      return {
        text: result.value,
        pageCount: 1, // DOCX doesn't have explicit page count
        fileType: "docx",
      };
    } catch (error) {
      console.error("Error processing DOCX:", error);
      throw new Error(
        `Failed to process DOCX: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async processDOC(file: File): Promise<ProcessedDocument> {
    try {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Try to convert DOC to HTML using mammoth
      // Note: Mammoth works best with DOCX, but can handle some DOC files
      const result = await mammoth.extractRawText({ buffer });

      console.log(`DOC processed: ${result.value.length} characters`);

      return {
        text: result.value,
        pageCount: 1, // DOC doesn't have explicit page count
        fileType: "doc",
      };
    } catch (error) {
      console.error("Error processing DOC:", error);
      throw new Error(
        `Failed to process DOC: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async close(): Promise<void> {
    // No cleanup needed for these libraries
  }
}
