exports.handler = function(event, context, callback) {

    var params = new URLSearchParams(event.queryStringParameters);

    var https = require("https");

    if(!process.env.COUNT_TOKEN) {
        callback(null, {
            statusCode: 302,
            body: "",
            headers: {
                "Location": "https://counter.clh.sh/counter.php?" + params.toString()
            }
        });
        return;
    }

    var clientIp =  (event.headers["x-forwarded-for"] || event.headers["client-ip"]).split(",")[0].trim();

    var ipv4Regex = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(clientIp);
    if(ipv4Regex != null) clientIp = ipv4Regex[1];

    var path = "/counter.php?" + params.toString() + "&token_auth=" + process.env.COUNT_TOKEN + "&cip=" + clientIp;

    var clientIp =  (event.headers["x-forwarded-for"] || event.headers["client-ip"]).split(",")[0].trim();

    var ipv4Regex = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(clientIp);
    if(ipv4Regex != null) clientIp = ipv4Regex[1];

    var path = "/counter.php?" + params.toString() + "&token_auth=" + process.env.COUNT_TOKEN + "&cip=" + clientIp;
    
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