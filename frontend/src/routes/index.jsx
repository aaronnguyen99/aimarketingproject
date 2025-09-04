import CompanyPage from "../pages/CompanyPage";
import CompetitorPage from "../pages/CompetitorsPage";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import PromptPage from "../pages/PromptPage";
import SourcesPage from "../pages/SourcesPage";
import AuthPage from "../pages/AuthPage";

export const routes=[
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
        path:'/prompt',
        page:PromptPage,
        isShowSidebar:true

    },             
    {
        path:'*',
        page:NotFoundPage,
        isShowSidebar:false

    },
]