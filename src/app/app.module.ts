import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';

import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { ListCategoriaPage } from '../pages/categorias/list/list.categoria';
import { EditCategoriaPage } from '../pages/categorias/edit/edit.categoria';
import { ListListasPage } from '../pages/listas/list/list.listas';
import { EditListaPage } from '../pages/listas/edit/edit.lista';
import { DetailListaPage } from '../pages/listas/detail/detail.lista';
import { EditProdutoPage } from '../pages/listas/produto/edit.produto';
import { SobrePage } from '../pages/sobre/sobre';

import { DatabaseService } from '../providers/shared/database.service'
import { ToastService } from '../providers/shared/toast.service'
import { CategoriaService } from '../providers/categorias/categoria.service'
import { ListaService } from '../providers/listas/lista.service'
import { ProdutoService } from '../providers/listas/produto.service'

@NgModule({
    declarations: [
        MyApp,
        ListCategoriaPage,
        ListListasPage,
        TabsPage,
        EditListaPage,
        EditCategoriaPage,
        DetailListaPage,
        EditProdutoPage,
        SobrePage
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ListCategoriaPage,
        ListListasPage,
        TabsPage,
        EditListaPage,
        EditCategoriaPage,
        DetailListaPage,
        EditProdutoPage,
        SobrePage
    ],
    providers: [
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        SQLite,
        ToastService,
        DatabaseService,
        CategoriaService,
        ListaService,
        ProdutoService
    ]
})
export class AppModule { }
