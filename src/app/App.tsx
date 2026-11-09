import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Lock,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast, Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { ForgotPassword } from "./components/ForgotPassword";
import { VerifyOTP } from "./components/VerifyOTP";
import { ResetPassword } from "./components/ResetPassword";

type LoginMethod = "email" | "phone" | null;
type FormMode = "login" | "register";
type ForgotPasswordStep = "method" | "verify" | "reset" | null;

interface RegisteredUser {
  identifier: string;
  password: string;
  loginMethod: "email" | "phone";
}

export default function App() {
  const [formMode, setFormMode] = useState<FormMode>("login");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [forgotPasswordStep, setForgotPasswordStep] =
    useState<ForgotPasswordStep>(null);
  const [recoveryData, setRecoveryData] = useState<{
    method: "email" | "phone";
    identifier: string;
  } | null>(null);

  // Mock database - lưu danh sách user đã đăng ký
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(
    () => {
      // Load từ localStorage nếu có
      const saved = localStorage.getItem("registeredUsers");
      if (saved) {
        return JSON.parse(saved);
      }
      // User demo có sẵn
      return [
        {
          identifier: "demo@gmail.com",
          password: "123456",
          loginMethod: "email",
        },
        {
          identifier: "+84 987 654 321",
          password: "123456",
          loginMethod: "phone",
        },
      ];
    },
  );

  // Lưu registeredUsers vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginMethod) {
      toast.error("Vui lòng chọn phương thức đăng nhập!");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Tìm user trong database
    const user = registeredUsers.find(
      (u) =>
        u.identifier.toLowerCase() === identifier.toLowerCase() &&
        u.password === password &&
        u.loginMethod === loginMethod,
    );

    setIsLoading(false);

    if (user) {
      // Đăng nhập thành công
      toast.success("Đăng nhập thành công!");
      setTimeout(() => {
        setCurrentUser(user);
        setIsLoggedIn(true);
      }, 500);
    } else {
      // Đăng nhập thất bại
      toast.error(
        "Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại email/số điện thoại hoặc mật khẩu.",
        {
          duration: 4000,
        },
      );
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginMethod) {
      toast.error("Vui lòng chọn phương thức đăng ký!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Kiểm tra user đã tồn tại chưa
    const existingUser = registeredUsers.find(
      (u) =>
        u.identifier.toLowerCase() === identifier.toLowerCase() &&
        u.loginMethod === loginMethod,
    );

    setIsLoading(false);

    if (existingUser) {
      toast.error("Tài khoản này đã tồn tại!");
      return;
    }

    // Đăng ký thành công
    const newUser: RegisteredUser = {
      identifier,
      password,
      loginMethod,
    };

    setRegisteredUsers([...registeredUsers, newUser]);
    toast.success("Đăng ký thành công! Vui lòng đăng nhập.");

    // Chuyển về form đăng nhập
    setTimeout(() => {
      switchMode("login");
    }, 1000);
  };

  const switchMode = (mode: FormMode) => {
    setFormMode(mode);
    setLoginMethod(null);
    setIdentifier("");
    setPassword("");
    setConfirmPassword("");
    setIsLoading(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIdentifier("");
    setPassword("");
    setConfirmPassword("");
    setLoginMethod(null);
    toast.info("Đã đăng xuất");
  };

  // Nếu đã đăng nhập, hiển thị Dashboard
  if (isLoggedIn && currentUser) {
    return (
      <Dashboard
        userInfo={{
          identifier: currentUser.identifier,
          loginMethod: currentUser.loginMethod,
        }}
        onLogout={handleLogout}
      />
    );
  }

  // Nếu đang ở luồng quên mật khẩu
  if (forgotPasswordStep === "method") {
    return (
      <>
        <Toaster position="top-center" richColors />
        <ForgotPassword
          onBack={() => setForgotPasswordStep(null)}
          onContinue={(method, identifier) => {
            setRecoveryData({ method, identifier });
            setForgotPasswordStep("verify");
          }}
          registeredUsers={registeredUsers}
        />
      </>
    );
  }

  if (forgotPasswordStep === "verify" && recoveryData) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <VerifyOTP
          recoveryMethod={recoveryData.method}
          identifier={recoveryData.identifier}
          onBack={() => setForgotPasswordStep("method")}
          onVerified={() => setForgotPasswordStep("reset")}
        />
      </>
    );
  }

  if (forgotPasswordStep === "reset" && recoveryData) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <ResetPassword
          identifier={recoveryData.identifier}
          recoveryMethod={recoveryData.method}
          onBack={() => setForgotPasswordStep("verify")}
          onSuccess={(newPassword) => {
            // Cập nhật mật khẩu mới vào database
            setRegisteredUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.identifier.toLowerCase() ===
                  recoveryData.identifier.toLowerCase() &&
                user.loginMethod === recoveryData.method
                  ? { ...user, password: newPassword }
                  : user,
              ),
            );

            // Reset luồng quên mật khẩu
            setForgotPasswordStep(null);
            setRecoveryData(null);
          }}
        />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="size-full flex items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg p-8"
        >
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="size-16 bg-gray-900 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-3xl">B</span>
            </div>
            <div className="text-center">
              <h2 className="font-bold text-gray-900 text-xl">
                SkinCare System
              </h2>
              <p className="text-sm text-gray-500">Hệ thống phân tích da</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 p-1 bg-gray-100 rounded-xl grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`py-2.5 font-medium text-sm rounded-lg transition-all duration-200 ${
                formMode === "login"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`py-2.5 font-medium text-sm rounded-lg transition-all duration-200 ${
                formMode === "register"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Đăng ký
            </button>
          </div>

          <form
            onSubmit={formMode === "login" ? handleLogin : handleRegister}
            className="space-y-5"
          >
            {/* Dropdown chọn phương thức */}
            <div className="relative">
              <label className="block mb-2">
                {formMode === "login"
                  ? "Phương thức đăng nhập"
                  : "Phương thức đăng ký"}
              </label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-input-background rounded-lg border border-border hover:border-foreground/20 transition-colors"
              >
                <span className="flex items-center gap-2 text-foreground">
                  {loginMethod === "email" ? (
                    <>
                      <Mail className="size-5" />
                      Email
                    </>
                  ) : loginMethod === "phone" ? (
                    <>
                      <Phone className="size-5" />
                      Số điện thoại
                    </>
                  ) : (
                    <span className="text-muted-foreground">
                      {formMode === "login"
                        ? "Chọn phương thức đăng nhập"
                        : "Chọn phương thức đăng ký"}
                    </span>
                  )}
                </span>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="size-5" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 w-full mt-2 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod("email");
                        setIsDropdownOpen(false);
                        setIdentifier("");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-accent transition-colors text-left"
                    >
                      <Mail className="size-5" />
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod("phone");
                        setIsDropdownOpen(false);
                        setIdentifier("");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-accent transition-colors text-left"
                    >
                      <Phone className="size-5" />
                      Số điện thoại
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input động - chỉ hiện khi đã chọn phương thức */}
            <AnimatePresence mode="wait">
              {loginMethod && (
                <motion.div
                  key={loginMethod}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block mb-2">
                    {loginMethod === "email"
                      ? "Địa chỉ Email"
                      : "Số điện thoại"}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {loginMethod === "email" ? (
                        <Mail className="size-5" />
                      ) : (
                        <Phone className="size-5" />
                      )}
                    </div>
                    <input
                      type={loginMethod === "email" ? "email" : "tel"}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        loginMethod === "email"
                          ? "example@gmail.com"
                          : "+84 123 456 789"
                      }
                      className="w-full pl-12 pr-4 py-3 bg-input-background rounded-lg border border-border focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input mật khẩu - luôn hiển thị */}
            <div>
              <label className="block mb-2">Mật khẩu</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="size-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-12 pr-12 py-3 bg-input-background rounded-lg border border-border focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu - chỉ hiện khi đăng ký */}
            <AnimatePresence>
              {formMode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block mb-2">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock className="size-5" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full pl-12 pr-12 py-3 bg-input-background rounded-lg border border-border focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quên mật khẩu - chỉ hiện khi đăng nhập */}
            {formMode === "login" && (
              <div className="text-right">
                {/* <button
                type="button"
                onClick={() => {
                  setForgotPasswordStep('method');
                }}
                className="text-primary hover:underline transition-all"
              >
                Quên mật khẩu?
              </button> */}
              </div>
            )}

            {/* Nút đăng nhập/đăng ký */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="size-5 animate-spin" />}
              {isLoading
                ? formMode === "login"
                  ? "Đang đăng nhập..."
                  : "Đang đăng ký..."
                : formMode === "login"
                  ? "Đăng nhập"
                  : "Đăng ký"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
