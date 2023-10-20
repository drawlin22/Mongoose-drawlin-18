const router = require('express').Router();

const {
    getUsersAll,
    getUsersById,
    updateUser,
    deleteUser,
    createUser,
    addFriend,


} = require('../../controllers/user-controller');

router.route('/').get(getUsersAll).post(createUser); /* Api/user */

router.route('/:id').get(getUsersById).put(updateUser).delete(updateUser); /* Api/user/:id */

router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteUser); /* Api/user/:userId/friends/:friendId */

module.exports = router;
