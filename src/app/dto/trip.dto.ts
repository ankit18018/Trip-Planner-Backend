export default interface TripDto {
  destination: string;
  startDate: string;
  endDate: string;
  comment?: string;
}
export interface TripUpdateDto {
  destination?: string;
  startDate?: string;
  endDate?: string;
  comment?: string;
}

export interface TripFilterDto {
  min_start_date: string;
  max_start_date: string;
  min_end_date: string;
  max_end_date: string;
  destination: string;
  page: number;
  own_trips: boolean;
  next_month_plan: boolean;
}
