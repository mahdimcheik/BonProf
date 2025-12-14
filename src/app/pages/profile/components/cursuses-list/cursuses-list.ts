import { CursusCard } from '@/pages/components/cursuses/cursus-card/cursus-card';
import { CursusEdition } from '@/pages/components/cursuses/cursus-edition/cursus-edition';
import { SmartSectionComponent } from '@/pages/components/smart-section/smart-section.component';
import { CursusWrapperService } from '@/pages/shared/services/cursus-wrapper-service';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { Component, DestroyRef, inject, model, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { CursusCreate, CursusDetails } from 'src/client';

@Component({
    selector: 'bp-cursuses-list',
    imports: [SmartSectionComponent, CursusCard, CursusEdition],
    templateUrl: './cursuses-list.html'
})
export class CursusesList {
    cursusWrapperService = inject(CursusWrapperService);
    teacherWrapperService = inject(TeacherWrapperService);
    messageService = inject(MessageService);
    activatedRoute = inject(ActivatedRoute);
    destroyRef = inject(DestroyRef);

    title = 'Liste des Formations';

    editMode = model(true);
    buttonIcon = model('pi pi-plus');
    showEditBox = signal(false);

    cursuses = signal<CursusDetails[]>([]);

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        const cursusesData = await firstValueFrom(this.cursusWrapperService.getCursusByTeacher(this.teacherWrapperService?.teacherProfile()?.id ?? ''));
        this.cursuses.set(cursusesData || []);
    }

    async showAddCursusBox() {
        this.showEditBox.set(true);
    }

    hideAddCursusBox() {
        this.showEditBox.set(false);
    }

    cancel() {
        this.showEditBox.set(false);
    }

    async addNewCursus(event: CursusCreate) {
        const res = await firstValueFrom(this.cursusWrapperService.addCurus(event));
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Cours ajouté avec succès' });
        this.showEditBox.set(false);
        await this.loadData();
    }
}
