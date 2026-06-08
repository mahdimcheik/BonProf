import { CommonModule } from '@angular/common';
import {
    Component,
    DestroyRef,
    OnInit,
    computed,
    effect,
    inject,
    input,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({
    selector: 'bp-countdown',
    imports: [CommonModule],
    templateUrl: './countdown.html',
    styleUrl: './countdown.scss',
})
export class Countdown implements OnInit {
    /** Time left, in seconds. */
    time = input.required<number>();

    private readonly destroyRef = inject(DestroyRef);
    private readonly remaining = signal(0);

    /** Two-digit minutes / seconds, split per digit for independent animation. */
    protected readonly minuteDigits = computed(() =>
        this.toDigits(Math.floor(this.remaining() / 60))
    );
    protected readonly secondDigits = computed(() =>
        this.toDigits(this.remaining() % 60)
    );
    protected readonly finished = computed(() => this.remaining() <= 0);

    constructor() {
        // Re-sync the internal countdown whenever the input changes.
        effect(() => {
            this.remaining.set(Math.max(0, Math.floor(this.time())));
        });
    }

    ngOnInit(): void {
        interval(1000)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.remaining.update((value) => (value > 0 ? value - 1 : 0));
            });
    }

    private toDigits(value: number): string[] {
        return value.toString().padStart(2, '0').split('');
    }
}
