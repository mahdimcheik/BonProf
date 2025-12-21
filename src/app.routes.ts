// import { ProfileEditionPage } from '@/pages/profile/profile-edition-page/profile-edition-page';
// import { ProfilePage } from '@/pages/profile/profile-page/profile-page';
import { isConnectedGuard, isNotConnectedGuard } from '@/pages/shared/guards/can-login.guard';
import { connectionResolver } from '@/pages/shared/resolvers/connection.resolver';
import { Landing } from '@/site/landing/landing';
import { MainPage } from '@/site/landing/pages/main-page/main-page';
import { MentionsLegalesPage } from '@/site/landing/pages/mentions-legales-page/mentions-legales-page';
import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from './app/pages/notfound/notfound';

export const appRoutes: Routes = [
    {
        path: '',
        component: Landing,
        resolve: {
            connection: connectionResolver
        },
        children: [
            {
                path: '',
                component: MainPage
            },
            {
                path: 'mentions-legales',
                component: MentionsLegalesPage
            },
            {
                path: 'auth',
                canActivate: [isNotConnectedGuard],
                loadChildren: () => import('./app/pages/auth/auth.routes')
            }
        ]
    },
    //

    // Dashboard routes (protected)
    {
        path: 'dashboard',
        component: AppLayout,
        canActivate: [isConnectedGuard],
        children: [
            {
                path: 'teacher',
                children: [
                    // {
                    //     path: 'profile/:id',
                    //     component: ProfilePage
                    // },
                    // {
                    //     path: 'profile/:id/edition',
                    //     component: ProfileEditionPage
                    // }
                ]
            }
        ]
    },

    // // Dashboard routes (protected)
    // {
    //     path: ADMIN_PATH,
    //     component: AppLayout,
    //     canActivate: [isConnectedGuard],
    //     children: [
    //         { path: SETTINGS_PATH, component: SettingsComponent },
    //         { path: 'users-list', component: UsersListComponent },
    //         { path: 'adminitration', component: AdminitrationComponent },
    //         { path: 'request-list', component: RequestListComponent },
    //         { path: 'request-list/:id', component: CandidatDetailComponent }
    //     ]
    // },
    // {
    //     path: STUDENT_PATH,
    //     component: AppLayout,
    //     canActivate: [isConnectedGuard],
    //     children: [
    //         { path: 'calendar-student', component: CalendarStudentComponent },
    //         { path: 'list-teachers', component: TeacherListComponent },
    //         { path: 'favorites', component: StudentFavoritesComponent },
    //         { path: 'reservation-list', component: ReservationListComponent }
    //     ]
    // },

    // {
    //     path: 'dashboard',
    //     component: AppLayout,
    //     children: [
    //         { path: '', component: Dashboard },
    //         { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
    //         { path: 'documentation', component: Documentation },
    //         { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
    //     ]
    // },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
