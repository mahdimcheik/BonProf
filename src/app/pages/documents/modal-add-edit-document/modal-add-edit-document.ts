import { BaseModalComponent } from '@/pages/components/base-modal/base-modal.component';
import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { Component, computed, inject, model, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { PrivacyDocumentDetails } from 'src/client';

@Component({
    selector: 'bp-modal-add-edit-document',
    imports: [BaseModalComponent, ConfigurableFormComponent],
    templateUrl: './modal-add-edit-document.html'
})
export class ModalAddEditDocument {
    teacherService = inject(TeacherWrapperService);

    visible = model(false);
    title = model('Réserver ce créneau');
    document = model<PrivacyDocumentDetails | null>(null);
    types = this.teacherService.types;
    type = model.required<string>();
    typeId = computed(() => {
        return this.types().find((t) => t.name === this.type())?.id ?? '';
    });
    submitClicked = output<void>();
    cancelClicked = output<void>();

    documentForm = computed<Structure>(() => {
        const document = this.document();
        return {
            id: 'documentForm',
            name: 'documentForm',
            label: 'Document',
            styleClass: '!w-full min-w-full',
            sections: [
                {
                    id: 'documentDetails',
                    name: 'documentDetails',
                    styleClass: '!w-full',
                    fields: [
                        {
                            id: 'title',
                            name: 'title',
                            type: 'text',
                            label: 'Titre de la réservation',
                            required: true,
                            fullWidth: true,
                            placeholder: 'Entrer le titre de la réservation'
                        },
                        {
                            id: 'description',
                            name: 'description',
                            type: 'textarea',
                            label: 'Description du document',
                            required: true,
                            fullWidth: true,
                            placeholder: 'Décrivez le document'
                        },
                        {
                            id: 'file',
                            name: 'file',
                            label: 'Fichier',
                            type: 'file',
                            placeholder: 'Choisir votre fichier',
                            accept: 'image/*, application/pdf',
                            maxFileSize: 1000000,
                            showCancelButton: true,
                            multiple: false,
                            mode: 'advanced',
                            chooseLabel: 'Choisir votre fichier',
                            uploadLabel: 'Téléverser',
                            cancelLabel: 'Annuler',
                            emptyMessage: 'Glissez et déposez votre fichier ici',
                            showUploadButton: true,
                            fullWidth: true
                        }
                    ]
                }
            ]
        };
    });

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        await firstValueFrom(this.teacherService.getDocumentTypes());
    }

    async submit(form: FormGroup<any>) {
        const values = form.value.documentDetails;
        await firstValueFrom(this.teacherService.uploadDocument(values.file, this.typeId(), values.title));
        this.submitClicked.emit();
        this.visible.set(false);
    }

    cancel() {
        this.cancelClicked.emit();
        this.visible.set(false);
    }
}
