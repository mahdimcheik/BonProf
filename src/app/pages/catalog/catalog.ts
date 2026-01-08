import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CursusesList } from '../cursuses/cursuses-list/cursuses-list';
import { ProductsList } from '../products/products-list/products-list';
import { MainService } from '../shared/services/main.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'bp-catalog',
    imports: [TabsModule, CursusesList, ProductsList],
    templateUrl: './catalog.html'
})
export class Catalog {
    mainService = inject(MainService);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    tab: string = 'cursuses';

    ngOnInit() {
        this.mainService.getTeacherFullProfile();
        // .subscribe();
        this.activatedRoute.queryParams.subscribe((params) => {
            const tabParam = params['tab'];
            if (tabParam) {
                this.tab = tabParam;
            } else {
                this.tab = 'cursuses';
            }
        });
    }

    onTabChange(tabValue: string | number | undefined) {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { tab: tabValue },
            queryParamsHandling: 'merge'
        });
    }
}
