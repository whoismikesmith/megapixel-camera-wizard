let cameraConnections = {};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.type) {
        case 'connectWebSocket':
            connectWebSocket(request.ip);
            break;
        case 'disconnectWebSocket':
            disconnectWebSocket(request.ip);
            break;
    }
});

function connectWebSocket(ip) {
    if (cameraConnections[ip]) {
        console.log(`WebSocket already connected to ${ip}`);
        return;
    }

    let ws = new WebSocket(`ws://${ip}:9998`);
    cameraConnections[ip] = ws;

    ws.onopen = function () {
        console.log(`WebSocket connected to ${ip}`);
        sendRcpConfig(ws);
        sendRcpGetRequests(ws);
        chrome.runtime.sendMessage({ type: 'connectionStatus', ip: ip, status: 'connected' });
    };

    ws.onerror = function (error) {
        console.log(`Connection error with ${ip}:`, error);
        chrome.runtime.sendMessage({ type: 'connectionStatus', ip: ip, status: 'error' });
    };

    ws.onmessage = function (message) {
        //console.log(`Message from ${ip}:`, message.data);
        // Parse the message and log the data
        try {
            const data = JSON.parse(message.data);
            if (data.type === "rcp_cur_int_edit_info" || data.type === "rcp_cur_int") {
                switch (data.id) {
                    case "SENSOR_SYNC_OFFSET_PIXELS":
                        if (data.cur !== undefined) {
                            const offsetPixels = typeof data.cur === 'object' ? data.cur.val : data.cur;
                            console.log(`SENSOR_SYNC_OFFSET_PIXELS: ${offsetPixels}`);
                        }
                        break;
                    case "SENSOR_SYNC_OFFSET_UNIT_PICO_SECONDS":
                        if (data.cur?.val !== undefined) {
                            console.log(`SENSOR_SYNC_OFFSET_UNIT_PICO_SECONDS: ${data.cur.val}`);
                        }
                        break;
                    case "EXPOSURE_ANGLE":
                        if (data.cur !== undefined) {
                            const exposureAngle = typeof data.cur === 'object' ? data.cur.val : data.cur;
                            console.log(`EXPOSURE_ANGLE: ${exposureAngle}`);
                        }
                        break;
                }
            }
        } catch (error) {
            console.error(`Error parsing WebSocket message from ${ip}:`, error);
        }
    };

    ws.onclose = function () {
        console.log(`WebSocket closed with ${ip}`);
        delete cameraConnections[ip];
        chrome.runtime.sendMessage({ type: 'connectionStatus', ip: ip, status: 'disconnected' });
    };
}

function disconnectWebSocket(ip) {
    if (cameraConnections[ip]) {
        console.log(`Disconnecting WebSocket from ${ip}`);
        cameraConnections[ip].close();
        delete cameraConnections[ip];
    }
}


function sendRcpConfig(ws) {
    const rcpConfig = {
        "type": "rcp_config",
        "strings_decoded": 0,
        "json_minified": 1,
        "include_cacheable_flags": 0,
        "encoding_type": "legacy",
        "client": {
            "name": "My Awesome Control App",
            "version": "1.42"
        }
    };

    const rcpGetTypes = {
        "type": "rcp_get_types",
        // Add other necessary fields as per the documentation
    };

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(rcpConfig));
        console.log("rcp_config sent to camera");

        ws.send(JSON.stringify(rcpGetTypes));
        console.log("rcp_get_types sent to camera");
    }
}

function sendRcpGetRequests(ws) {
    const rcpGetParams = [
        "RCP_PARAM_SENSOR_SYNC_OFFSET_PIXELS",
        "RCP_PARAM_SENSOR_SYNC_OFFSET_UNIT_PICO_SECONDS",
        "RCP_PARAM_EXPOSURE_ANGLE"
    ];

    rcpGetParams.forEach(param => {
        const rcpGet = {
            "type": "rcp_get",
            "id": param
        };

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(rcpGet));
            console.log(`rcp_get request sent for ${param}`);
        }
    });
}
