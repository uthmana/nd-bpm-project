'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { FcGoogle } from 'react-icons/fc';
import Checkbox from 'components/checkbox';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Button from 'components/button/button';
import nd_logo from '/public/img/auth/nd_logo.webp';

function ForgotPassword() {
  const forgotForm = useRef(null);
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');

  const router = useRouter();
  const handleforgotPassword = (e) => {
    e.preventDefault();
    setEmail(e.target.elements.email.value);
    setStep(1);
  };

  const resendEmail = () => {
    setStep(0);
    forgotForm.current?.dispatchEvent(new Event('submit'));
  };

  const sendEmail = () => {
    return (
      <div className="mt-[120px] flex h-[360px] w-full items-center justify-center px-2 md:mx-0 md:mt-0 md:h-full md:px-0 lg:items-center lg:justify-start">
        {/* Forgot Password section */}
        <form
          onSubmit={handleforgotPassword}
          ref={forgotForm}
          className="mx-auto w-full max-w-[360px] flex-col items-center md:pl-4 lg:pl-0"
        >
          <img
            src={nd_logo.src}
            className="absolute top-16 md:top-32"
            width={80}
          />
          <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
            Parolanızı mı unuttunuz
          </h3>
          <p className="mb-9 ml-1 text-base text-gray-600">
            Şifrenizi sıfırlamak için e-postanızı girin!
          </p>
          <InputField
            variant="auth"
            extra="mb-8"
            label="E-posta*"
            placeholder="E-posta"
            id="email"
            type="email"
            name="email"
            required
          />
          <Button text="Gönder" />
        </form>
      </div>
    );
  };

  const emailSuccess = () => {
    return (
      <div className="mb-32 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
        {/* Forgot Password section */}
        <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
          <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
            Forgot Password
          </h3>
          <p className="mb-9 ml-1 text-base text-gray-600">
            Enter your email to reset your password!
          </p>

          <p className="text-black mb-9 ml-1 text-base">
            We have sent email to <span className="font-semibold">{email}</span>{' '}
            to reset your password. Please check your inbox.
          </p>
          <button
            onClick={resendEmail}
            className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Resend Email
          </button>
        </div>
      </div>
    );
  };

  return <Default maincard={step === 0 ? sendEmail() : emailSuccess()} />;
}

export default ForgotPassword;
