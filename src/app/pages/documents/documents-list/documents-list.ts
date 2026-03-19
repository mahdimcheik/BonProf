import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { firstValueFrom } from 'rxjs';
import { DocumentTypeEnum, PrivacyDocumentDetails } from 'src/client';
import { DocumentsByType } from '../documents-by-type/documents-by-type';

interface DocumentFile {
    name: string;
    size: number;
    type: string;
}

type VerificationStatus = 'pending' | 'verified' | 'rejected';

@Component({
    selector: 'bp-documents-list',
    imports: [CommonModule, ReactiveFormsModule, FileUploadModule, ButtonModule, InputTextModule, ToastModule, CardModule, TagModule, BadgeModule, DocumentsByType],
    templateUrl: './documents-list.html',
    providers: [MessageService],
    standalone: true
})
export class DocumentsList implements OnInit {
    teacheWapperService = inject(TeacherWrapperService);
    DocumentType = DocumentTypeEnum;
    documents = signal<PrivacyDocumentDetails[]>([]);

    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
    async loadDocuments() {
        const res = await firstValueFrom(this.teacheWapperService.getPrivacyDocuments());
        if (res) {
            this.documents.set(res);
        }
    }
}
