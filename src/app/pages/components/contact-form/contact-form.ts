import { Component, input } from '@angular/core';
import { Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { LoginOutput } from 'src/client';
import { ConfigurableFormComponent } from '../configurable-form/configurable-form.component';
import { Structure } from '../configurable-form/related-models';

@Component({
    selector: 'bp-contact-form',
    imports: [ConfigurableFormComponent, Button],
    templateUrl: './contact-form.html',
    styleUrls: ['./contact-form.scss']
})
export class ContactForm {
    teacherprofile = input.required<LoginOutput>();
    contactStructure: Structure = {
        id: 'contactForm',
        name: 'contactForm',
        label: 'Me contacter',
        styleClass: 'w-full !p-0',
        hideCancelButton: true,
        hideSubmitButton: true,
        formFieldGroups: [
            {
                id: 'contactForm',
                name: 'contactForm',
                label: 'Contact',
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
                        placeholder: 'Si différent de celui utilisé pour la création du compte',
                        fullWidth: true
                    },
                    {
                        id: 'message',
                        name: 'message',
                        type: 'textarea',
                        label: 'Message',
                        required: true,
                        placeholder: 'Votre message',
                        fullWidth: true,
                        validation: [Validators.required]
                    }
                ]
            }
        ]
    };
}
