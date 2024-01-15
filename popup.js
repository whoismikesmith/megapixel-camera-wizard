document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('toggleConversion');
    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', function(event) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {toggle: event.target.checked});
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addCamera').addEventListener('click', addCameraLine);
});

function addCameraLine() {
    const template = document.getElementById('cameraTemplate').content.cloneNode(true);
    template.querySelector('.deleteCamera').addEventListener('click', deleteCameraLine);

    // Append new camera line to the list
    document.getElementById('cameraList').appendChild(template);
}

function deleteCameraLine(event) {
    event.target.parentElement.remove();
}

// Example function to send camera data to content.js
function sendCameraData() {
    let cameras = [];
    document.querySelectorAll('.cameraLine').forEach(line => {
        let camera = {
            name: line.querySelector('input[type=text]').value,
            targetFirstSlice: line.querySelector('input[type=number]').value,
            shutterAngle: line.querySelector('input[type=number]').value
        };
        cameras.push(camera);
    });

    // Send this data to content.js
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {cameras: cameras});
    });
}
