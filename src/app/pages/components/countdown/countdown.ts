import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({
    selector: 'bp-countdown',
    imports: [CommonModule],
    templateUrl: './countdown.html',
    styleUrl: './countdown.scss'
})
export class Countdown implements OnInit {
    /** Time left, in seconds. */
    time = input.required<number>();
    onExpiration = output<void>();

    private readonly destroyRef = inject(DestroyRef);
    private readonly remaining = signal(0);

    protected readonly minutes = computed(() => this.pad(Math.floor(this.remaining() / 60)));
    protected readonly seconds = computed(() => this.pad(this.remaining() % 60));
    protected readonly finished = computed(() => this.remaining() <= 0);

    constructor() {
        // Re-sync the internal countdown whenever the input changes.
        effect(() => {
            this.remaining.set(Math.max(0, Math.floor(this.time())));
        });
    }

    ngOnInit(): void {
        const interval$ = interval(1000)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.remaining.update((value) => (value > 0 ? value - 1 : 0));
                if (this.remaining() === 0) {
                    this.onExpiration.emit();
                    interval$.unsubscribe();
                }
            });
    }

    private pad(value: number): string {
        return value.toString().padStart(2, '0');
    }
}
