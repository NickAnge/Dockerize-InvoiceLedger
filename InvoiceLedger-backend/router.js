const express = require('express');
const passport = require('passport');
const passportService = require('./config/passport');
const multerService = require('./config/multer');

const controllers = {
    user: require('./User'),
    deliveryNote: require('./DeliveryNote')
};

const routes = {
    user: express.Router(),
    deliveryNote: express.Router()
};

const requireAuth = passport.authenticate('jwt', { session: false });
const upload = multerService.upload.single("file");
module.exports = function (app) {
    // * USER ROUTES *
    app.use('/users', requireAuth, routes.user);
    routes.user
        .get('/', controllers.user.showUsers)
        .get('/:user_id', controllers.user.findUser)
        .delete('/:user_id', controllers.user.delete)
        .put('/:user_id', controllers.user.update);
    // * AUTH USER ROUTES *
    app.use('/auth', routes.user);
    routes.user
        .post('/register', controllers.user.register)
        .post('/login', controllers.user.login);

    // * DELIVERY NOTES ROUTES *
    app.use('/deliveryNotes', requireAuth, routes.deliveryNote);
    routes.deliveryNote
        .get('/', controllers.deliveryNote.showDeliveryNotes)
        .post('/createDeliveryNote', upload, controllers.deliveryNote.create)
        .delete('/:deliverynote_id', controllers.deliveryNote.delete)
        .get('/searchDeliveryNote', controllers.deliveryNote.search)
        .get('/:deliverynote_id', controllers.deliveryNote.find);

    app.use('/Upload', requireAuth, express.static('Upload'));

};
