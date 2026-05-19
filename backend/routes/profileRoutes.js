const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const profileControllers = require('../controllers/profileControllers')


router.get('/', auth, profileControllers.getProfile)
router.patch('/update-displayName-description', auth, profileControllers.updateDisplayNameAndDescription);
router.post('/add-contacts', auth, profileControllers.addContact);
router.delete('/delete-contacts/:contactId', auth, profileControllers.deleteContact);
router.post('/add-tag', auth, profileControllers.addTag)
router.delete('/delete-tag', auth, profileControllers.deleteTag)
router.post('/resetpassword-in-profile', auth, profileControllers.resetPasswordInProfile)

module.exports = router