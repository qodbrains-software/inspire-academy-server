// authenicate if the user id is found in the database.

function authUser(req, res, next){
    if(req.user == null){
        res.status(401);
        return res.send("Unauthorized to download book");
    };
    next();
};

module.exports = {
    authUser
}