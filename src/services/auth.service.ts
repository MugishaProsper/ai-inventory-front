import { LoggingUser, RegisteringUser } from "@/types/User";
import api from '@/lib/api'

const AuthService = {
    login : async (data : LoggingUser) => {
        try {
            const response = await api.post('/auth/login', {
                email : data.email,
                password : data.password
            })
            return response.data
        } catch (error : any) {
            throw error
        }
    },
    register : async (data : RegisteringUser) => {
        try {
            const response = await api.post('/auth/register', {
                email : data.email,
                password : data.password,
                fullname : data.fullname
            })
            return response.data
        } catch (error : any) {
            throw error
        }
    },
    logout : async () => {
        try {
            const response = await api.post('/auth/logout', {
                withCredentials : true
            })
            return response.data
        } catch (error : any) {
            throw error
        }
    },
    forgotPassword : async (email : string) => {
        try {
            const response = await api.post('/auth/forgot-password', {
                email : email
            })
            return response.data
        } catch (error : any) {
            throw error
        }
    },
    resetPassword : async (token : string, password : string) => {
        try {
            const response = await api.post('/auth/reset-password', {
                token : token,
                password : password
            })
            return response.data
        } catch (error : any) {
            throw error
        }
    },
    changePassword : async (oldPassword : string, newPassword : string) => {
        try {
            const response = await api.post('/auth/change-password', {
                oldPassword : oldPassword,
                newPassword : newPassword
            })
            return response.data
        } catch (error : any) {
            throw error
        }
    },
    getCurrentUser : async () => {
        try {
            const response = await api.get('/auth/me')
            return response.data
        } catch (error : any) {
            throw error
        }
    }
};

export default AuthService