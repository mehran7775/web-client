export type KeyValuePairs<key,value> = {
  key: key,
  value: value
}

export type AutoCompleteItem = {
  id: string,
  name: String,
  fullname: String
}

export type PaginatedResult<type> = {
  offset: bigint,
  length: bigint,
  data: type
}
