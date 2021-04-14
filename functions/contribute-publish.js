exports.handler = function (event, context, callback) {
    var https = require("https");
    
    (function() {
        var body = event.body || "";
        
        send({
            hostname: "script.google.com",
            path: "/macros/s/AKfycby2Jm3wkMpqD5FKupwJgTKsrnpj8tCOKZjHlMCLJBqO2SkBtlMyyAfPtuBtSpciD1FA3g/exec" + (body ? "" : "?htmls=true"),
            method: body ? "POST" : "GET",
            headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body), "Host": "script.google.com", "Transfer-Encoding": "identity" },
        }, body, function(err, resBody, res) {
            if(err) callback(null, {
                statusCode: 500,
                body: "err",
                headers: {"Content-Type": "text/plain"}
            });
            else callback(null, {
                statusCode: res.statusCode,
                body: resBody,
                headers: {"Content-Type": res.headers["content-type"]}
            });
        });
        
    })();

    function send(options, body, cb) {
    
        var req = https.request(options, function (res) {
            res.setEncoding("utf8");
    
            var resBody = "";
    
            res.on("data", function (chunk) {
                resBody += chunk;
            });
            res.on("close", function() {
                console.log(res.statusCode);
                console.log(res.headers);
                if(res.headers.location) {
                    var newOptions = {};
                    Object.assign(newOptions, options);
                    
                    var url = new URL(res.headers.location);
                    newOptions.hostname = url.hostname;
                    newOptions.path = url.pathname;
                    if(url.search) newOptions.path += url.search;
                    newOptions.method = "GET";
                    
                    newOptions.headers = { "Host": url.hostname };
                    
                    send(newOptions, "", cb);
                } else {
                    cb(false, resBody, res);
                }
            });
        });
    
        req.on("error", function(err) {
            console.log(err);
            cb(true);
        });
    
        req.end(body);
    }

}