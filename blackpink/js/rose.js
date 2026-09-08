document.addEventListener("DOMContentLoaded", function() {
    var video = document.getElementById("video");
    video.addEventListener("loadedmetadata", function() {
      // Establecer el tiempo de inicio en el segundo 30 después de que se carguen los metadatos
      video.currentTime = 15;
    });
  }
  );

  document.addEventListener("DOMContentLoaded", function() {
    var video = document.getElementById("video");

    // Detectar si el dispositivo es móvil
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
    }

    video.addEventListener("loadedmetadata", function() {
        // Establecer el tiempo de inicio en el segundo 15 después de que se carguen los metadatos
        video.currentTime = 15;
    });
});

//scroll 

////////////////////////////////////////


const images = document.querySelectorAll('bio-img');

function triggerAnimation(entries){
  entries.forEach (entry => {
    const image = entry.target.querySelector('img');

    image.classList.toggle('unset', entry.isIntersecting);
  });
}

const options ={
  root: null,
  rootMargin: '0px',
  threshold: 1
};

const observe = new IntersectionObserver(triggerAnimation, options);

images.forEach(image => {
  observe.observe(image);
});

// Add the album cards for the discography section
const albumCards = document.querySelectorAll('.album-card');
const albumInfo = document.querySelectorAll('.album-info');
const overlay = document.getElementById('overlay');
const toggles = document.querySelectorAll('.toggle-info');


albumCards.forEach((albumCard, index) => {
  albumCard.addEventListener('click', () => {
    albumInfo.forEach(info => info.classList.remove('open'));
    albumInfo[index].classList.add('open'); 
    overlay.style.display = 'block';
  });
});

toggles.forEach((toggle, index) => {
  toggle.addEventListener('click', (e) => {
    e.stopPropagation(); // evita conflictos
    albumInfo.forEach(info => info.classList.remove('open'));
    albumInfo[index].classList.add('open');
    overlay.style.display = 'block';
  });
});


overlay.addEventListener('click', () => {
  albumInfo.forEach(info => info.classList.remove('open'));
  overlay.style.display = 'none';
});
