let cameraData = [];
let projectHz = null;
let projectMaxSlices = null;
let slicePeriod = null;
let framePeriod = null;

// Function to inject your HTML content
function injectHTML() {
    const targetElement = document.querySelector('div.sidebar');
    if (targetElement && !document.querySelector('div.injectedCw')) {
        const newContent = document.createElement('div');
        newContent.className = "injectedCw";
        newContent.innerHTML = `
            <div class="el-collapse-item__content">
            <section>
            <form class="el-form el-form--label-top">
                <div class="el-form-item el-form-item--mini">
                    <div class="el-form-item__content">
                        Camera Wizard
                    </div>
                </div>
                <table class="periods">
                    <tbody>
                    <tr class="frameRate">
                    <td >
                        <label class="small square red"></label>
                    </td>
                    <td class="label">Video Frame Rate</td>
                    <td class="value">loading...</td>
                </tr>
                        <tr class="sliceCount">
                            <td >
                                <label class="small square green"></label>
                            </td>
                            <td class="label">Max Slice Count</td>
                            <td class="value">loading...</td>
                        </tr>
                        <tr class="slicePeriod">
                            <td >
                                <label class="small square orange"></label>
                            </td>
                            <td class="label">Slice Period</td>
                            <td class="value">loading...</td>
                        </tr>
                        <tr class="framePeriod">
                            <td >
                                <label class="small square yellow"></label>
                            </td>
                            <td class="label">Frame Period</td>
                            <td class="value">loading...</td>
                        </tr>
                    </tbody>
                </table>
                <div class="el-divider el-divider--horizontal" role="separator" style="--el-border-style: solid;"></div>
                <!-- add a camera button -->
                <button type="button" class="el-button el-button--primary el-button--mini add-a-camera">
                    <span class>Add a Camera</span>
                </button>
                <div class="cameraList">
                </div>
                <template class="cameraTemplate">
                
                <div class="cameraItem">
                <button type="button" class="cameraToggleButton el-button el-button--success el-button--mini">Toggle Camera Details</button> 
                <div class="cameraDetails">
                <!-- camera name -->
                <div class="flex fields">
                    <div class="el-form-item el-form-item--mini">
                        <label class="el-form-item__label">Camera Name</label>
                        <div class="el-form-item__content">
                            <div class="is-controls-right" id="cameraName">
                                    <div class="el-input el-input--mini">
                                        <input type="text" autocomplete="off" class="el-input__inner" role="spinbutton" aria-valuemax="10000" aria-valuemin="-10000" aria-valuenow="0" aria-disabled="false">
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div class="el-form-item el-form-item--mini">
                        <label class="el-form-item__label">GUI Color</label>
                        <div class="el-form-item__content">
                            <div class="is-controls-right" id="guiColor">
                                    <div class="el-input el-input--mini">
                                        <input type="color" style="width: 75px;" class="el-input__inner" role="spinbutton" aria-valuemax="10000" aria-valuemin="-10000" aria-valuenow="0" aria-disabled="false">
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- slice fields -->
                <div class="flex fields">
                    <div class="el-form-item el-form-item--mini">
                        <label class="el-form-item__label">Last Target Slice</label>
                        <div class="el-form-item__content">
                            <div class="is-controls-right" id="lastTargetSlice">
                                    <div class="el-input el-input--mini">
                                        <input type="number" autocomplete="off" class="el-input__inner" role="spinbutton" aria-valuemax="10000" aria-valuemin="-10000" aria-valuenow="0" aria-disabled="false">
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div class="el-form-item el-form-item--mini">
                        <label class="el-form-item__label">Target Slice Count</label>
                        <div class="el-form-item__content">
                            <div class="is-controls-right" id="targetSliceCount">
                                    <div class="el-input el-input--mini">
                                        <input type="number" autocomplete="off" class="el-input__inner" role="spinbutton" aria-valuemax="10000" aria-valuemin="-10000" aria-valuenow="0" aria-disabled="false">
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- offsets fields -->
                <div class="flex fields">
                    <div class="el-form-item el-form-item--mini">
                        <label class="el-form-item__label">Required Offsets</label>
                        <div class="el-form-item__content">
                            <div class="is-controls-right" id="requiredOffset">
                                    <div class="el-input el-input--mini">
                                        <input type="text" autocomplete="off" class="el-input__inner" role="spinbutton" aria-valuemax="10000" aria-valuemin="-10000" aria-valuenow="0" aria-disabled="false" readonly>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div class="el-form-item el-form-item--mini">
                        <label class="el-form-item__label">Optimal Shutter Angle</label>
                        <div class="el-form-item__content">
                            <div class="is-controls-right" id="optimalShutterAngle">
                                    <div class="el-input el-input--mini">
                                        <input type="number" autocomplete="off" class="el-input__inner" role="spinbutton" aria-valuemax="10000" aria-valuemin="-10000" aria-valuenow="0" aria-disabled="false" readonly>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- side by side inputs -->
                <div class="flex fields">
                    <div class="el-form-item el-form-item--mini">
                        <label class="el-form-item__label">IP Address</label>
                        <div class="el-form-item__content">
                            <div class="is-controls-right" id="ipAddress">
                                    <div class="el-input el-input--mini">
                                        <input type="text" autocomplete="off" class="el-input__inner" role="spinbutton" aria-valuemax="10000" aria-valuemin="-10000" aria-valuenow="0" aria-disabled="false" placeholder="0.0.0.0">
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="syncOffsetSelection">
                <label class="el-form-item__label">Genlock Offset Type</label>
                    <select class="offsetTypeDropdown">
                        <option value="red">RED Sensor Offset</option>
                        <option value="evertz">Evertz Clock Offset</option>
                    </select>
                </div>

                <div class="redOffsetFields">
                    <div class="flex fields">
                        <div class="el-form-item el-form-item--mini">
                            <label class="el-form-item__label">Sensor Shift</label>
                            <div class="el-form-item__content">
                                <div class="is-controls-right" id="redSensorShift">
                                        <div class="el-input el-input--mini">
                                            <input type="text" autocomplete="off" class="el-input__inner" role="spinbutton" aria-valuemax="10000" aria-valuemin="-10000" aria-valuenow="0" aria-disabled="false" readonly>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="enable row">
                        <input id="redRcpEnable" type="checkbox">
                        <label for="redRcpEnable">Enable RED RCP</label>
                    </div>
                </div>

                <div class="evertzOffsetFields" style="display: none;">
                    <div class="flex fields">
                        <div class="el-form-item el-form-item--mini">
                            <label class="el-form-item__label">Mode</label>
                            <div class="el-form-item__content">
                                <div class="is-controls-right" id="evertzMode">
                                    <select class="modeDropdown">
                                        <option value="1080p@24">1080p @ 24</option>
                                        <option value="1080p@30">1080p @ 30</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex fields">
                        <div class="el-form-item el-form-item--mini">
                            <label class="el-form-item__label">Horizontal Lines</label>
                            <div class="el-form-item__content">
                                <div class="is-controls-right" id="evertzHorizontalLines">
                                        <div class="el-input el-input--mini">
                                            <input type="number" autocomplete="off" class="el-input__inner" role="spinbutton" aria-valuemax="10000" aria-valuemin="0" aria-valuenow="0" aria-disabled="false" readonly>
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div class="el-form-item el-form-item--mini">
                            <label class="el-form-item__label">Vertical Lines</label>
                            <div class="el-form-item__content">
                                <div class="is-controls-right" id="redSensorShift">
                                        <div class="el-input el-input--mini">
                                            <input type="number" autocomplete="off" class="el-input__inner" role="spinbutton" aria-valuemax="10000" aria-valuemin="0" aria-valuenow="0" aria-disabled="false" readonly>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- delete a camera button -->
                <button type="button" class="el-button el-button--danger el-button--mini delete-a-camera">
                    <span class>Delete</span>
                </button>
                </div> <!-- details -->
                </div>
                </template>
            </form>
            </section>
            </div>
        `;
        targetElement.appendChild(newContent);
    }

    // Add event listener to 'Add a Camera' button
    const addButton = document.querySelector('button.add-a-camera');
    if (addButton) {
        addButton.addEventListener('click', addCameraItem);
    }
}

// Initial injection
injectHTML();

// Add a camera
function addCameraItem() {
    console.log("attempting to add camera");
    const template = document.querySelector('.cameraTemplate').content.cloneNode(true);
    const newCamera = template.querySelector('div.cameraItem');
    const newCameraId = `camera-${cameraData.length}`;
    newCamera.id = newCameraId;

    // Default camera name
    const cameraName = `Camera ${cameraData.length + 1}`;

    // Set camera name in the input field
    const nameInput = newCamera.querySelector('input[type="text"]');
    nameInput.value = cameraName;

    // Update the toggle button text
    const toggleButton = newCamera.querySelector('.cameraToggleButton');
    toggleButton.textContent = `Toggle ${cameraName} Details`;

    // Attach event listener to 'Delete' button
    const deleteButton = newCamera.querySelector('button.delete-a-camera');
   
    deleteButton.addEventListener('click', function() {
        // Code to remove the camera from the cameras array
        deleteCameraItem(newCameraId)
        
    });

    document.querySelector('div.cameraList').appendChild(newCamera);

    // Add new camera data to array
    cameraData.push({ id: newCameraId, name: cameraName, data: {} }); // Update with actual data
}

// Delete a Camera
function deleteCameraItem(cameraId) {
    const cameraElement = document.getElementById(cameraId);
    if (cameraElement) {
        // cleanup websocket connection
        const ipAddress = cameraElement.querySelector('#ipAddress .el-input__inner').value;
        const isConnected = cameraElement.querySelector('#redRcpEnable').checked;

        // Disconnect WebSocket if connected
        if (isConnected && ipAddress) {
            chrome.runtime.sendMessage({ type: 'disconnectWebSocket', ip: ipAddress });
        }
        cameraElement.remove();
    }
    // Remove camera data from array
    cameraData = cameraData.filter(camera => camera.id !== cameraId);
    // Reapply camera settings to reset the highlighting
    saveCameras();
    applyCameraSettings(cameras);
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
            projectMaxSlices = maxSliceNumber;
            console.log("inject Max slice number:", projectMaxSlices);
            chrome.storage.local.set({ 'maxSliceNumber': projectMaxSlices });
        } else {
            console.error("No slice number found");
        }
    }
}




// Observer callback to re-inject HTML when necessary
function observerCallback(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
            injectHTML();
            if (checkAndExtractHzValue()) {
                updatePeriods(projectHz, projectMaxSlices)
                updateTableValues(projectHz, projectMaxSlices, slicePeriod, framePeriod);
                //obs.disconnect(); // Stop observing once the content is found
            }
        }
    }
}

// Set up the Mutation Observer
const observer = new MutationObserver(observerCallback);

// Define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document.body, { childList: true, subtree: true });


// Observe changes squencer track to update period times
const trackNode = document.querySelector('.sequencer .track');
console.log(trackNode);
if (trackNode) {
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            updateMaxSliceCount();
            //storePeriodData();
        });
    });

    // Configuration of the observer
    const config = { childList: true, subtree: true };

    // Start observing
    observer.observe(trackNode, config);
}


// Function to check for the desired content and extract it
function checkAndExtractHzValue() {
    const labels = document.querySelectorAll('div[class="app status labels"] label');
    for (let label of labels) {
        if (label.textContent.includes('Hz')) {
            let matches = label.textContent.match(/(\d+\.?\d*)Hz/);
            if (matches) {
                projectHz = parseFloat(matches[1]);
                console.log('Hz Value:', projectHz);
                chrome.storage.local.set({ 'projectHz': projectHz });
                return matches[1]; // Return the value if found
            }
        }
    }
}



function updatePeriods(hz, slices) {
    if (hz && slices) {
        slicePeriod = ((1 / hz) / slices) * 1000; //*1000 for ms conversion
        framePeriod = (slicePeriod * slices);
        console.log("slice period: ", slicePeriod);
        console.log("frame period: ", framePeriod);
    }
};

function updateTableValues(projectHz, projectMaxSlices, slicePeriod, framePeriod) {
    // Find the table rows by their class names
    const frameRateRow = document.querySelector('tr.frameRate .value');
    const maxSliceCountRow = document.querySelector('tr.sliceCount .value');
    const slicePeriodRow = document.querySelector('tr.slicePeriod .value');
    const framePeriodRow = document.querySelector('tr.framePeriod .value');

    // Update the values
    if (frameRateRow) {
        frameRateRow.textContent = projectHz.toFixed(2) + ' Hz';
    }
    if (maxSliceCountRow) {
        maxSliceCountRow.textContent = projectMaxSlices;
    }
    if (slicePeriodRow) {
        slicePeriodRow.textContent = slicePeriod.toFixed(3) + ' ms';
    }
    if (framePeriodRow) {
        framePeriodRow.textContent = framePeriod.toFixed(3) + ' ms';
    }
}

function saveCameras() {
    let cameras = [];
    document.querySelectorAll('.cameraItem').forEach((item, index) => {
        let cameraName = item.querySelector('#cameraName .el-input__inner').value;
        let camera = {
            name: item.querySelector('#cameraName .el-input__inner').value,
            targetFirstSlice: item.querySelector('#lastTargetSlice .el-input__inner').value,
            targetSlices: item.querySelector('#targetSliceCount .el-input__inner').value,
            color: item.querySelector('#guiColor .el-input__inner').value,
            redKomodoEnabled: item.querySelector('#redRcpEnable').checked,
            ip: item.querySelector('#ipAddress .el-input__inner').value,
            sensorShiftOffset: item.querySelector('#requiredOffset .el-input__inner').value,
            wsConnected: false // You'll need to adjust this according to your WebSocket logic
        };
        cameras.push(camera);

        // Update the text of the toggle button
        let toggleButton = item.querySelector('.cameraToggleButton');
        if (toggleButton) {
            toggleButton.textContent = `Toggle ${cameraName} Details`;
        }
    });

    chrome.storage.local.set({ 'cameras': cameras });
    console.log('Applying and saving camera data:', cameras);
    applyCameraSettings(cameras);


}

// Adding event listeners to save cameras when input fields are changed
document.addEventListener('change', function (event) {
    if (event.target.closest('.cameraItem')) {
        saveCameras();
    }
});


// Apply camera settings based on the provided data
function applyCameraSettings(cameras) {
    const maxSlices = document.querySelectorAll('.sequencer .track th.slice').length;

    // First, reset styles for all slices
    resetAllSlices(maxSlices);

    // Now apply styles for each camera
    cameras.forEach(camera => {
        if (camera.targetFirstSlice && camera.targetSlices && camera.color) {
            const slicesToColor = parseInt(camera.targetSlices);
            let targetSlice = parseInt(camera.targetFirstSlice);

            for (let i = 0; i < slicesToColor; i++) {
                let sliceNumber = targetSlice - i;
                if (sliceNumber < 1) sliceNumber += maxSlices; //wrap around

                const sliceElement = document.querySelector(`.sequencer .track th.slice:nth-child(${sliceNumber+1})`); // determine starting slice of color (should be the right side of group)
                if (sliceElement) {
                    sliceElement.style.backgroundColor = camera.color;
                    if (i === 0) { // target right most slice for labeling
                        sliceElement.style.borderTopColor = "#FFFFFF";
                        sliceElement.style.borderTop = "solid 2px";
                        const cameraLabel = document.createElement("div");
                        cameraLabel.className = "added-camera";
                        cameraLabel.style.cssText = "position: absolute;transform: rotate(-20deg);transform-origin: left;left: 30px;top: -16px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;max-width: 100px;"
                        cameraLabel.innerHTML = camera.name;
                        sliceElement.appendChild(cameraLabel);
                    }
                }
            }
        }
    });
}

// Reset styles for all slices
function resetAllSlices(maxSlices) {
    for (let i = 1; i <= maxSlices+1; i++) {
        const sliceElement = document.querySelector(`.sequencer .track th.slice:nth-child(${i})`);
        if (sliceElement) {
            sliceElement.style.backgroundColor = '';
            sliceElement.style.borderTop = "none";
            const existingCameraLabel = sliceElement.querySelector('.added-camera');
            if (existingCameraLabel) {
                sliceElement.removeChild(existingCameraLabel);
            }
        }
    }
}


    // Attach the event listener to a parent element
    document.body.addEventListener('click', function(event) {
        // Check if the clicked element is a toggle button
        if (event.target && event.target.classList.contains('cameraToggleButton')) {
            console.log("Toggle camera clicked");
            const details = event.target.nextElementSibling;
            details.style.display = details.style.display === 'none' ? '' : 'none';
        }
    });


    document.addEventListener('change', function(event) {
        if (event.target.classList.contains('offsetTypeDropdown')) {
            const selectedValue = event.target.value;
            const redOffsetFields = event.target.closest('.cameraItem').querySelector('.redOffsetFields');
            const evertzOffsetFields = event.target.closest('.cameraItem').querySelector('.evertzOffsetFields');
    
            if (selectedValue === 'red') {
                redOffsetFields.style.display = 'block';
                evertzOffsetFields.style.display = 'none';
            } else if (selectedValue === 'evertz') {
                redOffsetFields.style.display = 'none';
                evertzOffsetFields.style.display = 'block';
            }
        }
    });
    
//listener for RED RCP connection
document.addEventListener('change', function(event) {
    if (event.target.id === 'redRcpEnable') {
        const cameraItem = event.target.closest('.cameraItem');
        const ipAddress = cameraItem.querySelector('#ipAddress .el-input__inner').value;
        const messageType = event.target.checked ? 'connectWebSocket' : 'disconnectWebSocket';

        if (ipAddress) {
            chrome.runtime.sendMessage({ type: messageType, ip: ipAddress });
        }
    }
});

// Function to calculate required offset
function calculateRequiredOffset(cameraItem) {
    // Retrieve input values
    const targetFirstSlice = parseInt(cameraItem.querySelector('#lastTargetSlice .el-input__inner').value) || 0;
    //const slicePeriod = parseFloat(document.getElementById('slicePeriod').textContent.replace('ms', ''));

    // Calculate the required offset
    const requiredOffset = targetFirstSlice * slicePeriod;
    cameraItem.querySelector('#requiredOffset .el-input__inner').value = requiredOffset.toFixed(3) + ' ms';

    // Send message to background.js
    const ip = cameraItem.querySelector('#ipAddress .el-input__inner').value;
    if (ip) {
        chrome.runtime.sendMessage({
            type: 'calculateSensorSyncShift',
            requiredOffsetMs: requiredOffset,
            ip: ip
        });
    }
}

// Function to calculate optimal shutter angle
function calculateOptimalShutterAngle(cameraItem, projectMaxSlices) {
    // Retrieve input value
    const targetSlices = parseInt(cameraItem.querySelector('#targetSliceCount .el-input__inner').value) || 0;

    // Calculate the optimal shutter angle
    const optimalShutterAngle = (targetSlices / projectMaxSlices) * 360;
    cameraItem.querySelector('#optimalShutterAngle .el-input__inner').value = optimalShutterAngle.toFixed(2);

    // Send message to background.js
    const ip = cameraItem.querySelector('#ipAddress .el-input__inner').value;
    const cameraName = cameraItem.querySelector('#cameraName .el-input__inner').value;
    if (ip && cameraName) {
        chrome.runtime.sendMessage({
            type: 'optimalShutterAngle',
            cameraName: cameraName,
            optimalShutterAngle: optimalShutterAngle,
            ip: ip
        });
    }
}

// Event listener for input changes
document.addEventListener('change', function(event) {
    if (event.target.closest('.cameraItem')) {
        const cameraItem = event.target.closest('.cameraItem');
        calculateRequiredOffset(cameraItem);
        calculateOptimalShutterAngle(cameraItem, projectMaxSlices);
    }
});
