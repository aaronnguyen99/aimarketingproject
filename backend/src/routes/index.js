const PromptRouter= require('./PromptRouter.js')
const CompanyRouter= require('./CompanyRouter.js')
const ScoreRouter= require('./ScoreRouter.js')
const SourceRouter= require('./SourceRouter.js')
const authRoutes = require('./UserRouter.js');
const paymentRoute=require('./PaymentRouter.js');
const dailyRoute=require('./DailyRouter.js');
const auth = require('../middleware/auth');
const authCron = require('../middleware/cronAuth');

const routes=(app)=>{
    app.use('/api/prompt',auth,PromptRouter)
    app.use('/api/company',auth,CompanyRouter)
    app.use('/api/auth',authRoutes)
    app.use('/api/cron',authCron,dailyRoute)
    app.use('/api/score',auth,ScoreRouter)
    app.use('/api/source',auth,SourceRouter)
    app.use('/api/payment',auth,paymentRoute)
}

module.exports=routes