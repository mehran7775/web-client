export function required(val: any): boolean | string {
  return !!val || "errors.validation.required"
}