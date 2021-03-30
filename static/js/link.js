const formUrl = document.getElementById('formUrl');
const qrcodeCanvas = document.getElementById('qrcode-canvas');
const errorP = document.getElementById('error');

QRCode.toCanvas(qrcodeCanvas, formUrl.innerText, function (err) {
    if (err) {
        console.log(err);
        errorP.innerText = 'Cannot generte QRCode';
    }
});