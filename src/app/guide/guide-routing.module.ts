import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
/* Components */
const routes: Routes = [
  { path: '', component: GettingStartedComponent },
  { path: 'getting-started', component: GettingStartedComponent },
  { path: 'basic', component: BasicComponent },
  { path: 'background', component: BackgroundComponent },
  { path: 'border', component: BorderComponent },
  { path: 'button', component: ButtonComponent },
  { path: 'opacity', component: OpacityComponent },
  { path: 'position', component: PositionComponent },
  { path: 'shadows', component: ShadowsComponent },
  { path: 'sizing', component: SizingComponent },
  { path: 'text', component: TextComponent },
  { path: 'z-index', component: ZIndexComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuideRoutingModule {}
