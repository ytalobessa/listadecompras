import { Component } from '@angular/core';

import { ListListasPage } from '../listas/list/list.listas';
import { ListCategoriaPage } from '../categorias/list/list.categoria';
import { SobrePage } from '../sobre/sobre';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    tab1Root: any = ListListasPage;
    tab2Root: any = ListCategoriaPage;
    tab3Root: any = SobrePage;

    constructor() { }
}
