importScripts("lightweight-java-highlighter.js");

onmessage = (event) => {
    var data = event.data;
    if (data.function == "highlightAuto") {
        var result = lexJava(data.args[0]);
        postMessage({
            nonce: data.nonce,
            data: result
        });
    } else if(data.function == "getLineAddresses") {
        postMessage({
            nonce: data.nonce,
            data: getLineAddresses(data.args[0])
        });
    }
  };

