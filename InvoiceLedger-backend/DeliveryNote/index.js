const express = require('express');
const Sequalize = require('sequelize');


const DeliveryNote = require('./model')
const Op = Sequalize.Op;


exports.showDeliveryNotes = function (req, res) {
    DeliveryNote.findAll()
        .then(DeliveryNotes => {
            return res.status(200).json({
                message: DeliveryNotes
            });
        })
        .catch((err) => {
            console.error('problem communicating with db');
            res.status(500).json({
                err: error.message
            });
        });
}


exports.create = function (req, res) {
    // console.log(req.body.coordinates);
    if (req.file == undefined) {
        const newDeliveryNote = new DeliveryNote({
            name: req.body.name,
            job: req.body.job,
            VATRegistrationNum: req.body.VatRegistrationNum,
            address: req.body.address,
            city: req.body.city,
            loadingPlace: req.body.loadingPlace,
            taxOffice: req.body.taxOffice,
            destination: req.body.destination,
            // details: req.body.details,
            // file: req.file.path,
            coordinates: req.body.coordinates
        });
        // console.log(coordinates)
        let { name, job, VATRegistrationNum, address, city, loadingPlace, taxOffice, destination, coordinates } = newDeliveryNote;
        DeliveryNote.create({
            name,
            job,
            VATRegistrationNum,
            address,
            city,
            loadingPlace,
            taxOffice,
            destination,
            coordinates
        })
            .then(result => {
                res.status(201).json({
                    message: "Delivery Note created",
                    user: result
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    err: err.message
                });
            });
    }
    else {
        const newDeliveryNote = new DeliveryNote({
            name: req.body.name,
            job: req.body.job,
            VATRegistrationNum: req.body.VatRegistrationNum,
            address: req.body.address,
            city: req.body.city,
            loadingPlace: req.body.loadingPlace,
            taxOffice: req.body.taxOffice,
            destination: req.body.destination,
            // details: req.body.details,
            file: req.file.path,
            coordinates: req.body.coordinates
        });
        let { name, job, VATRegistrationNum, address, city, loadingPlace, taxOffice, destination, file, coordinates } = newDeliveryNote;
        DeliveryNote.create({
            name,
            job,
            VATRegistrationNum,
            address,
            city,
            loadingPlace,
            taxOffice,
            destination,
            file,
            coordinates
        })
            .then(result => {
                res.status(201).json({
                    message: "Delivery Note created",
                    user: result
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    err: err.message
                });
            });
    }
}


exports.find = function (req, res) {
    const deliverynote_id = req.params.deliverynote_id;
    DeliveryNote.findOne({
        where: {
            id: deliverynote_id,
        },
    })
        .then((DeliveryNoteInfo) => {
            console.log(DeliveryNoteInfo)
            if (DeliveryNoteInfo) {
                console.log('DeliveryNote found at db');
                res.status(200).json({
                    message: "Your asked deliveryNore",
                    DeliveryNote: DeliveryNoteInfo
                });
            } else {
                console.error('DeliveryNote not found in db');
                res.status(404).send('Your asked DeliveryNote does not exist in db');
            }
        })
        .catch((error) => {
            console.error('problem communicating with db');
            res.status(500).json({
                err: error.message
            });
        });
}

exports.delete = function (req, res) {
    const deliverynote_id = req.params.deliverynote_id;
    DeliveryNote.destroy({
        where: {
            id: deliverynote_id,
        },
    })
        .then((DeliveryNoteInfo) => {
            if (DeliveryNoteInfo === 1) {
                console.log('DeliveryNote deleted from db');
                res.status(200).send('DeliveryNote deleted from db');
            } else {
                console.error('DeliveryNote not found in db');
                res.status(404).send('no DeliveryNote in db');
            }
        })
        .catch((error) => {
            console.error('problem communicating with db');
            res.status(500).json({
                err: error.message
            });
        });
}

exports.search = function (req, res) {
    const { term } = req.query;
    // let term = "Volos"//for testing with postman
    console.log(term)
    DeliveryNote.findAll({
        where: {
            [Op.or]: [
                { VATRegistrationNum: { [Op.like]: '%' + term + '%' } },
                { name: { [Op.like]: '%' + term + '%' } },
                { job: { [Op.like]: '%' + term + '%' } },
                { address: { [Op.like]: '%' + term + '%' } },
                { city: { [Op.like]: '%' + term + '%' } },
                { loadingPlace: { [Op.like]: '%' + term + '%' } },
                { taxOffice: { [Op.like]: '%' + term + '%' } },
                { destination: { [Op.like]: '%' + term + '%' } },
                { file: { [Op.like]: '%' + term + '%' } },
                { coordinates: { [Op.like]: '%' + term + '%' } }
            ]
        }
    })
        .then(DeliveryNotes => {
            console.log(DeliveryNotes)
            return res.status(200).json({
                message: DeliveryNotes
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                Error: err
            })
        })
}





