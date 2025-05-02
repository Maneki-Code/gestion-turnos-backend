import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    email: string;
    role: string;
    iat: number;
    exp: number;
  };
}
