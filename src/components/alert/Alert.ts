import BaseComponent from '@utils/baseComponent';

const classNames = ['alert', 'absolute', 'top-5', 'left-1/2', '-translate-x-1/2', 'max-w-max', 'z-20', 'min-w-[200px]'];

export class Alert {
  private alert: BaseComponent<'div'>;

  constructor(isSuccessAlert: boolean, textContent: string) {
    this.alert = new BaseComponent({
      tagName: 'div',
      classNames: [isSuccessAlert ? 'alert-success' : 'alert-error', ...classNames],
    });
    this.setContent(isSuccessAlert, textContent);
  }

  public setAlertOnPage(): void {
    document.body.append(this.alert.getNode());
    setTimeout(() => this.alert.destroy(), 5000);
  }

  private setContent(isSuccessAlert: boolean, textContent: string): void {
    const alertMessage = new BaseComponent({ tagName: 'span', textContent });
    this.alert.getNode().innerHTML = this.getIcon(isSuccessAlert);
    this.alert.append(alertMessage);
  }

  private getIcon(isSuccessAlert: boolean): string {
    return `${
      isSuccessAlert
        ? '<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
    }`;
  }
}
