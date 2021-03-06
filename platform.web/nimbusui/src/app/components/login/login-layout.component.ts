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

import { Component } from '@angular/core';
import { AppBranding, Layout, FooterConfig } from '../../model/menu-meta.interface';
import { Param } from '../../shared/app-config.interface';
import { LayoutService } from '../../services/layout.service';

@Component({
    templateUrl: './login-layout.component.html',
    providers: [ LayoutService ]
})

export class LoginLayoutCmp {
    private static LAYOUT: string = 'loginlayout';
    public topMenuItems: Param[];
    public branding: AppBranding;
    public footer: FooterConfig;

    constructor(private layoutSvc: LayoutService) {
        // initialize
        this.branding = {} as AppBranding;

        this.layoutSvc.layout$.subscribe(
            data => {
                let layout: Layout = data;
                this.branding = layout.topBar.branding;
                this.footer = layout.footer;
                this.topMenuItems = layout.topBar.headerMenus;
            }
        );
        this.layoutSvc.getLayout(LoginLayoutCmp.LAYOUT);
    }
}
