interface BaseAPIResponse<T>{
    success : boolean
    message : string
    data : T
}

interface ApiError{
    success : boolean
    message : string
}