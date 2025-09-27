export interface CommandHandler<TCommand, TResult> {
  execute(query: TCommand): Promise<TResult>;
}
