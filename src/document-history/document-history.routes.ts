import { Router } from 'express';

import {
    getDocumentContentDiff, getDocumentHistory, getSpecificVersionOfDocument, insertDocument
} from './document-history.controller';

export const documentHistoryRouter = Router();

documentHistoryRouter.get('/document/:documentId', getDocumentHistory);
documentHistoryRouter.get('/document/:documentId/versions/:vid', getSpecificVersionOfDocument);
documentHistoryRouter.get('/document/:documentId/diff', getDocumentContentDiff);
documentHistoryRouter.post('/document', insertDocument);
