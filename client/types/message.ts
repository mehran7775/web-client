import { Paginated } from "./collection"
import moment from "moment"

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
            this.dateTime = moment(Date()).toISOString()
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

export type Message = {
    id: Number,
    dateTime: String,
    title: String,
    preview: String,
    origin: Number,
    type: Number,
    flags: Number,
    message: Message_template_1 | Message_template_2
}

export type Message_template_1 = {
    body: String
}

export type Message_template_2 = {
    body: String
}
