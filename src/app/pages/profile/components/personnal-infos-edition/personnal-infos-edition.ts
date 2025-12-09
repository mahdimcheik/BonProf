import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { ageValidator } from '@/pages/shared/validators/confirmPasswordValidator';
import { Component, computed, inject, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TeacherProfileUpdate } from 'src/client';

@Component({
    selector: 'bp-personnal-infos-edition',
    imports: [ConfigurableFormComponent],
    templateUrl: './personnal-infos-edition.html'
})
export class PersonnalInfosEdition implements OnInit {
    teacherWarapperService = inject(TeacherWrapperService);
    router = inject(Router);
    teacherProfile = this.teacherWarapperService.teacherProfile;

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
                            value: teacher?.user.firstName || '',
                            placeholder: 'Prénom',
                            required: true,
                            validation: [Validators.required]
                        },
                        {
                            id: 'lastName',
                            name: 'lastName',
                            label: 'Nom',
                            type: 'text',
                            value: teacher?.user.lastName || '',
                            placeholder: 'Nom',
                            required: true,
                            validation: [Validators.required, Validators.minLength(3)]
                        },
                        {
                            id: 'dateOfBirth',
                            name: 'dateOfBirth',
                            type: 'date',
                            label: 'Date de naissance',
                            value: teacher?.user.dateOfBirth ? new Date(teacher.user.dateOfBirth) : new Date('2000-01-01'),
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
                            id: 'phoneNumber',
                            name: 'phoneNumber',
                            type: 'text',
                            label: 'Numéro de téléphone',
                            value: teacher?.user.phoneNumber || '',
                            fullWidth: true,
                            required: false,
                            placeholder: 'Numéro de téléphone'
                        },
                        {
                            id: 'title',
                            name: 'title',
                            type: 'text',
                            label: 'Titre',
                            value: teacher?.title || '',
                            fullWidth: true,
                            required: false,
                            placeholder: 'Titre'
                        },
                        {
                            id: 'description',
                            name: 'description',
                            type: 'texteditor',
                            label: 'Description',
                            value: teacher?.description || '',
                            fullWidth: true,
                            required: false,
                            placeholder: 'Description'
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
                            placeholder: 'LinkedIn'
                        },
                        {
                            id: 'facebook',
                            name: 'facebook',
                            type: 'text',
                            label: 'Facebook',
                            required: false,
                            placeholder: 'Facebook'
                        },
                        {
                            id: 'github',
                            name: 'github',
                            type: 'text',
                            label: 'GitHub',
                            required: false,
                            placeholder: 'GitHub'
                        },
                        {
                            id: 'twitter',
                            name: 'twitter',
                            type: 'text',
                            label: 'Twitter',
                            required: false,
                            placeholder: 'Twitter'
                        }
                    ]
                }
            ]
        };
    });

    async submit(event: FormGroup<any>) {
        console.log(event.value);
        const teacher = event.value;
        const updatedTeacher: TeacherProfileUpdate = {
            ...this.teacherProfile(),
            title: teacher.optionalFields.title,
            description: teacher.optionalFields.description,
            id: this.teacherProfile()?.id!,
            user: {
                firstName: teacher.personnalInfos.firstName,
                lastName: teacher.personnalInfos.lastName,
                dateOfBirth: teacher.personnalInfos.dateOfBirth
            }
        };
        await firstValueFrom(this.teacherWarapperService.updateTeacherProfile(updatedTeacher));
        await this.router.navigate(['dashboard/teacher/profile/me']);
    }

    ngOnInit(): void {}
}
