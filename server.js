const express = require('express');
const db = require('./config/connection');
// Require model
const { User, Thought, Reaction } = require('./models');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post('/api/users', (req, res) => {
    User.create(req.body)
        .then((user) => {
        res.json(user);
        })
        .catch((err) => {
        res.status(400).json(err);
        });
    });

app.get('/api/users', (req, res) => {
        User.find({})
        .then((user) => {
        res.json(user);
        })
        .catch((err) => {
        res.status(400).json(err);
        });
    },

app.get('/api/users/:id', (req, res) => {
        User.findOne({ _id: req.params.id })
        .populate('thoughts')
        .populate('friends')
        .then((user) => {
            if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
            }
            res.json(user);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    }),

app.put('/api/users/:id', async (req, res) => {
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
    })),

    

app.delete('/api/users/:id', (req, res) => {
        User.findOneAndDelete({ _id: req.params.id })
        .then((user) => {
            if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
            }
            res.json(user);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    });

app.post('/api/users/:userId/friends/:friendId', async (req, res) => {
        await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: req.params.friendId } },
        { new: true }
        )
        .then((user) => {
            if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
            }
            res.json(user);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    });

app.delete('/api/users/:userId/friends/:friendId', (req, res) => {
        User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
        )
        .then((user) => {
            if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
            }
            res.json(user);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    });

app.post('/api/thoughts', (req, res) => {
    console.log(req.body)
        Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );
        })
        .then((user) => {
            if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
            }
            res.json(user);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    });

app.get('/api/thoughts', (req, res) => {
        Thought.find({})
        .then((thought) => {
            res.json(thought);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    }), 

app.get('/api/thoughts/:id', (req, res) => {
        Thought.findOne({ _id: req.params.id })
        .then((thought) => {
            if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
            }
            res.json(thought);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    });

app.put('/api/thoughts/:id', (req, res) => {
        Thought.findOneAndUpdate(
        { _id: req.params.id },
        {
            $set: {
            thoughtText: req.body.thoughtText,
            username: req.body.username,
            reactions: req.body.reactions,
            },
        },
        {
            runValidators: true,
            new: true,
        }
        )
        .then((thought) => {
            if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
            }
            res.json(thought);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    });

// app.post('/api/thoughts/:thoughtId/reactions', (req, res) => {
//         Thought.findOneAndUpdate(
//         { _id: req.params.thoughtId },
//         { $push: { reactions: req.body } },
//         { new: true }
//         )
//         .then((thought) => {
//             if (!thought) {
//             res.status(404).json({ message: 'No thought found with this id!' });
//             return;
//             }
//             res.json(thought);
//         })
//         .catch((err) => {
//             res.status(400).json(err);
//         });
//     }
//     ),

app.post('/api/thoughts/:thoughtId/reactions', (req, res) => {
    Thought.findOne({ _id: req.params.thoughtId })
    .then((thought) => {
        if (!thought) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
        }
        const newReaction = new Reaction(req.body);
        return newReaction.save();
    })
    .then((newReaction) => {
        return Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: newReaction._id } },
            { new: true }
        );
    })
    .then((updatedThought) => {
        res.json(updatedThought);
    })
    .catch((err) => {
        res.status(400).json(err);
    });
});


app.delete('/api/thoughts/:id', (req, res) => {
        Thought.findOneAndDelete({ _id: req.params.id })
        .then((thought) => {
            if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
            }
            res.json(thought);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    });

app.delete('/api/thoughts/:thoughtId/reactions/:reactionId', (req, res) => {
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: req.params.reactionId } },
        { new: true }
        )
        .then((thought) => {
            if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
            }
            res.json(thought);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    });


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});




