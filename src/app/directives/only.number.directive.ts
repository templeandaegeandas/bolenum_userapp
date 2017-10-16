import { Component, Directive, Output, EventEmitter } from '@angular/core';

import { NgModel } from '@angular/forms';

@Directive({
  selector: '[ngModel][onlynumber]',
  providers: [NgModel],
  host: {
    '(input)' : 'onInputChange($event)'
  }
})
export class OnlyNumberDirective {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  constructor(private model: NgModel) { }

  onInputChange(event) {
    var cleanInputValue = event.target.value.replace(/[^\w\s]/gi, '');
    cleanInputValue = cleanInputValue.replace(/[A-Za-z]/, '');
    cleanInputValue = cleanInputValue.replace(/ /g, '');
    this.ngModelChange.emit(cleanInputValue);
    this.model.valueAccessor.writeValue(cleanInputValue);
  }
}
