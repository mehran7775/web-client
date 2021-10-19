export type KeyValuePairs<key,value> = {
  key: key,
  value: value
}

export class AutoCompleteItem {
  id: string
  name: String
  fullname: String
  constructor(id: string, name: string, fullname: string = "") {
    this.id = id
    this.name = name
    this.fullname = fullname
  }
}

export type PaginatedResult<type> = {
  offset: bigint,
  length: bigint,
  data: type
}
