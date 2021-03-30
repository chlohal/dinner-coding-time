exports.handler = function(event, context, callback) {

    var params = new URLSearchParams(event.queryStringParameters);

    var https = require("https");

    console.log("TOKEN SUBSTR: " +process.env.COUNT_TOKEN.substring(0, 4));

    var path = "/counter.php?" + params.toString() + "&token_auth=" + process.env.COUNT_TOKEN + "&cip=" + event.headers["client-ip"];

    const options = {
        hostname: "counter.clh.sh",
        path: path,
        method: 'GET',
        headers: {
            "user-agent": event.headers["user-agent"]
        }
    };

    var req = https.request(options, function (res) {
        res.setEncoding("utf8");

        var body = "";

        res.on("data", function (chunk) {
            body += chunk;
        });
        res.on("close", function() {
            console.log(res.statusCode, body);
            callback(null, {
                statusCode: 200,
                body: "done",
                headers: {"Content-Type": "text/plain"}
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

    req.end("");
}