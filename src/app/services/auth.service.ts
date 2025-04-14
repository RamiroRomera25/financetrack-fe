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

    authenticate(login: LoginRequest): Observable<UserDTO> {
        return this.http.post<UserDTO>(
            `${this.host}/login`,
            toSnakeCase(login)
        ).pipe(
            map((userDTO): UserDTO => {
                return toCamelCase(userDTO);
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
}
