export const commandHandlersByCommandType: Map<string, string> = new Map();

export function commandHandler(commandType: new (...args: any[]) => any) {
  return function (target: any) {
    commandHandlersByCommandType.set(commandType.name, target.name);
  };
}
