import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Clock,
  Smartphone,
  Zap,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ListOrdered,
  Bell,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="pt-28 pb-28 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            <div className="flex justify-center mb-8">
              <Badge
                variant="outline"
                className="py-1.5 px-5 text-sm rounded-full border-slate-300 text-slate-600 bg-slate-50 font-medium"
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-900 inline-block" />
                  The Future of Waitlist Management is Here
                </span>
              </Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-[1.05]">
              Never wait in a <br className="hidden md:block" />
              physical line again.
            </h1>

            <p className="text-xl text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
              DigiQ is a modern, real-time queue management platform. Join lines
              from your phone, track your live position, and arrive exactly when
              it&apos;s your turn.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
              <Button
                size="lg"
                className="h-13 px-8 text-base rounded-full bg-slate-900 text-white hover:bg-slate-700 transition-all hover:-translate-y-0.5 shadow-none"
                asChild
              >
                <Link href="/register">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 px-8 text-base rounded-full border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-all hover:-translate-y-0.5"
                asChild
              >
                <Link href="/services">Browse Services</Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 md:gap-10 text-sm text-slate-500 font-medium flex-wrap">
              {['No app required', 'Free for users', 'Real-time sync'].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-900" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-24 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-16">
              <p className="text-xl font-bold uppercase tracking-widest text-slate-500 mb-3">
                Platform features
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                Everything you need to manage time
              </h2>
              <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
                Built for modern businesses and customers who value their time.
                Powerful enough for hospitals, simple enough for coffee shops.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: Clock,
                  title: 'Real-Time Tracking',
                  description:
                    'Watch your position update instantly without refreshing. Powered by WebSockets for true live data.',
                },
                {
                  icon: Building2,
                  title: 'Smart Dashboards',
                  description:
                    'Comprehensive admin tools for businesses to manage multiple services, active queues, and analytics.',
                },
                {
                  icon: Zap,
                  title: 'Lightning Fast',
                  description:
                    'Optimised infrastructure delivers millisecond-latency status updates between businesses and customers.',
                },
                {
                  icon: Smartphone,
                  title: 'Mobile-First Design',
                  description:
                    'A beautiful responsive web app that feels native on any device. No install needed — works in the browser.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Secure & Reliable',
                  description:
                    'Enterprise-grade JWT authentication, secure sessions, and encrypted transfers keep every user safe.',
                },
                {
                  icon: ListOrdered,
                  title: 'Multi-Service Support',
                  description:
                    'Hospitals, clinics, barbershops, government offices — one platform handles queues for any organisation.',
                },
              ].map((feature) => (
                <Card
                  key={feature.title}
                  className="group border border-slate-200 bg-white hover:border-slate-400 hover:-translate-y-1 transition-all duration-200 shadow-none rounded-2xl"
                >
                  <CardContent className="p-7">
                    <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center mb-5 group-hover:bg-slate-900 transition-colors duration-200">
                      <feature.icon className="h-5 w-5 text-slate-900 group-hover:text-white transition-colors duration-200" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-20">
              <p className="text-xl font-bold uppercase tracking-widest text-slate-500 mb-3">
                How it works
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                Three steps to reclaim your time
              </h2>
              <p className="text-lg text-slate-500">
                Simple enough for anyone, powerful enough for every use case.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              {[
                {
                  step: '01',
                  title: 'Find a Service',
                  desc: 'Browse the directory of services or visit an organisation and head straight to their page.',
                },
                {
                  step: '02',
                  title: 'Join the Queue',
                  desc: 'Get your digital token and an accurate estimated wait time in seconds. No paper, no hassle.',
                },
                {
                  step: '03',
                  title: 'Show Up On Time',
                  desc: 'Track your live position from anywhere. Arrive exactly when it\'s your turn and walk right in.',
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center group">
                  <div className="h-16 w-16 rounded-full border-2 border-slate-200 flex items-center justify-center text-xl font-black text-slate-900 mb-6 group-hover:border-slate-900 transition-colors duration-200 bg-white">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
    <footer className="bg-white border-t border-zinc-200 py-6">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <p className="text-sm text-zinc-500">
      © {new Date().getFullYear()} DigiQ. All rights reserved.
    </p>
  </div>
</footer>
    </div>
  );
}