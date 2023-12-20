import React from 'react';
import Link from 'next/link';

export default function page() {
  return (
    <section className="flex h-screen w-screen flex-col items-center gap-5 bg-[#f5f8fe] pt-32">
      <h1 className="text-5xl">Access Denied</h1>
      <p className="max-w-2xl text-center text-3xl">
        You are logged in, but you do not have the rquired access level to view
        this page.
      </p>
      <Link
        className="rounded-full border bg-brand-500 p-2 font-bold text-white"
        href="/"
      >
        Return to Home page
      </Link>
    </section>
  );
}
