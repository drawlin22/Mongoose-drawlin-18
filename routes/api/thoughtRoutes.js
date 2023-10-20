const router = require('express').Router();

const {
    getThoughtsAll,
    getThoughtsById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

router.route('/').get(getThoughtsAll).post(createThought); /* Api/thought */
router.route('/:id').get(getThoughtsById).put(updateThought).delete(deleteThought); /* Api/thought/:id */
router.route('/:thoughtId/reactions').post(addReaction); /* Api/thought/:thoughtId/reactions */
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction); /* Api/thought/:thoughtId/reactions/:reactionId */
module.exports = router;