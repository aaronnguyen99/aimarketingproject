const PromptRouter= require('./PromptRouter.js')
const CompanyRouter= require('./CompanyRouter.js')
const ScoreRouter= require('./ScoreRouter.js')
const authRoutes = require('./UserRouter.js');
const auth = require('../middleware/auth');

const routes=(app)=>{
    app.use('/api/prompt',auth,PromptRouter)
    app.use('/api/company',auth,CompanyRouter)
    app.use('/api/auth',authRoutes)
    app.use('/api/score',auth,ScoreRouter)

}

module.exports=routes