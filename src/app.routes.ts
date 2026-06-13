import { ProfileEditionPage } from '@/pages/profile/profile-edition-page/profile-edition-page';
import { ProfilePage } from '@/pages/profile/profile-page/profile-page';
import { ReservationDetailsPage } from '@/pages/reservations/reservation-details/reservation-details';
import { ReservationsPageStudent } from '@/pages/reservations/reservations-page-student/reservations-page-student';
import { ReservationsPageTeacher } from '@/pages/reservations/reservations-page-teacher/reservations-page-teacher';
import { isConnectedGuard, isNotConnectedGuard } from '@/pages/shared/guards/can-login.guard';
import { isStudentOnlyGuard, isTeacherOnlyGuard } from '@/pages/shared/guards/roles.guard';
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
            },
            {
                path: 'fast-search',
                loadComponent: () => import('./app/pages/teachers-catalog/teacher-search/teacher-search').then((m) => m.TeacherSearch)
            },
            {
                path: 'profile/:id',
                component: ProfilePage
            }
        ]
    },

    // Dashboard routes (protected)
    {
        path: 'dashboard',
        component: AppLayout,
        canActivate: [isConnectedGuard],
        children: [
            {
                path: 'teacher',
                canActivate: [isTeacherOnlyGuard],
                children: [
                    {
                        path: 'profile/:id/edition',
                        component: ProfileEditionPage
                    },
                    {
                        path: 'planning',
                        loadComponent: () => import('./app/pages/slots/calendar-teacher/calendar-teacher').then((m) => m.CalendarTeacher)
                    },
                    {
                        path: 'catalog/:id',
                        loadComponent: () => import('./app/pages/catalog/catalog').then((m) => m.Catalog)
                    },
                    {
                        path: 'documents',
                        loadComponent: () => import('./app/pages/documents/documents-list/documents-list').then((m) => m.DocumentsList)
                    },
                    {
                        path: 'reservations',
                        component: ReservationsPageTeacher
                    },
                    {
                        path: 'reservations/:id',
                        component: ReservationDetailsPage
                    }
                ]
            },
            {
                path: 'student',
                canActivate: [isStudentOnlyGuard],
                children: [
                    {
                        path: 'planning',
                        loadComponent: () => import('./app/pages/slots/calendar-student/calendar-student').then((m) => m.CalendarStudent)
                    },
                    {
                        path: 'profile/:id/edition',
                        component: ProfileEditionPage
                    },
                    {
                        path: 'reservations',
                        component: ReservationsPageStudent
                    },
                    {
                        path: 'reservations/:id',
                        component: ReservationDetailsPage
                    },
                    {
                        path: 'fast-search',
                        loadComponent: () => import('./app/pages/teachers-catalog/teacher-search/teacher-search').then((m) => m.TeacherSearch)
                    },
                    {
                        path: 'active-order',
                        loadComponent: () => import('./app/pages/orders/order-active/order-active').then((m) => m.OrderActive)
                    }
                ]
            },
            {
                path: 'settings',
                loadComponent: () => import('./app/pages/settings/settings').then((m) => m.Settings)
            }
        ]
    },
    {
        path: 'payment',
        children: [
            {
                path: 'success',
                loadComponent: () => import('./app/pages/payments/payment-success/payment-success').then((m) => m.PaymentSuccess)
            },
            {
                path: 'cancel',
                loadComponent: () => import('./app/pages/payments/payment-canceled/payment-canceled').then((m) => m.PaymentCanceled)
            }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
