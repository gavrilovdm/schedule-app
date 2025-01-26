import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { IDaySchedule } from "../../shared/models/schedule.model";
import { ScheduleComponent } from "../../features/schedule/schedule.component";
import { ScheduleService } from "../../features/schedule/schedule.service";

 @Component({
  selector: 'app-schedule-page',
  template: `
    <app-schedule 
      [schedule]="schedule" 
      (cellClicked)="onCellClicked($event)">
    </app-schedule> 
  `,
  providers: [ScheduleService],
  standalone: true,
  imports: [CommonModule, ScheduleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
 })
 export class SchedulePageComponent {
  schedule: undefined | IDaySchedule[] = [];
  destroyRef = inject(DestroyRef);
  
  constructor(
    private scheduleService: ScheduleService,
    private cdRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.getSchedule();
  }

  getSchedule(): void {
    this.scheduleService.getSchedule()
      .pipe(
        map((schedule: undefined | IDaySchedule[]) => {
            if (schedule) {
              this.schedule = [...schedule];
              this.cdRef.markForCheck();
            }
          }
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onCellClicked(event: undefined | { day: string, time: number }): void {
    if (!event) throw new Error('Event is undefined');

    this.scheduleService.toggleBookng(event.day, event.time)
    .pipe(
      map(success => {
        if (success) {
          this.getSchedule();
        }
      })
    )
    .subscribe();
  }
 }