import BaseComponent from '@utils/baseComponent';

export class ConfirmationPrompt {
  public prompt: BaseComponent<'div'>;
  private promptText: BaseComponent<'p'>;
  private confirmBtn: BaseComponent<'button'>;
  private cancelBtn: BaseComponent<'button'>;

  constructor(promptText: string) {
    this.prompt = new BaseComponent({
      tagName: 'div',
      classNames: ['grid', 'grid-cols-2', 'grid-rows-2', 'gap-2', 'pt-6', 'items-center', 'justify-items-center'],
    });

    this.promptText = new BaseComponent({
      tagName: 'p',
      textContent: promptText,
      classNames: ['text-center', 'text-lg', 'col-span-2'],
    });

    this.confirmBtn = new BaseComponent({
      tagName: 'button',
      textContent: 'OK',
      classNames: ['btn', 'btn-primary', 'w-24'],
    });

    this.cancelBtn = new BaseComponent({
      tagName: 'button',
      textContent: 'Cancel',
      classNames: ['btn', 'btn-accent', 'w-24'],
    });

    this.prompt.appendChildren([this.promptText, this.confirmBtn, this.cancelBtn]);
  }

  public addCancelAction(cancelAction: () => void): void {
    this.cancelBtn.addListener('click', () => {
      cancelAction();
    });
  }

  public addConfirmAction(confirmAction: () => void): void {
    this.confirmBtn.addListener('click', () => {
      confirmAction();
    });
  }
}
