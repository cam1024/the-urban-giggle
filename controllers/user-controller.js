// const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    //find all users
    getUsers(req, res) {
        User.find()
        .select('-__v')
        .populate({path:"thoughts"})
        .populate({path:"friends"})
            .then(async (userData) => {
                res.json(userDatas);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    //find user by id
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate({path:"thoughts"})
            .populate({path:"friends"})
            .then(async (userData) =>
                !userData
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json({ userData })
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    //create new user
    createUser(req, res) {
        User.create(req.body)
            .then((userData) => res.json(userData))
            
            .catch((err) => {
                console.log(err)
                res.status(500).json(err)});
            
    },
    
    //delete user by id
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
        .then((userData) =>
        !userData
          ? res
              .status(404)
              .json({ message: 'No user found with that ID :(' })
          : res.json(userData)
      )
      .catch((err) => res.status(500).json(err));
  },
    //update user by id
    updateUser(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body,},
            {runValidators: true,
            new: true,
            })
            .then((userData) =>
            !userData
              ? res
                  .status(404)
                  .json({ message: 'No user found with that ID'})
              : res.json(userData)
          )
          .catch((err) => res.status(500).json(err));
      },

    newFriend(req, res) {
        User.findOneAndUpdate(
        {_id:req.params.userId},
        {$addToSet:{friends: req.params.friendId}},{ new: true}
        )
        .then((userData) =>
        !userData
          ? res
              .status(404)
              .json({ message: 'No user found with that ID' })
          : res.json(userData)
      )
      .catch((err) => res.status(500).json(err));
  },
  removeFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId },
     { $pull: { friends: req.params.friendId } }, { new: true })
    .then((userData) =>
    !userData
      ? res
          .status(404)
          .json({ message: 'No user found with that ID :(' })
      : res.json(userData)
  )
  .catch((err) => res.status(500).json(err));
},
};