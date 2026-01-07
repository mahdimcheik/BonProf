import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { LogoComponent } from '@/pages/components/logo/logo.component';
import { Component, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'bp-forgot-password',
    imports: [ButtonModule, ConfigurableFormComponent, LogoComponent],
    templateUrl: './forgot-password.html'
})
export class ForgotPassword {
    router = inject(Router);
    messageService = inject(MessageService);

    forgotPasswordFormStructure: Structure = {
        id: 'forgotPasswordForm',
        name: 'forgotPasswordForm',
        label: 'Mot de passe oublié',
        globalValidators: [Validators.required],
        styleClass: 'md:min-w-[40rem] min-w-[90vw] !p-0',
        hideSubmitButton: true,
        hideCancelButton: true,
        fields: [
            {
                id: 'email',
                name: 'email',
                label: 'Email',
                type: 'email',
                required: true,
                placeholder: 'Entrer votre email',
                validation: [Validators.email, Validators.required],
                fullWidth: true
            }
        ]
    };

    submit(e: FormGroup) {
        // const email = e.value.email;
        // this.authService.forgotPassword({ email }).subscribe(() => {
        //     this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Un email vous a été envoyé pour réinitialiser votre mot de passe' });
        //     this.router.navigate(['/auth/login']);
        // });
    }

    cancel() {
        this.router.navigate(['/auth/login']);
    }
}
