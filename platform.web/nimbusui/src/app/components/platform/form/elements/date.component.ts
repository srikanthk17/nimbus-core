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
import { NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { Component, forwardRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WebContentSvc } from '../../../../services/content-management.service';
import { BaseControl } from './base-control.component';
import { PageService } from '../../../../services/page.service';
import { Param } from '../../../../shared/app-config.interface';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateControl),
  multi: true
};

@Component({
  selector: 'nm-input-date',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,WebContentSvc],
  template: `
  <!--<div class='date-holder' [hidden]="!element?.config?.visible?.currState || !element?.visible?.currState" *ngIf="element.config?.uiStyles?.attributes?.hidden==false">-->
  <div class='date-holder' [hidden]="!element?.visible?.currState" *ngIf="element.config?.uiStyles?.attributes?.hidden==false">
  <div class="number" *ngIf="element.config?.uiStyles?.attributes?.controlId!=''">{{element.config?.uiStyles?.attributes?.controlId}}</div>
    <label [attr.for]="element.config?.code" class="">{{label}}
        <nm-tooltip *ngIf="element.config?.uiStyles?.attributes?.help!=''" [helpText]='element.config?.uiStyles?.attributes?.help'></nm-tooltip>
    </label>
    <input
        [id]="element.config?.code" 
        [(ngModel)]="value"
        (focusout)="emitValueChangedEvent(this,$event)"
        [disabled]="!element?.enabled?.currState"
        type="date"
        max="9999-12-31"
        class="form-control" 
        *ngIf="element.config?.uiStyles?.attributes?.readOnly==false">
    <p style="margin-bottom:0rem;" *ngIf="element.config?.uiStyles?.attributes?.readOnly==true">{{element.leafState}}</p>
  </div>
   `
})
export class DateControl extends BaseControl<String> {

    @ViewChild(NgModel) model: NgModel;

    element: Param;

    constructor(wcs: WebContentSvc, pageService: PageService,cd:ChangeDetectorRef) {
        super(pageService,wcs,cd);
    }

}
