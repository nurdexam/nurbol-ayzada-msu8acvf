"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  CalendarBlank,
  Clock,
  Heart,
  MapPin,
  MusicNotes,
  Pause,
} from "@phosphor-icons/react";
import type { InvitationData } from "@/types/invitation";
import Image from "next/image";

interface EconomyInvitationProps {
  data: InvitationData;
}

export default function EconomyInvitation({
  data,
}: EconomyInvitationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [attending, setAttending] = useState<boolean | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Аты-жөніңізді енгізіңіз");
      return;
    }

    if (attending === null) {
      setMessage("Жауабыңызды таңдаңыз");
      return;
    }

    if (!data.clientEmail) {
      setMessage("Email табылмады");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientEmail: data.clientEmail,
          name: name.trim(),
          guests,
          attending,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Қате орын алды"
        );
      }

      setMessage(
        "Рақмет! Жауабыңыз қабылданды ❤️"
      );

      setName("");
      setGuests(1);
      setAttending(null);
    } catch (error) {
      console.error("RSVP error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Жауапты жіберу мүмкін болмады"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const target = new Date(data.dateTime);

    const updateTimer = () => {
      const difference = target.getTime() - Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference / (1000 * 60 * 60)) % 24
        ),
        minutes: Math.floor(
          (difference / (1000 * 60)) % 60
        ),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleMusic = () => {
    const audio = document.getElementById(
      "toy-music"
    ) as HTMLAudioElement | null;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          console.log("Музыканы ойнату мүмкін болмады.");
        });
    }
  };

  return (
    <main className="min-h-screen overflow-hidden  bg-[#f8f5ef] text-[#29251f]">
      <audio id="toy-music" loop preload="metadata">
        <source src={"/music/toy.mp3"} type="audio/mpeg" />
      </audio>

      {/* MUSIC BUTTON */}
      <button
        type="button"
        onClick={toggleMusic}
        aria-label="Музыканы қосу немесе өшіру"
        className="fixed right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-md transition hover:scale-105"
      >
        {isPlaying ? (
          <Pause size={19} weight="bold" />
        ) : (
          <MusicNotes size={19} weight="bold" />
        )}
      </button>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center px-6 py-12">
        <div className="absolute inset-0">
          <Image
          width={1920}
          height={1080}
            src={data.coverImage}
            alt={`${data.groom} мен ${data.bride}`}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/35" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white"
        >
          <p className="mb-6 text-xs text-gray-200 font-body font-bold uppercase tracking-[0.35em]">
            Тойға шақыру
          </p>

          <h1 className="font-wedding text-5xl flex flex-col md:flex-row leading-tight sm:text-6xl md:text-8xl">
            <div>{data.groom}</div>
            <span className="mx-3 font-light">&</span>
            <div>{data.bride}</div>
          </h1>

          <div className="mx-auto my-8 h-px w-20 bg-white/70" />

          <p className="text-sm text-gray-200 font-body font-bold uppercase tracking-[0.25em]">
            {data.date}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white"
        >
          <ArrowDown
            size={22}
            weight="thin"
            className="animate-bounce"
          />
        </motion.div>
      </section>

      {/* INTRO */}
      <section className="px-6 py-24 text-center sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl"
        >
          <Heart
            size={28}
            weight="thin"
            className="mx-auto mb-8"
          />

          <p className="mb-4 text-xs  font-body uppercase tracking-[0.3em] text-[#81796d]">
            Құрметті қонақтар!
          </p>

          <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
            Сіздерді қуанышымызға
            <br />
            ортақтасуға шақырамыз
          </h2>

          <p className="mx-auto font-wedding font-bold mt-8 max-w-lg text-sm leading-7 text-[#70695f]">
            Өміріміздегі ең маңызды күндердің бірін
            сіздермен бірге атап өтуді асыға күтеміз.
            Ақ тілектеріңізбен бірге тойымыздың қадірлі
            қонағы болыңыздар!
          </p>
        </motion.div>
      </section>

      {/* COUNTDOWN */}
      <section className="bg-[#29251f] px-6 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase font-body tracking-[0.35em] text-white/50">
            Тойымызға дейін
          </p>

          <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
            Қуанышты күнге санаулы сәт
          </h2>

          <div className="mx-auto mt-12 font-wedding font-bold grid max-w-2xl grid-cols-4 gap-3 sm:gap-6">
            <CountdownItem
              value={timeLeft.days}
              label="КҮН"
            />

            <CountdownItem
              value={timeLeft.hours}
              label="САҒАТ"
            />

            <CountdownItem
              value={timeLeft.minutes}
              label="МИНУТ"
            />

            <CountdownItem
              value={timeLeft.seconds}
              label="СЕКУНД"
            />
          </div>
        </div>
      </section>

      {/* EVENT INFO */}
      <section className="border-y border-[#ded8ce] bg-[#f1ede5] px-6 py-20">
        <div className="mx-auto grid font-body font-bold max-w-4xl gap-12 text-center sm:grid-cols-3 sm:gap-8">
          <InfoItem
            icon={<CalendarBlank size={25} weight="thin" />}
            title="Күні"
            value={data.date}
          />

          <InfoItem
            icon={<Clock size={25} weight="thin" />}
            title="Басталуы"
            value={data.time}
          />

          <InfoItem
            icon={<MapPin size={25} weight="thin" />}
            title="Мекенжай"
            value={data.venue}
            description={data.address}
          />
        </div>
      </section>

      {/* PROGRAM */}
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto font-body max-w-2xl">
          <SectionHeading
            eyebrow="Той бағдарламасы"
            title="Той кеші"
          />

          <div className="mt-14">
            {data.events.map((event, index) => (
              <motion.div
                key={`${event.time}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="flex items-center gap-6 border-b border-[#ded8ce] py-6"
              >
                <span className="w-20 shrink-0 font-serif text-xl">
                  {event.time}
                </span>

                <span className="h-px flex-1 bg-[#ded8ce]" />

                <span className="text-right text-sm text-[#625c53]">
                  {event.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-[#24211d] font-body px-6 py-24 text-white sm:py-32">
        <SectionHeading
          eyebrow="Біздің естеліктер"
          title="Бақытты сәттер"
          dark
        />

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {data.gallery.map((image, index) => (
            <motion.div
              key={image}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
              }}
              className={`overflow-hidden ${
                index === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <Image
              width={1920}
              height={1080}
                src={image}
                alt="Естелік сурет"
                className="h-full min-h-48 w-full object-cover transition duration-700 hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <section className="px-6 py-24 font-wedding font-bold text-center sm:py-32">
        <MapPin
          size={28}
          weight="thin"
          className="mx-auto mb-8"
        />

        <p className="text-xs uppercase tracking-[0.3em] text-[#81796d]">
          Той өтетін мекен
        </p>

        <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
          {data.venue}
        </h2>

        <p className="mt-4 text-sm text-[#70695f]">
          {data.address}
        </p>

      <a
  href={`https://2gis.kz/search/${encodeURIComponent(
    `${data.venue}, ${data.address}`
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-8 inline-block border border-[#29251f] px-7 py-3 text-xs uppercase tracking-[0.15em] transition hover:bg-[#29251f] hover:text-white"
>
  Картаны ашу
</a>
      </section>

      {/* RSVP */}
      <section className="bg-[#f1ede5] font-wedding font-bold px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-xl text-center">
          <Heart
            size={26}
            weight="thin"
            className="mx-auto mb-7"
          />

          <p className="text-xs uppercase tracking-[0.3em] text-[#81796d]">
            Қатысуыңызды растаңыз
          </p>

          <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
            Тойға келесіз бе?
          </h2>

          <p className="mt-5 text-md leading-7 tracking-[0.1rem] text-[#70695f]">
            Келетініңізді алдын ала хабарлауыңызды сұраймыз.
          </p>

         <form
  onSubmit={handleSubmit}
  className="mt-12 space-y-5 text-left"
>
  <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Аты-жөніңіз"
    className="w-full border-b border-[#bdb6ab] bg-transparent px-1 py-4 text-sm outline-none placeholder:text-[#938b80] focus:border-[#29251f]"
  />

  <input
    type="number"
    min="1"
    value={guests}
    onChange={(e) => setGuests(Number(e.target.value))}
    placeholder="Қонақтар саны"
    className="w-full border-b border-[#bdb6ab] bg-transparent px-1 py-4 text-sm outline-none placeholder:text-[#938b80] focus:border-[#29251f]"
  />

  <div className="grid grid-cols-2 gap-3 pt-3">
    <button
      type="button"
      onClick={() => setAttending(true)}
      className={`border px-4 py-4 text-xs uppercase tracking-[0.1em] transition ${
        attending === true
          ? "border-[#29251f] bg-[#29251f] text-white"
          : "border-[#29251f] hover:bg-[#29251f] hover:text-white"
      }`}
    >
      Иә, келемін
    </button>

    <button
      type="button"
      onClick={() => setAttending(false)}
      className={`border px-4 py-4 text-xs uppercase tracking-[0.1em] transition ${
        attending === false
          ? "border-[#29251f] bg-[#29251f] text-white"
          : "border-[#bdb6ab] text-[#70695f] hover:border-[#29251f] hover:text-[#29251f]"
      }`}
    >
      Келе алмаймын
    </button>
  </div>

  {message && (
    <p className="text-center text-sm text-[#70695f]">
      {message}
    </p>
  )}

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-[#29251f] px-6 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-[#403a33] disabled:opacity-50"
  >
    {loading ? "Жіберілуде..." : "Растау"}
  </button>
</form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#24211d] px-6 py-20 text-center text-white">
        <p className="font-serif text-3xl">
          {data.groom} & {data.bride}
        </p>

        <div className="mx-auto my-6 h-px w-12 bg-white/40" />

        <p className="text-xs font-body uppercase tracking-[0.25em] text-white/60">
          Тойымызда жүздескенше!
        </p>

        <Heart
          size={18}
          weight="fill"
          className="mx-auto mt-7"
        />
      </footer>
    </main>
  );
}

function CountdownItem({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="border border-white/10 px-2 py-5 sm:px-5 sm:py-7">
      <div className="font-serif text-3xl sm:text-5xl">
        {String(value).padStart(2, "0")}
      </div>

      <div className="mt-2 text-[9px] tracking-[0.2em] text-white/50 sm:text-[10px]">
        {label}
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-5">{icon}</div>

      <p className="text-[10px] uppercase tracking-[0.25em] text-[#81796d]">
        {title}
      </p>

      <p className="mt-3 font-serif text-xl">
        {value}
      </p>

      {description && (
        <p className="mt-1 text-xs text-[#81796d]">
          {description}
        </p>
      )}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <div className="text-center">
      <p
        className={`text-xs uppercase tracking-[0.3em] ${
          dark ? "text-white/50" : "text-[#81796d]"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`mt-4 font-serif text-4xl sm:text-5xl ${
          dark ? "text-white" : "text-[#29251f]"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

