# Smart Grid Gridify Component - Implementation Guide

## Overview
The `SmartGridGridifyComponent` is a custom PrimeNG table component that builds **GridifyQuery** JSON objects for direct use in backend APIs with `[FromBody] GridifyQuery query`.

## GridifyQuery Structure

The component generates a JSON object with the following structure:

```typescript
{
    page: number,           // Current page number (1-based)
    pageSize: number,       // Items per page
    orderBy: string | null, // e.g., "FirstName asc, LastName desc"
    filter: string | null   // e.g., "Age>10,Name=*John*"
}
```

## Features

### 1. **Sorting**
- Three states: ascending (`1`), descending (`-1`), and none (`0`)
- Maps to: `"asc"`, `"desc"`, or removed from orderBy
- Multiple columns can be sorted
- Example output: `"FirstName asc, Age desc"`

### 2. **Filtering**

#### Text Filter (contains)
- Uses wildcards: `Name=*John*`
- Case-insensitive search

#### Select Filter (equals)
- Exact match: `Status=Active`
- Works with strings, numbers, dates

#### MultiSelect Filter (in)
- OR conditions: `(CategoryId=1|CategoryId=2|CategoryId=3)`

#### Date Filter
- Equals: `CreatedAt=2026-01-21T10:00:00.000Z`
- Before: `CreatedAt<2026-01-21T10:00:00.000Z`
- After: `CreatedAt>2026-01-21T10:00:00.000Z`

### 3. **Global Search**
- Searches across all filterable columns
- Uses OR conditions: `(FirstName=*search*|LastName=*search*|Email=*search*)`

### 4. **LocalStorage**
- Automatically saves: sorts, filters, page, pageSize, search
- Restores state on component initialization
- Uses `storageName` input for unique storage key

## Usage Example

```typescript
// In your component
export class MyComponent {
    data = signal<User[]>([]);
    totalRecords = signal<number>(0);
    
    columns: DynamicColDef[] = [
        {
            field: 'firstName',
            header: 'First Name',
            sortable: true,
            filterable: true,
            type: 'text'
        },
        {
            field: 'status',
            header: 'Status',
            sortable: true,
            filterable: true,
            type: 'select',
            options: [
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' }
            ]
        },
        {
            field: 'categories',
            header: 'Categories',
            filterable: true,
            type: 'array',
            filterField: 'categoryId',
            options: categories,
            optionLabel: 'name',
            optionValue: 'id'
        }
    ];

    tableState = signal<GridifyQuery>({ page: 1, pageSize: 10, orderBy: null, filter: null });

    constructor(private userService: UserService) {
        // Watch for tableState changes and fetch data
        effect(() => {
            const query = this.tableState();
            this.fetchData(query);
        });
    }

    fetchData(query: GridifyQuery) {
        this.userService.getUsers(query).subscribe(response => {
            this.data.set(response.data || []);
            this.totalRecords.set(response.count || 0);
        });
    }
}
```

```html
<!-- In your template -->
<bp-smart-grid-gridify
    [(data)]="data"
    [(columns)]="columns"
    [(tableState)]="tableState"
    [(totalRecords)]="totalRecords"
    [height]="'800px'"
    [storageName]="'users-table-state'"
    [lineItemComponent]="userCardComponent"
/>
```

## Backend Integration

Your backend API should accept:

```csharp
[HttpPost]
public async Task<IActionResult> GetUsers([FromBody] GridifyQuery query)
{
    var result = await _userService.GetUsersAsync(query);
    return Ok(result);
}
```

Example query received by backend:
```json
{
    "page": 2,
    "pageSize": 20,
    "orderBy": "FirstName asc, CreatedAt desc",
    "filter": "Age>25,Status=Active,(CategoryId=1|CategoryId=2),Name=*John*"
}
```

## Filter Operators

| Match Mode | Operator | Example | Description |
|------------|----------|---------|-------------|
| contains   | `=*text*` | `Name=*John*` | Case-insensitive contains |
| equals     | `=` | `Status=Active` | Exact match |
| in         | `=` with `\|` | `(Id=1\|Id=2)` | OR conditions |
| before     | `<` | `Date<2026-01-21` | Less than |
| after      | `>` | `Date>2026-01-21` | Greater than |

## LocalStorage Structure

Stored state example:
```json
{
    "sorts": [
        { "field": "firstName", "order": 1 },
        { "field": "age", "order": -1 }
    ],
    "filters": {
        "status": { "value": "Active", "matchMode": "equals" },
        "age": { "value": 25, "matchMode": "after" }
    },
    "page": 2,
    "pageSize": 20,
    "search": "john"
}
```

## Notes

1. **Page Numbers**: GridifyQuery uses 1-based page numbers (1, 2, 3...), while PrimeNG paginator uses 0-based `first` index (0, 10, 20...). The component handles this conversion automatically.

2. **Filter String Building**: Filters are combined with commas (`,`) which represents AND conditions. OR conditions use pipes (`|`) within parentheses.

3. **Date Handling**: Dates are automatically converted to ISO 8601 format for transmission to the backend.

4. **Search vs Filter**: Global search is appended to the filter string as OR conditions across all filterable columns.

5. **Effect Optimization**: The component uses Angular signals and effects to automatically rebuild the GridifyQuery whenever sorts, filters, or pagination changes.
