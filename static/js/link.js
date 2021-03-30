const errorP = document.getElementById('error');

function createQRCode(baseUrl, activityName) {
    const qrcodeCanvas = document.getElementById(`qrcode-canvas-${activityName}`);

    QRCode.toCanvas(qrcodeCanvas, `${baseUrl}${activityName}`, function (err) {
        console.log('creating qrcode...');
        if (err) {
            console.log(err);
            errorP.innerText = 'Cannot generate QRCodes';
        }
    });
}