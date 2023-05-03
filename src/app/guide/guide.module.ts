import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuideRoutingModule } from './guide-routing.module';
/* Components */
import { GettingStartedComponent } from './components/getting-started/getting-started.component';
import { BasicComponent } from './components/basic/basic.component';
import { BackgroundComponent } from './components/background/background.component';
import { BorderComponent } from './components/border/border.component';
import { ButtonComponent } from './components/button/button.component';
import { OpacityComponent } from './components/opacity/opacity.component';
import { PositionComponent } from './components/position/position.component';
import { ShadowsComponent } from './components/shadows/shadows.component';
import { SizingComponent } from './components/sizing/sizing.component';
import { TextComponent } from './components/text/text.component';
import { ZIndexComponent } from './components/z-index/z-index.component';

@NgModule({
  declarations: [
    GettingStartedComponent,
    BasicComponent,
    BackgroundComponent,
    BorderComponent,
    ButtonComponent,
    OpacityComponent,
    PositionComponent,
    ShadowsComponent,
    SizingComponent,
    TextComponent,
    ZIndexComponent,
  ],
  imports: [CommonModule, GuideRoutingModule],
  exports: [
    GettingStartedComponent,
    BasicComponent,
    BackgroundComponent,
    BorderComponent,
    ButtonComponent,
    OpacityComponent,
    PositionComponent,
    ShadowsComponent,
    SizingComponent,
    TextComponent,
    ZIndexComponent,
  ],
})
export class GuideModule {}
