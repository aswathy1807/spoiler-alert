let blockedWords = [];
let timeout = null;

// Initial Load
chrome.storage.local.get(['spoilers'], (res) => {
  blockedWords = res.spoilers || [];
  scanAndBlur();
});

function scanAndBlur() {
  if (blockedWords.length === 0) return;

  // Select text-heavy elements
  const elements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, li, b, strong, a');

  elements.forEach(el => {
    const text = el.innerText.toLowerCase();
    
    // Check if any blocked word exists in this element
    const match = blockedWords.some(word => text.includes(word));

    if (match && !el.classList.contains('spoiler-shielded')) {
      el.classList.add('spoiler-shielded');
      
      // Click-to-Reveal Logic
      el.title = "Spoiler hidden by Shield. Click to reveal.";
      el.style.cursor = "help";
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        el.classList.toggle('spoiler-revealed');
      });
    }
  });
}

// Performance-optimized Scroll Watcher (Debounced)
const observer = new MutationObserver(() => {
  clearTimeout(timeout);
  timeout = setTimeout(scanAndBlur, 300); 
});

observer.observe(document.body, { childList: true, subtree: true });