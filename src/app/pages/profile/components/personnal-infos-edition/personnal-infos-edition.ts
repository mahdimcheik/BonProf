import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { LanguagesWrapperService } from '@/pages/shared/services/languages-service';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { ageValidator, socialMediaUrlValidator } from '@/pages/shared/validators/confirmPasswordValidator';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LanguageDetails, TeacherUpdate } from 'src/client';

@Component({
    selector: 'bp-personnal-infos-edition',
    imports: [ConfigurableFormComponent],
    templateUrl: './personnal-infos-edition.html'
})
export class PersonnalInfosEdition implements OnInit {
    teacherWarapperService = inject(TeacherWrapperService);
    languagesWrapperService = inject(LanguagesWrapperService);
    router = inject(Router);
    teacherProfile = this.teacherWarapperService.teacherProfile;
    languagesList = signal<LanguageDetails[]>([]);

    personnalInfosStructure = computed<Structure>(() => {
        const teacher = this.teacherProfile();
        return {
            id: 'personnalInfos',
            name: 'personnalInfos',
            label: 'Informations personnelles',
            styleClass: 'md:min-w-full min-w-full !p-0',
            formFieldGroups: [
                {
                    id: 'personnalInfos',
                    name: 'personnalInfos',
                    label: 'Informations personnelles',
                    description: 'Veuillez remplir les champs obligatoires',
                    styleClass: 'w-full',
                    fields: [
                        {
                            id: 'firstName',
                            name: 'firstName',
                            label: 'Prénom',
                            type: 'text',
                            value: teacher?.firstName || '',
                            placeholder: 'Prénom',
                            required: true,
                            validation: [Validators.required]
                        },
                        {
                            id: 'lastName',
                            name: 'lastName',
                            label: 'Nom',
                            type: 'text',
                            value: teacher?.lastName || '',
                            placeholder: 'Nom',
                            required: true,
                            validation: [Validators.required, Validators.minLength(3)]
                        },
                        {
                            id: 'dateOfBirth',
                            name: 'dateOfBirth',
                            type: 'date',
                            label: 'Date de naissance',
                            value: teacher?.dateOfBirth ? new Date(teacher.dateOfBirth) : new Date('2000-01-01'),
                            fullWidth: true,
                            required: true,
                            placeholder: 'Date de naissance',
                            validation: [Validators.required, ageValidator()]
                        }
                    ]
                },
                {
                    id: 'optionalFields',
                    name: 'optionalFields',
                    label: 'Champs facultatifs',
                    fields: [
                        {
                            id: 'title',
                            name: 'title',
                            type: 'text',
                            label: 'Titre',
                            value: teacher?.teacher?.title || '',
                            fullWidth: true,
                            required: false,
                            placeholder: 'Titre'
                        },
                        {
                            id: 'description',
                            name: 'description',
                            type: 'texteditor',
                            label: 'Description',
                            value: teacher?.teacher?.description || '',
                            fullWidth: true,
                            required: false,
                            placeholder: 'Description'
                        },
                        {
                            id: 'languagesIds',
                            label: 'Langues parlées',
                            name: 'languagesIds',
                            type: 'multiselect',
                            compareKey: 'id',
                            displayKey: 'name',
                            value: this.teacherProfile()?.languages?.map((lang) => lang.id) || [],
                            fullWidth: true,
                            options: this.languagesList()
                        },
                        {
                            id: 'priceIndicative',
                            name: 'priceIndicative',
                            type: 'number',
                            label: 'Tarif indicatif (€ par heure)',
                            value: teacher?.teacher?.priceIndicative || null,
                            fullWidth: true,
                            required: false,
                            placeholder: 'Tarif indicatif'
                        }
                    ]
                },
                {
                    id: 'socialLinks',
                    name: 'socialLinks',
                    label: 'Reseaux sociaux',
                    fields: [
                        {
                            id: 'linkedIn',
                            name: 'linkedIn',
                            type: 'text',
                            label: 'LinkedIn',
                            required: false,
                            placeholder: 'LinkedIn',
                            value: teacher?.teacher?.linkedIn || '',
                            validation: [socialMediaUrlValidator('linkedin')]
                        },
                        {
                            id: 'faceBook',
                            name: 'faceBook',
                            type: 'text',
                            label: 'FaceBook',
                            required: false,
                            placeholder: 'FaceBook',
                            value: teacher?.teacher?.faceBook || '',
                            validation: [socialMediaUrlValidator('facebook')]
                        },
                        {
                            id: 'gitHub',
                            name: 'gitHub',
                            type: 'text',
                            label: 'GitHub',
                            required: false,
                            placeholder: 'GitHub',
                            value: teacher?.teacher?.gitHub || '',
                            validation: [socialMediaUrlValidator('github')]
                        },
                        {
                            id: 'twitter',
                            name: 'twitter',
                            type: 'text',
                            label: 'Twitter',
                            required: false,
                            placeholder: 'Twitter',
                            value: teacher?.teacher?.twitter || '',
                            validation: [socialMediaUrlValidator('twitter')]
                        }
                    ]
                }
            ]
        };
    });

    async submit(event: FormGroup<any>) {
        console.log(event.value);
        const teacher = event.value;
        const updatedTeacher: TeacherUpdate = {
            ...this.teacherProfile(),
            title: teacher.optionalFields.title,
            description: teacher.optionalFields.description,
            linkedIn: teacher.socialLinks.linkedIn,
            faceBook: teacher.socialLinks.faceBook,
            gitHub: teacher.socialLinks.gitHub,
            twitter: teacher.socialLinks.twitter,
            priceIndicative: teacher.optionalFields.priceIndicative,
            genderId: this.teacherProfile()?.gender?.id || '',

            firstName: teacher.personnalInfos.firstName,
            lastName: teacher.personnalInfos.lastName,
            dateOfBirth: teacher.personnalInfos.dateOfBirth
        };
        await firstValueFrom(this.teacherWarapperService.updateTeacherProfile(updatedTeacher));
        await this.router.navigate(['dashboard/teacher/profile/me']);
    }

    ngOnInit() {
        this.loadData();
    }
    async loadData() {
        const languagesData = await firstValueFrom(this.languagesWrapperService.getAvailableLanguages());
        this.languagesList.set(languagesData);
    }
}
