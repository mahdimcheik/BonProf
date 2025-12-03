import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'bp-mentions-legales-page',
    imports: [RouterLink],
    templateUrl: './mentions-legales-page.html',
    styleUrl: './mentions-legales-page.scss'
})
export class MentionsLegalesPage {
    getCurrentDate(): string {
        return new Date().toLocaleDateString('fr-FR');
    }
}
