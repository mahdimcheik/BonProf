import { Component } from '@angular/core';
import { AgendaService, DayService, MonthService, ScheduleModule, WeekService, WorkWeekService } from '@syncfusion/ej2-angular-schedule';

@Component({
    imports: [ScheduleModule],
    standalone: true,
    selector: 'bp-test-calendar',
    providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],
    templateUrl: './test-calendar.html'
})
export class TestCalendar {}
