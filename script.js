const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const downloadBtn = document.getElementById("downloadBtn");
const batchDownloadBtn = document.getElementById("batchDownloadBtn");
const outlineToggle = document.getElementById("outlineToggle");

let images = [];
let currentIndex = 0;
let dragging = false;
let imgX = 0, imgY = 0, offsetX = 0, offsetY = 0;
let scale = 1, rotation = 0;
let currentImg = null;

upload.addEventListener("change", (e) => {
    images = [];
    currentIndex = 0;
    const files = e.target.files;
    for (const file of files){
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            images.push(img);
            if(images.length === 1) { initImage(img); }
        };
    }
});

function initImage(img){
    currentImg = img;
    imgX = canvas.width/2;
    imgY = canvas.height/2;
    scale = 1;
    rotation = 0;
    draw();
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(!currentImg) return;
    ctx.save();
    ctx.translate(imgX, imgY);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    ctx.drawImage(currentImg, -currentImg.width/2, -currentImg.height/2);
    ctx.restore();
}

canvas.addEventListener("pointerdown",(e)=>{
    dragging=true;
    offsetX = e.offsetX - imgX;
    offsetY = e.offsetY - imgY;
});

canvas.addEventListener("pointermove",(e)=>{
    if(dragging){
        imgX = e.offsetX - offsetX;
        imgY = e.offsetY - offsetY;
        draw();
    }
});

canvas.addEventListener("pointerup",()=>{ dragging=false; });
canvas.addEventListener("pointerleave",()=>{ dragging=false; });

document.addEventListener("wheel",(e)=>{
    if(e.ctrlKey && currentImg){
        scale += e.deltaY* -0.001;
        scale = Math.max(0.1, Math.min(5, scale));
        draw();
        e.preventDefault();
    }
});

document.addEventListener("keydown",(e)=>{
    if(!currentImg) return;
    if(e.key === "ArrowLeft") rotation -= 0.1;
    if(e.key === "ArrowRight") rotation += 0.1;
    draw();
});

function applyOutline(){
    const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    for(let i=0;i<imageData.data.length;i+=4){
        if(imageData.data[i+3]>0){
            imageData.data[i]=255;
            imageData.data[i+1]=255;
            imageData.data[i+2]=255;
        }
    }
    ctx.putImageData(imageData,0,0);
}

downloadBtn.addEventListener("click",()=>{
    if(!currentImg) return;
    if(outlineToggle.checked) applyOutline();
    const link = document.createElement("a");
    link.download = `sticker_${currentIndex+1}.png`;
    link.href = canvas.toDataURL();
    link.click();
});

batchDownloadBtn.addEventListener("click",()=>{
    images.forEach((img, idx)=>{
        initImage(img);
        if(outlineToggle.checked) applyOutline();
        const link = document.createElement("a");
        link.download = `sticker_${idx+1}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
});
