import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';

import { User } from './user';


@Injectable()
export class SigninService {

  //public handleError;

  constructor(
    private _router: Router,
    private http: Http){}


  logout() {
    //localStorage.removeItem("user");
    this._router.navigate(['Login']);
  }

  login(user: any){

    const _signinUrl = 'http://uoosc.cloudapp.net/o/token/';
    const body = JSON.stringify(user);

     //this is optional - angular2 already sends these
  //  const headers = new Headers();

    let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({headers: headers});

    return this.http.post(_signinUrl, user, options)
      .map((data) => {
        console.log(data.json());
        this.extractData  = data.json().access_token;
        localStorage.setItem("user",data.json().access_token)
      })
      .catch(this.handleError);
  }

  handleError(error: any){
    console.error(error);
   return Observable.throw(error.json().error || 'Server error');
  }
  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }

   checkCredentials(){
    if (localStorage.getItem("user") === null){
        this._router.navigate(['Login']);
    }
  }
}
