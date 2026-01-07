import { CursusWrapperService } from '@/pages/shared/services/cursus-wrapper-service';
import { MainService } from '@/pages/shared/services/main.service';
import { ProductWrapperService } from '@/pages/shared/services/product-wrapper-service';
import { Component, computed, inject, model, output, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CursusDetails, ProductCreate, ProductDetails, ProductUpdate } from 'src/client';
import { ConfigurableFormComponent } from '../../configurable-form/configurable-form.component';
import { Structure } from '../../configurable-form/related-models';

@Component({
    selector: 'bp-product-edition',
    imports: [ConfigurableFormComponent],
    templateUrl: './product-edition.html'
})
export class ProductEdition {
    productWrapperService = inject(ProductWrapperService);
    cursusWrapperService = inject(CursusWrapperService);
    mainService = inject(MainService);

    clickSubmit = output<ProductDetails | ProductCreate | ProductUpdate>();
    clickCancel = output<void>();
    product = model<ProductDetails | undefined>(undefined);
    cursuses = signal<CursusDetails[]>([]);

    productForm = computed<Structure>(() => {
        const product = this.product();
        return {
            id: 'cursus',
            name: 'Cursus',
            label: 'Cursus',
            styleClass: 'md:min-w-full min-w-full !p-0',
            sections: [
                {
                    id: 'informations',
                    name: product ? `Editer le produit: ${product.name}` : 'Ajouter un produit',
                    label: product ? `Editer le produit: ${product.name}` : 'Ajouter un produit',
                    fields: [
                        {
                            id: 'cursusId',
                            label: 'Cursus associé',
                            name: 'cursusId',
                            type: 'select',
                            required: false,
                            value: product ? product.cursus?.id : '',
                            options: this.cursuses(),
                            displayKey: 'name',
                            compareKey: 'id',
                            fullWidth: true
                        },
                        { id: 'name', label: 'Titre', name: 'name', type: 'text', required: true, value: product ? product.name : '', placeholder: 'Titre du produit', fullWidth: true },

                        { id: 'price', label: 'Prix', name: 'price', type: 'number', required: true, value: product ? product.price : '', fullWidth: true },
                        { id: 'description', label: 'Description', name: 'description', type: 'textarea', required: true, value: product ? product.description : '', fullWidth: true, placeholder: 'Description' }
                    ]
                }
            ]
        };
    });

    ngOnInit(): void {
        this.loadData();
    }

    async loadData() {
        const cursusesData = await firstValueFrom(this.cursusWrapperService.getCursusByTeacher(this.mainService.userConnected()?.id ?? ''));
        this.cursuses.set(cursusesData || []);
    }

    submit($event: FormGroup<any>) {
        const values = $event.value.informations;
        console.log(values);

        if (this.product()) {
            const updatedProduct: ProductUpdate = values;
            updatedProduct.id = this.product()!.id;
            this.clickSubmit.emit(updatedProduct);
        } else {
            values.teacherId = this.mainService.userConnected()?.id;
            this.clickSubmit.emit(values as ProductCreate);
        }
    }
    onCancel() {
        this.clickCancel.emit();
    }
}
