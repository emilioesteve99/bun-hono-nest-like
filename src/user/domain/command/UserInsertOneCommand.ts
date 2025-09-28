import { Command } from '../../../common/application/model/Command';

export class UserInsertOneCommand implements Command {
  public readonly name!: string;

  public constructor(options: Required<UserInsertOneCommand>) {
    Object.assign(this, options);
  }
}
