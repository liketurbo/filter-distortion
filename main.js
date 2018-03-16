/* Some code */
ctx.drawImage(/* Some drawing */)
const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
const disData = new FilterDistortion().filter(data);
const disImage = new window.ImageData(disData, canvas.width, canvas.height);
ctx.putImageData(disImage, 0, 0);
/* Some other code */
