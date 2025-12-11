import { SmartSectionComponent } from '@/pages/components/smart-section/smart-section.component';
import { FormationCard } from '@/pages/formations/components/formation-card/formation-card';
import { FormationsEdition } from '@/pages/formations/components/formations-edition/formations-edition';
import { FormationWrapperService } from '@/pages/shared/services/formation-wrapper-service';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { Component, DestroyRef, inject, model, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { FormationCreate, FormationDetails } from 'src/client';

@Component({
    selector: 'bp-formations-list',
    imports: [SmartSectionComponent, FormationCard, FormationsEdition, ButtonModule],
    templateUrl: './formations-list.html'
})
export class FormationsList {
    formationWrapperService = inject(FormationWrapperService);
    teacherWrapperService = inject(TeacherWrapperService);
    messageService = inject(MessageService);
    activatedRoute = inject(ActivatedRoute);
    destroyRef = inject(DestroyRef);

    title = 'Liste des Formations';

    editMode = model(true);
    buttonIcon = model('pi pi-plus');
    showEditBox = signal(false);

    formations = signal<FormationDetails[]>([]);

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        const formationsData = await firstValueFrom(this.formationWrapperService.getFormations());
        this.formations.set(formationsData.data || []);
    }

    async showAddformationBox() {
        this.showEditBox.set(true);
    }

    hideAddFormationBox() {
        this.showEditBox.set(false);
    }

    cancel() {
        this.showEditBox.set(false);
    }

    async addNewFormation(event: FormationCreate) {
        const res = await firstValueFrom(this.formationWrapperService.addFormation(event));
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Formation ajoutée avec succès' });
        this.showEditBox.set(false);
        await this.loadData();
    }
}
