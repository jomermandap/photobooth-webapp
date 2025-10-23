// constants
const WIDTH = 1080, HEIGHT = 1920, HALF = HEIGHT / 2;

// dom elements
const elements = {
  video: document.getElementById('liveVideo'),
  canvas: document.getElementById('finalCanvas'),
  ctx: document.getElementById('finalCanvas').getContext('2d'),
  takePhotoBtn: document.getElementById('takePhoto'),
  downloadBtn: document.getElementById('downloadBtn'),
  countdownEl: document.querySelector('.countdown-timer'),
  filterBtns: document.querySelectorAll('.filter-btn')
};

// current filter state
let currentFilter = 'none';

let photoStage = 0; // 0=top,1=bottom,2=done

// move video to half
const moveVideoToHalf = i => {
  const { video } = elements;
  video.style.display = 'block';
  video.style.top = i === 0 ? '0' : '50%';
  video.style.left = '0';
  video.style.width = '100%';
  video.style.height = '50%';
};

// countdown
const startCountdown = callback => {
  let count = 3;
  const { countdownEl } = elements;
  countdownEl.textContent = count;
  countdownEl.style.display = 'flex';
  const intervalId = setInterval(() => {
    count--;
    if (count > 0) countdownEl.textContent = count;
    else {
      clearInterval(intervalId);
      countdownEl.style.display = 'none';
      callback();
    }
  }, 1000);
};

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

// capture photo
const capturePhoto = () => {
  const { video, ctx, takePhotoBtn } = elements;
  const yOffset = photoStage === 0 ? 0 : HALF;
  const vW = video.videoWidth, vH = video.videoHeight;
  const targetAspect = WIDTH / HALF, vAspect = vW / vH;
  let sx, sy, sw, sh;

  if (vAspect > targetAspect) { sh = vH; sw = vH * targetAspect; sx = (vW - sw) / 2; sy = 0; }
  else { sw = vW; sh = vW / targetAspect; sx = 0; sy = (vH - sh) / 2; }

  ctx.save();
  ctx.translate(WIDTH, 0);
  ctx.scale(-1, 1);
  
  // apply selected filter
  applyFilter(ctx, currentFilter);
  
  ctx.drawImage(video, sx, sy, sw, sh, 0, yOffset, WIDTH, HALF);
  ctx.restore();

  photoStage++;
  if (photoStage === 1) { moveVideoToHalf(1); takePhotoBtn.disabled = false; }
  else if (photoStage === 2) finalizePhotoStrip();
};

// finalize photo strip
const finalizePhotoStrip = () => {
  const { video, ctx, canvas } = elements;
  video.style.display = 'none';
  const frame = new Image();
  frame.src = 'Assets/fish-photobooth/camerapage/frame.png';
  frame.onload = () => {
    ctx.drawImage(frame, 0, 0, WIDTH, HEIGHT);
    localStorage.setItem('photoStrip', canvas.toDataURL('image/png'));
    setTimeout(() => window.location.href = 'final.html', 50);
  };
  frame.complete && frame.onload();
};

// download photo
const downloadPhoto = () => {
  elements.canvas.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'photo-strip.png';
    a.click();
  }, 'image/png');
};

// setup camera
const setupCamera = () => {
  navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 2560 }, height: { ideal: 1440 }, facingMode: 'user' }, audio: false })
    .then(stream => { 
      elements.video.srcObject = stream; 
      elements.video.play(); 
      moveVideoToHalf(0);
      // apply initial filter
      elements.video.classList.add('video-filter-none');
    })
    .catch(err => alert('Camera access failed: ' + err));
};

// setup filter events
const setupFilterEvents = () => {
  const { filterBtns, video } = elements;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // add active class to clicked button
      btn.classList.add('active');
      
      // update current filter
      currentFilter = btn.dataset.filter;
      
      // remove all existing filter classes
      video.classList.remove('video-filter-none', 'video-filter-soft-skin', 'video-filter-vintage', 'video-filter-warm', 'video-filter-cool', 'video-filter-dramatic');
      
      // apply new filter class
      video.classList.add(`video-filter-${currentFilter}`);
      
      // debug logging
      console.log('Filter changed to:', currentFilter);
      console.log('Video classes:', video.className);
    });
  });
};

// setup events
const setupEventListeners = () => {
  const { takePhotoBtn, downloadBtn } = elements;

  takePhotoBtn.addEventListener('click', () => {
    if (photoStage > 1) return;
    takePhotoBtn.disabled = true;
    startCountdown(capturePhoto);
  });

  downloadBtn.addEventListener('click', downloadPhoto);
  window.addEventListener('resize', () => {
    if (photoStage === 0) moveVideoToHalf(0);
    else if (photoStage === 1) moveVideoToHalf(1);
  });
  
  // setup filter events
  setupFilterEvents();
};

// initialize photo booth
const initPhotoBooth = () => { 
  setupCamera(); 
  setupEventListeners(); 
};
initPhotoBooth();

// logo redirect and ensure filter events are set up
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo');
  if (logo) logo.addEventListener('click', () => window.location.href = 'index.html');
  
  // ensure filter events are set up
  if (elements.filterBtns.length > 0) {
    setupFilterEvents();
  }
});
