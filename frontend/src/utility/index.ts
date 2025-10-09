export function encodeToHexWithSpace(body: object): string {
    return JSON.stringify(body)
        .split('')
        .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(' ');
}

export async function generateRequestSignature(body: object, token: string) {
    const timestamp = Date.now().toString();
    const bodyString = JSON.stringify(body);
    const dataToSign = `${timestamp}:${bodyString}:${token}`;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(token);
    const data = encoder.encode(dataToSign);

    return crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
        .then(key => crypto.subtle.sign("HMAC", key, data))
        .then(signatureBuffer => {
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
        });
}
