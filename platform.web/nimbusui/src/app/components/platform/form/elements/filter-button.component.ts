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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Param } from '../../../../shared/app-config.interface';
import { FormGroup } from '@angular/forms';
import { WebContentSvc } from '../../../../services/content-management.service';
import { PageService } from '../../../../services/page.service';
import { ServiceConstants } from './../../../../services/service.constants';

@Component({
    selector: 'nm-filter-button',
    providers: [WebContentSvc],
    template:`
        <button class="{{fbutton.config?.uiStyles?.attributes?.cssClass}}" (click)="emitEvent(this)" type="button">
            {{label}}
            <ng-template [ngIf]="fText?.config?.uiStyles?.attributes?.alias == 'TextBox'">
                <span class="badge badge-default">{{fText?.leafState}}</span>
            </ng-template>
        </button>
    `
})

export class FilterButton {
   @Input() filterButton: Param;
   @Input() form: FormGroup;
   @Output() buttonClickEvent = new EventEmitter();
   public label: string;
   public fbutton: Param;
   public fText: Param;
  // private filterCount: string;
   private imagesPath: string;

   constructor(private pageService: PageService, private wcs: WebContentSvc) {
       wcs.content$.subscribe( result => {
           this.label = result.label;
       } );
   }

   ngOnInit() {
       this.imagesPath = ServiceConstants.IMAGES_URL;
       for(var p in this.filterButton.type.model.params) {
           let element = this.filterButton.type.model.params[p];
           if (element.config.uiStyles.attributes.alias === 'Button') {
               this.fbutton = element;
               this.wcs.getContent(element.config.code);
           }
           if (element.config.uiStyles.attributes.alias === 'TextBox') {
               this.fText = element;
               //this.filterCount = element.leafState;
           }
       }
       this.buttonClickEvent.subscribe(( $event ) => {
           //console.log( $event );
           this.pageService.processEvent( $event.fbutton.path, $event.fbutton.config.uiStyles.attributes.b,
               null, $event.fbutton.config.uiStyles.attributes.method );
       } );
   }

   emitEvent( $event: any ) {
       this.buttonClickEvent.emit( $event );
   }

}
