exports.handler = function (event, context, callback) {
    var body = event.body;
    
    console.log(body);


    var https = require("https");

    const options = {
        hostname: "api.jsonbin.it",
        path: "/bins/",
        method: 'POST',
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
    }
    
    console.log(options);

    var req = https.request(options, function (res) {
        res.setEncoding("utf8");

        var resBody = "";

        res.on("data", function (chunk) {
            resBody += chunk;
        });
        res.on("close", function() {
            console.log("res.statusCode", res.statusCode, resBody);
            callback(null, {
                statusCode: res.statusCode,
                body: resBody,
                headers: {"Content-Type": "application/javascript"}
            });
        });
    });

    req.on("error", function(err) {
        console.log(err);
        callback(null, {
            statusCode: 500,
            body: err.message,
            headers: {"Content-Type": "text/plain"}
        });
    });

    req.end(body);
}