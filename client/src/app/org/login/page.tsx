import { LoginForm } from '@/components/auth/login-form';
import { Header } from '@/components/layout/header';

export default function OrgLoginPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <LoginForm type="org" />

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Are you a user?{' '}
              <a href="/login" className="text-slate-900 font-medium hover:underline">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
