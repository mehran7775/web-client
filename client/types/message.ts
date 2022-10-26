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
  path?: string
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

export interface MessageChatType {
  id: number
  body: string
  self?: boolean
  date: string
  time: string
  file?: File | null
}

export class MessageChat implements MessageChatType{
 readonly id: number
 readonly body: string
 readonly self: boolean 
 readonly date: string
 readonly time: string
 readonly file: File | null

  constructor(id: number, body: string, date: string, time: string = '11:50', file: File = null, self: boolean = true) {
    this.id = id
    this.body = body
    this.date = date
    this.time = time
    this.file = file
    this.self = self
  }
}
