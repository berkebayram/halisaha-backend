const { MatchLinker } = require("../models");


const handleGetLink = async (req, res) => {
    try {
        const id = req.params.id ?? req.query.id ?? req.query.Id;
        const found = await MatchLinker.findById(id);
        if (!found)
            return res.status(404).json({ message: "Not Found" });
        if (found.used)
            return res.status(402).json({ message: "Link already has been used" });
        const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.example.halisaha';
        const deepLink = `com.example.halisaha://invite?link=${encodeURIComponent(id)}&matchId=${encodeURIComponent(found.matchId)}&positionId=${encodeURIComponent(found.positionId)}`;
        return res.type('html').send(`
    <!DOCTYPE html>
    <html lang="tr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Halı Saha Daveti</title>
        <script>
          // Kullanıcı mobildeyse deep linki dene
          window.onload = function() {
            const start = Date.now();
            window.location = '${deepLink}';
            // Eğer 2 saniye içinde uygulama açılmazsa play store'a yönlendir
            setTimeout(() => {
              if (Date.now() - start < 2200) {
                window.location = '${playStoreUrl}';
              }
            }, 1500);
          };
        </script>
      </head>
      <body style="font-family:sans-serif;text-align:center;padding:2rem">
        <h1>Halı Saha Daveti Yükleniyor...</h1>
        <p>Eğer uygulama açılmadıysa <a href="${playStoreUrl}">buraya tıklayarak yükleyebilirsin</a>.</p>
      </body>
    </html>
  `);
    }
    catch (err) {
        console.log(`Err on match kick: ${err.message}`);
        return res.status(400).json({ message: "Bad Request" });
    }
}

const serveApplicationJson = async (req, res) => {
    return res.json([[
        {
            "relation": [
                "delegate_permission/common.handle_all_urls"
            ],
            "target": {
                "namespace": "android_app",
                "package_name": "com.example.halisaha",
                "sha256_cert_fingerprints": [
                    "4B:BB:1E:A8:C4:A5:B9:E5:92:FF:F0:0E:BF:B8:9C:24:18:E5:E6:F8:1C:19:16:72:7E:62:5E:9F:EF:A3:AF:85"
                ]
            }
        }
    ]]);
}

module.exports = {
    handleGetLink,
    serveApplicationJson
}
