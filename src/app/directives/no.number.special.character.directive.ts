import {Component, Directive, Output, EventEmitter} from '@angular/core';

import {NgModel} from '@angular/forms';

@Directive({
selector: '[ngModel][nonumberspecialcharacter]',
providers: [NgModel],
host: {
    '(input)' : 'onInputChange($event)'
      }
})
export class NoNumberSpecialCharacterDirective{
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  constructor(private model:NgModel){}

  onInputChange(event){
    console.log(event);
    
    var newValue = event.target.value.replace(/[^\w\s]/gi, '');
    newValue = newValue.replace(/[0-9]/, '');
    this.ngModelChange.emit(newValue);
    this.model.valueAccessor.writeValue(newValue);
  }

}
