export interface LoggingUser{
    email : string,
    password : string
}

export interface RegisteringUser extends LoggingUser {
    fullname : string
}

export interface User extends RegisteringUser {
    phone_number : number,
    address : string    
}