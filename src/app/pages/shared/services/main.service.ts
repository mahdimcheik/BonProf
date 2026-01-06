import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { catchError, map, Observable, of, tap } from 'rxjs';
import {
    AddressDetails,
    AuthService,
    ForgotPassword,
    Login,
    LoginResponse,
    ObjectResponse,
    PasswordRecovery,
    PasswordResetResponse,
    StringResponse,
    TeachersService,
    UserCreate,
    UserDetails,
    UserDetailsResponse,
    UserLogin,
    UserUpdate
} from 'src/client';
import { environment } from 'src/environments/environment';
import { LocalstorageService } from './localstorage.service';

@Injectable({
    providedIn: 'root'
})
export class MainService {
    router = inject(Router);
    authService = inject(AuthService);
    messageService = inject(MessageService);
    localStorageService = inject(LocalstorageService);
    teacherService = inject(TeachersService);

    ApplicationName = 'BonProf';
    logoUrl = 'assets/bird.svg';
    baseUrl = environment.API_URL;
    token = signal<string>('');

    // addresses
    AddressesList = signal<AddressDetails[]>([]);

    // pour la page profile
    userConnected = signal({} as UserDetails);

    isAdmin = computed(() => this.userConnected()?.roles?.some((role: any) => role.name === 'Admin'));
    isSuperAdmin = computed(() => this.userConnected()?.roles?.some((role: any) => role.name === 'SuperAdmin'));
    isTeacher = computed(() => this.userConnected()?.roles?.some((role: any) => role.name === 'Teacher'));
    isStudent = computed(() => this.userConnected()?.roles?.some((role: any) => role.name === 'Student'));

    mainTopbarLinks = linkedSignal<MenuItem[]>(() => {
        return [
            { label: 'Accueil', routerLink: '/' },
            { label: 'Dashboard', routerLink: '/dashboard' },
            { label: 'Mentions Légales', routerLink: '/mentions-legales' }
        ] as MenuItem[];
    });

    mainTopbarSecondaryLinks = linkedSignal<MenuItem[]>(() => {
        const user = this.userConnected();
        if (user && user.email) {
            return [{ label: 'Deconnexion', command: () => this.logout().subscribe() }];
        }
        return [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'UI Components',
                items: [
                    { label: 'Profile', icon: 'pi pi-fw pi-id-card', routerLink: ['/profile'] },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] }
                ]
            }
        ] as MenuItem[];
    });

    sidebarMenuItems = linkedSignal<MenuItem[]>(() => {
        const user = this.userConnected();
        const items: MenuItem[] = [
            {
                label: 'Home',
                root: true
            },
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
            {
                label: 'UI Components',
                root: true
            },
            { label: 'Profile', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/teacher/profile/me'] },
            { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] }
        ];
        return items;
    });

    /**
     * Enregistre un nouvel utilisateur.
     * @param userDTO les données de l'utilisateur à enregistrer
     * @returns Un observable contenant la réponse de l'API
     */
    register(userDTO: UserCreate): Observable<UserDetailsResponse> {
        return this.authService.authRegisterPost(userDTO).pipe(
            catchError((error) => {
                console.error("Erreur lors de l'inscription :", error);
                return of({
                    message: error.message ?? 'Erreur inconnue',
                    status: error.status ?? 500,
                    data: {} as UserDetails
                } as UserDetailsResponse);
            })
        );
    }

    /**
     * Authentifie un utilisateur.
     * @param userLoginDTO les données de connexion de l'utilisateur
     * @returns Un observable contenant la réponse de l'API
     */
    login(userLoginDTO: UserLogin): Observable<LoginResponse> {
        return this.authService.authLoginPost(userLoginDTO).pipe(
            map((response) => {
                return {
                    message: response.message ?? '',
                    status: response.status!,
                    data: response.data as Login
                };
            }),
            tap((res) => {
                this.token.set(res.data?.token ?? '');
                this.userConnected.set(res.data?.user as UserDetails);
                this.localStorageService.setUser(res.data?.user ?? '');
            })
        );
    }
    /**
     * Rafraîchit le token d'authentification.
     * @returns Un observable contenant la réponse de l'API
     */
    refreshToken(): Observable<LoginResponse> {
        return this.authService.authRefreshTokenGet().pipe(
            tap((res) => {
                this.token.set(res.data?.token ?? '');
                this.userConnected.set(res.data?.user as UserDetails);
            })
        );
    }
    /**
     * Récupère le profil public d'un utilisateur par son ID.
     * @param input les données pour réinitialiser le mot de passe (email)
     * @returns Un observable contenant la réponse de l'API
     */
    forgotPassword(input: { email: string }): Observable<PasswordResetResponse> {
        const forgotPasswordInput: ForgotPassword = {
            email: input.email
        };
        return this.authService.authForgotPasswordPost(forgotPasswordInput);
    }

    /**
     * Récupère le profil public d'un utilisateur par son ID.
     * @param changePassword les données pour réinitialiser le mot de passe (token, newPassword)
     * @returns Un observable contenant la réponse de l'API
     */
    resetPassword(changePassword: PasswordRecovery): Observable<StringResponse> {
        return this.authService.authResetPasswordPost(changePassword);
    }

    /**
     * Réinitialise les données utilisateur stockées localement.
     * Utilisé lors de la déconnexion.
     * @returns void
     */
    reset(): void {
        this.localStorageService.reset();
        this.userConnected.set({} as UserDetails);
        this.token.set('');
    }

    logout(): Observable<ObjectResponse> {
        this.reset();

        return this.authService.authLogoutGet().pipe(
            tap(() => {
                this.router.navigate(['/']);
                this.messageService.add({
                    summary: 'Déconnexion réussie',
                    detail: 'Vous avez été déconnecté avec succès.',
                    severity: 'success'
                });
            })
        );
    }

    // teacher
    getTeacherFullProfile() {
        return this.teacherService.teachersMyProfileGet().pipe(
            tap((response) => {
                if (response.data) {
                    this.userConnected.set(response.data ?? null);
                }
            })
        );
    }

    updateTeacherProfile(updatedProfile: UserUpdate) {
        return this.teacherService.teachersUpdateProfilePut(updatedProfile);
    }
}
