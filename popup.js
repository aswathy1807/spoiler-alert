const input = document.getElementById('wordInput');
const btn = document.getElementById('addBtn');
const listDiv = document.getElementById('list');

// Initialize list on popup open
chrome.storage.local.get(['spoilers'], (res) => {
  renderList(res.spoilers || []);
});

// Add Word Logic
btn.onclick = () => {
  const word = input.value.trim().toLowerCase();
  if (word) {
    chrome.storage.local.get(['spoilers'], (res) => {
      const newList = [...(res.spoilers || []), word];
      chrome.storage.local.set({ spoilers: newList }, () => {
        renderList(newList);
        input.value = '';
      });
    });
  }
};

// Render Logic with Delete Button
function renderList(list) {
  listDiv.innerHTML = '';
  list.forEach((word, index) => {
    const item = document.createElement('div');
    item.className = 'word-item';
    item.innerHTML = `
      <span>${word}</span>
      <button class="delete-btn" data-idx="${index}">Delete</button>
    `;
    listDiv.appendChild(item);
  });

  document.querySelectorAll('.delete-btn').forEach(b => {
    b.onclick = (e) => {
      const idx = e.target.getAttribute('data-idx');
      list.splice(idx, 1);
      chrome.storage.local.set({ spoilers: list }, () => renderList(list));
    };
  });
}