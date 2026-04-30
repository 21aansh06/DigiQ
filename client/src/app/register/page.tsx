import { RegisterForm } from '@/components/auth/register-form';
import { Header } from '@/components/layout/header';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <RegisterForm type="user" />

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Want to register your organization?{' '}
              <a href="/org/register" className="text-slate-900 font-medium hover:underline">
                Register here
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
