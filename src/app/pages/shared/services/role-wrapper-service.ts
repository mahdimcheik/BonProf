import { inject, Injectable, signal } from '@angular/core';
import { map, of, tap } from 'rxjs';
import { RoleDetails, RolesService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class RoleWrapperService {
    roleService = inject(RolesService);
    roles = signal<RoleDetails[]>([]);

    getRoles() {
        if (this.roles().length > 0) {
            return of(this.roles());
        }
        return this.roleService.rolesAllGet().pipe(
            map((response) => response.data),
            tap((res) => {
                const toto = this.roles();
                this.roles.set(res ?? []);
            })
        );
    }
}
