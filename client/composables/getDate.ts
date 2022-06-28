

export default function getDate(date: string, locale: string) {
    const myDate = new Date(date).toLocaleDateString(locale)
    return myDate
}
