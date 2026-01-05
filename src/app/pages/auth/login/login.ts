import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { LogoComponent } from '@/pages/components/logo/logo.component';
import { MainService } from '@/pages/shared/services/main.service';
import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { catchError } from 'rxjs';
import { UserLogin } from 'src/client';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ConfigurableFormComponent, LogoComponent],
    templateUrl: './login.html'
})
export class Login {
    router = inject(Router);
    authService = inject(MainService);
    messageService = inject(MessageService);

    loginFormStructure: Structure = {
        id: 'login',
        name: 'login',
        label: 'Connexion',
        hideSubmitButton: true,
        hideCancelButton: true,

        styleClass: 'md:min-w-[40rem] min-w-[90vw] !p-0',
        sections: [
            {
                id: 'login',
                name: 'login',
                description: 'Veuillez remplir les champs obligatoires',
                styleClass: 'w-full',
                fields: [
                    {
                        id: 'email',
                        name: 'email',
                        label: 'Email',
                        type: 'text',
                        placeholder: 'Email',
                        required: true,
                        fullWidth: true,
                        validation: [Validators.email, Validators.required]
                    },
                    {
                        id: 'password',
                        name: 'password',
                        label: 'Mot de passe',
                        type: 'password',
                        placeholder: 'Mot de passe',
                        required: true,
                        fullWidth: true,
                        validation: [Validators.required, Validators.minLength(8)]
                    }
                ]
            }
        ]
    };

    handleFormSubmit(formGroup: FormGroup) {
        const formData = formGroup.value;
        const loginData = {
            email: formData.login.email,
            password: formData.login.password
        };

        this.loginWithData(loginData);
    }

    private loginWithData(loginData: UserLogin) {
        this.authService
            .login(loginData)
            .pipe(
                catchError((err) => {
                    this.messageService.add({
                        summary: 'Erreur',
                        detail: 'Mauvais identifiants',
                        severity: 'error'
                    });
                    throw err;
                })
            )
            .subscribe(() => {
                this.messageService.add({
                    summary: 'Connexion réussie',
                    detail: `Bienvenue`,
                    severity: 'success',
                    life: 500,
                    icon: 'pi pi-check-circle'
                });
                this.router.navigate(['/']);
            });
    }
}
