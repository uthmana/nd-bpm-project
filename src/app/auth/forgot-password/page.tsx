'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { useState, useRef } from 'react';
import Button from 'components/button';
import nd_logo from '/public/img/auth/nd_logo.webp';
import { emailRegex } from 'utils';
import NextLink from 'next/link';
import { sendForgotEmail } from 'app/lib/apiRequest';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import Image from 'next/image';

function ForgotPassword() {
  const forgotForm = useRef(null);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [emailState, setEmailState] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValues = (e) => {
    setEmailState('');
    setEmail(e.target.elements?.email?.value);
  };

  const handleforgotPassword = async (e) => {
    e.preventDefault();
    let emailValue = e.target.elements?.email?.value;
    setError('');
    setEmail(emailValue);
    if (!emailValue) {
      setEmailState('error');
      return;
    }
    if (emailValue && !emailRegex.test(emailValue)) {
      setError('error');
      return;
    }
    //Send Email
    setIsSubmitting(true);
    const { status, data, error } = await sendForgotEmail({
      type: 'forgotPassword',
      email: emailValue,
      subject: 'Şifre Yenile',
      message: 'Lütfen gelen kutunuzu kontrol edin.',
    });

    if (status === 200) {
      setStep(1);
      setIsSubmitting(false);
      return;
    }
    setError('error');
    setIsSubmitting(false);
  };

  const resendEmail = () => {
    setStep(0);
    forgotForm.current?.dispatchEvent(new Event('submit'));
  };

  const sendEmail = () => {
    return (
      <div className="mt-[120px] flex w-full items-center justify-center px-2 md:mx-0 md:mt-0 md:h-full md:px-0 lg:items-center lg:justify-start">
        {/* Forgot Password section */}

        <form
          onSubmit={handleforgotPassword}
          ref={forgotForm}
          className="mx-auto flex w-full max-w-[360px] flex-col justify-between md:pl-4 lg:pl-0"
        >
          <div className="mb-10">
            <Image
              width="100"
              height="20"
              src={nd_logo.src}
              alt="nd Industries Logo"
              className="relative "
            />
          </div>
          <div>
            <NextLink
              href="/auth/sign-in"
              className="mb-4 inline-flex items-center text-sm font-medium dark:text-white"
            >
              <MdKeyboardArrowLeft className="h-6 w-6" /> Geri
            </NextLink>

            <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
              Şifre Yenile
            </h3>
            <p className="mb-9 ml-1 text-base text-gray-600">
              Şifrenizi sıfırlamak için e-postanızı girin!
            </p>

            {error ? (
              <p className="mb-3 block w-full rounded-md bg-red-500 p-2 text-center  text-sm font-bold text-white">
                Beklenmeyen bir hata oluştu. Daha sonra tekrar deneyin.
              </p>
            ) : null}

            <InputField
              variant="auth"
              extra="mb-8"
              label="E-posta"
              placeholder="E-posta"
              id="email"
              type="text"
              name="email"
              state={emailState}
              onChange={(e) => handleValues(e)}
              value={email}
            />
            <Button
              loading={isSubmitting}
              extra="!h-11"
              text="E-POSTA GÖNDER"
            />
          </div>
        </form>
      </div>
    );
  };

  const emailSuccess = () => {
    return (
      <div className="mt-[120px] flex w-full items-center justify-center px-2 md:mx-0 md:mt-0 md:h-full md:px-0 lg:items-center lg:justify-start">
        {/* Forgot Password section */}
        <div className="mx-auto flex w-full max-w-[360px] flex-col justify-between md:pl-4 lg:pl-0">
          <div className="mb-10">
            <Image
              width="100"
              height="20"
              src={nd_logo.src}
              alt="nd Industries Logo"
              className="relative"
            />
          </div>
          <div>
            <NextLink
              href="/auth/sign-in"
              className="mb-4 inline-flex items-center text-sm font-medium underline dark:text-white"
            >
              <MdKeyboardArrowLeft className="h-7 w-7" /> Geri
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
              <span className="font-semibold"> {email} </span> adresine e-posta
              gönderdik. Lütfen gelen kutunuzu kontrol edin.
            </p>
            <Button
              onClick={resendEmail}
              loading={isSubmitting}
              extra="!h-11"
              text="TEKRAR GÖNDER"
            />
          </div>
        </div>
      </div>
    );
  };

  return <Default maincard={step === 0 ? sendEmail() : emailSuccess()} />;
}

export default ForgotPassword;
