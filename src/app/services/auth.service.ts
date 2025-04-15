import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {enviroment} from "../.env/enviroment";
import {LoginRequest, UserDTO, UserDTOPost} from "../models/user";
import {map, Observable} from "rxjs";
import {toCamelCase, toSnakeCase} from "../utils/mappers";
import {log} from "node:util";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);

    host: string = `${enviroment.auth}`
    isLogged: boolean = false;
    userName: string = "";

    register(post: UserDTOPost): Observable<UserDTO> {
        return this.http.post<UserDTO>(
            `${this.host}/register`,
            toSnakeCase(post)
        ).pipe(
            map((userDTO): UserDTO => {
                return toCamelCase(userDTO);
            })
        );
    }

    authenticate(login: LoginRequest): Observable<any> {
        return this.http.post<any>(
            `${this.host}/login`,
            toSnakeCase(login)
        ).pipe(
            map((tokenResponse): any => {
                this.isLogged = true;
                console.log(tokenResponse.user)
                this.userName = tokenResponse.user.last_name + " " + tokenResponse.user.first_name ;
                return toCamelCase(tokenResponse);
            })
        )
    }

    validEmail(email: string): Observable<boolean> {
        const params = new HttpParams()
            .set('email', email.toString());

        console.log("A")
        return this.http.get<boolean>(
            `${this.host}/validEmail`,
            {params}
        );
    }

    setToken(accessToken: string) {
      sessionStorage.setItem("access_token", accessToken);
    }

    removeToken() {
      sessionStorage.removeItem("access_token");
      this.isLogged = false;
    }

    getToken() {
      return sessionStorage.getItem("access_token")
    }

    get logged() {
      return this.isLogged;
    }

    get getUserName() {
      return this.userName
    }
}
