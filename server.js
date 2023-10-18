const express = require('express');
const db = require('./config/connection');
// Require model
const { User } = require('./models');

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

app.put('/api/users/:id', (req, res) => {
        User.findOneAndUpdate(
        { _id: req.params.id },
        {
            $set: {
            username: req.body.username,
            email: req.body.email,
            thoughts: req.body.thoughts,
            friends: req.body.friends,
            },
        },
        {
            runValidators: true,
            new: true,
        }
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
    }));

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

app.post('/api/thoughts', (req, res) => {
        Thought.create(req.body)
        .then((thought) => {
            res.json(thought);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    });

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


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});





// ## Acceptance Criteria

// ```md
// GIVEN a social network API
// WHEN I enter the command to invoke the application
// THEN my server is started and the Mongoose models are synced to the MongoDB database
// WHEN I open API GET routes in Insomnia for users and thoughts
// THEN the data for each of these routes is displayed in a formatted JSON
// WHEN I test API POST, PUT, and DELETE routes in Insomnia
// THEN I am able to successfully create, update, and delete users and thoughts in my database
// WHEN I test API POST and DELETE routes in Insomnia
// THEN I am able to successfully create and delete reactions to thoughts and add and remove friends to a user’s friend list
// ```