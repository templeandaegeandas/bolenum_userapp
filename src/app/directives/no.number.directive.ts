import {Component, Directive, Output, EventEmitter} from '@angular/core';

import {NgModel} from '@angular/forms';

@Directive({
selector: '[ngModel][nonumber]',
providers: [NgModel],
host: {
    '(ngModelChange)' : 'onInputChange($event)'
      }
})
export class NoNumberDirective{
  constructor(private model:NgModel){}

  onInputChange(event){
    var newValue = event.replace(/[0-9]/, '');
    this.model.valueAccessor.writeValue(newValue);
  }
}
