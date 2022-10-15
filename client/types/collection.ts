export interface KeyValuePairs<key, value> {
  key: key;
  value: value;
}

export interface AutoCompleteItemInterface {
  id: string;
  name: string;
  fullName: string;
}


export class AutoCompleteItem implements AutoCompleteItemInterface {
  id: string;
  name: string;
  fullName: string;
  constructor(id: string, name: string, fullname: string = "") {
    this.id = id;
    this.name = name;
    this.fullName = fullname;
  }
}




export const defaultWealthValidityItems: AutoCompleteItemInterface[]  = [
  new AutoCompleteItem("1", "روز"),
  new AutoCompleteItem("4", "انجام و حذف"),
  new AutoCompleteItem("3", "تا لغو"),
  new AutoCompleteItem("2", "تا تاریخ"),
];


export interface Paginated {
  offset: number;
  length: number;
}

export interface SearchModel extends Paginated {
  echo?: any;
}

export class AutoCompleteSearchModel implements SearchModel {
  name: string;
  offset: number;
  length: number;
  echo: any;
  constructor(value: string, offset: number, length: number) {
    this.name = value;
    this.offset = offset || 0;
    this.length = length || 5;
  }
}

export class PaginatedResult<type> implements SearchModel {
  data: type[];
  offset: number;
  length: number;
  echo: any;
  constructor(data: type[], offset: number = 0, length: number = 10) {
    this.data = data;
    this.offset = offset
    this.length = length
  }
}
