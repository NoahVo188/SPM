import { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, ArrowLeft, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface ResetPasswordProps {
  identifier: string;
  recoveryMethod: 'email' | 'phone';
  onSuccess: (newPassword: string) => void;
  onBack?: () => void;
}

export function ResetPassword({ identifier, recoveryMethod, onSuccess, onBack }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);

    toast.success('Đặt lại mật khẩu thành công!', {
      description: '',
    });

    setTimeout(() => {
      onSuccess(newPassword);
    }, 1500);
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
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="size-5" />
            Quay lại
          </button>
        )}

        <div className="mb-10 text-center">
          <h1 className="mb-3">Đặt lại mật khẩu</h1>
          <p className="text-muted-foreground text-sm mb-3">Tạo mật khẩu mới cho tài khoản</p>
          <div className="inline-flex items-center gap-2 text-foreground bg-muted/30 px-4 py-2 rounded-lg text-sm">
            {recoveryMethod === 'email' ? (
              <Mail className="size-4" />
            ) : (
              <Phone className="size-4" />
            )}
            {identifier}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mật khẩu mới */}
          <div>
            <label className="block mb-2">Mật khẩu mới</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="size-5" />
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="w-full pl-12 pr-12 py-3 bg-input-background rounded-lg border border-border focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showNewPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block mb-2">Xác nhận mật khẩu</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="size-5" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full pl-12 pr-12 py-3 bg-input-background rounded-lg border border-border focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>

          {/* Nút xác nhận */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.01 } : {}}
            whileTap={!isLoading ? { scale: 0.99 } : {}}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {isLoading && <Loader2 className="size-5 animate-spin" />}
            {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
