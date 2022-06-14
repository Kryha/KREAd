export interface ActivityEvent {
  name: string;
  price?: number;
  from?: string;
  to: string;
  date: EpochTimeStamp;
}
