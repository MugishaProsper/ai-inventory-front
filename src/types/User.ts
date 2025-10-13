export interface LoggingUser{
    email : string,
    password : string
}

export interface RegisteringUser {
    fullname : string,
    username : string,
    email : string,
    password : string
}

export interface User extends RegisteringUser {
    phone_number : number,
    address : string    
}