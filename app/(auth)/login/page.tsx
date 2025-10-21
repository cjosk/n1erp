import { Suspense } from 'react';
import LoginForm from './LoginForm';

const LoginPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f9fa] text-gray-600">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ff7a00]/30 border-t-[#ff7a00]" />
          <p className="mt-4 text-sm font-medium">Yükleniyor...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
