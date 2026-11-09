import { useState } from 'react';
import { Mail, Phone, ChevronDown, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

type RecoveryMethod = 'email' | 'phone' | null;

interface RegisteredUser {
  identifier: string;
  loginMethod: 'email' | 'phone';
}

interface ForgotPasswordProps {
  onBack: () => void;
  onContinue: (method: 'email' | 'phone', identifier: string) => void;
  registeredUsers: RegisteredUser[];
}

export function ForgotPassword({ onBack, onContinue, registeredUsers }: ForgotPasswordProps) {
  const [recoveryMethod, setRecoveryMethod] = useState<RecoveryMethod>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recoveryMethod) {
      toast.error('Vui lòng chọn phương thức khôi phục!');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Kiểm tra xem identifier có tồn tại trong hệ thống không
    const userExists = registeredUsers.find(
      (u) =>
        u.identifier.toLowerCase() === identifier.toLowerCase() &&
        u.loginMethod === recoveryMethod
    );

    setIsLoading(false);

    if (!userExists) {
      // Thông tin không tồn tại trong hệ thống
      toast.error(
        'Thông tin này chưa được đăng ký trong hệ thống. Vui lòng kiểm tra lại hoặc tạo tài khoản mới.',
        {
          duration: 4000,
        }
      );
      return;
    }

    // Thông tin hợp lệ, chuyển sang màn hình xác minh OTP
    toast.success('Xác thực thông tin tài khoản thành công!');
    setTimeout(() => {
      onContinue(recoveryMethod, identifier);
    }, 500);
  };

  return (
    <div className="size-full flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg p-8"
      >
        {/* Nút quay lại */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="size-5" />
          Quay lại
        </button>

        <div className="mb-10 text-center">
          <h1 className="mb-3">Quên mật khẩu</h1>
          <p className="text-muted-foreground text-sm">
            Chọn phương thức để khôi phục tài khoản của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dropdown chọn phương thức khôi phục */}
          <div className="relative">
            <label className="block mb-2">Phương thức khôi phục</label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-input-background rounded-lg border border-border hover:border-foreground/20 transition-colors"
            >
              <span className="flex items-center gap-2 text-foreground">
                {recoveryMethod === 'email' ? (
                  <>
                    <Mail className="size-5" />
                    Email
                  </>
                ) : recoveryMethod === 'phone' ? (
                  <>
                    <Phone className="size-5" />
                    Số điện thoại
                  </>
                ) : (
                  <span className="text-muted-foreground">Chọn phương thức khôi phục</span>
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
                      setRecoveryMethod('email');
                      setIsDropdownOpen(false);
                      setIdentifier('');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-accent transition-colors text-left"
                  >
                    <Mail className="size-5" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryMethod('phone');
                      setIsDropdownOpen(false);
                      setIdentifier('');
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
            {recoveryMethod && (
              <motion.div
                key={recoveryMethod}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block mb-2">
                  {recoveryMethod === 'email' ? 'Địa chỉ Email' : 'Số điện thoại'}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {recoveryMethod === 'email' ? (
                      <Mail className="size-5" />
                    ) : (
                      <Phone className="size-5" />
                    )}
                  </div>
                  <input
                    type={recoveryMethod === 'email' ? 'email' : 'tel'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      recoveryMethod === 'email'
                        ? 'Nhập email (ví dụ: example@gmail.com)'
                        : 'Nhập số điện thoại'
                    }
                    className="w-full pl-12 pr-4 py-3 bg-input-background rounded-lg border border-border focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nút tiếp tục */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.01 } : {}}
            whileTap={!isLoading ? { scale: 0.99 } : {}}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {isLoading && <Loader2 className="size-5 animate-spin" />}
            {isLoading ? 'Đang kiểm tra...' : 'Tiếp tục'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
