import { IAccessToken } from '../../interfaces/IToken';

declare global {
  namespace Express {
    export interface Request {
      user: IAccessToken;
    }
  }
}
