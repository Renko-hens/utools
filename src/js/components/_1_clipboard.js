const writeBtn = document.querySelector('.write-btn');
const inputEl = document.querySelector('.to-copy');


if(writeBtn || inputEl) {
  writeBtn.addEventListener('click', () => {
    const inputValue = inputEl.value.trim();
    if (inputValue) {
      navigator.clipboard.writeText(inputValue)
        .then(() => {
          if (writeBtn.innerText !== 'Скопировано!') {
            const originalText = writeBtn.innerText;
            writeBtn.innerText = 'Скопировано!';
            setTimeout(() => {
              writeBtn.innerText = originalText;
            }, 1500);
          }
        })
        .catch(err => {
          console.log('Something went wrong', err);
        })
    }
  });  
}