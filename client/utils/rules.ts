export function required(val: any): boolean | string {
  return !!val || "Required."
}