const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const profileControllers = require('../controllers/profileControllers')

router.patch('/update-displayName-description', auth, profileControllers.updateDisplayNameAndDescription);
router.post('/add-contacts', auth, profileControllers.addContact);
router.delete('/delete-contacts/:contactId', auth, profileControllers.deleteContact);


module.exports = router