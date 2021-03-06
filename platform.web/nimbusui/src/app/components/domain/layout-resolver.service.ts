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

import { WebContentSvc } from './../../services/content-management.service';
import { BreadcrumbService } from './../platform/breadcrumb/breadcrumb.service';
import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { PageService } from '../../services/page.service';

@Injectable()
export class LayoutResolver implements Resolve<string> {

    constructor(
        private _pageSvc: PageService, 
        private router: Router,
        private _breadcrumbService: BreadcrumbService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> | Promise<string> {
        let flowName = route.params['domain'];
        let flowConfig = this._pageSvc.getFlowConfig(flowName);
        if (flowConfig) {

            // Push the home breadcrumb into memory under the domain name.
            this._breadcrumbService.push(flowName, 'Home', flowConfig.params[0].path);

            let routeToDefaultPage: boolean = true;
            if (route.firstChild.params['pageId']) {
                routeToDefaultPage = false;
            }
            return this._pageSvc.getFlowLayoutConfig(flowName, routeToDefaultPage).then(layout => {
                return layout;
            });
        } else {
            this._pageSvc.getLayoutConfigForFlow(flowName);
            return this._pageSvc.layout$.map(layout => {
                return layout;
            }).first();
        }
    }
}
