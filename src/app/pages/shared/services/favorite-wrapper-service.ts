import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { CreateFavorite, FavoritesService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class FavoriteWrapperService {
    favoritesService = inject(FavoritesService);

    addFavorite(createFavorite: CreateFavorite) {
        return this.favoritesService.favoritesAddPost(createFavorite).pipe(
            catchError((res) => {
                console.log('error res : ', res);
                return of();
            }),
            map((response) => response.data)
        );
    }

    removeFavorite(teacherId: string) {
        return this.favoritesService.favoritesRemoveTeacherIdDelete(teacherId).pipe(
            catchError((res) => {
                console.log('error res : ', res);
                return of();
            }),
            map((response) => response.data)
        );
    }

    isFavorite(teacherId: string) {
        return this.favoritesService.favoritesIsFavoriteTeacherIdGet(teacherId).pipe(
            catchError((res) => {
                console.log('error res : ', res);
                return of();
            }),
            map((response) => response.data)
        );
    }
}
