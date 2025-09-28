export interface UpdateManyAdapter<TCommand, TContext = void> {
  updateMany(command: TCommand, context: TContext): Promise<void>;
}
