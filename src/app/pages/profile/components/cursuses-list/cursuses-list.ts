import { SmartSectionComponent } from '@/pages/components/smart-section/smart-section.component';
import { CursusWrapperService } from '@/pages/shared/services/cursus-wrapper-service';
import { MainService } from '@/pages/shared/services/main.service';
import { Component, DestroyRef, inject, model, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { CursusCreate, CursusDetails } from 'src/client';
import { CursusEdition } from '../cursus-edition/cursus-edition';
import { CursusCard } from '../cursus-card/cursus-card';

@Component({
    selector: 'bp-cursuses-list',
    imports: [SmartSectionComponent, CursusCard, CursusEdition, ButtonModule],
    templateUrl: './cursuses-list.html'
})
export class CursusesList {
    cursusWrapperService = inject(CursusWrapperService);
    mainService = inject(MainService);
    messageService = inject(MessageService);
    activatedRoute = inject(ActivatedRoute);
    destroyRef = inject(DestroyRef);

    title = 'Liste des cours';

    editMode = model(true);
    showActions = model(true);
    buttonIcon = model('pi pi-plus');
    showEditBox = signal(false);

    cursuses = signal<CursusDetails[]>([]);

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        if (this.mainService?.userConnected()?.id == null) {
            this.cursuses.set([]);
            return;
        }
        const cursusesData = await firstValueFrom(this.cursusWrapperService.getCursusByTeacher(this.mainService?.userConnected()?.id ?? ''));
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
