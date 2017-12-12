'use strict';
import { NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { Component, forwardRef, ViewChild } from '@angular/core';
import { WebContentSvc } from '../../../../services/content-management.service';
import { BaseControl } from './base-control.component';
import { PageService } from '../../../../services/page.service';
import { Param } from '../../../../shared/app-config.interface';
/**
 * \@author Sandeep Mantha
 * \@whatItDoes A control to be used when the user input is in the form of date or date with time or just the time.
 */

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Calendar),
  multi: true
};

@Component({
  selector: 'nm-input-calendar',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,WebContentSvc],
  template: `
        <label [attr.for]="element.config?.code" class="" *ngIf="this.showLabel">{{label}}
            <nm-tooltip *ngIf="element.config?.uiStyles?.attributes?.help!=''" [helpText]='element.config?.uiStyles?.attributes?.help'></nm-tooltip>
        </label>
        <p-calendar [(ngModel)]="value"  
            (focusout)="emitValueChangedEvent(this,$event)" 
            [minDate]="min"
            [maxDate]="max"
            [timeOnly]="element.config?.uiStyles?.attributes?.timeOnly"
            [showTime]="element.config?.uiStyles?.attributes?.showTime" 
            [hourFormat]="element.config?.uiStyles?.attributes?.hourFormat" >
        </p-calendar>
   `
})
export class Calendar extends BaseControl<String> {

    @ViewChild(NgModel) model: NgModel;

    element: Param;
    
    min: Date;
    
    max: Date

    constructor(wcs: WebContentSvc, pageService: PageService) {
        super(pageService,wcs);
    }

    ngOnInit(){
        if(this.element.config.validation!=null) {
            this.element.config.validation.constraints.forEach(validator => {
                if (validator.name === 'DateRange') {
                  this.min = new Date(validator.attribute.min)
                  this.max = new Date(validator.attribute.max)
                }
              });
         }
    }

}
