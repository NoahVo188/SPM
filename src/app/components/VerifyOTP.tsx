import { useState } from 'react';
import { ArrowLeft, Loader2, Mail, Phone, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface VerifyOTPProps {
  recoveryMethod: 'email' | 'phone';
  identifier: string;
  onBack: () => void;
  onVerified: () => void;
}

export function VerifyOTP({ recoveryMethod, identifier, onBack, onVerified }: VerifyOTPProps) {
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendCode = async () => {
    setIsSending(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(code);
    setIsSending(false);

    toast.success(
      `Mã xác minh đã được gửi đến ${
        recoveryMethod === 'email' ? 'email' : 'số điện thoại'
      } của bạn!`,
      {
        description: `Mã của bạn là: ${code}`,
        duration: 10000,
      }
    );
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!generatedOTP) {
      toast.error('Vui lòng gửi mã xác minh trước!');
      return;
    }

    if (otp.length !== 6) {
      toast.error('Vui lòng nhập đủ 6 chữ số!');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);

    if (otp === generatedOTP) {
      toast.success('Xác minh thành công!');
      setTimeout(() => {
        onVerified();
      }, 500);
    } else {
      toast.error('Mã xác minh không đúng. Vui lòng thử lại.');
      setOtp('');
    }
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

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3">Xác minh mã</h1>
          <p className="text-muted-foreground text-sm mb-4">
            Nhập mã xác minh được gửi đến
          </p>
          <div className="inline-flex items-center gap-2 text-foreground bg-muted/30 px-4 py-2 rounded-lg">
            {recoveryMethod === 'email' ? (
              <Mail className="size-4" />
            ) : (
              <Phone className="size-4" />
            )}
            <span className="text-sm">{identifier}</span>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          {/* Ô nhập mã và nút gửi mã */}
          <div>
            <label className="block mb-3 text-sm font-medium">Mã xác minh</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  <Shield className="size-5 text-foreground stroke-[2.5]" />
                  {!otp && (
                    <span className="text-sm text-muted-foreground">Nhập mã 6 chữ số</span>
                  )}
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setOtp(value);
                  }}
                  className={`w-full pr-4 py-3.5 bg-input-background rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg tracking-[0.3em] font-medium ${
                    otp ? 'pl-12' : 'pl-44'
                  }`}
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={isSending}
                className="px-6 py-3.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2 font-medium"
              >
                {isSending && <Loader2 className="size-4 animate-spin" />}
                {isSending ? 'Đang gửi...' : 'Gửi mã'}
              </button>
            </div>
          </div>

          {/* Nút xác minh */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.01 } : {}}
            whileTap={!isLoading ? { scale: 0.99 } : {}}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {isLoading && <Loader2 className="size-5 animate-spin" />}
            {isLoading ? 'Đang xác minh...' : 'Xác minh'}
          </motion.button>

          {/* Gửi lại */}
          <p className="text-sm text-muted-foreground text-center">
            Chưa nhận được mã?{' '}
            <button
              type="button"
              onClick={handleSendCode}
              disabled={isSending}
              className="text-primary hover:underline disabled:opacity-50 font-medium"
            >
              Gửi lại
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
