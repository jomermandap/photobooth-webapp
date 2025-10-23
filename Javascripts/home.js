// Simple homepage functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const startButton = document.getElementById('start-button');
  const cameraBtn = document.getElementById('menu-camera-button');
  const uploadBtn = document.getElementById('menu-upload-button');
  const logoEl = document.querySelector('.logo');

  // Navigation function
  function navigateTo(url, buttonId) {
    if (typeof gtag === 'function') {
      gtag('event', 'button_click', {
        button_id: buttonId || 'no-id',
        button_text: 'navigation',
      });
    }
    window.location.href = url;
  }

  // Add click event to start button
  if (startButton) {
    startButton.addEventListener('click', function(e) {
      e.preventDefault();
      navigateTo('menu.html', 'start-button');
    });
  }

  // Add click events to menu buttons
  if (cameraBtn) {
    cameraBtn.addEventListener('click', function(e) {
      e.preventDefault();
      navigateTo('camera.html', 'menu-camera-button');
    });
  }

  if (uploadBtn) {
    uploadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      navigateTo('upload.html', 'menu-upload-button');
    });
  }

  // Add click event to logo
  if (logoEl) {
    logoEl.addEventListener('click', function(e) {
      e.preventDefault();
      navigateTo('index.html', 'logo');
    });
  }

  // Add hover effects to features
  const features = document.querySelectorAll('.feature');
  features.forEach(feature => {
    feature.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });
    
    feature.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Add button hover effects
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});