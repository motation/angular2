import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import {Navigation} from "./navigation/navigation.component";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {WebsocketService} from "./websocket/websocketService";
import {ConfigurationComponent} from "./configuration/configuration.component";


const appRoutes:Routes = [
    // { path: '**', component: HomeComponent },
    {path: 'home', component: HomeComponent},
    {path: 'configuration', component: ConfigurationComponent}
]


@NgModule({
    imports: [BrowserModule, RouterModule.forRoot(appRoutes)],
    declarations: [AppComponent, Navigation, HomeComponent, ConfigurationComponent],
    bootstrap: [AppComponent, Navigation],
    providers: [WebsocketService]
})
export class AppModule {
}
