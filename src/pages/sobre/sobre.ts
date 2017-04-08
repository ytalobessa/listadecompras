import { Component } from '@angular/core';

@Component({
    selector: 'sobre',
    templateUrl: 'sobre.html'
})
export class SobrePage {
    versao: string

    constructor() {
        this.versao = "1.0.0";
    }
}
