import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { LogoComponent } from '@/pages/components/logo/logo.component';
import { passwordStrengthValidator, passwordValidator } from '@/pages/shared/validators/confirmPasswordValidator';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'bp-reset-password',
    imports: [LogoComponent, ConfigurableFormComponent, ButtonModule],
    templateUrl: './reset-password.html'
})
export class ResetPassword {
    visible: boolean = false;
    // private authService = inject(UserMainService);
    activatedRoute = inject(ActivatedRoute);
    router = inject(Router);
    messageService = inject(MessageService);

    changePasswordFormStructure: Structure = {
        id: 'changePasswordForm',
        name: 'changePasswordForm',
        label: 'Réinitialiser votre mot de passe',
        globalValidators: [Validators.required],
        styleClass: 'md:min-w-[40rem] min-w-[90vw] !p-0',
        hideCancelButton: true,
        hideSubmitButton: true,
        formFieldGroups: [
            {
                id: 'password',
                name: 'password',
                label: 'Mot de passe',
                groupValidators: [Validators.required, Validators.minLength(8), passwordValidator('password', 'passwordConfirmation')],
                fields: [
                    {
                        id: 'password',
                        name: 'password',
                        label: 'Mot de passe',
                        type: 'password',
                        fullWidth: true,
                        required: true,
                        placeholder: 'Mot de passe',
                        order: 1
                    },
                    {
                        id: 'passwordConfirmation',
                        name: 'passwordConfirmation',
                        label: 'Confirmer votre mot de passe',
                        type: 'password',
                        required: true,
                        fullWidth: true,
                        placeholder: 'Confirmer votre mot de passe',
                        order: 2
                    }
                ]
            }
        ]
    };

    userForm = new FormGroup(
        {
            userId: new FormControl<string>(''),
            resetToken: new FormControl<string>(''),
            password: new FormControl<string>('', [Validators.required, Validators.minLength(8), passwordStrengthValidator]),
            passwordConfirmation: new FormControl<string>('', [Validators.required])
        },
        { validators: [passwordValidator('password', 'passwordConfirmation')] }
    );

    ngOnInit(): void {
        let userId = this.activatedRoute.snapshot.queryParams['userId'] ?? '';
        let resetToken = this.activatedRoute.snapshot.queryParams['resetToken'] ?? '';
        this.userForm.setValue({
            userId: userId,
            resetToken: resetToken,
            password: '',
            passwordConfirmation: ''
        });
    }

    async submit(e: FormGroup) {
        // await firstValueFrom(
        //     this.authService.resetPassword(e.value as PasswordRecoveryInput).pipe(
        //         tap((res) => {
        //             this.router.navigate(['/']);
        //             this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Mot de passe réinitialisé avec succès' });
        //             this.router.navigate(['/auth/password-reset-successfully']);
        //         })
        //     )
        // );
    }
}
