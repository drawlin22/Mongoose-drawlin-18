// const Thought = require('../models/');
const {User, Thought} = require('../models/User');

module.exports = {
    async getThoughtsAll(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(400).json(err);
        }
    },
    async getThoughtsById(req, res) {
        try {
            const thought = await Thought.findById(req.params.id)
            .populate('reactions')
            .select('-__v')
            if (!thought) {
                res.status(404).json({ message: 'No thought found with this id!' });
            }
            res.json(thought);
        } catch (err) {
            res.status(400).json(err);
        }
    },
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );
            if (!user) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(thought);
        } catch (err) {
            res.status(400).json(err);
        }
    },
    async updateThought(req, res) {
        try{
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { runValidators: true, new: true })
                if (!thought) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(thought);
            }  catch (err) {
                res.status(400).json(err);
            }
        },
        async deleteThought(req, res) {
            try {
                const thought = await Thought.findOneAndDelete({ _id: req.params.id });
                if (!thought) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                const user = await User.findOneAndUpdate(
                    { username: thought.username },
                    { $pull: { thoughts: thought._id } },
                    { new: true }
                );
                res.json(thought);
            } catch (err) {
                res.status(400).json(err);
            }
        },
        async addReaction(req, res) {
            try {
                const thought = await Thought.findOneAndUpdate(
                    { _id: req.params.thoughtId },
                    { $push: { reactions: req.body } },
                    { new: true, runValidators: true }
                );
                if (!thought) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(thought);
            } catch (err) {
                res.status(400).json(err);
            }
        },
        async deleteReaction(req, res) {
            try {
                const thought = await Thought.findOneAndUpdate(
                    { _id: req.params.thoughtId },
                    { $pull: { reactions: { reactionId: req.params.reactionId } } },
                    { new: true, runValidators: true }
                );
                if (!thought) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(thought);
            } catch (err) {
                res.status(400).json(err);
            }
        }




};