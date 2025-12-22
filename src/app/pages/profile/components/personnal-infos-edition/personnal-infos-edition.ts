import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { GenderWrapperService } from '@/pages/shared/services/gender-wrapper-service';
import { LanguagesWrapperService } from '@/pages/shared/services/languages-service';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { ageValidator, socialMediaUrlValidator } from '@/pages/shared/validators/confirmPasswordValidator';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GenderDetails, LanguageDetails, TeacherUpdate } from 'src/client';

@Component({
    selector: 'bp-personnal-infos-edition',
    imports: [ConfigurableFormComponent],
    templateUrl: './personnal-infos-edition.html'
})
export class PersonnalInfosEdition implements OnInit {
    teacherWarapperService = inject(TeacherWrapperService);
    languagesWrapperService = inject(LanguagesWrapperService);
    genderWrapperService = inject(GenderWrapperService);
    router = inject(Router);
    teacherProfile = this.teacherWarapperService.teacher;
    teacher = computed(() => this.teacherWarapperService.teacher()?.teacher);
    profile = computed(() => this.teacherWarapperService.teacher()?.profile);
    languagesList = signal<LanguageDetails[]>([]);
    genderOptions = signal<GenderDetails[]>([]);

    personnalInfosStructure = computed<Structure>(() => {
        const teacher = this.teacherProfile();
        return {
            id: 'personnalInfos',
            name: 'personnalInfos',
            label: 'Informations personnelles',
            styleClass: 'md:min-w-full min-w-full !p-0',
            sections: [
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
                            value: this.profile()?.firstName || '',
                            placeholder: 'Prénom',
                            required: true,
                            validation: [Validators.required]
                        },
                        {
                            id: 'lastName',
                            name: 'lastName',
                            label: 'Nom',
                            type: 'text',
                            value: this.profile()?.lastName || '',
                            placeholder: 'Nom',
                            required: true,
                            validation: [Validators.required, Validators.minLength(3)]
                        },
                        {
                            id: 'dateOfBirth',
                            name: 'dateOfBirth',
                            type: 'date',
                            label: 'Date de naissance',
                            value: this.profile()?.dateOfBirth ? new Date(this.profile()?.dateOfBirth!) : new Date('2000-01-01'),
                            fullWidth: true,
                            required: true,
                            placeholder: 'Date de naissance',
                            validation: [Validators.required, ageValidator()]
                        },
                        {
                            id: 'genderId',
                            label: 'Genre',
                            name: 'genderId',
                            type: 'select',
                            compareKey: 'id',
                            displayKey: 'name',
                            value: this.profile()?.gender?.id || null,
                            fullWidth: true,
                            options: this.genderOptions()
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
                            value: this.teacher()?.title || '',
                            fullWidth: true,
                            required: false,
                            placeholder: 'Titre'
                        },
                        {
                            id: 'description',
                            name: 'description',
                            type: 'texteditor',
                            label: 'Description',
                            value: this.teacher()?.description || '',
                            fullWidth: true,
                            required: false,
                            placeholder: 'Description'
                        },
                        {
                            id: 'languageIds',
                            label: 'Langues parlées',
                            name: 'languageIds',
                            type: 'multiselect',
                            compareKey: 'id',
                            displayKey: 'name',
                            value: this.profile()?.languages?.map((lang) => lang.id) || [],
                            fullWidth: true,
                            options: this.languagesList()
                        },
                        {
                            id: 'priceIndicative',
                            name: 'priceIndicative',
                            type: 'number',
                            label: 'Tarif indicatif (€ par heure)',
                            value: this.teacher()?.priceIndicative || null,
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
                            value: this.teacher()?.linkedIn || '',
                            validation: [socialMediaUrlValidator('linkedin')]
                        },
                        {
                            id: 'faceBook',
                            name: 'faceBook',
                            type: 'text',
                            label: 'FaceBook',
                            required: false,
                            placeholder: 'FaceBook',
                            value: this.teacher()?.faceBook || '',
                            validation: [socialMediaUrlValidator('facebook')]
                        },
                        {
                            id: 'gitHub',
                            name: 'gitHub',
                            type: 'text',
                            label: 'GitHub',
                            required: false,
                            placeholder: 'GitHub',
                            value: this.teacher()?.gitHub || '',
                            validation: [socialMediaUrlValidator('github')]
                        },
                        {
                            id: 'twitter',
                            name: 'twitter',
                            type: 'text',
                            label: 'Twitter',
                            required: false,
                            placeholder: 'Twitter',
                            value: this.teacher()?.twitter || '',
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
            languageIds: teacher.optionalFields.languageIds,
            linkedIn: teacher.socialLinks.linkedIn,
            faceBook: teacher.socialLinks.faceBook,
            gitHub: teacher.socialLinks.gitHub,
            twitter: teacher.socialLinks.twitter,
            priceIndicative: teacher.optionalFields.priceIndicative,
            profile: {
                firstName: teacher.personnalInfos.firstName,
                lastName: teacher.personnalInfos.lastName,
                dateOfBirth: teacher.personnalInfos.dateOfBirth,
                genderId: teacher.personnalInfos.genderId
            }
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
        const genders = await firstValueFrom(this.genderWrapperService.getGenders());
        this.genderOptions.set(genders ?? []);
    }
}
