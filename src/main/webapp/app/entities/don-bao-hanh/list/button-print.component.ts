import { Component } from '@angular/core';
@Component({
  template: `<button (click)="sayHello(item?.title)">{{ item?.title }}</button>`,
})
export class ButtonPrintComponent {
  item: any;

  sayHello(title: string): void {
    alert(`Hello ${title}`);
  }
}
