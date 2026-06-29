export interface WeddingMeta {
  id: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  accessCode: string;
  coupleUsername: string;
  couplePassword: string;
}

export interface WeddingsFile {
  weddings: WeddingMeta[];
}

export interface ScheduleItem {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  location: string;
  responsiblePersons: string[];
}

export interface WeddingData {
  weddingId: string;
  weddingDate: string;
  roles: string[];
  schedule: ScheduleItem[];
}

export interface ResponsiblePersonSession {
  type: 'responsible';
  weddingId: string;
  role: string;
  weddingDate: string;
}

export interface CoupleSession {
  type: 'couple';
  weddingId: string;
  coupleUsername: string;
}

export type AuthSession = ResponsiblePersonSession | CoupleSession | null;

export interface PendingWeddingLogin {
  weddingId: string;
  weddingDate: string;
}

export interface SentNotifications {
  [key: string]: boolean;
}

export interface NotificationAlert {
  itemId: string;
  title: string;
  time: string;
  location: string;
  minutesUntil: number;
}
