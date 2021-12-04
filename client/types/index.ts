export * from "./collection"
export * from "./message"
export * from "./panels"
export * from "./sso"
export * from "./oms"
export * from "./wealth"

export type Error = {
  code: number
  detail: Array<ErrorDetail>
}

export type ErrorDetail = {
  loc: string
  type: string
}
