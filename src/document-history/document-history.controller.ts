import { detailedDiff } from 'deep-object-diff';
import { NextFunction, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';

import { HttpStatusCode, resourceNotFoundError } from '../core/error-management';
import { isJson } from '../util';
import DocumentHistory, { DocumentHistoryDocument } from './models/document-history.model';

/**
 * @route POST /document
 */
export const insertDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await body('documentId', 'Document Id cannot be blank').not().isEmpty({ ignore_whitespace: true }).run(req);
    await body('documentContent', 'Document Content must be a valid JSON').custom(isJson).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      if (!errors.isEmpty()) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
      }
    }

    const { documentId, documentContent } = req.body;

    const document = await DocumentHistory.insertNewVersion({ documentId, documentContent });

    res.json({ document });
  } catch (err) {
    next(err);
  }
};

/**
 * @route GET /document/:documentId
 */
export const getDocumentHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const document = await DocumentHistory.findOne({ documentId: req.params.documentId });

    if (!document) {
      throw resourceNotFoundError(`The requested document ${req.params.documentId} does not exist`);
    }

    res.send(document);
  } catch (err) {
    next(err);
  }
};

/**
 * @route GET /document/:documentId/versions/:vid'
 */
export const getSpecificVersionOfDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await param('vid', 'Document vid must be numeric').isNumeric().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      if (!errors.isEmpty()) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
      }
    }

    const documentId = req.params.documentId;
    const vid = parseInt(req.params.vid);

    const document = await DocumentHistory.getSpecificVersion(documentId, vid);

    if (!document) {
      throw resourceNotFoundError(`The requested version ${vid} of the document ${documentId} does not exist`);
    }

    res.send(document);
  } catch (err) {
    next(err);
  }
};

/**
 * @route GET /document/:documentId/diff?vid=5'
 */
export const getDocumentContentDiff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documentId = req.params.documentId;
    await query('vid', 'Document vid must be provided').not().isEmpty().run(req);
    await query('vid', 'Document vid must be numeric').isNumeric().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      if (!errors.isEmpty()) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
      }
    }

    const vid = parseInt(<string>req.query.vid);

    const requestedVersion = await DocumentHistory.getSpecificVersion(documentId, vid);

    if (!requestedVersion) {
      throw resourceNotFoundError(`The requested version ${vid} of the document ${documentId} does not exist`);
    }

    const previousVersion = await DocumentHistory.getSpecificVersion(documentId, vid - 1);

    const previousVersionContent = previousVersion ? previousVersion.documentContent[0].content : {};
    const requestedVersionContent = requestedVersion.documentContent[0].content;

    res.send({
      documentId: requestedVersion.documentId,
      previousVersionContent,
      requestedVersionContent,
      detailedDiff: detailedDiff(previousVersionContent, requestedVersionContent),
    });
  } catch (err) {
    next(err);
  }
};
