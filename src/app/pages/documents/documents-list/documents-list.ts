import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

interface DocumentFile {
    name: string;
    size: number;
    type: string;
}

type VerificationStatus = 'pending' | 'verified' | 'rejected';

@Component({
    selector: 'bp-documents-list',
    imports: [CommonModule, ReactiveFormsModule, FileUploadModule, ButtonModule, InputTextModule, ToastModule, CardModule, TagModule, BadgeModule],
    templateUrl: './documents-list.html',
    providers: [MessageService],
    standalone: true
})
export class DocumentsList implements OnInit {
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);

    verificationForm!: FormGroup;
    uploadedFiles: { [key: string]: DocumentFile[] } = {
        diploma: [],
        identity: [],
        professional: []
    };

    verificationStatus: VerificationStatus = 'pending';
    reviewTimeframe = '24–48 heures';

    ngOnInit() {
        this.initializeForm();
    }

    private initializeForm() {
        this.verificationForm = this.fb.group({
            siretNumber: ['', [Validators.required, Validators.pattern(/^\d{3}\s?\d{3}\s?\d{3}\s?\d{5}$/)]],
            diplomaFile: [null, Validators.required],
            identityFile: [null, Validators.required],
            professionalFile: [null]
        });
    }

    onFileSelect(event: any, fileType: 'diploma' | 'identity' | 'professional'): void {
        const files = event.files;
        if (files && files.length > 0) {
            const file = files[0];

            // Validate file type
            const allowedTypes = fileType === 'diploma' ? ['application/pdf', 'image/jpeg', 'image/png'] : fileType === 'identity' ? ['application/pdf', 'image/jpeg', 'image/png'] : ['application/pdf', 'image/jpeg', 'image/png'];

            if (!allowedTypes.includes(file.type)) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Type de fichier invalide',
                    detail: `Veuillez télécharger un format de fichier valide (PDF, JPG ou PNG)`
                });
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5242880) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Fichier trop volumineux',
                    detail: 'La taille du fichier ne doit pas dépasser 5 Mo'
                });
                return;
            }

            this.uploadedFiles[fileType] = [
                {
                    name: file.name,
                    size: file.size,
                    type: file.type
                }
            ];

            this.messageService.add({
                severity: 'success',
                summary: 'Fichier téléchargé',
                detail: `${file.name} téléchargé avec succès`
            });
        }
    }

    removeFile(fileType: 'diploma' | 'identity' | 'professional'): void {
        this.uploadedFiles[fileType] = [];
    }

    onSave(): void {
        if (this.verificationForm.valid) {
            // Save form data to localStorage or send to API
            const formData = {
                siretNumber: this.verificationForm.get('siretNumber')?.value,
                uploadedFiles: this.uploadedFiles,
                savedAt: new Date().toISOString()
            };

            localStorage.setItem('verificationDraft', JSON.stringify(formData));

            this.messageService.add({
                severity: 'info',
                summary: 'Enregistré',
                detail: 'Vos données de vérification de profil ont été enregistrées en tant que brouillon'
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Formulaire incomplet',
                detail: 'Veuillez remplir tous les champs obligatoires'
            });
        }
    }

    onSubmit(): void {
        if (this.verificationForm.valid && this.uploadedFiles['diploma'].length > 0 && this.uploadedFiles['identity'].length > 0) {
            // Submit to verification
            this.messageService.add({
                severity: 'success',
                summary: 'Soumis',
                detail: 'Vos documents ont été soumis pour vérification. Vous recevrez une notification dans les 24 à 48 heures.'
            });

            // Reset verification status to pending
            this.verificationStatus = 'pending';

            // Clear draft
            localStorage.removeItem('verificationDraft');
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Documents obligatoires manquants',
                detail: "Veuillez télécharger les documents de diplôme et d'identité avant de soumettre"
            });
        }
    }

    getStatusBadgeClass(): string {
        switch (this.verificationStatus) {
            case 'verified':
                return 'badge-success';
            case 'rejected':
                return 'badge-danger';
            default:
                return 'badge-warning';
        }
    }

    getStatusLabel(): string {
        switch (this.verificationStatus) {
            case 'verified':
                return 'Vérifié';
            case 'rejected':
                return 'Rejeté';
            default:
                return 'Vérification en attente';
        }
    }

    getStatusIcon(): string {
        switch (this.verificationStatus) {
            case 'verified':
                return 'pi pi-check-circle';
            case 'rejected':
                return 'pi pi-times-circle';
            default:
                return 'pi pi-hourglass';
        }
    }
}
