import { Image } from 'components/image/Image';
import React from 'react';

export default function ResetPassword({ token }) {
  //TODO: Email templete sholu be improved
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-[black] py-32 text-lg text-white">
      <div className="mx-auto flex h-full w-[400px] flex-col gap-9">
        <img
          className="h-11 w-11"
          src="https://nd-bpm-project.vercel.app/_next/static/media/nd_logo.c299b55c.webp"
          alt={'ND Logo'}
        />

        <h1>Şifre Sıfırla.</h1>
        <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayınız </p>
        <a
          className="!w-max !rounded-xl !bg-brand-500 !px-6 !py-3 !text-base !font-medium"
          target="_blank"
          href={`https://nd-bpm-project.vercel.app/auth/change-password?${token}`}
        >
          Şifre Sıfırla
        </a>

        <p>
          Eğer şifre sıfırlama talebinde bulunmadıysan bu e-postayı görmezden
          gelebilirsin.
        </p>

        {/* Social links comes here */}
      </div>
    </main>
  );
}
