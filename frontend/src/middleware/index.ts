export function encodeToHexWithSpace(text: unknown): string {
    return JSON.stringify(text)
        .split('')
        .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(' ');
}