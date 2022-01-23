export function hideNull(key: string, value: any) {
    if (value === null) {
        return undefined;
    }
    return value;
}