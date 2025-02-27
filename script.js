document.addEventListener("DOMContentLoaded", function () {
    const languageToggle = document.getElementById("language-toggle");
    const themeToggle = document.getElementById("theme-toggle");
    let currentLanguage = "en"; // Default: English

    // Language Toggle
    languageToggle.addEventListener("click", () => {
        currentLanguage = currentLanguage === "en" ? "ar" : "en";
        document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
        document.body.style.fontFamily = currentLanguage === "ar" ? "Arial, sans-serif" : "Arial, sans-serif";
        
        document.querySelectorAll("[data-en]").forEach((el) => {
            el.innerHTML = el.getAttribute(`data-${currentLanguage}`);
        });

        languageToggle.innerHTML = currentLanguage === "en" ? "🌍 عربي" : "🌍 English";
    });

    // Dark Mode Toggle
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        themeToggle.innerHTML = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
    });
});
