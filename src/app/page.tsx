"use client";
import Link from "next/link";
import { Leaf, Brain, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
      return;
    }
  }, [router]);
  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="px-6 py-5 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Leaf className="w-8 h-8 text-sky-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">Nivara</span>
            </div>

            <div className="flex items-center gap-5">
              <Link
                href="/login"
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium transition-all shadow-sm hover:shadow flex items-center gap-2"
              >
                Signup
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex items-center justify-center px-6 py-24 lg:py-32">
          <div className="text-center space-y-10 max-w-5xl mx-auto z-1">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-800 rounded-full text-sm font-medium">
                <Brain className="w-4 h-4" />
                AI-Powered Mental Wellness Companion
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                Find calm in{" "}
                <span className="bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  every breath
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Nivara listens, understands, and gently guides you through
                stress, anxiety, and low moments using mindfulness, NLP, and
                ancient Ayurvedic wisdom blended with nature&apos;s healing
                touch.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                <span>100% Private & Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                <span>No Data Sold</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                <span>Backed by Ayurveda & Science</span>
              </div>
            </div>
          </div>
        </main>

        {/* Features */}
        <section id="features" className="py-20 px-6 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Healing through understanding
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Nivara combines modern AI with timeless wellness traditions
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Brain className="w-8 h-8" />,
                  title: "Empathetic NLP Listening",
                  desc: "Understands your emotions, tone, and context — responds with compassion, not scripts.",
                },
                {
                  icon: <Leaf className="w-8 h-8" />,
                  title: "Ayurvedic Mood Boosters",
                  desc: "Personalized herbal teas, aromas, and routines based on your dosha and current state.",
                },
                {
                  icon: <Sparkles className="w-8 h-8" />,
                  title: "Nature-Inspired Mindfulness",
                  desc: "Guided forest baths, sunrise meditations, and breathwork synced with your environment.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 mb-5 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-6 border-t border-slate-200 bg-white/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-sky-600" />
              <span className="font-semibold text-slate-900">Nivara</span>
            </div>

            <p className="text-slate-600">
              © {new Date().getFullYear()} Nivara. Healing with care.
            </p>

            <div className="flex gap-6 text-slate-600">
              {["Privacy", "Science", "Contact"].map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="hover:text-slate-900 transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
