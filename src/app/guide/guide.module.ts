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
import { SharedModule } from '../shared/shared.module';
import { ColorsComponent } from './components/colors/colors.component';
import { BreakpointsComponent } from './components/breakpoints/breakpoints.component';
import { ReservedWordsComponent } from './components/reserved-words/reserved-words.component';
import { PseudosComponent } from './components/pseudos/pseudos.component';
import { CombinatorsComponent } from './components/combinators/combinators.component';
import { AbbreviationsComponent } from './components/abbreviations/abbreviations.component';
import { CombosComponent } from './components/combos/combos.component';
import { MethodsComponent } from './components/methods/methods.component';
import { AdvancedComponent } from './components/advanced/advanced.component';

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
    ColorsComponent,
    BreakpointsComponent,
    ReservedWordsComponent,
    PseudosComponent,
    CombinatorsComponent,
    AbbreviationsComponent,
    CombosComponent,
    MethodsComponent,
    AdvancedComponent,
  ],
  imports: [CommonModule, GuideRoutingModule, SharedModule],
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
    ColorsComponent,
    BreakpointsComponent,
    ReservedWordsComponent,
    PseudosComponent,
    CombinatorsComponent,
    AbbreviationsComponent,
    CombosComponent,
    MethodsComponent,
    AdvancedComponent,
  ],
})
export class GuideModule {}
