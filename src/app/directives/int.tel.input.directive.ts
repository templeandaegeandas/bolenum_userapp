import { Directive, ElementRef,HostListener } from '@angular/core';

declare var $: any;


@Directive({
  selector: '[int-tel-input]'
})
export class IntTelInputDirective {
  constructor(private el: ElementRef) {
    console.log(el)
    $(el.nativeElement).intlTelInput();
  }

}
