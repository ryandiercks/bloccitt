'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
    

  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });
    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments"
    });
    Post.hasMany(models.Vote, {
      foreignKey: "postId",
      as: "votes"
    });
    Post.hasMany(models.Favorite, {
      foreignKey: "postId",
      as: "favorites"
    });
    Post.afterCreate((post, callback) => {
      return models.Favorite.create({
        userId: post.userId,
        postId: post.id
      });
    });
    // #1
   Post.addScope("lastFiveFor", (userId) => {
    // #2
        return {
          where: { userId: userId},
    // #3
          limit: 5,
          order: [["createdAt", "DESC"]]
        }
      });
  };
  Post.prototype.getPoints = function(){

    // #1 We check to see if the post has any votes. If not, we return 0.
        if(this.votes.length === 0) return 0
   
    // #2 If a post has votes, then we get a count of all values, add them and return the result. 
    //The map function transforms the array. this.votes is an array of Vote objects. map turns it into an array of values. 
    //The reduce function goes over all values, reducing them until one is left, the total.
        return this.votes
          .map((v) => { return v.value })
          .reduce((prev, next) => { return prev + next });
      };
      // We will need to know if a user has already favorited a post so we can style the button appropriately
      Post.prototype.getFavoriteFor = function(userId){
        return this.favorites.find((favorite) => { return favorite.userId == userId });
      };
      
  return Post;
};