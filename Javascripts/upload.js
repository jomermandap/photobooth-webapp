// clear local storage
window.addEventListener('DOMContentLoaded', () => localStorage.removeItem('photoStrip'));

// constants
const WIDTH = 1080, HEIGHT = 1920, HALF = HEIGHT / 2;

// dom elements
const elements = {
  canvas: document.getElementById('finalCanvas'),
  ctx: document.getElementById('finalCanvas').getContext('2d'),
  uploadInput: document.getElementById('uploadPhotoInput'),
  uploadBtn: document.getElementById('uploadPhoto'),
  readyBtn: document.getElementById('readyButton'),
  downloadBtn: document.getElementById('downloadBtn'),
  filterBtns: document.querySelectorAll('.filter-btn')
};

// current filter state
let currentFilter = 'none';

let photoStage = 0; // 0=top,1=bottom,2=donee

// apply filter to canvas context
const applyFilter = (ctx, filter) => {
  switch(filter) {
    case 'soft-skin':
      ctx.filter = 'contrast(1.1) brightness(1.05) saturate(0.9) blur(0.5px)';
      break;
    case 'vintage':
      ctx.filter = 'sepia(0.8) contrast(1.2) brightness(0.9) saturate(1.3)';
      break;
    case 'warm':
      ctx.filter = 'sepia(0.3) contrast(1.1) brightness(1.1) saturate(1.2)';
      break;
    case 'cool':
      ctx.filter = 'hue-rotate(200deg) contrast(1.1) brightness(0.95) saturate(0.8)';
      break;
    case 'dramatic':
      ctx.filter = 'contrast(1.4) brightness(0.8) saturate(1.5) hue-rotate(10deg)';
      break;
    default:
      ctx.filter = 'none';
  }
};

// draw photo
const drawPhoto = img => {
  const { ctx } = elements;
  const yOffset = photoStage === 0 ? 0 : HALF;
  const imgAspect = img.width / img.height, targetAspect = WIDTH / HALF;
  let sx, sy, sw, sh;

  if (imgAspect > targetAspect) { sh = img.height; sw = img.height * targetAspect; sx = (img.width - sw) / 2; sy = 0; }
  else { sw = img.width; sh = img.width / targetAspect; sx = 0; sy = (img.height - sh) / 2; }

  ctx.save();
  // apply selected filter
  applyFilter(ctx, currentFilter);
  ctx.drawImage(img, sx, sy, sw, sh, 0, yOffset, WIDTH, HALF);
  ctx.restore();
  
  photoStage++;
  if (photoStage === 2) finalizePhotoStrip();
};

// finalize photo strip
const finalizePhotoStrip = () => {
  const { ctx, readyBtn, downloadBtn, uploadBtn } = elements;
  const frame = new Image();
  frame.onload = () => {
    ctx.drawImage(frame, 0, 0, WIDTH, HEIGHT);
    uploadBtn.style.display = 'none';
    readyBtn.style.display = 'inline-block';
    readyBtn.disabled = false;
    downloadBtn.style.display = 'inline-block';
  };
  frame.src = 'Assets/fish-photobooth/camerapage/frame.png';
};

// ready button
elements.readyBtn.addEventListener('click', () => {
  localStorage.setItem('photoStrip', elements.canvas.toDataURL('image/png'));
  window.location.href = 'final.html';
});

// download photo
const downloadPhoto = () => {
  const { canvas } = elements;
  canvas.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'photo-strip.png';
    a.click();
  }, 'image/png');
};

// upload button
elements.uploadBtn.addEventListener('click', () => elements.uploadInput.click());

// handle upload
elements.uploadInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => drawPhoto(img);
  img.src = URL.createObjectURL(file);
  elements.uploadInput.value = '';
});

// download button
elements.downloadBtn.addEventListener('click', downloadPhoto);

// setup filter events
const setupFilterEvents = () => {
  const { filterBtns } = elements;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // add active class to clicked button
      btn.classList.add('active');
      
      // update current filter
      currentFilter = btn.dataset.filter;
    });
  });
};

// logo redirect
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo');
  if (logo) logo.addEventListener('click', () => window.location.href = 'index.html');
  
  // setup filter events
  setupFilterEvents();
});
