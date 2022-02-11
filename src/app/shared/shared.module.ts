import { NgModule } from '@angular/core';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [FormsModule, ReactiveFormsModule, ...SHARED_ZORRO_MODULES],
  exports: [FormsModule, ReactiveFormsModule, ...SHARED_ZORRO_MODULES],
})
export class SharedModule {}
