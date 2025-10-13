import { motion } from "framer-motion"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

const Login: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const { loading, login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            await login(email, password)
            navigate("/")
        } catch (error : any) {
            throw new Error(error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-lg shadow-md w-96"
            >
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                <div className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        className="w-full"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                    <p className="text-center text-gray-600">
                        Don't have an account?{" "}
                        <Button
                            variant="link"
                            className="text-blue-600 p-0"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </Button>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default Login