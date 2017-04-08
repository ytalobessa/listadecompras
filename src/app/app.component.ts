import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { DatabaseService } from '../providers/shared/database.service'

@Component({
    templateUrl: 'app.html',
    providers: [DatabaseService]
})
export class MyApp {
    rootPage = TabsPage;

    constructor(platform: Platform, database: DatabaseService) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();

            if (database)
                database.createDatabase();
        });
    }
}
