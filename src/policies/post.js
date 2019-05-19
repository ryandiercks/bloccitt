const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {
    new() {
<<<<<<< HEAD
        return (this._isAdmin());
=======
        return (this._isMember() || this._isAdmin());
>>>>>>> public-profiles
    }

    create() { 
        return this.new();
    }

    edit() {
<<<<<<< HEAD
        return this._isAdmin();
=======
        return (this._isMember() || this._isAdmin());
>>>>>>> public-profiles
    }

    update(){
        return this.edit();
    }

    destroy() {
        return this.update();
    }
}
