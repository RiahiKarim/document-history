export interface CreateDocumentDto {
  readonly documentId: string;
  readonly documentContent: { [key: string]: any };
}
