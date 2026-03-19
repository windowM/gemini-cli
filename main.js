// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

const updateToggleButton = (theme) => {
  themeToggle.textContent = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
};

const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
updateToggleButton(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateToggleButton(newTheme);

  // Reset Disqus to match the new theme if DISQUS is loaded
  if (typeof DISQUS !== 'undefined') {
    DISQUS.reset({
      reload: true,
      config: function () {
        this.page.identifier = window.location.pathname;
        this.page.url = window.location.href;
      }
    });
  }
});

// Lunch Recommendation Logic
const lunchOptions = [
  "Kimchi Jjigae (Kimchi Stew)",
  "Bibimbap",
  "Bulgogi",
  "Tonkatsu",
  "Sushi",
  "Pasta",
  "Hamburger",
  "Fried Chicken",
  "Salad Bowl",
  "Sandwich",
  "Tacos",
  "Ramen"
];

const recommendBtn = document.getElementById('recommend-btn');
const display = document.getElementById('recommendation-display');

recommendBtn.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * lunchOptions.length);
  const selected = lunchOptions[randomIndex];
  
  display.style.opacity = 0;
  setTimeout(() => {
    display.textContent = selected;
    display.style.opacity = 1;
  }, 150);
});

// Smooth fade for recommendation
display.style.transition = 'opacity 0.2s';
