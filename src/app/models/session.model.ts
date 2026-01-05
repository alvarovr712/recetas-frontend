export interface Session {
  id: string;
  userId: string;
  createdAt: string;   
  expiresAt: string;   
  ip: string;
  browser: string;
  token: string;
}
