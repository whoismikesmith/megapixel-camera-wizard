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
                                        <input type="number" autocomplete="off" class="el-input__inner" role="spinbutton" aria-valuemax="10000" aria-valuemin="-10000" aria-valuenow="0" aria-disabled="false">
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div class="el-form-item el-form-item--mini">
                        <label class="el-form-item__label">Optimal Shutter Angle</label>
                        <div class="el-form-item__content">
                            <div class="is-controls-right" id="optimalShutterAngle">
                                    <div class="el-input el-input--mini">
                                        <input type="number" autocomplete="off" class="el-input__inner" role="spinbutton" aria-valuemax="10000" aria-valuemin="-10000" aria-valuenow="0" aria-disabled="false">
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
                <div class="enable row">
                    <input id="redRcpEnable" type="checkbox">
                    <label for="redRcpEnable">Enable RED RCP</label>
                </div>
                <!-- delete a camera button -->
                <button type="button" class="el-button el-button--danger el-button--mini delete-a-camera">
                    <span class>Delete</span>
                </button>
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

    // Attach event listener to 'Delete' button
    const deleteButton = newCamera.querySelector('button.delete-a-camera');
    deleteButton.addEventListener('click', () => deleteCameraItem(newCameraId));

    document.querySelector('div.cameraList').appendChild(newCamera);

    // Add new camera data to array
    cameraData.push({ id: newCameraId, data: {} }); // Update with actual data
}

// Delete a Camera
function deleteCameraItem(cameraId) {
    const cameraElement = document.getElementById(cameraId);
    if (cameraElement) {
        cameraElement.remove();
    }
    // Remove camera data from array
    cameraData = cameraData.filter(camera => camera.id !== cameraId);
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
                updateTableValues(projectHz, projectMaxSlices, slicePeriod,framePeriod);
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
            storePeriodData();
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
                projectHz =  parseFloat(matches[1]);
                console.log('Hz Value:',projectHz);
                chrome.storage.local.set({ 'projectHz': projectHz });
                return matches[1]; // Return the value if found
            }
        }
    }
}



function updatePeriods(hz, slices){
    if (hz && slices){
        slicePeriod = ((1/hz) / slices)*1000; //*1000 for ms conversion
        framePeriod = (slicePeriod * slices);
        console.log("slice period: ",slicePeriod);
        console.log("frame period: ",framePeriod);
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
    });

    chrome.storage.local.set({ 'cameras': cameras });
    console.log('Applying and saving camera data:', cameras);
    applyCameraSettings(cameras);

    
}

// Adding event listeners to save cameras when input fields are changed
document.addEventListener('change', function(event) {
    if (event.target.closest('.cameraItem')) {
        saveCameras();
    }
});


// Apply camera settings based on the provided data
function applyCameraSettings(cameras) {
    // Clear existing custom styles
    document.querySelectorAll('.sequencer .track th.slice').forEach(th => {
        th.style.backgroundColor = ''; // Reset the background color
    });

    // Apply new styles based on camera data
    cameras.forEach(camera => {
        if (camera.targetFirstSlice && camera.targetSlices && camera.color) {
            console.log("setting new slice highlighting color for : ",camera);
            const maxSlices = document.querySelectorAll('.sequencer .track th.slice').length;
            const slicesToColor = camera.targetSlices;
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
