import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

interface SignupFormProps {
  onSignInClick?: () => void
}

export function SignupForm({ onSignInClick }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    const { error: authError } = await authClient.signUp.email({
      name,
      email,
      password,
    })
    setLoading(false)

    if (authError) {
      setError(authError.message ?? "Signup failed. Please try again.")
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-8 w-full flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Congratulations!</h2>
        <p className="text-gray-500 text-sm">Your account has been created successfully. Sign in to get started.</p>
        <button
          onClick={() => onSignInClick?.()}
          className="mt-2 w-full bg-[#CA4141] hover:bg-[#b33636] text-white font-medium py-2.5 rounded-full transition-colors"
        >
          Go to Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-8 w-full">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Create Account
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-800">
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            required
            className="rounded-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-800">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            className="rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password + Confirm Password side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-800">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="rounded-xl pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirm-password" className="text-sm font-medium text-gray-800">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                required
                className="rounded-xl pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full bg-[#CA4141] hover:bg-[#b33636] text-white font-medium py-2.5 rounded-full transition-colors disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onSignInClick?.() }}
            className="text-[#CA4141] font-medium"
          >
            Sign in
          </a>
        </p>
      </form>
    </div>
  )
}
