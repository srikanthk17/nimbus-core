/**
 * @license
 * Copyright 2017-2018 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
import { ControlValueAccessor } from '@angular/forms/src/directives';
import { Component, Input, Output, EventEmitter,forwardRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Param } from '../../../../shared/app-config.interface';
import { WebContentSvc } from '../../../../services/content-management.service';
import { PageService } from '../../../../services/page.service';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckBoxGroup),
  multi: true
};

@Component({
  selector: 'nm-input-checkbox',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,WebContentSvc ],
  template: `
      <fieldset>
          <legend class="">{{label}}
                <nm-tooltip *ngIf="element.config?.uiStyles?.attributes?.help!=''" [helpText]='element.config?.uiStyles?.attributes?.help'></nm-tooltip>
           </legend>
          <div class="checkboxHolder">
            <div class="form-checkrow" *ngFor="let value of element?.values; let i = index">
                <label class="custom-control custom-check">
                    <input  type="checkbox"
                        (click)="selectOption(value.code, this);emitValueChangedEvent(this,$event)"
                        [checked] = "checkedState(value.code)"
                        [disabled]="!element?.enabled?.currState"
                        class="custom-control-input" 
                        name="{{element.config?.code}}">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">{{value.label}}</span>
                </label>
            </div>
          </div>
    </fieldset>
   `
})

export class CheckBoxGroup implements ControlValueAccessor {

    @Input() element: Param;
    @Input() form: FormGroup;
    @Input('value') _value;
    @Output() antmControlValueChanged =new EventEmitter();
    public label: string;
    // TODO replace selected options with element.leafState once it supports collection
    private selectedOptions: string[] = [];

    constructor(private pageService: PageService,private wcs: WebContentSvc,private cd: ChangeDetectorRef) {
        wcs.content$.subscribe(result => {
            this.label = result.label;
        });
    }

    public onChange: any = (_) => { /*Empty*/ }
    public onTouched: any = () => { /*Empty*/ }

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this.onChange(val);
        this.onTouched();
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    writeValue(value) {
        if(value) {
        }
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    setState(event:any,frmInp:any) {
        frmInp.element.leafState = event;
        this.cd.markForCheck();
        //added to overide the state with ws update.
        //this.selectedOptions = [];
        //this.selectedOptions.push(event);
        //console.log(frmInp.element.leafState);
    }

    emitValueChangedEvent(formControl:any,$event:any) {
        this.antmControlValueChanged.emit(formControl.element);
    }

    selectOption(code: string, elem: any) {
        var array = this.selectedOptions;
        var index = array.indexOf(code);
        if (index > -1) {
            array.splice(index, 1);
        } else {
            array.push(code);
        }
        this.value = this.selectedOptions;
    }

    checkedState(val:any) {
        var array = this.selectedOptions;
        var index = array.indexOf(val);
        if(index> -1) {
            return true;
        } else {
            return false;
        }
    }
    ngOnInit() {
        if(this.element.leafState !=null && this.element.leafState.length > 0) {
            this.selectedOptions = this.element.leafState;
        }
        if( this.form.controls[this.element.config.code]!= null) {
            this.form.controls[this.element.config.code].valueChanges.subscribe(($event) => this.setState($event,this));
            
            this.pageService.eventUpdate$.subscribe(event => {
                let frmCtrl = this.form.controls[event.config.code];
                if(frmCtrl!=null && event.path.startsWith(this.element.path)) {
                    if(event.leafState!=null)
                        frmCtrl.setValue(event.leafState);
                    else
                        frmCtrl.reset();
                }
            });
            this.pageService.validationUpdate$.subscribe(event => {
                let frmCtrl = this.form.controls[event.config.code];
                if(frmCtrl!=null && event.path.startsWith(this.element.path)) {
                    if(event.enabled.currState)
                        frmCtrl.enable();
                    else
                        frmCtrl.disable();
                }
            });
        }
        this.wcs.getContent(this.element.config.code);
        this.antmControlValueChanged.subscribe(($event) => {
             //console.log($event);
             if ($event.config.uiStyles.attributes.postEventOnChange) {
                this.pageService.postOnChange($event.path, 'state', JSON.stringify($event.leafState));
             }
         });
    }
}
