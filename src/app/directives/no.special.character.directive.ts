import {Component, Directive, Output, EventEmitter} from '@angular/core';

import {NgModel} from '@angular/forms';

@Directive({
selector: '[ngModel][nospecialcharacter]',
providers: [NgModel],
host: {
    '(ngModelChange)' : 'onInputChange($event)'
      }
})
export class NoSpecialCharacterDirective{
  constructor(private model:NgModel){}

  onInputChange(event){
    var newValue = event.replace(/[^\w\s]/gi, '');
    this.model.valueAccessor.writeValue(newValue);
  }
}
