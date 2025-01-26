export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'; 

export interface IDaySchedule {
  day: WeekDay;
  bookedTime: number[];
}

export interface IScheduleResponse {
  schedule?: IDaySchedule[];
  success?: boolean
}
