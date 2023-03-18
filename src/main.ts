import { ApplicationRef } from '@angular/core';
import { enableDebugTools } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .then(m => enableDebugTools(m.injector.get(ApplicationRef).components[0]))
  .catch(err => console.error(err));
