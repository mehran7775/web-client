import { MessageOrigin } from '@/types/message'

export interface Notification {
  type: "Administrative" | "Accounting";
  params: {
    origin: number,
    messagesCount: MessageOrigin
  };
}
