export interface CommandHandler<TCommand, TResult = void> {
  execute(query: TCommand): Promise<TResult>;
}
