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
  origins: Array<string>;

  constructor(
    tags: MessageTag[],
    dateTime: string | null = null,
    title: string | null = null
  ) {
    this.tags = tags;
    this.dateTime = dateTime;
    this.title = title;
    this.origins = ["RLC"];
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

export enum MessageOrigin {
  rlc = 1,
  support = 2,
  admin = 3,
  tedan = 4,
  codal = 5,
}

export interface Message {
  id: number;
  dateTime: string | null;
  title: string;
  preview: string;
  origin: number;
  type: MessageOrigin;
  flags: number;
  message: string;
  seenDate: string | null;
}

export interface MessageSourceResult {
  instrumentCode: string;
  origin: MessageOrigin;
  messagesCount: number;
}

export interface MessageTemplate {}

export interface MessageTemplate_1 extends MessageTemplate {
  body: String;
}


export interface MessageChat {
  id: number
  body: string
  self: boolean
  date: string
  file: File
}
