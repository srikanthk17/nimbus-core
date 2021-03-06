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

import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { Param, Model } from '../../../shared/app-config.interface';
import { DialogModule } from 'primeng/primeng';
import { WebContentSvc } from './../../../services/content-management.service';
import { PageService } from '../../../services/page.service';
import { Action, HttpMethod, Behavior} from './../../../shared/command.enum';
import { GenericDomain } from '../../../model/generic-domain.model';
import { BaseElement } from '../base-element.component';

/**
 * \@author Sandeep.Mantha
 * \@author Dinakar.Meda
 * \@whatItDoes Modal is a container. Modal(s) go within a Tile. Modal windows can have only Section(s).
 * 
 * \@howToUse 
 * @Modal annotation from Configuration drives this. 
 *      Attribute "type = {dialog, slider}".
 *      Attribute "title"
 *      Attribute "cssClass"
 *      Attribute "width" // TODO add from config
 * <nm-modal [element]="element"></nm-modal>
 * 
 */
@Component({
    selector: 'nm-modal',
    templateUrl: './modal.component.html'
})

export class Modal extends BaseElement implements OnInit, OnDestroy {
    // width of modal window
    public _width: string;
    // closable to indicate whether modal window can be closed
    public _closable: boolean;
    // title of modal window
    public title: string;

    constructor(private wcsvc: WebContentSvc, private pageSvc: PageService) {
        super(wcsvc);
    }

    ngOnInit(): void {
        //let modal = this;
        this.title = this.element.config.uiStyles.attributes.title;
    }

    ngOnDestroy() {
    }

    /**
     * Closable attribute. Can the Modal window be closed?
     */
    public get closable(): boolean {
        return this.element.config.uiStyles.attributes.closable;
    }

    /**
     * Width attribute. Width of the Modal Window.
     * TODO drive it through cssClass instead of a separate width attribute.
     */
    public get width(): string {
        return this.element.config.uiStyles.attributes.width;
    }

    /**
     * Close diaglog function.
     */
    public closeDialog(event: any) {
        //console.log('modal close clicked..........');
        if (this.visible) {
            this.pageSvc.processEvent(this.element.path+'/closeModal', Behavior.execute.value, new GenericDomain(), HttpMethod.GET.value);
        }
    }

}
