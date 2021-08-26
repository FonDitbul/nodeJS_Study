module.exports = {
    isOwner:function (req,res) {
        if(req.session.is_logined){
            return true
        }else{
            return false
        }
    },
    statusUI:function (req,res){
        let authStatusUI = '<a href="/login">login</a>'
        if(this.isOwner(req,res)) {
            authStatusUI = `${req.session.nickname} | <a href="/login/logout_process">logout</a>`
        }
        return authStatusUI
    }
}
