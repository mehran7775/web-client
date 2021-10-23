import { Paginated } from "./collection"
import { DateTime } from "luxon"

export class MessageQuery extends Paginated {
    filters: MessageFilter
    constructor(offset: number, length: number, filters: MessageFilter) {
        super(offset, length)
        this.filters = filters
    }
}

export class MessageFilter {
    //TODO Change name to from
    dateTime: string
    tags: MessageTag[]
    constructor(tags: MessageTag[], dateTime: string | null = null) {
        this.tags = tags
        if (dateTime)
            this.dateTime = dateTime
        else
            this.dateTime = DateTime.now().toISO()
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
    dateTime: string
    title: string
    preview: string
    origin: number
    type: number
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
        this.dateTime = dateTime || DateTime.now().toISO()
        this.preview = preview
        this.origin = origin
        this.type = type
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
