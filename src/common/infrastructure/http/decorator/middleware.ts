export const middlewares: string[] = [];

export function middleware() {
  return function (target: any) {
    middlewares.push(target.name);
  };
}
