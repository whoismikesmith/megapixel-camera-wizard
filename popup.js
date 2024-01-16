document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('toggleConversion');

    // Load the saved state of the toggle switch
    chrome.storage.local.get(['toggleState'], function(result) {
        if (result.toggleState !== undefined) {
            toggleSwitch.checked = result.toggleState;
        }
    });

    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', function(event) {
            // Save the state of the toggle switch
            chrome.storage.local.set({'toggleState': event.target.checked});

            // Send the state to content.js
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {toggle: event.target.checked});
            });
        });
    }


    // Load cameras on popup open
    loadCameras();

    // Event listener for adding cameras
    document.getElementById('addCamera').addEventListener('click', function() {
        addCameraLine();
    });

    // Request max slice number from content.js
    /* chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {getMaxSliceNumber: true});
    });
 */
    // Load max slice number on popup open
    chrome.storage.local.get(['maxSliceNumber'], function(result) {
        if (result.maxSliceNumber !== undefined) {
            console.log("Max Slice Number:", result.maxSliceNumber);
            document.getElementById('maxSliceCount').textContent = result.maxSliceNumber; // Update DOM element
            updateMaxSliceInputs(result.maxSliceNumber); // Update max attribute of target slice inputs
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

    const shutterAngleInput = cameraLine.querySelector('.shutterAngle');
    const colorInput = cameraLine.querySelector('.cameraColor');

    nameInput.value = camera.name || '';
    targetFirstSliceInput.value = camera.targetFirstSlice || '';
    shutterAngleInput.value = camera.shutterAngle || '';
    colorInput.value = camera.color || '#ff0000';

    // Add change event listeners to update data whenever any input changes
    [nameInput, targetFirstSliceInput, shutterAngleInput, colorInput].forEach(input => {
        input.addEventListener('change', saveCameras);
    });

    template.querySelector('.deleteCamera').addEventListener('click', function(event) {
        event.target.parentElement.remove();
        saveCameras();
    });

    document.getElementById('cameraList').appendChild(template);
    saveCameras();
}

function saveCameras() {
    let cameras = [];
    document.querySelectorAll('.cameraLine').forEach((line, index) => {
        let camera = {
            name: line.querySelector('input[type=text]').value,
            targetFirstSlice: line.querySelector('.targetFirstSlice').value,
            shutterAngle: line.querySelector('.shutterAngle').value,
            color: line.querySelector('.cameraColor').value
        };
        cameras.push(camera);
    });

    chrome.storage.local.set({'cameras': cameras});
    console.log('Sending camera data:', cameras); // Check the data before sending

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {cameras: cameras});
    });
}


function loadCameras() {
    chrome.storage.local.get(['cameras'], function(result) {
        if (result.cameras && result.cameras.length > 0) {
            result.cameras.forEach(camera => addCameraLine(camera));
        }
    });
    saveCameras();
}

function validateSliceInput(inputElement, maxSliceNumber) {
    inputElement.addEventListener('input', function() {
        const currentValue = parseInt(inputElement.value);
        if (currentValue > maxSliceNumber) {
            inputElement.value = maxSliceNumber; // Reset to max if exceeded
            // Optionally, display an error message to the user
        }
    });
}
