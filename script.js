const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const downloadBtn = document.getElementById("downloadBtn");
const batchDownloadBtn = document.getElementById("batchDownloadBtn");
const outlineToggle = document.getElementById("outlineToggle");

let images = [];
let currentIndex = 0;

upload.addEventListener("change", function(e){
    images = [];
    currentIndex = 0;
    for(const file of e.target.files){
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            images.push(img);
            if(images.length === 1){
                drawImageOnCanvas(images[0]);
            }
        };
    }
});

function drawImageOnCanvas(img){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let scale = Math.min(canvas.width/img.width, canvas.height/img.height);
    let w = img.width * scale;
    let h = img.height * scale;
    ctx.drawImage(img, (canvas.width-w)/2, (canvas.height-h)/2, w, h);
}

function applyOutline(){
    const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    for(let i=0;i<imageData.data.length;i+=4){
        if(imageData.data[i+3]>0){
            imageData.data[i] = 255;
            imageData.data[i+1] = 255;
            imageData.data[i+2] = 255;
        }
    }
    ctx.putImageData(imageData,0,0);
}

downloadBtn.addEventListener("click", function(){
    if(images.length===0) return;
    if(outlineToggle.checked) applyOutline();
    const link = document.createElement("a");
    link.download = `sticker_${currentIndex+1}.png`;
    link.href = canvas.toDataURL();
    link.click();
});

batchDownloadBtn.addEventListener("click", function(){
    if(images.length===0) return;
    images.forEach((img, idx)=>{
        drawImageOnCanvas(img);
        if(outlineToggle.checked) applyOutline();
        const link = document.createElement("a");
        link.download = `sticker_${idx+1}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
});
