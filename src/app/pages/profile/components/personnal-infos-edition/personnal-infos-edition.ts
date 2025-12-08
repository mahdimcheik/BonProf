import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { ageValidator } from '@/pages/shared/validators/confirmPasswordValidator';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
    selector: 'bp-personnal-infos-edition',
    imports: [ConfigurableFormComponent],
    templateUrl: './personnal-infos-edition.html'
})
export class PersonnalInfosEdition {
    personnalInfosStructure: Structure = {
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
                        placeholder: 'Prénom',
                        required: true,
                        validation: [Validators.required]
                    },
                    {
                        id: 'lastName',
                        name: 'lastName',
                        label: 'Nom',
                        type: 'text',
                        placeholder: 'Nom',
                        required: true,
                        validation: [Validators.required, Validators.minLength(8)]
                    },
                    {
                        id: 'dateOfBirth',
                        name: 'dateOfBirth',
                        type: 'date',
                        label: 'Date de naissance',
                        fullWidth: true,
                        required: true,
                        placeholder: 'Date de naissance',
                        value: new Date('2000-01-01'),
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
                        fullWidth: true,
                        required: false,
                        placeholder: 'Numéro de téléphone'
                    },
                    {
                        id: 'title',
                        name: 'title',
                        type: 'text',
                        label: 'Titre',
                        fullWidth: true,
                        required: false,
                        placeholder: 'Titre'
                    },
                    {
                        id: 'description',
                        name: 'description',
                        type: 'texteditor',
                        label: 'Description',
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
}
