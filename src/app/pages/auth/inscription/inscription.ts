import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { LogoComponent } from '@/pages/components/logo/logo.component';
import { MainService } from '@/pages/shared/services/main.service';
import { ageValidator, passwordStrengthValidator, passwordValidator } from '@/pages/shared/validators/confirmPasswordValidator';
import { Component, inject, signal } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { UserCreate } from 'src/client';

@Component({
    selector: 'bp-inscription',
    imports: [ConfigurableFormComponent, LogoComponent, RouterLink, ButtonModule],
    templateUrl: './inscription.html'
})
export class Inscription {
    router = inject(Router);
    mainService = inject(MainService);
    messageService = inject(MessageService);

    roleOptions = [
        {
            id: '87a0a5ed-c7bb-4394-a163-7ed7560b4a01',
            name: 'Etudiant',
            label: 'Etudiant'
        },
        {
            id: '87a0a5ed-c7bb-4394-a163-7ed7560b3703',
            name: 'Professeur',
            label: 'Professeur'
        }
    ];

    genderOptions = [
        {
            id: '87a0a5ed-c7bb-4394-a163-7ed7560b4a01',
            name: 'Homme',
            label: 'Homme'
        },
        {
            id: '87a0a5ed-c7bb-4394-a163-7ed7560b3703',
            name: 'Femme',
            label: 'Femme'
        }
    ];

    selectedGender = signal(this.genderOptions[0]);

    inscriptionFormStructure: Structure = {
        id: 'inscriptionForm',
        name: 'inscriptionForm',
        label: 'Inscription',
        globalValidators: [Validators.required],
        styleClass: 'max-w-[40rem] ',
        hideCancelButton: true,
        hideSubmitButton: true,
        formFieldGroups: [
            {
                id: 'inscriptionForm',
                name: 'inscriptionForm',
                label: 'Inscription',
                fields: [
                    {
                        id: 'roleId',
                        name: 'roleId',
                        type: 'select',
                        label: "Je m'inscris en tant que",
                        displayKey: 'name',
                        compareKey: 'id',
                        required: true,
                        value: this.roleOptions[0].id,
                        placeholder: 'Choissir un rôle',
                        options: this.roleOptions,
                        fullWidth: true,
                        validation: [Validators.required]
                    },
                    {
                        id: 'firstName',
                        name: 'firstName',
                        type: 'text',
                        label: 'Prénom',
                        required: true,
                        placeholder: 'Prénom',
                        validation: [Validators.required]
                    },
                    {
                        id: 'lastName',
                        name: 'lastName',
                        type: 'text',
                        label: 'Nom',
                        required: true,
                        placeholder: 'Nom',
                        validation: [Validators.required]
                    },
                    {
                        id: 'email',
                        name: 'email',
                        type: 'email',
                        label: 'Email',
                        required: true,
                        placeholder: 'Email',
                        fullWidth: true,

                        validation: [Validators.email, Validators.required]
                    },
                    {
                        id: 'password',
                        name: 'password',
                        type: 'password',
                        label: 'Mot de passe',
                        required: true,
                        placeholder: 'Mot de passe',
                        validation: [Validators.required, passwordStrengthValidator()]
                    },
                    {
                        id: 'confirmPassword',
                        name: 'confirmPassword',
                        type: 'password',
                        label: 'Confirmer le mot de passe',
                        placeholder: 'Confirmer le mot de passe',
                        validation: [Validators.required]
                    },
                    {
                        id: 'dateOfBirth',
                        name: 'dateOfBirth',
                        type: 'date',
                        label: 'Date de naissance',
                        required: true,
                        placeholder: 'Date de naissance',
                        value: new Date('2000-01-01'),
                        validation: [Validators.required, ageValidator()]
                    },
                    {
                        id: 'gender',
                        name: 'gender',
                        label: 'Genre',
                        type: 'select',
                        placeholder: 'Genre',
                        required: true,
                        options: this.genderOptions,
                        value: this.selectedGender()?.id,
                        displayKey: 'name',
                        compareKey: 'id',
                        valueFormatter: (gender: any) => {
                            if (!gender || !gender.name) return '';

                            // Translate gender names from English to French
                            switch (gender.name.toLowerCase()) {
                                case 'male':
                                    return 'Homme';
                                case 'female':
                                    return 'Femme';
                                case 'other':
                                    return 'Préfère ne pas dire';
                                default:
                                    return gender.name;
                            }
                        }
                    }
                ],
                groupValidators: [passwordValidator('password', 'confirmPassword')]
            },
            {
                id: 'optionalFields',
                name: 'optionalFields',
                label: 'Champs facultatifs',
                fields: [
                    {
                        id: 'phoneNumber',
                        name: 'phoneNumber',
                        type: 'text',
                        label: 'Numéro de téléphone',
                        required: false,
                        placeholder: 'Numéro de téléphone'
                    },
                    {
                        id: 'title',
                        name: 'title',
                        type: 'text',
                        label: 'Titre',
                        required: false,
                        placeholder: 'Titre'
                    },
                    {
                        id: 'description',
                        name: 'description',
                        type: 'textarea',
                        label: 'Description',
                        required: false,
                        placeholder: 'Description'
                    }
                ]
            },
            {
                id: 'privacy',
                name: 'privacy',
                label: 'Consentements et confidentialité',
                fields: [
                    {
                        id: 'privacyPolicyConsent',
                        name: 'privacyPolicyConsent',
                        type: 'checkbox',
                        label: "J'ai lu et j'accepte la politique de confidentialité",
                        required: true,
                        fullWidth: true,
                        validation: [Validators.requiredTrue]
                    },
                    {
                        id: 'dataProcessingConsent',
                        name: 'dataProcessingConsent',
                        type: 'checkbox',
                        label: "J'accepte que mes données personnelles soient traitées conformément au RGPD pour la création et la gestion de mon compte, ainsi que pour la fourniture des services de la plateforme.",
                        required: true,
                        fullWidth: true,
                        validation: [Validators.requiredTrue]
                    }
                ]
            }
        ]
    };

    async submit(event: FormGroup<any>) {
        const value = event.value;
        const userCreationData: UserCreate = {
            ...value.inscriptionForm,
            ...value.privacy,
            ...value.optionalFields
        };
        console.log(userCreationData);

        try {
            const res = await firstValueFrom(this.mainService.register(userCreationData));
            this.messageService.add({
                severity: 'success',
                summary: 'Inscription réussie',
                detail: 'Votre compte a été créé avec succès.'
            });
            await this.router.navigate(['/auth/login']);
        } catch {
            this.messageService.add({
                severity: 'error',
                summary: "Erreur d'inscription",
                detail: 'Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.'
            });
            return;
        }
    }
}
