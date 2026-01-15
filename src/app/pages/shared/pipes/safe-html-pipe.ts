import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as DOMPurify from 'dompurify'; // Importez la librairie

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(value: string): SafeHtml {
        // 1. D'abord, on nettoie le HTML méchant (scripts, onlick, etc.)
        // mais on garde le HTML gentil (style, b, img safe)
        const cleanValue = DOMPurify.default.sanitize(value);

        // 2. Ensuite seulement, on dit à Angular "C'est bon, tu peux afficher"
        return this.sanitizer.bypassSecurityTrustHtml(cleanValue);
    }
}
