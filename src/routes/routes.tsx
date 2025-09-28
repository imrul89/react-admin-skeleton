import Dashboard from '@pages/dashboard';
import Permissions from '@pages/permissions';
import PermissionCreate from '@pages/permissions/create';
import PermissionEdit from '@pages/permissions/edit';
import Roles from '@pages/roles';
import RoleCreate from '@pages/roles/create';
import RoleEdit from '@pages/roles/edit';
import RolePermissions from '@pages/roles/permissions';
import SchoolClasses from '@pages/school-classes';
import SchoolClassCreate from '@pages/school-classes/create';
import SchoolClassEdit from '@pages/school-classes/edit';
import Profile from '@pages/settings';
import Students from '@pages/students';
import StudentCreate from '@pages/students/create';
import StudentEdit from '@pages/students/edit';
import Users from '@pages/users';
import UserCreate from '@pages/users/create';
import UserEdit from '@pages/users/edit';
import {
  DashboardBreadcrumb,
  DynamicUserBreadcrumb
} from '@/routes/route-utils';

const routes = [
  {
    path: '',
    breadcrumb: DashboardBreadcrumb,
    component: Dashboard,
    exact: true,
    children: []
  },
  {
    path: 'users',
    breadcrumb: 'Users',
    component: '',
    exact: true,
    children: [
      {
        path: '',
        breadcrumb: 'Users',
        component: Users,
        exact: true
      },
      {
        path: 'create',
        breadcrumb: 'Create User',
        component: UserCreate,
        exact: true
      },
      {
        path: ':id',
        breadcrumb: DynamicUserBreadcrumb,
        component: UserEdit,
        exact: true
      }
    ]
  },
  {
    path: 'profile',
    breadcrumb: 'Profile',
    component: Profile,
    exact: true,
    children: [
    ]
  },
  {
    path: 'roles',
    breadcrumb: 'Roles',
    component: '',
    exact: true,
    children: [
      {
        path: '',
        breadcrumb: 'Roles',
        component: Roles,
        exact: true
      },
      {
        path: 'create',
        breadcrumb: 'Create Role',
        component: RoleCreate,
        exact: true
      },
      {
        path: ':id',
        breadcrumb: 'Edit Role',
        component: RoleEdit,
        exact: true
      },
      {
        path: ':id/permissions',
        breadcrumb: 'Set Role Permissions',
        component: RolePermissions,
        exact: true
      }
    ]
  },
  {
    path: 'permissions',
    breadcrumb: 'Permissions',
    component: '',
    exact: true,
    children: [
      {
        path: '',
        breadcrumb: 'Permissions',
        component: Permissions,
        exact: true
      },
      {
        path: 'create',
        breadcrumb: 'Create Permission',
        component: PermissionCreate,
        exact: true
      },
      {
        path: ':id',
        breadcrumb: 'Edit Permission',
        component: PermissionEdit,
        exact: true
      }
    ]
  },
  {
    path: 'classes',
    breadcrumb: 'Classes',
    component: '',
    exact: true,
    children: [
      {
        path: '',
        breadcrumb: 'Classes',
        component: SchoolClasses,
        exact: true
      },
      {
        path: 'create',
        breadcrumb: 'Create Class',
        component: SchoolClassCreate,
        exact: true
      },
      {
        path: ':id',
        breadcrumb: 'Edit Class',
        component: SchoolClassEdit,
        exact: true
      }
    ]
  },
  {
    path: 'students',
    breadcrumb: 'Students',
    component: '',
    exact: true,
    children: [
      {
        path: '',
        breadcrumb: 'Students',
        component: Students,
        exact: true
      },
      {
        path: 'create',
        breadcrumb: 'Create Student',
        component: StudentCreate,
        exact: true
      },
      {
        path: ':id',
        breadcrumb: 'Edit Student',
        component: StudentEdit,
        exact: true
      }
    ]
  },
];

export default routes;
