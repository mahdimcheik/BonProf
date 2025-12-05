import { Routes } from '@angular/router';
import { Access } from './access';
import { Error } from './error';
import { Inscription } from './inscription/inscription';
import { Login } from './login/login';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'register', component: Inscription }
] as Routes;
