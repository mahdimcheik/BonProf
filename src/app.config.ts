import { cookiesInterceptor } from '@/pages/shared/interceptors/cookies.interceptor';
import { errorHandlerInterceptor } from '@/pages/shared/interceptors/error-handler.interceptor';
import { exceptionLoaderInterceptor } from '@/pages/shared/interceptors/exception-loader.interceptor';
import { loaderInterceptor } from '@/pages/shared/interceptors/loader.interceptor';
import { TokenInterceptor } from '@/pages/shared/interceptors/token.interceptor';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { provideDefaultClient } from './client/providers';
import { environment } from './environments/environment';

const basePath = environment.API_URL;

export const appConfig: ApplicationConfig = {
    providers: [
        provideDefaultClient({ basePath: environment.API_URL }),
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withInterceptors([TokenInterceptor, cookiesInterceptor, errorHandlerInterceptor, exceptionLoaderInterceptor, loaderInterceptor])),
        provideHttpClient(withFetch()),
        MessageService,
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } })
    ]
};
