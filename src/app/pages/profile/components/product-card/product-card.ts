import { ConfirmModalComponent } from '@/pages/components/confirm-modal/confirm-modal.component';
import { ProductWrapperService } from '@/pages/shared/services/product-wrapper-service';
import { Component, inject, model, output, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { firstValueFrom } from 'rxjs';
import { ProductCreate, ProductDetails, ProductUpdate } from 'src/client';

@Component({
    selector: 'bp-product-card',
    imports: [Card, Button, ConfirmModalComponent],
    templateUrl: './product-card.html'
})
export class ProductCard {
    productWrapperService = inject(ProductWrapperService);
    messageService = inject(MessageService);

    editMode = model(true);
    product = model.required<ProductDetails>();
    showEditModal = signal(false);
    showDeleteConfirm = signal(false);
    needRefresh = output<boolean>();

    cancel() {
        this.showEditModal.set(false);
    }

    openEditModal() {
        this.showEditModal.set(true);
    }

    async editProduct(product: ProductDetails | ProductCreate | ProductUpdate) {
        try {
            const newProduct = await firstValueFrom(this.productWrapperService.updateProduct(product as ProductUpdate));
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Produit édité avec succès' });
            if (newProduct.data) {
                this.product.set(newProduct.data);
            }
        } finally {
            this.editMode.set(false);
        }
    }
    showConfirmModal() {
        this.showDeleteConfirm.set(true);
    }
    hideConfirmModal() {
        this.showDeleteConfirm.set(false);
    }

    async deleteProduct() {
        try {
            await firstValueFrom(this.productWrapperService.deleteProduct(this.product().id));
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Le produit a été supprimé avec succès.' });
            this.needRefresh.emit(true);
        } finally {
            this.showDeleteConfirm.set(false);
        }
    }
}
