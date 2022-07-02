import { SearchModel } from "./collection";

export class MessageQuery implements SearchModel {
  filters: MessageFilter;
  offset: number;
  length: number;
  echo: any;
  constructor(offset: number, length: number, filters: MessageFilter) {
    this.filters = filters;
    this.offset = offset;
    this.length = length;
  }
}

export class MessageFilter {
  //TODO Change name to from
  dateTime: string | null;
  tags: MessageTag[];
  title: string | null;
  constructor(tags: MessageTag[], dateTime: string | null = null, title: string | null = null) {
    this.tags = tags;
    this.dateTime = dateTime;
    this.title = title;
  }
}

export class MessageTag {
  recordId: number;
  entity: number;
  constructor(record: number, entity: number) {
    this.recordId = record;
    this.entity = entity;
  }
}

enum types {
  rlc = 1,
  tedan = 4,
  codal = 5,
}

export interface Message {
  id: number,
  dateTime: string | null,
  title: string,
  preview: string,
  origin: number,
  type: types,
  flags: number,
  message: string,
  seenDate: string
}

export interface MessageTemplate {
}

export interface MessageTemplate_1 extends MessageTemplate {
  body: String;
}
