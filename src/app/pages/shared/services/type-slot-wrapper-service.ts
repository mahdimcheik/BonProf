import { inject, Injectable, signal } from '@angular/core';
import { map, of } from 'rxjs';
import { TypeSlotCreate, TypeSlotDetails, TypeSlotsService, TypeSlotUpdate } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class TypeSlotWrapperService {
    typeslotService = inject(TypeSlotsService);
    typeSlots = signal<TypeSlotDetails[]>([]);

    getAllTypeSlots(forceRefetch = false) {
        if (this.typeSlots().length > 0 && !forceRefetch) {
            return of(this.typeSlots());
        }
        return this.typeslotService.typeslotsAllGet().pipe(
            map((response) => {
                if (response.data) {
                    this.typeSlots.set(response.data);
                }
                return response.data ?? [];
            })
        );
    }

    addTypeSlot(typeSlot: TypeSlotCreate) {
        return this.typeslotService.typeslotsPost(typeSlot);
    }

    updateTypeSlot(typeSlot: TypeSlotUpdate) {
        return this.typeslotService.typeslotsPut(typeSlot);
    }
}
