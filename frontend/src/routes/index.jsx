import CompanyPage from "../pages/CompanyPage";
import CompetitorPage from "../pages/CompetitorsPage";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import PromptPage from "../pages/PromptPage";
import SignupPage from "../pages/SignupPage";
import SourcesPage from "../pages/SourcesPage";


export const routes=[
    {
        path:'/',
        page:HomePage,
        isShowSidebar:false
    },
    {
        path:'/company',
        page:CompanyPage,
        isShowSidebar:true

    },
    {
        path:'/competitor',
        page:CompetitorPage,
        isShowSidebar:true

    },
    {
        path:'/dashboard',
        page:DashboardPage,
        isShowSidebar:true

    },
    {
        path:'/source',
        page:SourcesPage,
        isShowSidebar:true

    },    
    {
        path:'/login',
        page:LoginPage,
        isShowSidebar:false

    },
    {
        path:'/prompt',
        page:PromptPage,
        isShowSidebar:true

    },
    {
        path:'/signup',
        page:SignupPage,
        isShowSidebar:false

    },                
    {
        path:'*',
        page:NotFoundPage,
        isShowSidebar:false

    },
]