export function encodeToHexWithSpace(body: object): string {
    return JSON.stringify(body)
        .split('')
        .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(' ');
}

export async function generateRequestSignature(body: object, token: string) {
    if (!token) {
        throw new Error("Token (API key) is missing in generateRequestSignature");
    }

    const timestamp = Date.now().toString();
    const bodyString = JSON.stringify(body);
    const dataToSign = bodyString ? `${timestamp}:${bodyString}:${token}` : `${timestamp}:${token}`;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(token);
    const data = encoder.encode(dataToSign);

    const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
    const signature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

    return {
        timestamp,
        signature,
        headers: {
            "x-timestamp": timestamp,
            "x-signature": signature,
            "x-api-key": token,
        },
    };
}
