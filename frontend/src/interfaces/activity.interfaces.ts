export interface ActivityEvent {
  name: string;
  type?: string;
  price?: number;
  from?: string;
  to: string;
  date: EpochTimeStamp;
}
