export function hideNull(key: string, value: any) {
    if (value === null) {
        return undefined;
    }
    return value;
}


export async function doAsync(fn: Function) {
    return fn()
}
