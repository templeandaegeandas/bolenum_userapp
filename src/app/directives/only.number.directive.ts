import { Component, Directive, Output, EventEmitter } from '@angular/core';

import { NgModel } from '@angular/forms';

@Directive({
  selector: '[ngModel][onlynumber]',
  providers: [NgModel],
  host: {
    '(ngModelChange)': 'onInputChange($event)'
  }
})
export class OnlyNumberDirective {
  constructor(private model: NgModel) { }

  onInputChange(event) {
    var cleanInputValue = event.replace(/[^\w\s]/gi, '');
    cleanInputValue = cleanInputValue.replace(/[A-Za-z]/, '');
    cleanInputValue = cleanInputValue.replace(/ /g, '');
    this.model.valueAccessor.writeValue(cleanInputValue);
  }
}
