 // #1
 const Comment = require("./models").Comment;
 const Post = require("./models").Post;
 const User = require("./models").User;
 const Favorite = require("./models").Favorite;
 const Authorizer = require("../policies/favorite");
 
 module.exports = {
 
 // #2  We call create on the Favorite model with the id of the current user and the id of the post to create a favorite.
   createFavorite(req, callback){
     return Favorite.create({
       postId: req.params.postId,
       userId: req.user.id
     })
     .then((favorite) => {
       callback(null, favorite);
     })
     .catch((err) => {
       callback(err);
     });
   },
 
 // #3  In deleteFavorite, we look to see if a favorite exists for the user and the post in question. 
 // If we find a favorite, we verify that the user is authorized to delete the favorite by passing both to the policy instance. 
 // If authorized, we delete the favorite.


   deleteFavorite(req, callback){
     const id = req.params.id;
 
     return Favorite.findById(id)
     .then((favorite) => {
 
       if(!favorite){
         return callback("Favorite not found");
       }
 
 // #4
       const authorized = new Authorizer(req.user, favorite).destroy();
 
       if(authorized){
         Favorite.destroy({ where: { id }})
         .then((deletedRecordsCount) => {
           callback(null, deletedRecordsCount);
         })
         .catch((err) => {
           callback(err);
         });
       } else {
         req.flash("notice", "You are not authorized to do that.")
         callback(401);
       }
     })
     .catch((err) => {
       callback(err);
     });
   }
 }