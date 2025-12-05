import { Landing } from '@/site/landing/landing';
import { MainPage } from '@/site/landing/pages/main-page/main-page';
import { MentionsLegalesPage } from '@/site/landing/pages/mentions-legales-page/mentions-legales-page';
import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Notfound } from './app/pages/notfound/notfound';

export const appRoutes: Routes = [
    {
        path: '',
        component: Landing,
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
                loadChildren: () => import('./app/pages/auth/auth.routes')
            }
        ]
    },
    //

    // Dashboard routes (protected)
    // {
    //     path: TEACHER_PATH,
    //     component: AppLayout,
    //     canActivate: [isConnectedGuard],
    //     children: [
    //         // Settings
    //         { path: '', component: CalendarTeacherComponent },
    //         { path: 'calendar-teacher', component: CalendarTeacherComponent },
    //         { path: SETTINGS_PATH, component: SettingsComponent },
    //         { path: PROFILE_PATH + '/:id', component: ProfileTeacherComponent },
    //         { path: RESERVATION_PATH + '/list', component: UsersListComponent },
    //         { path: CONTACT_PATH, component: GestionCursusesComponent },
    //         { path: 'reservation-list', component: ReservationListByTeacherComponent }
    //     ]
    // },

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
    {
        path: 'dashboard',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
