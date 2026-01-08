import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { FormSection, Structure } from '@/pages/components/configurable-form/related-models';
import { GenderWrapperService } from '@/pages/shared/services/gender-wrapper-service';
import { LanguagesWrapperService } from '@/pages/shared/services/languages-service';
import { MainService } from '@/pages/shared/services/main.service';
import { ageValidator, socialMediaUrlValidator } from '@/pages/shared/validators/confirmPasswordValidator';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GenderDetails, LanguageDetails, TeacherUpdate, UserUpdate } from 'src/client';

@Component({
    selector: 'bp-personnal-infos-edition',
    imports: [ConfigurableFormComponent],
    templateUrl: './personnal-infos-edition.html'
})
export class PersonnalInfosEdition implements OnInit {
    mainService = inject(MainService);
    languagesWrapperService = inject(LanguagesWrapperService);
    gendersWrapperService = inject(GenderWrapperService);
    router = inject(Router);

    user = this.mainService.userConnected;
    languagesList = signal<LanguageDetails[]>([]);
    genderOptions = signal<GenderDetails[]>([]);

    personnalInfosStructure = computed<Structure>(() => {
        const user = this.user();
        const isTeacher = this.mainService.isTeacher();

        const personnalInfos: FormSection = {
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
                    value: user?.firstName || '',
                    placeholder: 'Prénom',
                    required: true,
                    validation: [Validators.required]
                },
                {
                    id: 'lastName',
                    name: 'lastName',
                    label: 'Nom',
                    type: 'text',
                    value: user?.lastName || '',
                    placeholder: 'Nom',
                    required: true,
                    validation: [Validators.required, Validators.minLength(3)]
                },
                {
                    id: 'dateOfBirth',
                    name: 'dateOfBirth',
                    type: 'date',
                    label: 'Date de naissance',
                    value: user?.dateOfBirth ? new Date(user.dateOfBirth) : new Date('2000-01-01'),
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
                    value: user?.gender?.id || null,
                    fullWidth: true,
                    options: this.genderOptions()
                }
            ]
        };

        const socialLinks: FormSection = {
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
                    value: user?.teacher?.linkedIn || '',
                    validation: [socialMediaUrlValidator('linkedin')]
                },
                {
                    id: 'faceBook',
                    name: 'faceBook',
                    type: 'text',
                    label: 'FaceBook',
                    required: false,
                    placeholder: 'FaceBook',
                    value: user?.teacher?.faceBook || '',
                    validation: [socialMediaUrlValidator('facebook')]
                },
                {
                    id: 'gitHub',
                    name: 'gitHub',
                    type: 'text',
                    label: 'GitHub',
                    required: false,
                    placeholder: 'GitHub',
                    value: user?.teacher?.gitHub || '',
                    validation: [socialMediaUrlValidator('github')]
                },
                {
                    id: 'twitter',
                    name: 'twitter',
                    type: 'text',
                    label: 'Twitter',
                    required: false,
                    placeholder: 'Twitter',
                    value: user?.teacher?.twitter || '',
                    validation: [socialMediaUrlValidator('twitter')]
                }
            ]
        };

        const optionalFields: FormSection = isTeacher
            ? {
                  id: 'optionalFields',
                  name: 'optionalFields',
                  label: 'Champs facultatifs',
                  fields: [
                      {
                          id: 'title',
                          name: 'title',
                          type: 'text',
                          label: 'Titre',
                          value: user?.title || '',
                          fullWidth: true,
                          required: false,
                          placeholder: 'Titre'
                      },
                      {
                          id: 'description',
                          name: 'description',
                          type: 'texteditor',
                          label: 'Description',
                          value: user?.description || '',
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
                          value: this.user()?.languages?.map((lang) => lang.id) || [],
                          fullWidth: true,
                          options: this.languagesList()
                      },
                      {
                          id: 'priceIndicative',
                          name: 'priceIndicative',
                          type: 'number',
                          label: 'Tarif indicatif (€ par heure)',
                          value: user?.teacher?.priceIndicative || null,
                          fullWidth: true,
                          required: false,
                          placeholder: 'Tarif indicatif',
                          disabled: !isTeacher
                      }
                  ]
              }
            : {
                  id: 'optionalFields',
                  name: 'optionalFields',
                  label: 'Champs facultatifs',
                  fields: [
                      {
                          id: 'title',
                          name: 'title',
                          type: 'text',
                          label: 'Titre',
                          value: user?.title || '',
                          fullWidth: true,
                          required: false,
                          placeholder: 'Titre'
                      },
                      {
                          id: 'description',
                          name: 'description',
                          type: 'texteditor',
                          label: 'Description',
                          value: user?.description || '',
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
                          value: this.user()?.languages?.map((lang) => lang.id) || [],
                          fullWidth: true,
                          options: this.languagesList()
                      }
                  ]
              };

        return isTeacher
            ? {
                  id: 'personnalInfos',
                  name: 'personnalInfos',
                  label: 'Informations personnelles',
                  styleClass: 'md:min-w-full min-w-full !p-0',
                  sections: [personnalInfos, optionalFields, socialLinks]
              }
            : {
                  id: 'personnalInfos',
                  name: 'personnalInfos',
                  label: 'Informations personnelles',
                  styleClass: 'md:min-w-full min-w-full !p-0',
                  sections: [personnalInfos, optionalFields]
              };
    });

    async submit(event: FormGroup<any>) {
        const user = event.value;
        if (this.mainService.isTeacher()) {
            const updatedUser: UserUpdate = {
                ...this.user(),
                firstName: user.personnalInfos.firstName,
                lastName: user.personnalInfos.lastName,
                dateOfBirth: user.personnalInfos.dateOfBirth,
                genderId: user.personnalInfos.genderId,
                languagesIds: user.optionalFields.languagesIds,
                title: user.optionalFields.title,
                description: user.optionalFields.description,
                teacher: {
                    ...this.user()?.teacher,
                    gitHub: user.socialLinks.gitHub,
                    twitter: user.socialLinks.twitter,
                    linkedIn: user.socialLinks.linkedIn,
                    faceBook: user.socialLinks.faceBook,

                    priceIndicative: user.optionalFields.priceIndicative
                },
                student: undefined
            };
            await firstValueFrom(this.mainService.updateTeacherProfile(updatedUser));
            await this.router.navigate(['dashboard/teacher/profile/me']);
        } else if (this.mainService.isStudent()) {
            const updatedUser: UserUpdate = {
                ...this.user(),
                firstName: user.personnalInfos.firstName,
                lastName: user.personnalInfos.lastName,
                dateOfBirth: user.personnalInfos.dateOfBirth,
                genderId: user.personnalInfos.genderId,
                languagesIds: user.optionalFields.languagesIds,
                title: user.optionalFields.title,
                description: user.optionalFields.description,
                student: {
                    // ...this.teacherProfile()?.student,
                },
                teacher: undefined
            };
            await firstValueFrom(this.mainService.updateStudentProfile(updatedUser));
            await this.router.navigate(['dashboard/student/profile/me']);
        }
    }

    ngOnInit() {
        this.loadData();
    }
    async loadData() {
        const languagesData = await firstValueFrom(this.languagesWrapperService.getAvailableLanguages());
        this.languagesList.set(languagesData);
        const gendersData = await firstValueFrom(this.gendersWrapperService.getGenders());
        this.genderOptions.set(gendersData ?? []);
    }
}
