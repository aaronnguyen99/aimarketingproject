import CompanyPage from "../pages/CompanyPage";
import DashboardPage from "../pages/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import PromptPage from "../pages/PromptPage";
import SourcesPage from "../pages/SourcesPage";
import SettingPage from "../pages/SettingPage";
import LoadingPage from "../pages/LoadingPage";
export const routes=[
    {
        path:'/company',
        page:CompanyPage,
        isShowSidebar:true

    },
    {
        path:'/loading',
        page:LoadingPage,
        isShowSidebar:true

    },
    {
        path:'/setting',
        page:SettingPage,
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