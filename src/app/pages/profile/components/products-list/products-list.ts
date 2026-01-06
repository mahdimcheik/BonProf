import { ProductCard } from '@/pages/components/products/product-card/product-card';
import { ProductEdition } from '@/pages/components/products/product-edition/product-edition';
import { SmartSectionComponent } from '@/pages/components/smart-section/smart-section.component';
import { MainService } from '@/pages/shared/services/main.service';
import { ProductWrapperService } from '@/pages/shared/services/product-wrapper-service';
import { Component, DestroyRef, inject, model, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { ProductCreate, ProductDetails } from 'src/client';

@Component({
    selector: 'bp-products-list',
    imports: [SmartSectionComponent, ProductEdition, ProductCard, ButtonModule],
    templateUrl: './products-list.html'
})
export class ProductsList {
    productWrapperService = inject(ProductWrapperService);
    mainService = inject(MainService);
    messageService = inject(MessageService);
    activatedRoute = inject(ActivatedRoute);
    destroyRef = inject(DestroyRef);

    title = 'Liste des produits';

    editMode = model(true);
    buttonIcon = model('pi pi-plus');
    showEditBox = signal(false);

    products = signal<ProductDetails[]>([]);

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        const productsData = await firstValueFrom(this.productWrapperService.getTeacherProducts(this.mainService?.userConnected()?.id ?? ''));
        this.products.set(productsData.data || []);
    }

    async showAddCursusBox() {
        this.showEditBox.set(true);
    }

    hideAddCursusBox() {
        this.showEditBox.set(false);
    }

    cancel() {
        this.showEditBox.set(false);
    }

    async addNewProduct(event: ProductCreate) {
        const res = await firstValueFrom(this.productWrapperService.createProduct(event));
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Produit ajouté avec succès' });
        this.showEditBox.set(false);
        await this.loadData();
    }
}
