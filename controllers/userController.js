const {User, Thought} = require('../models/User');
// const Thought = require('../models/Thought');

module.exports = { /* Api/user all */
    async getUsersAll(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(400).json(err);
        }
    },

async getUsersById(req, res) { /* Api/user/:id */
    try {
        const users = await User.findOne({ _id: req.params.id })
        .populate('friends')
        .populate('thoughts')
        .select('-__v')

        if (!users) {
            res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(users);
    } catch (err) {
        res.status(400).json(err);
    }

},

async createUser(req, res) { /* Api/user */
    try {
        const users = await User.create(req.body);
        res.json(users);
    } catch (err) {
        res.status(400).json(err);
    }
},

async updateUser(req, res) { /* Api/user/:id */
    try{
        const user= await User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { runValidators: true, new: true }
        );
        if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(user);
    } catch (err) {
        res.status(400).json(err);
    }
},

async deleteUser(req, res) { /* Api/user/:id */
try{
    const user = await User.findOneAndDelete({ _id: req.params.id });
    if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
    }
    await Thought.deleteMany({ username: user.username });
    res.json({message: 'User and associated thoughts deleted!'});
} catch (err) {
    res.status(400).json(err);
}
},

async addFriend(req, res) { /* Api/user/:userId/friends/:friendId */
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        );
        if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(user);
    } catch (err) {
        res.status(400).json(err);
    }
}

};