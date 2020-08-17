import { Document, Model, model, Schema } from 'mongoose';

import { invalidInputError } from '../../core/error-management';
import { isContentDifferent } from '../../util';
import { CreateDocumentDto } from '../dto';

const documentSchema = new Schema(
  {
    vid: {
      type: Number,
      required: true,
    },
    changeDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    content: {
      type: Schema.Types.Mixed,
    },
  },
  {
    _id: false,
  }
);

const documentHistorySchema = new Schema({
  documentId: {
    type: String,
    required: true,
  },
  documentContent: [documentSchema],
});

export interface DocumentHistoryDocument extends Document {
  documentId: string;
  documentContent: [
    {
      vid: number;
      changeDate: Date;
      content: any;
    }
  ];
}

interface DocumentHistoryModel extends Model<DocumentHistoryDocument> {
  insertNewVersion(newDocument: CreateDocumentDto): Promise<DocumentHistoryDocument>;
  getSpecificVersion(documentId: string, vid: number): Promise<DocumentHistoryDocument>;
  getLastTwoVersions(documentId: string): Promise<DocumentHistoryDocument>;
}

class DocumentHistoryClass extends Model {
  public static async insertNewVersion(newDocument: CreateDocumentDto) {
    const documentId = newDocument.documentId;
    const newDocumentContent = newDocument.documentContent;
    if (!documentId || !newDocumentContent) {
      throw invalidInputError('Bad data');
    }

    const document: DocumentHistoryDocument = await this.findOne({ documentId });

    if (!document) {
      // Add the document as the first version
      await this.create<DocumentHistoryDocument>({
        documentId,
        documentContent: [
          {
            vid: 1,
            changeDate: new Date(),
            content: newDocumentContent,
          },
        ],
      });
    } else {
      // Insert the document with its new version (latest version + 1)
      const latestInsertedDocument = document.documentContent.slice(-1)[0];
      const latestDocumentContent = latestInsertedDocument.content;

      if (!isContentDifferent(latestDocumentContent, newDocumentContent)) {
        throw invalidInputError(
          'The new document content is the same as the last document version. Please update your document content.'
        );
      }

      document.documentContent.push({
        vid: latestInsertedDocument.vid + 1,
        changeDate: new Date(),
        content: newDocumentContent,
      });
      await document.save();
    }

    return this.getLastTwoVersions(documentId);
  }

  public static async getLastTwoVersions(documentId: string) {
    return await this.findOne({ documentId }, { documentContent: { $slice: -2 } }).setOptions({ lean: true });
  }

  public static async getSpecificVersion(documentId: string, vid: number) {
    return await this.findOne(
      { documentId, documentContent: { $elemMatch: { vid } } },
      { documentId, documentContent: { $elemMatch: { vid } } }
    ).setOptions({
      lean: true,
    });
  }
}

documentHistorySchema.loadClass(DocumentHistoryClass);

const DocumentHistory = model<DocumentHistoryDocument, DocumentHistoryModel>('Document', documentHistorySchema);

export default DocumentHistory;
