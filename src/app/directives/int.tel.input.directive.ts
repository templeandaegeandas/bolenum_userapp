import { Directive, ElementRef,HostListener } from '@angular/core';

declare var $: any;


@Directive({
  selector: '[int-tel-input]'
})
export class IntTelInputDirective {
  constructor(private el: ElementRef) {
    $(el.nativeElement).intlTelInput();
  }

}
