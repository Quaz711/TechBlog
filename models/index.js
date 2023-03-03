const Comment = require('./comment');
const Post = require('./post');
const User = require('./user');

Comment.belongsTo(Post, {
    foreignKey: 'postID'
});

Comment.belongsTo(User, {
    foreignKey: 'userID'
});

User.hasMany(Comment, {
    foreignKey: 'userID'
});

User.hasMany(Post, {
    foreignKey: 'userId'
});

Post.hasMany(Comment, {
    foreignKey: 'postID'
});

Post.belongsTo(User, {
    foreignKey: 'userID'
});

module.exports = { Comment, Post, User};