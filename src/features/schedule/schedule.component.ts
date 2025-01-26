import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IDaySchedule } from '../../shared/models/schedule.model';

@Component({
  selector: 'app-schedule',
  imports: [CommonModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleComponent {
  hourCells = new Array(24);

  @Input() schedule: undefined | IDaySchedule[] = [];
  @Input() isAdmin: boolean = false;
  @Output() cellClicked = new EventEmitter<undefined | { day: string, time: number }>();

  onCellClick(day: string, time: number): void {
    this.cellClicked.emit({ day, time });
  }

  trackByDay(index: number, scheduleItem: IDaySchedule) {
    return scheduleItem.day;
  }
}
