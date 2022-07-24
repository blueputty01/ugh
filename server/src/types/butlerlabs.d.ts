export interface ExtractionResult {
  documentId: string;
  documentStatus: string;
  fileName: string;
  mimeType: string;
  documentType: string;
  confidenceScore: string;
  formFields: FormField[];
  tables: Table[];
}

export interface Table {
  tableName: string;
  confidenceScore: string;
  rows: Row[];
}

export interface Row {
  cells: Cell[];
}

export interface Cell {
  columnName: string;
  confidenceScore: string;
  value: string;
}

export interface FormField {
  fieldName: string;
  value: string;
  confidenceScore: string;
}
