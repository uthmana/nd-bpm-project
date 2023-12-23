'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { useState, useRef } from 'react';
import Button from 'components/button/button';
import nd_logo from '/public/img/auth/nd_logo.webp';
import { emailRegex } from 'utils';
import NextLink from 'next/link';

function ForgotPassword() {
  const forgotForm = useRef(null);
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [emailState, setEmailState] = useState('');

  const handleValues = (event) => {
    setEmailState('');
  };

  const handleforgotPassword = (e) => {
    e.preventDefault();
    const emailValue = e.target.elements.email.value;

    setError('');
    setEmail(emailValue);
    if (!emailValue) {
      setEmailState('error');
      return;
    }
    if (emailValue && !emailRegex.test(email)) {
      setError('error');
      return;
    }

    //TODO: Send email
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
          <NextLink
            href="/auth/sign-in"
            className="mb-4 inline-block text-sm font-medium dark:text-white"
          >
            {'<'} Geri
          </NextLink>
          <img
            src={nd_logo.src}
            className="absolute top-16 md:top-32"
            width={80}
          />
          <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
            Şifre Yenile
          </h3>
          <p className="mb-9 ml-1 text-base text-gray-600">
            Şifrenizi sıfırlamak için e-postanızı girin!
          </p>

          <p
            className={`absolute mb-3 hidden w-full rounded-md bg-red-500 p-2 text-center  text-sm font-bold text-white ${
              error ? 'block' : ''
            }`}
          >
            Geçersiz e-posta girdiniz !
          </p>

          <InputField
            variant="auth"
            extra="mb-8"
            label="E-posta*"
            placeholder="E-posta"
            id="email"
            type="text"
            name="email"
            state={emailState}
            onChange={(e) => handleValues(e)}
          />
          <Button text="Gönder" />
        </form>
      </div>
    );
  };

  const emailSuccess = () => {
    return (
      <div className="mt-[120px] flex h-[360px] w-full items-center justify-center px-2 md:mx-0 md:mt-0 md:h-full md:px-0 lg:items-center lg:justify-start">
        {/* Forgot Password section */}
        <div className="mx-auto w-full max-w-[360px] flex-col items-center md:pl-4 lg:pl-0">
          <img
            src={nd_logo.src}
            className="absolute top-16 md:top-32"
            width={80}
          />

          <NextLink
            href="/auth/sign-in"
            className="mb-4 inline-block text-sm font-medium dark:text-white"
          >
            {'<'} Geri
          </NextLink>
          <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
            Şifre Yenile
          </h3>
          <p className="mb-9 ml-1 text-base text-gray-600">
            Şifreni sıfırlaman için sana talimatları içeren bir e-posta
            göndereceğiz.
          </p>

          <p className="text-black mb-9 ml-1 text-base dark:text-white">
            Şifrenizi sıfırlamak için
            <span className="font-semibold">{email}</span> adresine e-posta
            gönderdik. Lütfen gelen kutunuzu kontrol edin.
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
