import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, computed, effect, input, model, OnInit, output, signal, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { CustomTableState, DATE_FILTER_MATCH_MODES, DynamicColDef, ICellRendererAngularComp, INITIAL_STATE, INITIAL_STATE_GRIDIFY, SortCriterion, SortOrder } from '../smart-grid/TableColumn ';
import { CustomSortComponent } from '../smart-grid/custom-sort/custom-sort.component';
import { ActionButtonRendererComponent } from '../smart-grid/default-component';
import { GridifyQuery } from 'src/client';
import { GridifyQueryBuilder, ConditionalOperator as op } from 'gridify-client';

@Component({
    selector: 'bp-smart-grid-gridify',
    imports: [TableModule, InputTextModule, CustomSortComponent, PaginatorModule, PopoverModule, SelectModule, MultiSelectModule, ButtonModule, DatePickerModule, CommonModule, FormsModule, NgComponentOutlet],
    templateUrl: './smart-grid-gridify.html',
    styleUrl: './smart-grid-gridify.scss'
})
export class SmartGridGridifyComponent<T extends Record<string, any>> implements OnInit {
    data = model<T[]>([]);
    columns = model.required<DynamicColDef[]>();
    tableState = model<GridifyQuery>(INITIAL_STATE_GRIDIFY);
    totalRecords = model<number>(0);
    loading = model(false);
    height = input<string>('1000px');
    heightNumber = computed(() => parseInt(this.height().replace('px', ''), 10));
    title = input<string>('');
    storageName = input<string>('');
    searchValue = signal<string>('');
    customComponents = model<{ [key: string]: Type<ICellRendererAngularComp> }>({});
    itemRendererComponent = input<Type<ICellRendererAngularComp>>();
    itemRendererComponentParams = input<any>();
    itemPropertyName = input<string>();
    dateFilterMatchModes = DATE_FILTER_MATCH_MODES;
    lineItemComponent = input<Type<ICellRendererAngularComp>>();
    styleClass = input<string>('');

    // output
    onRowClick = output<T | T[] | undefined>();

    // Internal signals for building the query
    private internalSorts = signal<SortCriterion[]>([]);
    private internalFilters = signal<{ [key: string]: { value: any; matchMode: string; specialFilter?: boolean } }>({});
    private internalPage = signal<number>(1);
    private internalPageSize = signal<number>(10);
    private internalSearch = signal<string>('');

    // Internal signals
    private componentMap = signal<{ [key: string]: Type<ICellRendererAngularComp> }>({
        default: ActionButtonRendererComponent
    });

    constructor() {
        this.getStateFromLocalStorage();
        const customComps = this.customComponents();
        this.componentMap.set({
            ...customComps,
            default: ActionButtonRendererComponent
        });

        // Effect to rebuild GridifyQuery whenever internal state changes
        effect(() => {
            const gridifyQuery = this.buildGridifyQuery();
            this.tableState.set(gridifyQuery);
        });
    }

    ngOnInit(): void {}

    getComponent(templateName: string | Type<ICellRendererAngularComp>): Type<ICellRendererAngularComp> {
        if (typeof templateName === 'string') {
            return this.componentMap()[templateName] || this.componentMap()['default'];
        }
        return templateName;
    }

    getSortOrderForField(field: string): SortOrder {
        const sortCriterion = this.internalSorts().find((s) => s.field === field);
        return sortCriterion?.order ?? 0;
    }

    sortChange(order: SortOrder, column: DynamicColDef): void {
        const sortField = column.sortField ?? column.field;
        const currentSorts = [...this.internalSorts()];
        const sortMap = new Map<string, SortCriterion>(currentSorts.map((s) => [s.field, s]));

        if (order === 0) {
            sortMap.delete(sortField);
        } else {
            sortMap.set(sortField, { field: sortField, order });
        }

        this.internalSorts.set(Array.from(sortMap.values()));
        this.internalPage.set(1);
        this.saveStateToLocalStorage();
    }

    // ========== Filtering Methods ==========
    getFilterValue(field: string): any {
        return this.internalFilters()[field]?.value ?? null;
    }

    getDateFilterMatchMode(field: string): string {
        return this.internalFilters()[field]?.matchMode ?? 'equals';
    }

    onTextFilterChange(value: string, column: DynamicColDef): void {
        const filterField = column.filterField ?? column.field;
        this.updateFilter(filterField, value, 'contains', column.field, column.specialFilter);
    }

    onSelectFilterChange(value: any, column: DynamicColDef): void {
        const filterField = column.filterField ?? column.field;
        this.updateFilter(filterField, value, 'equals', column.field, column.specialFilter);
    }

    onArrayFilterChange(value: any[], column: DynamicColDef): void {
        const filterField = column.filterField ?? column.field;
        this.updateFilter(filterField, value, 'in', column.field, column.specialFilter);
    }

    onDateFilterChange(date: Date | null, column: DynamicColDef, matchMode?: string): void {
        const filterField = column.filterField ?? column.field;
        const mode = matchMode ?? this.getDateFilterMatchMode(filterField);
        this.updateFilter(filterField, date, mode, column.field, column.specialFilter);
    }

    onDateFilterMatchModeChange(matchMode: string, column: DynamicColDef): void {
        const filterField = column.filterField ?? column.field;
        const currentFilter = this.internalFilters()[filterField];
        if (currentFilter) {
            this.updateFilter(filterField, currentFilter.value, matchMode, column.field, currentFilter.specialFilter);
        }
    }

    clearFilter(column: DynamicColDef): void {
        const filterField = column.filterField ?? column.field;
        const filters = { ...this.internalFilters() };
        delete filters[filterField];

        this.internalFilters.set(filters);
        this.internalPage.set(1);
        this.saveStateToLocalStorage();
    }

    resetFilter(): void {
        this.internalFilters.set({});
        this.internalPage.set(1);
        this.saveStateToLocalStorage();
    }

    private updateFilter(filterField: string, value: any, matchMode: string, displayField?: string, specialFilter?: boolean): void {
        const filters = { ...this.internalFilters() };

        if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
            delete filters[filterField];
        } else {
            filters[filterField] = { value, matchMode, specialFilter };
        }

        this.internalFilters.set(filters);
        this.internalPage.set(1);
        this.saveStateToLocalStorage();
    }

    // ========== Pagination Methods ==========
    onPageChange(event: any): void {
        const page = Math.floor(event.first / event.rows) + 1;
        this.internalPage.set(page);
        this.internalPageSize.set(event.rows);
        this.saveStateToLocalStorage();
    }

    // global search
    onSearchChange($event: Event): void {
        const value = ($event.target as HTMLInputElement).value;
        this.searchValue.set(value);
        this.internalSearch.set(value);
        this.internalPage.set(1);
        this.saveStateToLocalStorage();
    }

    // ========== GridifyQuery Builder ==========
    private buildGridifyQuery(): GridifyQuery {
        const orderBy = this.buildOrderByString();
        const filter = this.buildFilterString();

        return {
            page: this.internalPage(),
            pageSize: this.internalPageSize(),
            orderBy: orderBy || null,
            filter: filter || null
        };
    }

    private buildOrderByString(): string {
        const sorts = this.internalSorts();
        if (sorts.length === 0) return '';

        return sorts
            .map((sort) => {
                const direction = sort.order === 1 ? 'asc' : 'desc';
                return `${sort.field} ${direction}`;
            })
            .join(', ');
    }

    private buildFilterString(): string {
        const filters = this.internalFilters();
        const search = this.internalSearch();
        const filterParts: string[] = [];

        // Build filters from columns
        Object.entries(filters).forEach(([field, filterData]) => {
            const { value, matchMode } = filterData;

            switch (matchMode) {
                case 'contains':
                    // Text contains (case-insensitive with wildcards)
                    if (typeof value === 'string' && value.trim()) {
                        filterParts.push(`${field}=*${value}`);
                    }
                    break;
                case 'equals':
                    // Exact match (for selects, dates, etc.)
                    if (value !== null && value !== undefined) {
                        if (value instanceof Date) {
                            filterParts.push(`${field}=${value.toISOString()}`);
                        } else {
                            filterParts.push(`${field}=${value}`);
                        }
                    }
                    break;
                case 'in':
                    // Array contains (for multiselect)
                    if (Array.isArray(value) && value.length > 0) {
                        // Gridify uses OR conditions for array: field=value1|value2|value3
                        const orConditions = value.map((v) => `${field}=${v}`).join('|');
                        filterParts.push(`(${orConditions})`);
                    }
                    break;
                case 'before':
                    // Date before
                    if (value instanceof Date) {
                        filterParts.push(`${field}<${value.toISOString()}`);
                    }
                    break;
                case 'after':
                    // Date after
                    if (value instanceof Date) {
                        filterParts.push(`${field}>${value.toISOString()}`);
                    }
                    break;
                default:
                    // Default equals
                    if (value !== null && value !== undefined) {
                        filterParts.push(`${field}=${value}`);
                    }
            }
        });

        // Add global search if present
        if (search && search.trim()) {
            // Global search across all searchable columns
            const searchableColumns = this.columns().filter((col) => col.filterable !== false);
            if (searchableColumns.length > 0) {
                const searchConditions = searchableColumns.map((col) => `${col.field}=*${search}*`).join('|');
                filterParts.push(`(${searchConditions})`);
            }
        }

        return filterParts.join(',');
    }

    // ========== LocalStorage Methods ==========
    saveStateToLocalStorage(): void {
        if (this.storageName()) {
            const state = {
                sorts: this.internalSorts(),
                filters: this.internalFilters(),
                page: this.internalPage(),
                pageSize: this.internalPageSize(),
                search: this.internalSearch()
            };
            localStorage.setItem(this.storageName(), JSON.stringify(state));
        }
    }

    getStateFromLocalStorage(): void {
        if (this.storageName()) {
            const stateStr = localStorage.getItem(this.storageName());
            if (stateStr) {
                try {
                    const state = JSON.parse(stateStr);
                    this.internalSorts.set(state.sorts || []);
                    this.internalFilters.set(state.filters || {});
                    this.internalPage.set(state.page || 1);
                    this.internalPageSize.set(state.pageSize || 10);
                    this.internalSearch.set(state.search || '');
                    this.searchValue.set(state.search || '');
                } catch (error) {
                    console.error('Error parsing localStorage state:', error);
                    this.resetToDefaults();
                }
            } else {
                this.resetToDefaults();
            }
        } else {
            this.resetToDefaults();
        }
    }

    private resetToDefaults(): void {
        this.internalSorts.set([]);
        this.internalFilters.set({});
        this.internalPage.set(INITIAL_STATE_GRIDIFY.page || 1);
        this.internalPageSize.set(INITIAL_STATE_GRIDIFY.pageSize || 10);
        this.internalSearch.set('');
        this.searchValue.set('');
    }

    // Helper method to create inputs for the dynamic component
    getComponentInputs(item: T): Record<string, any> {
        // If itemPropertyName is explicitly provided, use it
        if (this.itemPropertyName()) {
            return { [this.itemPropertyName()!]: item };
        }

        // Otherwise, try to infer the property name from the component name
        // For CardUserComponent, it expects a 'user' input
        const componentName = this.itemRendererComponent()?.name.toLowerCase() || '';

        // Try to infer the property name from the component name
        // e.g., CardUserComponent -> user, CardProductComponent -> product
        let propertyName = 'data'; // default fallback

        if (componentName.includes('user')) {
            propertyName = 'user';
        } else if (componentName.includes('product')) {
            propertyName = 'product';
        } else if (componentName.includes('item')) {
            propertyName = 'item';
        }

        return { [propertyName]: item };
    }
}
