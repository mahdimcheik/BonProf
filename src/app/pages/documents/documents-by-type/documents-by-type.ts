import { SmartSectionComponent } from '@/pages/components/smart-section/smart-section.component';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { JsonPipe } from '@angular/common';
import { Component, inject, input, linkedSignal, model, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DocumentTypeEnum, PrivacyDocumentDetails } from 'src/client';
import { ModalAddEditDocument } from '../modal-add-edit-document/modal-add-edit-document';

@Component({
    selector: 'bp-documents-by-type',
    imports: [SmartSectionComponent, ButtonModule, ModalAddEditDocument, JsonPipe],
    templateUrl: './documents-by-type.html'
})
export class DocumentsByType {
    teacherService = inject(TeacherWrapperService);
    types = this.teacherService.types;
    type = input.required<DocumentTypeEnum>();
    relatedType = linkedSignal(() => this.types().find((t) => t.name === this.type()));
    documents = model.required<PrivacyDocumentDetails[]>();
    relatedDocuments = linkedSignal(() => this.documents().filter((doc) => doc.type?.name === this.type()));
    modalVisible = model(false);
    privacyDocumentTypeEnum = DocumentTypeEnum;
    needRefresh = output<void>();

    onAddDocument() {
        this.modalVisible.set(true);
    }
}
