import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpService } from "../services/http.service";

@Injectable()

export class AuthInterceptor implements HttpInterceptor{

    constructor(private httpService: HttpService){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler){
        const authToken = this.httpService.getToken();
        const authRequest = req.clone({headers: req.headers.set('Authorization', "Bearer " + authToken)}); // create copy of request & argument edits the request
        return next.handle(authRequest);
    }
}