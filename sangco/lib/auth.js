module.exports = {
    isOwner:function (req,res) {
        console.log(req.user, 'auth')
        if(req.user){
            return true
        }else{
            return false
        }
    },
    statusUI:function (req,res){
        let authStatusUI = '<a href="/login">login</a>'
        if(this.isOwner(req,res)) {
            authStatusUI = `${req.user.nickname} | <a href="/login/logout_process">logout</a>`
        }
        return authStatusUI
    }
}
