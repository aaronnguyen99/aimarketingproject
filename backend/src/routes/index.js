const PromptRouter= require('./PromptRouter.js')
const CompanyRouter= require('./CompanyRouter.js')
const authRoutes = require('./UserRouter.js');
const auth = require('../middleware/auth');

const routes=(app)=>{
    app.use('/api/prompt',auth,PromptRouter)
    app.use('/api/company',auth,CompanyRouter)
    app.use('/api/auth',authRoutes)

}

module.exports=routes