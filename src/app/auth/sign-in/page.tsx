'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import Button from 'components/button/button';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import nd_logo from '/public/img/auth/nd_logo.webp';
import { emailRegex } from '../../../utils';

function SignInDefault() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({ email: '', password: '' });
  const [emailState, setEmailState] = useState('');
  const [passwordState, setPasswordState] = useState('');
  const [error, setError] = useState(false);

  const handleValues = (event) => {
    const key = event.target?.name;
    const value = event.target?.value;
    setError(false);
    if (key === 'email') {
      setEmailState('');
    }
    if (key === 'password') {
      setPasswordState('');
    }
    const newVal = { [key]: value };
    setValues({ ...values, ...newVal });
  };

  const handleLogIn = async (e: any) => {
    e.preventDefault();

    //Form Validation
    const { email, password } = values;
    if (!email && !password) {
      setEmailState('error');
      setPasswordState('error');
      return;
    }
    if (!email) {
      setEmailState('error');
      return;
    }
    if (!password) {
      setPasswordState('error');
      return;
    }
    if (email && !emailRegex.test(email)) {
      setEmailState('error');
      return;
    }

    setSubmitting(true);
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    }).then((res) => {
      if (res && res.ok) {
        router.push('/admin');
        return;
      }
      setError(true);
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

            {error ? (
              <p className="mb-3 w-full rounded-md bg-red-500 p-2 text-center text-sm  font-bold text-white">
                E-posta veya Şifre hatalı
              </p>
            ) : null}

            <InputField
              variant="auth"
              extra="mb-3"
              label="E-posta*"
              placeholder="E-posta"
              id="email"
              type="text"
              name="email"
              length={50}
              onChange={(e) => handleValues(e)}
              state={emailState}
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
              state={passwordState}
              length={30}
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
