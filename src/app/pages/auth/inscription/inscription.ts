import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { GenderPipe } from '@/pages/shared/pipes/gender-pipe';
import { GenderWrapperService } from '@/pages/shared/services/gender-wrapper-service';
import { MainService } from '@/pages/shared/services/main.service';
import { RoleWrapperService } from '@/pages/shared/services/role-wrapper-service';
import { ageValidator, passwordStrengthValidator, passwordValidator } from '@/pages/shared/validators/confirmPasswordValidator';
import { Component, computed, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { GenderDetails, RoleDetails, RoleEnum, UserCreate } from 'src/client';

@Component({
    selector: 'bp-inscription',
    imports: [ConfigurableFormComponent, RouterLink, ButtonModule, FormsModule],
    templateUrl: './inscription.html',
    providers: [GenderPipe]
})
export class Inscription implements OnInit {
    router = inject(Router);
    genderWrapperService = inject(GenderWrapperService);
    roleWrapperService = inject(RoleWrapperService);
    mainService = inject(MainService);
    messageService = inject(MessageService);
    genderPipe = inject(GenderPipe);
    roleEnum = RoleEnum;

    roleOptions = signal<RoleDetails[]>([]);
    authorizedRoles = computed(() => this.roleOptions().filter((role) => role.name === RoleEnum.Teacher || role.name === RoleEnum.Student));
    genderOptions = signal<GenderDetails[]>([]);
    selectedUserType = signal<RoleEnum>(RoleEnum.Student);

    selectedGender = computed(() => {
        if (this.genderOptions().length > 0) {
            return this.genderOptions()[0];
        }
        return null;
    });
    selectedRole = computed(() => {
        if (this.authorizedRoles().length > 0) {
            return this.authorizedRoles()[0];
        }
        return null;
    });

    inscriptionFormStructure = linkedSignal<Structure>(() => {
        const roleId = this.selectedUserType();
        const returnStructure = {
            id: 'inscriptionForm',
            name: 'inscriptionForm',
            label: 'Inscription',
            globalValidators: [Validators.required],
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
                            value: new Date(2000, 0, 1),
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
                                return this.genderPipe.transform(gender.name);
                            }
                        }
                    ],
                    groupValidators: [passwordValidator('password', 'confirmPassword')]
                },
                {
                    id: 'isProfessional',
                    name: 'isProfessional',
                    label: 'Administration',
                    fields: [
                        {
                            id: 'siret',
                            name: 'siret',
                            type: 'number',
                            required: true,
                            label: 'Numéro de SIRET',
                            placeholder: 'Numéro de SIRET',
                            fullWidth: true
                        }
                    ]
                },
                {
                    id: 'optionalFields',
                    name: 'optionalFields',
                    label: 'Champs recommandés',
                    fields: [
                        {
                            id: 'title',
                            name: 'title',
                            type: 'text',
                            label: 'Titre',
                            required: false,
                            placeholder: 'Titre',
                            fullWidth: true
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
        if (roleId === RoleEnum.Student) {
            returnStructure.sections = returnStructure.sections?.filter((section) => section.id !== 'isProfessional');
        }

        return returnStructure as Structure;
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

    selectRole(roleName: string) {
        this.selectedUserType.set(roleName as RoleEnum);
    }

    async submit(event: FormGroup<any>) {
        const value = event.value;
        const roleName = this.selectedUserType();
        const roleId = this.roleOptions().find((role) => role.name === roleName)?.id;
        const userCreationData: UserCreate = {
            ...value.inscriptionForm,
            ...value.privacy,
            ...value.optionalFields,
            roleId,
            teacher:
                roleName === RoleEnum.Teacher
                    ? {
                          isProfessionnal: value.isProfessional?.isProfessional ?? false,
                          siret: value.isProfessional?.siret ?? null
                      }
                    : null,
            student: {}
        };

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
