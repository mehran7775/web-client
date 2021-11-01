import { Paginated } from "./collection"

export class MessageQuery extends Paginated {
    filters: MessageFilter
    constructor(offset: number, length: number, filters: MessageFilter) {
        super(offset, length)
        this.filters = filters
    }
}

export class MessageFilter {
    //TODO Change name to from
    dateTime: string | null
    tags: MessageTag[]
    constructor(tags: MessageTag[], dateTime: string | null = null) {
        this.tags = tags
        this.dateTime = dateTime
    }
}

export class MessageTag {
    recordId: number
    entity: number
    constructor(record: number, entity: number) {
        this.recordId = record
        this.entity = entity
    }
}

export class Message {
    id: number
    dateTime: string | null
    title: string
    preview: string
    origin: number
    messageType: number
    flags: number
    message: MessageTemplate
    seenAt: string
    constructor(
        id: number, title: string, message: MessageTemplate,
        dateTime: string | null = null, flags: number = 0,
        origin: number = 1, type: number = 1,
        preview: string = "", seenAt: string = "") {
        this.id = id
        this.title = title
        this.dateTime = dateTime
        this.preview = preview
        this.origin = origin
        this.messageType = type
        this.flags = flags
        this.message = message
        this.seenAt = seenAt
    }
}

export class MessageTemplate {
    constructor() { }
}

export class MessageTemplate_1 extends MessageTemplate {
    body: String
    constructor(body: string) {
        super()
        this.body = body
    }
}
