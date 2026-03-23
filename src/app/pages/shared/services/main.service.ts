import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { catchError, map, Observable, of, tap } from 'rxjs';
import {
    AuthService,
    FileUrl,
    FileUrlResponse,
    ForgotPassword,
    Login,
    LoginResponse,
    ObjectResponse,
    PasswordRecovery,
    PasswordResetResponse,
    RoleEnum,
    StringResponse,
    StudentsService,
    TeachersService,
    UserCreate,
    UserDetails,
    UserDetailsResponse,
    UserLogin,
    UserUpdate
} from 'src/client';
import { environment } from 'src/environments/environment';
import { CityDetails } from '../models/geolocalisation';
import { LocalstorageService } from './localstorage.service';
import { SignalRService } from './signal-r-service';

@Injectable({
    providedIn: 'root'
})
export class MainService {
    router = inject(Router);
    authService = inject(AuthService);
    messageService = inject(MessageService);
    localStorageService = inject(LocalstorageService);
    teacherService = inject(TeachersService);
    studentService = inject(StudentsService);
    signalRService = inject(SignalRService);

    ApplicationName = 'BonProf';
    logoUrl = 'assets/bird.svg';
    baseUrl = environment.API_URL;
    token = signal<string>('');

    // addresses
    selectedCity = signal<CityDetails | null>(null);

    // pour la page profile
    userConnected = signal({} as UserDetails);

    isAdmin = computed(() => this.userConnected()?.roles?.some((role: any) => role.name === RoleEnum.Admin));
    isSuperAdmin = computed(() => this.userConnected()?.roles?.some((role: any) => role.name === RoleEnum.SuperAdmin));
    isTeacher = computed(() => this.userConnected()?.roles?.some((role: any) => role.name === RoleEnum.Teacher));
    isStudent = computed(() => this.userConnected()?.roles?.some((role: any) => role.name === RoleEnum.Student));

    mainTopbarLinks = linkedSignal<MenuItem[]>(() => {
        const user = this.userConnected();
        if (user && user.email) {
            return [
                { label: 'Accueil', routerLink: '/' },
                { label: 'Dashboard', routerLink: '/dashboard' },
                { label: 'Mentions Légales', routerLink: '/mentions-legales' }
            ] as MenuItem[];
        } else
            return [
                { label: 'Accueil', routerLink: '/' },
                { label: 'Mentions Légales', routerLink: '/mentions-legales' }
            ] as MenuItem[];
    });

    mainTopbarSecondaryLinks = linkedSignal<MenuItem[]>(() => {
        const user = this.userConnected();
        if (user && user.email) {
            return [
                { label: 'Deconnexion', command: () => this.logout().subscribe() },
                { label: 'Profil', command: () => this.router.navigate(['/profile/me']) }
            ] as MenuItem[];
        }
        return [
            {
                label: 'Connexion',
                command: () => this.router.navigate(['/auth/login'])
            },
            {
                label: 'Inscription',
                command: () => this.router.navigate(['/auth/register'])
            }
        ] as MenuItem[];
    });

    sidebarMenuItems = linkedSignal<MenuItem[]>(() => {
        const user = this.userConnected();
        if (this.isTeacher()) {
            return [
                {
                    label: 'Général',
                    root: true
                },
                { label: 'Activités', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                {
                    label: 'Administration',
                    root: true
                },
                { label: 'Profile', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/teacher/profile/me/edition'] },
                { label: 'Planning', icon: 'pi pi-fw pi-check-square', routerLink: ['/dashboard/teacher/planning'] },
                { label: 'Catalog', icon: 'pi pi-fw pi-book', routerLink: ['/dashboard/teacher/catalog/me'] },
                { label: 'Documents', icon: 'pi pi-fw pi-book', routerLink: ['/dashboard/teacher/documents'] },
                { label: 'Reservations', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/teacher/reservations'] }
            ];
        } else if (this.isStudent()) {
            return [
                {
                    label: 'Général',
                    root: true
                },
                { label: 'Activités', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                {
                    label: 'Administration',
                    root: true
                },
                { label: 'Profile', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/student/profile/me/edition'] },
                { label: 'Planning', icon: 'pi pi-fw pi-check-square', routerLink: ['/dashboard/student/planning'] },
                { label: 'Reservations', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/student/reservations'] }
            ];
        } else return [];
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
                // Connect to SignalR hub if token is available
                if (res.data?.token) {
                    this.signalRService.initiateAndConnect(res.data.token).then(() => {
                        this.signalRService.addToAppropriateGroup(res.data?.user?.roles ?? []);
                    });
                }
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
                this.localStorageService.setUser(res.data?.user ?? '');
            })
        );
    }

    updateAvatar(file: File): Observable<FileUrlResponse> {
        if (!file) {
            return of({
                message: 'No file provided',
                status: 400,
                data: {} as FileUrl
            });
        }

        // Create FormData manually to ensure proper file parameter name
        const formData = new FormData();
        formData.append('file', file, file.name);

        // Use HttpClient directly to have full control over the request
        return this.authService.authUploadAvatarPost(file).pipe(
            tap((res) => {
                if (res.data) {
                    this.userConnected.update((user) => ({ ...user, profilePicture: res.data?.url }));
                }
            }),
            catchError((error) => {
                console.error('Error uploading avatar:', error);
                return of({
                    message: error.message || 'Error uploading avatar',
                    status: error.status || 500,
                    data: {} as FileUrl
                } as FileUrlResponse);
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

        // Remove user from SignalR groups and stop connection
        const roles = [...(this.userConnected()?.roles?.map((r) => ({ ...r })) ?? [])];
        this.signalRService.removeFromAppropriateGroup(roles);
        this.signalRService.stopConnection();

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

    getTeacherpublicProfile(id: string) {
        return this.teacherService.teachersUserUserIdGet(id);
    }

    updateTeacherProfile(updatedProfile: UserUpdate) {
        return this.teacherService.teachersUpdateProfilePut(updatedProfile);
    }

    // student

    getStudentFullProfile() {
        return this.studentService.studentsMyProfileGet().pipe(
            tap((response) => {
                if (response.data) {
                    this.userConnected.set(response.data ?? null);
                }
            })
        );
    }

    updateStudentProfile(updatedProfile: UserUpdate) {
        return this.studentService.studentsUpdateProfilePut(updatedProfile);
    }
}
