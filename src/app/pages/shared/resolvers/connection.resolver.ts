import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Login } from 'src/client';
import { MainService } from '../services/main.service';
import { LayoutService } from '@/layout/service/layout.service';

export const connectionResolver: ResolveFn<Login | null> = async (route, state) => {
    const mainService = inject(MainService);
    if (!mainService.userConnected()?.email) {
        try {
            const user = await firstValueFrom(mainService.refreshToken());
            return user?.data ?? null;
        } catch {
            return null;
        }
    }
    return null;
};
