import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { LogoComponent } from '@/pages/components/logo/logo.component';
import { GenderWrapperService } from '@/pages/shared/services/gender-wrapper-service';
import { MainService } from '@/pages/shared/services/main.service';
import { RoleWrapperService } from '@/pages/shared/services/role-wrapper-service';
import { ageValidator, passwordStrengthValidator, passwordValidator } from '@/pages/shared/validators/confirmPasswordValidator';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { GenderDetails, RoleDetails, UserCreate } from 'src/client';

@Component({
    selector: 'bp-inscription',
    imports: [ConfigurableFormComponent, LogoComponent, RouterLink, ButtonModule],
    templateUrl: './inscription.html'
})
export class Inscription implements OnInit {
    router = inject(Router);
    genderWrapperService = inject(GenderWrapperService);
    roleWrapperService = inject(RoleWrapperService);
    mainService = inject(MainService);
    messageService = inject(MessageService);

    roleOptions = signal<RoleDetails[]>([]);
    genderOptions = signal<GenderDetails[]>([]);

    selectedGender = computed(() => {
        if (this.genderOptions().length > 0) {
            return this.genderOptions()[0];
        }
        return null;
    });
    selectedRole = computed(() => {
        if (this.roleOptions().length > 0) {
            return this.roleOptions()[0];
        }
        return null;
    });

    inscriptionFormStructure = computed<Structure>(() => {
        return {
            id: 'inscriptionForm',
            name: 'inscriptionForm',
            label: 'Inscription',
            // globalValidators: [Validators.required],
            styleClass: 'max-w-[40rem] ',
            hideCancelButton: true,
            hideSubmitButton: true,
            sections: [
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
                            value: this.selectedRole()?.id,
                            placeholder: 'Choissir un rôle',
                            options: this.roleOptions(),
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
                            id: 'genderId',
                            name: 'genderId',
                            label: 'Genre',
                            type: 'select',
                            placeholder: 'Genre',
                            required: true,
                            options: this.genderOptions(),
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
    });

    ngOnInit(): void {
        this.loadData();
    }
    async loadData() {
        const genders = await firstValueFrom(this.genderWrapperService.getGenders());
        this.genderOptions.set(genders ?? []);
        const roles = await firstValueFrom(this.roleWrapperService.getRoles());
        this.roleOptions.set(roles ?? []);
    }

    async submit(event: FormGroup<any>) {
        const value = event.value;
        const userCreationData: UserCreate = {
            // ...value.inscriptionForm,
            email: value.inscriptionForm.email,
            password: value.inscriptionForm.password,
            roleId: value.inscriptionForm.roleId,
            ...value.privacy,
            profile: {
                firstName: value.inscriptionForm.firstName,
                lastName: value.inscriptionForm.lastName,
                dateOfBirth: value.inscriptionForm.dateOfBirth,
                genderId: value.inscriptionForm.genderId
            }
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
