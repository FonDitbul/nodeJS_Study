module.exports = {
    isOwner:function (req,res) {
        if(req.user){
            return true
        }else{
            return false
        }
    },
    statusUI:function (req,res){
        let authStatusUI = '<a href="/login">login</a> ' +
            '| <a href="/login/register">Register</a>'
        if(this.isOwner(req,res)) {
            authStatusUI = `${req.user.nickname} | <a href="/login/logout_process">logout</a>`
        }
        return authStatusUI
    }
}
