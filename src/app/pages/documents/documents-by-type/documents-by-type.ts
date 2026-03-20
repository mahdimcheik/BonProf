import { SmartSectionComponent } from '@/pages/components/smart-section/smart-section.component';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { Component, inject, input, linkedSignal, model, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DocumentTypeEnum, PrivacyDocumentDetails } from 'src/client';
import { ModalAddEditDocument } from '../modal-add-edit-document/modal-add-edit-document';

@Component({
    selector: 'bp-documents-by-type',
    imports: [SmartSectionComponent, ButtonModule, ModalAddEditDocument, DialogModule],
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

    selectedDocument = signal<PrivacyDocumentDetails | null>(null);
    previewVisible = signal(false);

    onAddDocument() {
        this.modalVisible.set(true);
    }

    onDocumentClick(doc: PrivacyDocumentDetails) {
        if (this.isImage(doc)) {
            this.selectedDocument.set(doc);
            this.previewVisible.set(true);
        } else {
            window.open(doc.filePath, '_blank');
        }
    }

    isImage(doc: PrivacyDocumentDetails): boolean {
        return doc.mimeType?.startsWith('image/') ?? false;
    }

    isPdf(doc: PrivacyDocumentDetails): boolean {
        return doc.mimeType === 'application/pdf';
    }

    formatSize(bytes?: number): string {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    fileIcon(doc: PrivacyDocumentDetails): string {
        if (this.isImage(doc)) return 'pi pi-image';
        if (this.isPdf(doc)) return 'pi pi-file-pdf';
        return 'pi pi-file';
    }
}
