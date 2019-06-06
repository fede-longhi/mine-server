const FileDocument = require('../models').FileDocument;

module.exports = {
    create(req, res) {
        console.log('Request create FileDocument');
        return FileDocument
        .create({
            name: req.body.name,
            extension: req.body.extension,
            partyId: req.body.partyId,
            data: req.body.data,
        })
        .then(fileDocument => {
            res.status(201).send(fileDocument);
        })
        .catch(error => res.status(400).send(error));
    },

    retrieve(req, res) {
        console.log('Request find by query params FileDocument: ' + JSON.stringify(req.query));
        if (Object.keys(req.query).length > 0) {
            if (req.query.fileDocumentId != null && req.query.fileDocumentId != undefined && req.query.partyId != null && req.query.partyId!= undefined) {
                return FileDocument
                .findByPk(req.query.fileDocumentId)
                .then(fileDocument => {
                    if (!!fileDocument && fileDocument.partyId == req.query.partyId) {
                        return res.status(200).send(fileDocument);  
                    }
                    return res.status(400).send({
                        message: "FileDocument not found."
                    })
                })
                .catch(error => res.status(400).send(error));
            }
            else if (req.query.fileDocumentId != null && req.query.fileDocumentId != undefined) {
                return FileDocument
                .findByPk(req.query.fileDocumentId)
                .then(fileDocument => {
                    if (!fileDocument) {
                        return res.status(400).send({
                            message: "FileDocument not found."
                        })
                    }
                    return res.status(200).send(fileDocument);
                })
                .catch(error => res.status(400).send(error));
            } else if (req.query.partyId != null && req.query.partyId!= undefined) {
                return FileDocument
                .findAll({
                    where: {
                        partyId: req.query.partyId
                    }
                })
                .then(fileDocument => {
                    if (!fileDocument) {
                        return res.status(400).send({
                            message: "FileDocument not found."
                        })
                    }
                    return res.status(200).send(fileDocument);
                })
                .catch(error => res.status(400).send(error));
            }
        } else {
            console.log('Find all');
            return FileDocument
                .findAll()
                .then((fileDocument) => res.status(200).send(fileDocument))
                .catch(error => res.status(400).send(error));
        }
    },

    update(req, res) {
        console.log('Request update by pk  FileDocument: ' + req.params.fileDocumentId);
        return FileDocument
            .findByPk(req.params.fileDocumentId)
            .then(fileDocument => {
                if (!fileDocument) {
                    return res.status(204).send({
                        message: 'FileDocument Not Found',
                    });
                }
                return fileDocument
                    .update({
                        extension: req.body.extension || fileDocument.extension,
                        data: req.body.data || fileDocument.data,
                    })
                    .then((fileDocument) => res.status(200).send(fileDocument))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },


    destroy(req, res) {
        console.log('Request remove by pk  FileDocument: ' + req.params.fileDocumentId);
        return FileDocument
            .findByPk(req.params.fileDocumentId)
            .then(fileDocument => {
                if (!fileDocument) {
                    return res.status(400).send({
                        message: 'FileDocument Not Found',
                    });
                }
                return fileDocument
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },

}
