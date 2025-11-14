/*
 * Enhancements for blog posts:
 * 1. Adds copy buttons to code blocks.
 * 2. Applies layout classes to images based on their natural width
 *    so narrow visuals can sit beside text while larger ones stay centered.
 */

(() => {
  const COPY_LABEL = 'Copy';
  const COPIED_LABEL = 'Copied!';

  function addCopyButtons() {
    const blocks = document.querySelectorAll('.post-body pre');
    blocks.forEach((block) => {
      if (block.querySelector('.code-copy-btn')) return;

      block.classList.add('has-copy');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'code-copy-btn';
      button.setAttribute('aria-label', 'Copy code snippet');
      button.textContent = COPY_LABEL;
      block.appendChild(button);

      button.addEventListener('click', async () => {
        const codeText = block.innerText.trim();
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(codeText);
          } else {
            const textarea = document.createElement('textarea');
            textarea.value = codeText;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
          }
          button.textContent = COPIED_LABEL;
          button.classList.add('is-copied');
          setTimeout(() => {
            button.textContent = COPY_LABEL;
            button.classList.remove('is-copied');
          }, 1800);
        } catch (err) {
          console.error('Copy failed', err);
        }
      });
    });
  }

  function markImage(img) {
    const width = img.naturalWidth || img.width;
    img.classList.add('post-image');
    if (width && width < 400) {
      img.classList.add('image-inline');
    } else {
      img.classList.add('image-block');
    }
  }

  function enhanceImages() {
    const images = document.querySelectorAll('.post-body img');
    images.forEach((img) => {
      if (img.complete) {
        markImage(img);
      } else {
        img.addEventListener('load', () => markImage(img), { once: true });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    addCopyButtons();
    enhanceImages();
  });
})();
