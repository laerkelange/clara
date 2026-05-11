const template = document.createElement('template');
const styleUrl = new URL('./clara-button.css', import.meta.url);

template.innerHTML = `
  <link rel="stylesheet" href="${styleUrl.href}">
  <button part="button" type="button" class="clara-button__control" data-variant="primary" data-size="small" aria-busy="false">
    <span class="clara-button__content">
      <slot name="icon"></slot>
      <span class="clara-button__label"><slot>Button</slot></span>
    </span>
  </button>
`;

export class ClaraButton extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'loading', 'button-type'];
  }

  private button!: HTMLButtonElement;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.button = shadowRoot.querySelector('button') as HTMLButtonElement;
  }

  connectedCallback() {
    this.updateButtonState();
  }

  attributeChangedCallback() {
    this.updateButtonState();
  }

  private updateButtonState() {
    const variant = this.getAttribute('variant') === 'secondary' ? 'secondary' : 'primary';
    const size = this.getAttribute('size') === 'large' ? 'large' : 'small';
    const loading = this.hasAttribute('loading');
    const disabled = this.hasAttribute('disabled') || loading;
    const buttonType = this.getAttribute('button-type') || 'button';

    this.button.dataset.variant = variant;
    this.button.dataset.size = size;
    this.button.disabled = disabled;
    this.button.type = buttonType;
    this.button.setAttribute('aria-busy', loading ? 'true' : 'false');

    if (loading) {
      this.button.classList.add('clara-button__control--loading');
    } else {
      this.button.classList.remove('clara-button__control--loading');
    }
  }
}

if (!customElements.get('clara-button')) {
  customElements.define('clara-button', ClaraButton);
}
