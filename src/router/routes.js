import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import Property from '@/pages/Property';
import LocationAnalysisReport from '@/pages/LocationAnalysisReport';
import Survey from '@/pages/Survey';
import Explorer from '@/pages/Explorer';
import LandHouse from '@/pages/LandHouse';
import LandDetail from '@/pages/LandDetail';
// import staticPages from '@/pages/static'
import QuestionEdit from '@/pages/admin/question/QuestionEdit';
import QuestionList from '@/pages/admin/question/QuestionList';
import SuburbList from '@/pages/admin/suburb/SuburbList';
import SuburbEdit from '@/pages/admin/suburb/SuburbEdit';
import PropertyMap from '@/pages/admin/property/PropertyMap';
import ProximityList from '@/pages/admin/proximity/ProximityList';
import ProximityEdit from '@/pages/admin/proximity/ProximityEdit';
import ReportContentManager from '@/pages/admin/report/ReportContentManager';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/properties/:propertyId',
    name: 'Property',
    component: Property
  },
  {
    path: '/properties/:propertyId/location-analysis-report',
    name: 'LocationAnalysisReport',
    component: LocationAnalysisReport,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/properties/:propertyId/survey',
    name: 'Survey',
    component: Survey,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/properties/:propertyId/explorer',
    name: 'Explorer',
    component: Explorer
  },
  {
    path: '/properties/:propertyId/landandhouse',
    name: 'LandHouse',
    component: LandHouse
  },
  {
    path: '/properties/:propertyId/landdetail',
    name: 'LandDetail',
    component: LandDetail
  },
  {
    path: '/admin/question/:questionId?',
    name: 'QuestionEdit',
    component: QuestionEdit,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/questions',
    name: 'QuestionList',
    component: QuestionList,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/suburbs',
    name: 'SuburbList',
    component: SuburbList,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/suburb/:suburbId?',
    name: 'SuburbEdit',
    component: SuburbEdit,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/propertymap',
    name: 'PropertyMap',
    component: PropertyMap,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/proximities',
    name: 'ProximityList',
    component: ProximityList,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/report',
    name: 'ReportContentManager',
    component: ReportContentManager,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/proximity/:proximityRuleId?',
    name: 'ProximityEdit',
    component: ProximityEdit,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '*',
    redirect: '/'
  }
]

// const pages = [
//   '02-homesearch-02',
//   '03-property-list-with-sidebar',
//   '04-property-list-with-map',
//   '05-property-grid-with-sidebar',
//   '06-property-grid-with-map',
//   '07-property-single-01',
//   '08-property-single-02',
//   '09-agent-grid',
//   '10-agent-list',
//   '11-agent-single-01',
//   '12-agent-single-02',
//   '13-blog-01',
//   '14-blog-massonary-02',
//   '15-blog-single',
//   '16-contact',
//   '18-homesearch-submit-properties',
//   '19-homesearch-404',
//   'full-width',
//   'two-column'
// ]
// pages.map((page, index) => {
//   routes.push({
//     path: `/${page}`,
//     name: `${page}`,
//     component: staticPages[index],
//     meta: {
//       requiresAuth: false
//     }
//   })
// })

export default routes
