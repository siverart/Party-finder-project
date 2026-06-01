const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const partyControllers = require('../controllers/partyControllers')


router.get('/get-all-room', partyControllers.getAllRoom);
router.get('/get-single-room/:roomId', auth, partyControllers.getSingleRoom);
router.post('/create-room', auth, partyControllers.createRoom);
router.post('/find-room', auth, partyControllers.findRoom);
router.get('/get-other-profile/:findedId', auth, partyControllers.getOtherProfile);
router.put('/complete-room/:roomId', auth, partyControllers.completeRoom);
router.patch('/update-room/:roomId', auth, partyControllers.updateRoom);
router.post('/kick-player/:roomId', auth, partyControllers.kickPlayer);
router.post('/join-room/:roomId', auth, partyControllers.joinRoom);
router.post('/leave-room/:roomId', auth, partyControllers.leaveRoom)



module.exports = router 