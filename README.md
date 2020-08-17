# Document-History

Document-History is an API running on NodeJs, express and MongoDB that allows to store JSON documents and its update history.

It is designed to keep the complete version history of a JSON document in a Mongo Database.

```
{
    _id: ObjectId("..."),
    documentId: "a8319a9c-7a68-407e-859a-63c21fd7660b"
    documentContent: [
        { vid: 1, changeDate: "2020-08-17T01:52:45.617+0000", content: {...} },
        { vid: 2, changeDate: "2020-08-18T01:52:45.617+0000", content: {...} }
    ]
}
```

To maintain the change history `documentContent` stores all versions of a document. This means that the old versions are kept and new versions will only get`$pushed`to the end of the array. `documentContent.vid` is the version id, which is an incrementing number witch each update.

### Features

- Insert new version of a JSON document. `POST /document`
- Browse the whole document history of a document by providing a `documentId`. `GET /document/:documentId`
- Browse a specific state of a JSON document by providing a `vid` (version number). `GET /document/:documentId/versions/:vid`
- Get the diff between 2 states of a document (requested version and previous version). `GET /document/:documentId/diff?vid=5`

_Note: There is a postman collection under the `postman` folder that contains basic examples of how to consume the API._

### Prerequisites

- [MongoDB](https://www.mongodb.com/download-center/community)
- [Node.js v12.18.3+](http://nodejs.org)

### Running `api` locally:

- Before running, create a `.env` from `.env.template` file with the environmental variables listed below.

| Var Name    | Type   | Default                                         | Description                   |
| ----------- | ------ | ----------------------------------------------- | ----------------------------- |
| PORT        | number | `3001`                                          | Port to run the API server on |
| MONGODB_URI | string | `mongodb://localhost:27017/document-history-db` | URL for MongoDB               |

- Once `.env` is created, run `npm install` to add all packages, then run the command below:
  ```
  npm run start
  ```

### License

All code in this repository is provided under the [MIT License](https://github.com/RiahiKarim/document-history/blob/master/LICENSE).
