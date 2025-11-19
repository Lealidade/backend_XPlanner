export function toWebHeaders(headers: Record<string, any>): Headers {
    const h = new Headers();

    for (const [key, value] of Object.entries(headers)) {
        if (typeof value === "string") {
            h.append(key, value);
        } else if (Array.isArray(value)) {
            value.forEach((v) => h.append(key, v));
        }
    }

    return h;
}
