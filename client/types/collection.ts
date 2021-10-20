export type KeyValuePairs<key, value> = {
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

export class Paginated {
  offset: number
  length: number
  constructor(offset: number = 0, length: number = 10) {
    this.offset = offset
    this.length = length
  }
}

export class PaginatedResult<type> extends Paginated {
  data: type[]
  constructor(data: type[], offset: number = 0, length: number = 10) {
    super(offset, length)
    this.data = data
  }
}
