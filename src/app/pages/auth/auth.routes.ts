import { Routes } from '@angular/router';
import { ForgotPassword } from './forgot-password/forgot-password';
import { Inscription } from './inscription/inscription';
import { Login } from './login/login';
import { ResetPassword } from './reset-password/reset-password';

export default [
    { path: 'login', component: Login },
    { path: 'forgot-password', component: ForgotPassword },
    { path: 'reset-password', component: ResetPassword },
    { path: 'register', component: Inscription }
] as Routes;
