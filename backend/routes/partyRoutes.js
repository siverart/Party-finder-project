const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const partyControllers = require('../controllers/partyControllers')

router.get('/get-all-room', partyControllers.getAllRoom);
router.get('/get-single-room/:roomId', auth, partyControllers.getSingleRoom);
router.post('/create-room', auth, partyControllers.createRoom);
router.delete('/delete-room/:roomId', auth, partyControllers.deleteRoom);
router.post('/find-room', auth, partyControllers.findRoom);
router.post('/get-other-profile/:findedId', auth, partyControllers.getOtherProfile)

module.exports = router 