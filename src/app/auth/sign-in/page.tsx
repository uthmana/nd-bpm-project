'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import Button from 'components/button/button';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import nd_logo from '/public/img/auth/nd_logo.webp';

function SignInDefault() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({ email: '', password: '' });

  const handleValues = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handleLogIn = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    const { email, password } = values;
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    }).then((res) => {
      if (res && res.ok) {
        router.push('/admin');
      } else {
        console.log('error', res);
      }
      setSubmitting(false);
    });
  };

  return (
    <Default
      maincard={
        <div className="mt-[120px] flex h-[500px] w-full items-center justify-center px-2 md:mx-0 md:mt-0 md:h-full md:px-0 md:pb-16 lg:mb-10 lg:items-center lg:justify-start">
          {/* Sign in section */}
          <form
            onSubmit={handleLogIn}
            className="reletive  mx-auto w-full max-w-[360px] flex-col items-center md:pl-4 lg:pl-0"
          >
            <img
              src={nd_logo.src}
              className="absolute top-16 md:top-32"
              width={80}
            />
            <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
              Giriş Yap
            </h3>
            <p className="mb-9 ml-1 text-base text-gray-600">
              Oturum açmak için e-posta adresinizi ve şifrenizi girin!
            </p>
            <InputField
              variant="auth"
              extra="mb-3"
              label="E-posta*"
              placeholder="E-posta"
              id="email"
              type="text"
              name="email"
              onChange={(e) => handleValues(e)}
            />

            {/* Password */}
            <InputField
              variant="auth"
              extra="mb-3"
              label="Şifre*"
              placeholder="Şifre"
              id="password"
              type="password"
              name="password"
              onChange={(e) => handleValues(e)}
            />
            {/* Checkbox */}
            <div className="mb-4 flex items-center justify-between px-2">
              <NextLink
                href="/auth/forgot-password"
                className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              >
                Parolanızı mı unuttunuz?
              </NextLink>
            </div>

            <Button loading={submitting} text="Giriş" />
          </form>
        </div>
      }
    />
  );
}

export default SignInDefault;
