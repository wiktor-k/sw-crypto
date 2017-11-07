async function fetchAndDecrypt(url) {
    const response = await fetch(url);
    if (url.includes('#')) {
        // Decrypts only 48 byte fragments, for other variants see:
        // https://github.com/siacs/Conversations/blob/22c37bd43086796bcaa6b35d1495e2806889186b/src/main/java/eu/siacs/conversations/entities/DownloadableFile.java#L51
        const fragment = url.substring(url.indexOf('#') + 1).match(/.{2}/g).map(part => parseInt(part, 16));
        const key = await crypto.subtle.importKey(
            'raw',
            new Uint8Array(fragment.slice(16)),
            {
                name: 'AES-GCM',
            },
            false,
            ['decrypt']
        );
        const decrypted = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: new Uint8Array(fragment.slice(0, 16)),
            },
            key,
            await response.arrayBuffer()
        );
        return new Response(decrypted, {
            headers: response.headers
        });
    }
    return response;
}

self.onfetch = function(event) {
    event.respondWith(fetchAndDecrypt(event.request.url));
};
