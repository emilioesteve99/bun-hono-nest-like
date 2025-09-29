export const queryHandlersByQueryType: Map<string, string> = new Map();

export function queryHandler(queryType: new (...args: any[]) => any) {
  return function (target: any) {
    queryHandlersByQueryType.set(queryType.name, target.name);
  };
}
