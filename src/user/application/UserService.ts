import { injectable } from 'inversify';

import { User } from '../domain/model/User';

export const UserServiceSymbol: symbol = Symbol('UserService');

@injectable()
export class UserService {
  public async getAll(): Promise<User[]> {
    return [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
    ];
  }
}
