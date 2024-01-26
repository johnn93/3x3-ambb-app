import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import {registerLocaleData} from "@angular/common";
import localeRo from '@angular/common/locales/ro';


registerLocaleData(localeRo, 'ro-RO');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
