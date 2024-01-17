chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // Handling toggle conversion
    if (request.toggle !== undefined) {
        let timingsElements = document.querySelectorAll('.subframe.timings .value');
        timingsElements.forEach(element => {
            if (request.toggle) { // Convert to microseconds
                if (!element.textContent.includes('μs')) { // Check if not already in microseconds
                    let msString = element.textContent.replace('ms', '');
                    element.textContent = convertToMicroseconds(msString);
                }
            } else { // Convert back to milliseconds
                if (element.textContent.includes('μs')) { // Check if in microseconds
                    let usString = element.textContent.replace('μs', '');
                    element.textContent = convertToMilliseconds(usString);
                }
            }
        });
    }

    // Handling camera data
    if (request.cameras) {
        applyCameraSettings(request.cameras);
    }

    if (request.getMaxSliceNumber) {
        sendMaxSliceNumber();
    }
});

// Convert milliseconds to microseconds
function convertToMicroseconds(msString) {
    let msValue = parseFloat(msString);
    return (msValue * 1000).toFixed(3) + 'μs';
}

// Convert microseconds to milliseconds
function convertToMilliseconds(usString) {
    let usValue = parseFloat(usString);
    return (usValue / 1000).toFixed(3) + 'ms';
}

// Apply camera settings based on the provided data
function applyCameraSettings(cameras) {
    // Clear existing custom styles
    document.querySelectorAll('.sequencer .track th.slice').forEach(th => {
        th.style.backgroundColor = ''; // Reset the background color
    });

    // Apply new styles based on camera data
    cameras.forEach(camera => {
        if (camera.targetFirstSlice && camera.shutterAngle && camera.color) {
            const maxSlices = document.querySelectorAll('.sequencer .track th.slice').length;
            const slicesToColor = Math.round((parseInt(camera.shutterAngle) / 360) * maxSlices);
            let targetSlice = parseInt(camera.targetFirstSlice);

            for (let i = 0; i < slicesToColor; i++) {
                // Calculate the slice number considering wrap-around
                let sliceNumber = targetSlice - i;
                if (sliceNumber < 1) {
                    sliceNumber += maxSlices;
                }

                // Apply color to the calculated slice
                const sliceElement = document.querySelector(`.sequencer .track th.slice:nth-child(${sliceNumber + 1})`); // +4 for offset
                if (sliceElement) {
                    sliceElement.style.backgroundColor = camera.color;
                }
            }
        }
    });
}

// Function to get and store the largest slice number
function updateMaxSliceCount() {
    const sliceElements = document.querySelectorAll('.sequencer .track th.slice');
    if (sliceElements.length > 0) {
        const lastSliceElement = sliceElements[sliceElements.length - 1];
        const content = lastSliceElement.textContent.trim();
        const match = content.match(/\d+$/);
        if (match) {
            const maxSliceNumber = parseInt(match[0]);
            console.log("Max slice number:", maxSliceNumber);
            chrome.storage.local.set({ 'maxSliceNumber': maxSliceNumber });
        } else {
            console.error("No slice number found");
        }
    }
}

// Observe changes in the DOM
const targetNode = document.querySelector('.sequencer .track');
if (targetNode) {
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            updateMaxSliceCount();
        });
    });

    // Configuration of the observer
    const config = { childList: true, subtree: true };

    // Start observing
    observer.observe(targetNode, config);
}

// Call updateMaxSliceCount on window load
window.addEventListener('load', function () {
    setTimeout(updateMaxSliceCount, 500); // Delay to ensure full page load
});

// Apply camera settings on page load
chrome.storage.local.get(['cameras'], function (result) {
    if (result.cameras) {
        applyCameraSettings(result.cameras);
    }
});


function setupWebSocketConnection(ipAddress, camera) {
    const ws = new WebSocket(`ws://${ipAddress}:9998`);
    ws.onopen = () => {
        console.log("Connected to RED Komodo camera");
        // Update connection status in the popup
        // Send initial commands or requests if needed
    };
    ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
    };
    ws.onmessage = (event) => {
        // Handle incoming messages from the camera
    };
    ws.onclose = () => {
        console.log("Connection closed");
        // Handle connection closure
    };

    return ws;
}
