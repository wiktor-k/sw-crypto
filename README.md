# Service Worker auto decryptor

Decrypts AES-GCM encrypted files using keys embedded in URL fragments.

This kind of URLs is generated by [Conversations][CONV] when uploading files
in encrypted chat sessions.

Putting this Service Worker on HTTP Upload host allows users to open encrypted
files in their browsers without transmitting encryption keys.

[CONV]: https://github.com/siacs/Conversations

## Running

Start a server:

    python -m SimpleHTTPServer

Go to root page:

    http://localhost:8000

This will register Service Worker and allow decrypting files, such as this one:

    http://localhost:8000/leaf-veins.jpg#492fc2ba53dd27a4f4a6a250310609f0c6c82267073eb9967390796a2d770e0a89d3f95c650d1f533e60b7e51a96cacf

## Installing Service Worker

Service worker is installed only on explicit call from JavaScript or when a Link header is inserted in response headers:

    Link: </worker.js>; rel="serviceworker"; scope="/"

To check this version use:

    python server.py

Unfortunately the initial request will not be processed by the Worker so the first file will not be decrypted.

See [A header-based SW installation][SWH] for more details.

[SWH]: https://github.com/w3c/ServiceWorker/issues/685
