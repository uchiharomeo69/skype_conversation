export interface Conversation {
  _id?: string;
  title: string;
  channelId: string;
  status: boolean; // xem conversation bi creator remove chua
  createAt: string;
  avatar: string;
  type: string;
}
