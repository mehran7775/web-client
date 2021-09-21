export type message = {
    id: Number,
    dateTime: String,
    title: String,
    preview: String,
    origin: Number,
    type: Number,
    flags: Number,
    message: message_template_1 | message_template_2
}

export type message_template_1 = {
    body: String
}

export type message_template_2 = {
    body: String
}
