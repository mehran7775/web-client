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
