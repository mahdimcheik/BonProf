import { SmartSectionComponent } from '@/pages/components/smart-section/smart-section.component';
import { Component, input, linkedSignal, model } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DocumentTypeEnum, PrivacyDocumentDetails } from 'src/client';
import { ModalAddEditDocument } from '../modal-add-edit-document/modal-add-edit-document';

@Component({
    selector: 'bp-documents-by-type',
    imports: [SmartSectionComponent, ButtonModule, ModalAddEditDocument],
    templateUrl: './documents-by-type.html'
})
export class DocumentsByType {
    type = input.required<DocumentTypeEnum>();
    documents = model.required<PrivacyDocumentDetails[]>();
    relatedDocuments = linkedSignal(() => this.documents().filter((doc) => doc.type?.name === this.type()));
    modalVisible = model(false);

    onAddDocument() {
        this.modalVisible.set(true);
    }
}
