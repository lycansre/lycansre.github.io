anime({
  targets: '#lavendaTitle',
  translateY: [-20, 0],
  opacity: [0, 1],
  duration: 2000,
  easing: 'easeOutElastic(1, .6)'
});

anime({
  targets: '.socials div',
  translateX: [-100, 0],
  opacity: [0, 1],
  delay: anime.stagger(200, { start: 1000 }),
  duration: 1200,
  easing: 'easeOutExpo'
});
