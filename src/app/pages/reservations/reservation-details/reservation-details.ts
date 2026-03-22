import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';
import { Component, computed, inject, model, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConversationDetails, ReservationDetails } from 'src/client';
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
  messages = signal<ConversationDetails[]>([]);
  newMessage = signal<string>('');

  reservation = signal<ReservationDetails | undefined>(undefined);
  partner = computed(() => {
    if (!this.reservation()) {
      return null;
    }
    return this.mainService.isStudent() ? this.reservation()?.slot?.teacher : this.reservation()?.student;    
  });

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.reservationId.set(params['id']);
      this.loadData();
    });
  }

  
  async loadData() {
    const result = await firstValueFrom(this.slotService.GetReservationById(this.reservationId()));
    if (result) {
      this.reservation.set(result!);
    }

    const messages = await firstValueFrom(this.slotService.GetConversationById(this.reservationId()));
    this.messages.set(messages ?? []);
  }

  rezise(direction: 'right' | 'left'){
    if(direction === 'right'){
      this.panelSizes.set([0.1, 99.9]);
    }else{
      this.panelSizes.set([99.9, 0.1]);
    }
  }

      isCurrentUserMessage(message: ConversationDetails): boolean {
        const currentUser = this.mainService.userConnected();
        return currentUser.id === message.senderId;
    }

        onKeyDown(event: KeyboardEvent) {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            this.sendMessage();
        }
    }

    getSenderName(message: ConversationDetails): string {
        const currentUser = this.mainService.userConnected();
        return currentUser.id === message.senderId ? 'Moi' : this.partner()?.user?.firstName + ' ' + this.partner()?.user?.lastName ;
    }

    async sendMessage() {
        
    }
}
