import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';
import { Component, inject, model, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ReservationDetails } from 'src/client';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'bp-reservation-details',
  imports: [SplitterModule, ButtonModule],
  templateUrl: './reservation-details.html',
})
export class ReservationDetailsPage  implements OnInit {
  slotService = inject(SlotWrapperService);
  activatedRoute = inject(ActivatedRoute);
  reservationId = signal<string>('');
  height = signal<string>(window.screen.height - 250 + 'px');
  panelSizes = signal<[number, number]>([25, 75]);

  reservation = signal<ReservationDetails | undefined>(undefined);
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.reservationId.set(params['id']);
      this.loadData();
    });

    // window.addEventListener('resize', this.onResize.bind(this));
  }

  
  async loadData() {
    const result = await firstValueFrom(this.slotService.GetReservationById(this.reservationId()));
    if (result) {
      this.reservation.set(result!);
    }
  }

  rezise(direction: 'right' | 'left'){
    if(direction === 'right'){
      this.panelSizes.set([0.1, 99.9]);
    }else{
      this.panelSizes.set([99.9, 0.1]);
    }
  }
}
