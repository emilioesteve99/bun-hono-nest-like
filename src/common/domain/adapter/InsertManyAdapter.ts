export interface InsertManyAdapter<TCommand, TModel, TContext = void> {
  insertMany(command: TCommand, context: TContext): Promise<TModel[]>;
}
