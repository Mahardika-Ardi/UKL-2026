"use client";

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInView } from "react-intersection-observer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Category {
  name: string;
  image: string;
  desc: string;
}

interface Reason {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface Social {
  label: string;
  icon: string;
  href: string;
}

interface ContactItem {
  iconPath: string;
  text: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface ParticleCanvasProps {
  className?: string;
  density?: number;
  connectDistance?: number;
  particleColor?: string;
  lineColor?: string;
}

interface RevealItemProps {
  children: React.ReactNode;
  index: number;
}

interface CategoryCardProps {
  cat: Category;
  index: number;
}

const categories: Category[] = [
  {
    name: "Sabuk",
    image: "/img/sabuk.jpg",
    desc: "Ikat pinggang sekolah berkualitas premium dengan bahan tahan lama.",
  },
  {
    name: "Dasi",
    image: "/img/dasi.jpg",
    desc: "Dasi formal dengan kerapian jahitan standar sekolah resmi.",
  },
  {
    name: "Hasduk",
    image: "/img/hasduk.jpg",
    desc: "Hasduk pramuka dengan warna resmi dan logo yang rapi.",
  },
  {
    name: "Almamater",
    image: "/img/almet.jpg",
    desc: "Jaket almamater dengan bordir logo sekolah yang presisi.",
  },
  {
    name: "Kaos Kaki",
    image: "/img/kaos-kaki.jpg",
    desc: "Kaos kaki putih dengan bahan adem dan tidak mudah sobek.",
  },
  {
    name: "Seragam",
    image: "/img/sma.jpg",
    desc: "Seragam lengkap SD, SMP, SMA dengan ukuran dan warna standar.",
  },
];

const reasons: Reason[] = [
  {
    title: "Sesuai Standar Resmi",
    desc: "Logo, warna, dan ukuran dijamin sesuai aturan dinas pendidikan & sekolah.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Bahan Premium & Awet",
    desc: "Menggunakan bahan pilihan yang tidak panas, nyaman, dan tahan lama.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
  },
  {
    title: "Praktis & Cepat",
    desc: "Pesan dari rumah, barang langsung diantar — tanpa perlu ke koperasi.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
  },
];

const socials: Social[] = [
  { label: "WhatsApp", icon: "ri-whatsapp-fill", href: "#" },
  { label: "Instagram", icon: "ri-instagram-line", href: "#" },
  { label: "Facebook", icon: "ri-facebook-circle-fill", href: "#" },
  { label: "Twitter", icon: "ri-twitter-x-line", href: "#" },
];

const contactItems: ContactItem[] = [
  {
    iconPath:
      "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    text: "+62 821-8231-0",
  },
  {
    iconPath:
      "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    text: "hello@atributo.com",
  },
  {
    iconPath:
      "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    text: "Indonesia",
  },
];

function ParticleCanvas({
  className = "",
  density = 60,
  connectDistance = 130,
  particleColor = "rgba(73,17,28,0.9)",
  lineColor = "73,17,28",
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let mouse: { x: number; y: number } | null = null;

    // Spatial grid
    const cellSize = connectDistance;
    const grid = new Map<number, Particle[]>();
    const cellKey = (cx: number, cy: number): number => cx * 100000 + cy;

    const updateGrid = (): void => {
      grid.clear();
      for (const p of particles) {
        const cx = Math.floor(p.x / cellSize);
        const cy = Math.floor(p.y / cellSize);
        const key = cellKey(cx, cy);
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key)!.push(p);
      }
    };

    const getNeighbors = (p: Particle): Particle[] => {
      const cx = Math.floor(p.x / cellSize);
      const cy = Math.floor(p.y / cellSize);
      const out: Particle[] = [];
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const b = grid.get(cellKey(cx + dx, cy + dy));
          if (b) out.push(...b);
        }
      }
      return out;
    };

    const seed = (): void => {
      particles = Array.from({ length: density }).map(
        (): Particle => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.6 + 0.8,
        }),
      );
    };

    const resize = (): void => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onMove = (e: MouseEvent): void => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = (): void => {
      mouse = null;
    };
    canvas.addEventListener("mousemove", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);

    const [lr, lg, lb] = lineColor
      .split(",")
      .map((n) => parseInt(n.trim(), 10));
    const cd2 = connectDistance * connectDistance;

    const tick = (): void => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        if (mouse) {
          const dx = p.x - mouse.x,
            dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > 0 && d2 < 14400) {
            const d = Math.sqrt(d2),
              f = (120 - d) / 120;
            p.x += (dx / d) * f * 2;
            p.y += (dy / d) * f * 2;
          }
        }
      }

      updateGrid();

      const seen = new Set<string>();
      for (const p of particles) {
        for (const q of getNeighbors(p)) {
          if (q === p) continue;
          const key =
            p.x <= q.x
              ? `${p.x}|${p.y}|${q.x}|${q.y}`
              : `${q.x}|${q.y}|${p.x}|${p.y}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const dx = p.x - q.x,
            dy = p.y - q.y,
            d2 = dx * dx + dy * dy;
          if (d2 < cd2) {
            const op = (1 - Math.sqrt(d2) / connectDistance) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${lr},${lg},${lb},${op})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [density, connectDistance, particleColor, lineColor]);

  return <canvas ref={canvasRef} className={className} />;
}

function useCssTilt(maxTilt = 10): React.RefCallback<HTMLElement> {
  const nodeRef = useRef<HTMLElement | null>(null);

  return useCallback(
    (node: HTMLElement | null): void => {
      const prev = nodeRef.current;
      if (prev) {
        const p = prev as HTMLElement & {
          __cm?: EventListener;
          __cl?: EventListener;
        };
        if (p.__cm) prev.removeEventListener("mousemove", p.__cm);
        if (p.__cl) prev.removeEventListener("mouseleave", p.__cl);
      }

      nodeRef.current = node;
      if (!node) return;

      node.style.setProperty("--tx", "0deg");
      node.style.setProperty("--ty", "0deg");
      node.style.setProperty("--ts", "1");
      node.style.transform =
        "perspective(1000px) rotateX(var(--tx)) rotateY(var(--ty)) scale(var(--ts))";
      node.style.transition = "transform 0.15s ease-out";

      const onMove = (e: MouseEvent): void => {
        const r = node.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * maxTilt;
        const y = ((e.clientY - r.top) / r.height - 0.5) * maxTilt;
        node.style.setProperty("--tx", `${-y}deg`);
        node.style.setProperty("--ty", `${x}deg`);
        node.style.setProperty("--ts", "1.02");
      };
      const onLeave = (): void => {
        node.style.setProperty("--tx", "0deg");
        node.style.setProperty("--ty", "0deg");
        node.style.setProperty("--ts", "1");
      };

      const n = node as HTMLElement & {
        __cm?: EventListener;
        __cl?: EventListener;
      };
      n.__cm = onMove as EventListener;
      n.__cl = onLeave as EventListener;
      node.addEventListener("mousemove", onMove);
      node.addEventListener("mouseleave", onLeave);
    },
    [maxTilt],
  );
}

const RevealItem = memo(function RevealItem({
  children,
  index,
}: RevealItemProps) {
  const { ref, inView } = useInView({
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-30px)",
        transitionDelay: `${index * 150}ms`,
      }}
    >
      {children}
    </div>
  );
});
RevealItem.displayName = "RevealItem";

const CategoryCard = memo(function CategoryCard({
  cat,
  index,
}: CategoryCardProps) {
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px",
    triggerOnce: true,
  });
  const tiltRef = useCssTilt(6);

  const setRef = useCallback(
    (node: HTMLDivElement | null): void => {
      inViewRef(node);
    },
    [inViewRef],
  );

  return (
    <div
      ref={setRef}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(60px)",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <Link
        href={`/products/${cat.name.toLowerCase()}`}
        ref={tiltRef as React.RefCallback<HTMLAnchorElement>}
        className="group relative block bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative h-64 overflow-hidden">
          <Image
            src={cat.image}
            alt={cat.name}
            width={500}
            height={300}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0A0908]/80 via-[#0A0908]/20 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 bg-white/90 text-[#49111C] text-xs font-bold rounded-full">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br from-[#49111C]/20 to-transparent" />
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2 group-hover:text-[#49111C] transition-colors">
            {cat.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {cat.desc}
          </p>
          <div className="flex items-center gap-2 text-[#49111C] font-semibold text-sm">
            <span>Lihat Produk</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
});
CategoryCard.displayName = "CategoryCard";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Hero refs
  const heroWrapRef = useRef<HTMLDivElement>(null);
  const heroTiltRef = useCssTilt(8);
  const imageTiltRef = useCssTilt(12);

  const { ref: whyRef, inView: whyVisible } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { ref: ctaRef, inView: ctaVisible } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    const hero = heroWrapRef.current;
    if (!hero) return;

    const setY = gsap.quickSetter(hero, "y", "px") as (v: number) => void;
    const setOp = gsap.quickSetter(hero, "opacity") as (v: number) => void;

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const sy = self.scroll();
        setY(sy * 0.3);
        setOp(Math.max(1 - sy / 600, 0.3));
        setScrollProgress(self.progress * 100);
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  const heroRefCallback = useCallback(
    (node: HTMLDivElement | null): void => {
      (heroWrapRef as React.MutableRefObject<HTMLDivElement | null>).current =
        node;
      heroTiltRef(node as HTMLElement | null);
    },
    [heroTiltRef],
  );

  const whySectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!whyVisible || !whySectionRef.current) return;
    gsap.fromTo(
      whySectionRef.current.querySelectorAll<HTMLElement>(".why-item"),
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" },
    );
  }, [whyVisible]);

  const categoryCards = useMemo(
    () =>
      categories.map((cat, i) => (
        <CategoryCard key={cat.name} cat={cat} index={i} />
      )),
    [],
  );

  return (
    <div className="min-h-screen bg-[#F2F4F3] text-[#0A0908] font-sans antialiased overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 z-100 h-1 bg-transparent pointer-events-none">
        <div
          className="h-full bg-linear-to-r from-[#49111C] via-[#F2F4F3] to-[#49111C] shadow-lg shadow-[#49111C]/50"
          style={{ width: `${scrollProgress}%`, transition: "none" }}
        />
      </div>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#0A0908] via-[#1f1418] to-[#49111C]" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay"
          style={{ backgroundImage: "url('/img/telkom.jpeg')" }}
        />

        <ParticleCanvas
          className="absolute inset-0 w-full h-full"
          density={70}
          connectDistance={140}
          particleColor="rgba(242,244,243,0.85)"
          lineColor="242,244,243"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0A0908] via-transparent to-[#0A0908]/40 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(10,9,8,0.7) 100%)",
          }}
        />

        <div
          ref={heroRefCallback}
          className="relative z-10 text-center max-w-4xl px-6"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
          }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8"
            style={{ transform: "translateZ(40px)" }}
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-sm tracking-wide">
              Stok Tersedia • Pengiriman Seluruh Indonesia
            </span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
            style={{ transform: "translateZ(60px)" }}
          >
            <span className="block text-white">Atributo</span>
            <span className="mt-2 text-[#49111C] bg-[#F2F4F3] px-6 py-2 rounded-xl inline-block shadow-2xl">
              Pusat Atribut Sekolah
            </span>
          </h1>

          <p
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ transform: "translateZ(30px)" }}
          >
            Lengkapi kebutuhan seragam, topi, dasi, hingga ikat pinggang sekolah
            putra-putri Anda dalam{" "}
            <span className="font-semibold text-white">satu tempat</span>.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            style={{ transform: "translateZ(50px)" }}
          >
            <Link
              href="/login"
              className="group inline-flex items-center gap-3 px-12 py-4 bg-[#49111C] hover:bg-[#5a1622] text-white font-semibold rounded-full shadow-2xl shadow-[#49111C]/50 transition-all duration-300 hover:scale-105 active:scale-100"
            >
              Belanja Sekarang
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <a
              href="#kenapa"
              className="inline-flex items-center gap-2 px-8 py-4 text-white/80 hover:text-white font-medium transition-colors"
            >
              Pelajari dulu
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <div className="flex flex-col items-center gap-2 text-white/50">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      <section
        id="kenapa"
        className="py-28 bg-[#F2F4F3] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(73,17,28,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div
          ref={whyRef as React.RefCallback<HTMLDivElement>}
          className="relative z-10 container mx-auto px-6 max-w-7xl transition-all duration-1200 ease-out"
          style={{
            opacity: whyVisible ? 1 : 0,
            transform: whyVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div
            ref={whySectionRef}
            className="grid lg:grid-cols-2 gap-20 items-center"
          >
            <div
              ref={imageTiltRef as React.RefCallback<HTMLDivElement>}
              className="relative"
              style={{ transformStyle: "preserve-3d", willChange: "transform" }}
            >
              <div className="absolute -inset-4 bg-linear-to-tr from-[#49111C]/30 to-[#49111C]/5 rounded-3xl blur-2xl" />
              <div className="relative group">
                <Image
                  src="/img/telkom.jpeg"
                  alt="Toko Atributo"
                  width={1000}
                  height={800}
                  className="w-full h-130 object-cover rounded-3xl shadow-2xl"
                />
                <div
                  className="absolute -top-4 -left-4 bg-[#0A0908] text-[#F2F4F3] px-4 py-2 rounded-xl shadow-xl text-sm font-semibold"
                  style={{ transform: "rotate(-5deg)" }}
                >
                  ✦ Sejak 2026
                </div>
              </div>
            </div>

            <div>
              <span className="inline-block px-4 py-1.5 bg-[#49111C]/10 text-[#49111C] text-sm font-semibold rounded-full mb-5">
                Kenapa Memilih Kami
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-8">
                Kenapa Harus Belanja di{" "}
                <span className="text-[#49111C]">Atributo?</span>
              </h2>
              <ul className="space-y-4">
                {reasons.map((r) => (
                  <li key={r.title} className="why-item opacity-0">
                    <div className="flex gap-5 p-4 rounded-2xl hover:bg-white transition-colors duration-300 group">
                      <div className="shrink-0 w-14 h-14 bg-[#49111C]/10 text-[#49111C] rounded-2xl flex items-center justify-center group-hover:bg-[#49111C] group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                        {r.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1">{r.title}</h3>
                        <p className="text-gray-600 leading-relaxed">
                          {r.desc}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="mt-10 inline-flex items-center gap-2 px-8 py-4 bg-[#0A0908] hover:bg-[#1a1a1a] text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-[1.03]">
                Pelajari Lebih Lanjut
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 bg-linear-to-brom-[#F2F4F3] to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(73,17,28,0.04)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative z-10 container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[#49111C]/10 text-[#49111C] text-sm font-semibold rounded-full mb-4">
              Produk Kami
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Kategori Produk
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Temukan berbagai kebutuhan atribut sekolah Anda dengan kualitas
              terbaik dan harga terjangkau.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryCards}
          </div>
        </div>
      </section>

      <section
        ref={ctaRef as React.RefCallback<HTMLElement>}
        className="py-24 bg-[#49111C] relative overflow-hidden transition-all duration-1000"
        style={{
          opacity: ctaVisible ? 1 : 0,
          transform: ctaVisible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,244,243,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Siap Melengkapi Kebutuhan Sekolah?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Dapatkan atribut sekolah berkualitas dengan harga terjangkau. Pesan
            sekarang dan nikmati kemudahan belanja online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#F2F4F3] hover:bg-white text-[#49111C] font-bold rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Mulai Belanja
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <a
              href="#footer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-white/40 hover:border-white text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/10 hover:scale-105"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>

      <footer
        id="footer"
        className="relative overflow-hidden bg-[#0A0908] text-white pt-24 pb-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(242,244,243,0.04)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-extrabold tracking-wider mb-5">
                ATRIBUT<span className="text-[#49111C]">O</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Pusat atribut sekolah terlengkap dengan kualitas terbaik.
                Melayani kebutuhan seragam dan atribut sekolah untuk semua
                jenjang pendidikan.
              </p>
              <div className="flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-10 h-10 bg-white/10 hover:bg-[#49111C] hover:scale-110 hover:-rotate-6 rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    <i className={s.icon} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-5">Kategori</h3>
              <ul className="space-y-3">
                {categories.map((c) => (
                  <li key={c.name}>
                    <Link
                      href={`/products/${c.name.toLowerCase()}`}
                      className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-5">Customer Care</h3>
              <ul className="space-y-3">
                {(
                  [
                    "FAQ",
                    "Kebijakan Atributo",
                    "Cara Memesan",
                    "Pengiriman",
                    "Retur & Refund",
                  ] as const
                ).map((link) => (
                  <li key={link}>
                    <Link
                      href={`/help/${link.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                      className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-5">Hubungi Kami</h3>
              <div className="space-y-4 text-white/60">
                {contactItems.map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-5 h-5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={item.iconPath}
                      />
                    </svg>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2026 Atributo. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-sm text-white/40">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
