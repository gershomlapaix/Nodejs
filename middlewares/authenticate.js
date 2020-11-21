function auth(req,res,next){
    console.log('Authenticated......')
    next()
}

module.exports = auth