document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('toggleConversion');

    // Load the saved state of the toggle switch
    chrome.storage.local.get(['toggleState'], function (result) {
        if (result.toggleState !== undefined) {
            toggleSwitch.checked = result.toggleState;
        }
    });

    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', function (event) {
            // Save the state of the toggle switch
            chrome.storage.local.set({ 'toggleState': event.target.checked });

            // Send the state to content.js
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { toggle: event.target.checked });
            });
        });
    }


    // Load cameras on popup open
    loadCameras();

    // Event listener for adding cameras
    document.getElementById('addCamera').addEventListener('click', function () {
        addCameraLine();
    });

    // Request max slice number from content.js
    /* chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {getMaxSliceNumber: true});
    });
 */
    // Load max slice number on popup open
    chrome.storage.local.get(['maxSliceNumber'], function (result) {
        if (result.maxSliceNumber !== undefined) {
            console.log("Max Slice Number:", result.maxSliceNumber);
            document.getElementById('maxSliceCount').textContent = result.maxSliceNumber; // Update DOM element
            updateMaxSliceInputs(result.maxSliceNumber); // Update max attribute of target slice inputs
            updateOptimalShutterAngles(result.maxSliceNumber); // Update optimal shutter angles

        }
    });


    // Event listener for target slices input changes in each camera line
    document.getElementById('cameraList').addEventListener('change', function (event) {
        if (event.target.classList.contains('targetSlices')) {
            const maxSliceNumber = parseInt(document.getElementById('maxSliceCount').textContent);
            updateOptimalShutterAngleForInput(event.target, maxSliceNumber);
        }
    });


});



function updateMaxSliceInputs(maxSliceNumber) {
    document.querySelectorAll('.targetFirstSlice').forEach(input => {
        input.max = maxSliceNumber;
        // Update validation for each input
        validateSliceInput(input, maxSliceNumber);
    });
}


function addCameraLine(camera = {}) {
    const template = document.getElementById('cameraTemplate').content.cloneNode(true);
    const cameraLine = template.querySelector('.cameraLine');

    // Set values if passed
    const nameInput = cameraLine.querySelector('input[type=text]');
    const targetFirstSliceInput = cameraLine.querySelector('.targetFirstSlice');
    // Attach validation to the input
    validateSliceInput(targetFirstSliceInput, parseInt(document.getElementById('maxSliceCount').textContent));

    const targetSlicesInput = cameraLine.querySelector('.targetSlices');
    const colorInput = cameraLine.querySelector('.cameraColor');
    const ipInput = cameraLine.querySelector('.ipAddress');
    const sensorShiftOffsetInput = cameraLine.querySelector('.sensorShiftOffset');

    //load input values or set to defaults
    nameInput.value = camera.name || '';
    targetFirstSliceInput.value = camera.targetFirstSlice || '';
    targetSlicesInput.value = camera.targetSlices || '';
    colorInput.value = camera.color || '#ff0000';
    ipInput.value = camera.ip || '';
    sensorShiftOffsetInput.value = camera.sensorShiftOffset || '';


    // Add change event listeners to update data whenever any input changes
    [nameInput, targetFirstSliceInput, targetSlicesInput, colorInput, ipInput, sensorShiftOffsetInput].forEach(input => {
        input.addEventListener('change', saveCameras);
    });

    template.querySelector('.deleteCamera').addEventListener('click', function (event) {
        // Retrieve camera IP and close WebSocket if connected
        const cameraLine = event.target.parentElement;
        const ip = cameraLine.querySelector('.ipAddress').value;
        if (ip) {
            // Send a message to background.js to close the WebSocket connection
            chrome.runtime.sendMessage({ type: 'disconnectWebSocket', ip: ip });
        }
        event.target.parentElement.remove();
        saveCameras();
    });

    // Find the RED Komodo Checkbox and Fields in the newly created camera line
    const redKomodoCheckbox = cameraLine.querySelector('.redKomodoCheckbox');
    const redKomodoFields = cameraLine.querySelector('.redKomodoFields');

    // Set checkbox state based on stored value
    redKomodoCheckbox.checked = camera.redKomodoEnabled || false;
    redKomodoFields.style.display = camera.redKomodoEnabled ? 'block' : 'none';

    // Attach event listener to the checkbox
    redKomodoCheckbox.addEventListener('change', function () {
        redKomodoFields.style.display = this.checked ? 'block' : 'none';
        saveCameras(); // Save changes when checkbox state changes
    });

    // Set up the WebSocket toggle switch
    const wsToggle = cameraLine.querySelector('.wsToggle');
    wsToggle.checked = camera.wsConnected || false;

    // Event listener for WebSocket toggle
    wsToggle.addEventListener('change', function () {
        const ip = cameraLine.querySelector('.ipAddress').value;
        // Check if IP is defined and valid before sending
        if (ip) {
            const messageType = this.checked ? 'connectWebSocket' : 'disconnectWebSocket';
            chrome.runtime.sendMessage({ type: messageType, ip: ip });
        } else {
            console.error('IP address is undefined or invalid');
        }
    });

    targetSlicesInput.addEventListener('change', function () {
        updateRequiredOffsetForCamera(cameraLine);
    });
    targetFirstSliceInput.addEventListener('change', function () {
        updateRequiredOffsetForCamera(cameraLine);
    });
    updateRequiredOffsetForCamera(cameraLine); // Initial update

    document.getElementById('cameraList').appendChild(template);
    saveCameras();
}

function saveCameras() {
    let cameras = [];
    document.querySelectorAll('.cameraLine').forEach((line, index) => {
        let camera = {
            name: line.querySelector('input[type=text]').value,
            targetFirstSlice: line.querySelector('.targetFirstSlice').value,
            targetSlices: line.querySelector('.targetSlices').value,
            color: line.querySelector('.cameraColor').value,
            redKomodoEnabled: line.querySelector('.redKomodoCheckbox').checked,
            ip: line.querySelector('.ipAddress').value,
            sensorShiftOffset: line.querySelector('.sensorShiftOffset').value,
            wsConnected: line.querySelector('.wsToggle').checked
        };
        cameras.push(camera);
    });

    chrome.storage.local.set({ 'cameras': cameras });
    console.log('Sending camera data:', cameras); // Check the data before sending

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { cameras: cameras });
    });
    // Send data to background script
    chrome.runtime.sendMessage({ type: 'updateCameras', cameras: cameras });

}


function loadCameras() {
    chrome.storage.local.get(['cameras'], function (result) {
        if (result.cameras && result.cameras.length > 0) {
            result.cameras.forEach(camera => addCameraLine(camera));
        }
    });
    saveCameras();
}

function validateSliceInput(inputElement, maxSliceNumber) {
    inputElement.addEventListener('input', function () {
        const currentValue = parseInt(inputElement.value);
        if (currentValue > maxSliceNumber) {
            inputElement.value = maxSliceNumber; // Reset to max if exceeded
            // Optionally, display an error message to the user
        }
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'connectionStatus') {
        console.log(`Camera at ${request.ip} is ${request.status}`);
        // Update the UI in popup.html to reflect the connection status
        updateConnectionStatusUI(request.ip, request.status);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get(['slicePeriod', 'framePeriod'], function (result) {
        if (result.slicePeriod && result.framePeriod) {
            document.getElementById('slicePeriod').textContent = result.slicePeriod;
            document.getElementById('framePeriod').textContent = result.framePeriod;
        }
    });
});



function updateConnectionStatusUI(ip, status) {
    // Implement logic to update the connection status indicator in the popup UI
}

function calculateOptimalShutterAngle(targetSlices, maxSlices) {
    // Calculate the optimal shutter angle
    return (targetSlices / maxSlices) * 360;
}

function updateOptimalShutterAngles(maxSliceNumber) {
    document.querySelectorAll('.cameraLine').forEach(cameraLine => {
        const targetSlicesInput = cameraLine.querySelector('.targetSlices');
        updateOptimalShutterAngleForInput(targetSlicesInput, maxSliceNumber);
    });
}

function updateOptimalShutterAngleForInput(inputElement, maxSliceNumber) {
    const targetSlices = parseInt(inputElement.value);
    const optimalShutterAngle = calculateOptimalShutterAngle(targetSlices, maxSliceNumber);

    // Navigate up to the common parent of both inputs, then find the .optimalShutterAngle input
    const parentElement = inputElement.closest('.cameraLine');
    const optimalShutterAngleInput = parentElement.querySelector('.optimalShutterAngle');

    if (optimalShutterAngleInput) {
        optimalShutterAngleInput.value = optimalShutterAngle.toFixed(2) + '°';
    }
    
    const cameraName = parentElement.querySelector('.cameraName').value;
    const ip = parentElement.querySelector('.ipAddress').value;
    sendOptimalShutterAngle(cameraName, optimalShutterAngle.toFixed(2),ip);

}

function sendOptimalShutterAngle(cameraName, optimalShutterAngle,ip) {
    chrome.runtime.sendMessage({
        type: 'optimalShutterAngle',
        cameraName: cameraName,
        optimalShutterAngle: optimalShutterAngle,
        ip:ip
    });
}


function updateRequiredOffsetForCamera(cameraLine) {
    const targetSlicesInput = cameraLine.querySelector('.targetSlices');
    const targetFirstSliceInput = cameraLine.querySelector('.targetFirstSlice');
    const requiredOffsetInput = cameraLine.querySelector('.requiredOffset');
    const slicePeriod = parseFloat(document.getElementById('slicePeriod').textContent.replace('ms', ''));

    if (targetSlicesInput && targetFirstSliceInput && requiredOffsetInput && !isNaN(slicePeriod)) {
        const targetSlices = parseInt(targetSlicesInput.value) || 0;
        const firstTargetSlice = parseInt(targetFirstSliceInput.value) || 0;
        const requiredOffset = firstTargetSlice * slicePeriod;
        requiredOffsetInput.value = requiredOffset.toFixed(3) + ' ms';
        const ip = cameraLine.querySelector('.ipAddress').value;

        //send to background
        if (ip) {
        chrome.runtime.sendMessage({
            type: 'calculateSensorSyncShift',
            requiredOffsetMs: requiredOffset, // The calculated offset in milliseconds
            ip: ip // include the IP address
        });
    } else {
        console.error('IP address is undefined or invalid for required offset calculation');
    }
    }
}

