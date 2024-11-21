import React from 'react';
import Link from 'next/link'; 

export default function AboutPage() {
  return (
    <div className="bg-[#0B3B49] text-[#FFECD1]">
      <title>About</title>
      <header className="py-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">About</h1>
          <p className="text-lg mt-2">
            <Link href="/home">
              <span className="hover:text-blue-500 cursor-pointer">Home</span>
            </Link>
            <span className="mx-5">&gt;</span>
            <Link href="/about">
              <span className="hover:text-blue-500 cursor-pointer">About</span>
            </Link>
          </p>
        </div>
      </header>
      <section className="bg-[#0B3B49] py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            ARTEM mengiklankan desain seni dengan berbagai macam - dari seniman kecil hingga menjadi seniman populer
          </h2>
          <p className="text-lg">
            Artem membantu Anda mengiklankan desain seni apa pun, tidak peduli seberapa kecil atau populernya Anda.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0B3B49] p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Cerita ARTEM</h3>
            <p>
              Berawal dari tugas proyek PPL, namun sekarang ARTEM terbukti telah membantu banyak pelaku UMKM.
            </p>
          </div>
          <div>
            <img
              src="https://glints.com/id/lowongan/wp-content/uploads/2021/10/pexels-mikhail-nilov-7988664.jpg"
              alt="Cerita"
              className="rounded-lg mb-20 w-full"
            />
          </div>
          <div>
            <img
              src="https://cdn1-production-images-kly.akamaized.net/CqkWxoNv7fci5QKEzMYTM7zfsQ0=/1200x900/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3299442/original/002987300_1605674462-pexels-fauxels-3182759.jpg"
              alt="Tujuan"
              className="rounded-lg mb-20 w-full"
            />
          </div>
          <div className="bg-[#0B3B49] p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Tujuan ARTEM</h3>
            <p>
              Menjadikan UMKM terutama di bidang seni menjadi lebih maju dan bisa berkembang mengikuti perkembangan teknologi yang semakin maju.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

