export const queryHandlersByCommandType: Map<string, string> = new Map();

export function queryHandler(queryType: new (...args: any[]) => any) {
  return function (target: any) {
    queryHandlersByCommandType.set(queryType.name, target.name);
  };
}
