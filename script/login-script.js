// slider
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let cur = 0, timer;

function goTo(n) {
  slides[cur].classList.remove('active');
  dots[cur].classList.remove('active');
  cur = (n + slides.length) % slides.length;
  slides[cur].classList.add('active');
  dots[cur].classList.add('active');
}

function nextSlide() { goTo(cur + 1); }

timer = setInterval(nextSlide, 4000);

dots.forEach(d => d.addEventListener('click', () => {
  clearInterval(timer);
  goTo(+d.dataset.i);
  timer = setInterval(nextSlide, 4200);
}));

