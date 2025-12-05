import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MainService } from '../services/main.service';

export const isAdminOnlyGuard: CanActivateFn = async (route, state) => {
    var auth = inject(MainService);
    if (auth.userConnected().email) {
        if (auth.userConnected().roles?.includes('Admin')) {
            return true;
        } else {
            return false;
        }
    }
    return false;
};

export const isTeacherOnlyGuard: CanActivateFn = async (route, state) => {
    var auth = inject(MainService);
    if (auth.userConnected().email) {
        if (auth.userConnected().roles?.includes('Teacher')) {
            return true;
        } else {
            return false;
        }
    }
    return false;
};

export const isStudentOnlyGuard: CanActivateFn = async (route, state) => {
    var auth = inject(MainService);
    if (auth.userConnected().email) {
        if (auth.userConnected().roles?.includes('Student')) {
            return true;
        } else {
            return false;
        }
    }
    return false;
};
