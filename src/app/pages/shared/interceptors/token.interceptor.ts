import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MainService } from '../services/main.service';
/**
 * @obsolete Pour le developpement uniquement
 * Intercepteur qui ajoute le token d'authentification aux requêtes API.
 * @param req La requête HTTP
 * @param next La fonction pour passer à la prochaine étape
 * @returns La réponse de la requête
 */
export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
    const mainService = inject(MainService);
    const token = mainService.token();

    // Only add token to API calls (not static assets or other requests)
    const isApiCall = req.url.includes('/api/') || req.url.includes(environment.API_URL);

    // Don't add token to non-API requests or if no token exists
    if (!isApiCall || !token) {
        return next(req);
    }

    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    return next(authReq);
};
