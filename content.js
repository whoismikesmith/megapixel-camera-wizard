chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.toggle !== undefined) {
        let timingsElements = document.querySelectorAll('.subframe.timings .value');
        timingsElements.forEach(element => {
            if (request.toggle) {
                // Convert to microseconds
                let msString = element.textContent.replace('ms', '');
                element.textContent = convertToMicroseconds(msString);
            } else {
                // Convert back to milliseconds (if needed)
                let usString = element.textContent.replace('μs', '');
                element.textContent = convertToMilliseconds(usString);
            }
        });
    }
});

function convertToMicroseconds(msString) {
    let msValue = parseFloat(msString);
    return (msValue * 1000).toFixed(3) + 'μs';
}

function convertToMilliseconds(usString) {
    let usValue = parseFloat(usString);
    return (usValue / 1000).toFixed(3) + 'ms';
}

