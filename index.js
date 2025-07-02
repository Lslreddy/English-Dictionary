let input = document.getElementById('searchInput');
let result = document.getElementById('result');
let error = document.getElementById('error');
let loading = document.getElementById('loading');
let instructions = document.querySelector('.instructions');
let themeToggle = document.getElementById('themeToggle');

function renderDefinitions(data) {
  let html = `<p><strong>Word:</strong> ${data.word}</p>`;

  const firstMeaning = data.meanings[0];
  html += `<p><strong>Part of Speech:</strong> ${firstMeaning.partOfSpeech}</p>`;

  const definitions = firstMeaning.definitions.slice(0, 2);
  definitions.forEach((def, index) => {
    html += `<p><strong>Definition ${index + 1}:</strong> ${def.definition}</p>`;
    if (def.example) {
      html += `<p><em>Example:</em> ${def.example}</p>`;
    }
  });

  const ukAudio = data.phonetics.find(p => p.audio && p.audio.includes('uk.mp3'))?.audio;
  const usAudio = data.phonetics.find(p => p.audio && p.audio.includes('us.mp3'))?.audio || data.phonetics.find(p => p.audio)?.audio;

  if (ukAudio || usAudio) {
    html += `<div>`;
    if (ukAudio) {
      html += `<p>UK Pronunciation</p><audio controls src="${ukAudio}"></audio>`;
    }
    if (usAudio && usAudio !== ukAudio) {
      html += `<p>US Pronunciation</p><audio controls src="${usAudio}"></audio>`;
    }
    html += `</div>`;
  }

  result.innerHTML = html;
}

async function fetchWord(word) {
  result.innerHTML = '';
  error.textContent = '';
  instructions.textContent = `Searching for the word "${word}"...`;
  loading.textContent = 'Loading...';

  try {
    let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) {
      throw new Error('Word not found.');
    }
    let data = await response.json();
    loading.textContent = '';
    instructions.textContent = '';
    renderDefinitions(data[0]);
  } catch (err) {
    loading.textContent = '';
    instructions.textContent = '';
    error.textContent = err.message === 'Failed to fetch' ? 'No internet connection.' : err.message;
  }
}

input.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    const word = input.value.trim();
    if (word) fetchWord(word);
  }
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
