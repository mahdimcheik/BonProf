import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';
import { Component, inject, model, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ReservationDetails } from 'src/client';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from "primeng/button";
import { MainService } from '@/pages/shared/services/main.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { ReservationStatusPipe } from '@/pages/shared/pipes/reservation-status-pipe';
import { SlotTypePipe } from '@/pages/shared/pipes/slot-type-pipe';

export interface ChatMessage {
    userId: string;
    author: string;
    content: string;
    sentAt: Date; 
    timestamp: Date;
}
@Component({
  selector: 'bp-reservation-details',
  imports: [SplitterModule, ButtonModule, DatePipe, FormsModule, InputTextModule, TextareaModule, TooltipModule, ReservationStatusPipe, SlotTypePipe],
  templateUrl: './reservation-details.html',
})
export class ReservationDetailsPage  implements OnInit {
  slotService = inject(SlotWrapperService);
  activatedRoute = inject(ActivatedRoute);
  mainService = inject(MainService);
  reservationId = signal<string>('');
  height = signal<string>(window.screen.height - 200 + 'px');
  panelSizes = signal<[number, number]>([25, 75]);
  messages = signal<ChatMessage[]>([]);
  newMessage = signal<string>('');

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

      isCurrentUserMessage(message: ChatMessage): boolean {
        const currentUser = this.mainService.userConnected();
        return currentUser.id === message.userId;
    }

        onKeyDown(event: KeyboardEvent) {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            this.sendMessage();
        }
    }

    async sendMessage() {
        
    }
}
