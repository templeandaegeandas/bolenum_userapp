import {Component, Directive, Output, EventEmitter} from '@angular/core';

import {NgModel} from '@angular/forms';

@Directive({
selector: '[ngModel][nonumberspecialcharacter]',
providers: [NgModel],
host: {
    '(ngModelChange)' : 'onInputChange($event)'
      }
})
export class NoNumberSpecialCharacterDirective{
  constructor(private model:NgModel){}

  onInputChange(event){
    var newValue = event.replace(/[^\w\s]/gi, '');
    newValue = newValue.replace(/[0-9]/, '');
    this.model.valueAccessor.writeValue(newValue);
  }
}
