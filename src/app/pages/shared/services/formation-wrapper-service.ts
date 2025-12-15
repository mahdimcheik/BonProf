import { inject, Injectable } from '@angular/core';
import { FormationCreate, FormationsService, FormationUpdate } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class FormationWrapperService {
    formationsService = inject(FormationsService);

    addFormation(formation: FormationCreate) {
        return this.formationsService.formationsPost(formation);
    }

    getFormations() {
        return this.formationsService.formationsAllGet();
    }

    getTeacherFormations(teacherId: string) {
        return this.formationsService.formationsTeacherIdGet(teacherId);
    }

    updateFormation(formation: FormationUpdate) {
        return this.formationsService.formationsPut(formation);
    }

    deleteFormation(formationId: string) {
        return this.formationsService.formationsIdDelete(formationId);
    }
}
