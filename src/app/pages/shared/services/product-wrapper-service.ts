import { inject, Injectable } from '@angular/core';
import { ProductCreate, ProductService, ProductUpdate } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class ProductWrapperService {
    productservice = inject(ProductService);

    getProducts() {
        return this.productservice.productAllGet();
    }

    getTeacherProducts(teacherId: string) {
        return this.productservice.productTeacherIdGet(teacherId);
    }

    getProductById(id: string) {
        return this.productservice.productIdGet(id);
    }

    createProduct(product: ProductCreate) {
        return this.productservice.productPost(product);
    }

    updateProduct(product: ProductUpdate) {
        return this.productservice.productPut(product);
    }
    deleteProduct(id: string) {
        return this.productservice.productIdDelete(id);
    }
}
