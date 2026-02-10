const sharp = require('sharp');

console.log("Testing sharp...");

sharp({
    create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 0.5 }
    }
})
    .png()
    .toBuffer()
    .then(data => console.log('Sharp works! Buffer length:', data.length))
    .catch(err => console.error('Sharp failed:', err));
