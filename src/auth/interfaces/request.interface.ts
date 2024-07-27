import { Request } from 'express';

export interface ProtectedRequest extends Request {
  user: {
    sub: string;
    email: string;
  };
}
