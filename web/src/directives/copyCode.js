import { Message } from 'element-ui';

export default {
  bind(el) {
    if (!el._copyCodeHandler) {
      el._copyCodeHandler = async () => {
        const codeElement = el.querySelector('.code-block code');
        if (codeElement) {
          const codeText = codeElement.textContent;
          try {
            await navigator.clipboard.writeText(codeText);
            Message.success('Code copied to clipboard!');
          } catch (err) {
            console.error('Failed to copy code', err);
          }
        }
      };
      el.addEventListener('click', el._copyCodeHandler);
    }
  },
  unbind(el) {
    if (el._copyCodeHandler) {
      el.removeEventListener('click', el._copyCodeHandler);
      delete el._copyCodeHandler;
    }
  }
};