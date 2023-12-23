'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from 'components/button/button';
import nd_logo from '/public/img/auth/nd_logo.webp';
import { useState } from 'react';

function ChangePassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [values, setValues] = useState({
    token: '',
    newPassword: '',
    repeatPassword: '',
  });
  // console.log('useSearchParams', token);

  const handleValues = (event) => {
    const key = event.target?.name;
    const value = event.target?.value;
    const newVal = { [key]: value };
    setValues({ token: token, ...values, ...newVal });
    console.log({ token: token, ...values, ...newVal });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (token && values.newPassword) {
      console.log({ token, newPassword: values.newPassword });
      //TODO: Make changePassword backend call
      // router.push('/auth/sign-in');
      return;
    }
    alert('token');
  };

  return (
    <Default
      maincard={
        <div className="mt-[120px] flex h-[380px] w-full items-center justify-center px-2 md:mx-0 md:mt-0 md:h-full md:px-0 md:pb-16 lg:mb-10 lg:items-center lg:justify-start">
          <form
            onSubmit={handleChangePassword}
            className="mx-auto w-full max-w-[360px] flex-col items-center md:pl-4 lg:pl-0"
          >
            <img
              src={nd_logo.src}
              className="absolute top-16 md:top-32"
              width={80}
            />
            <h3 className="mb-8 text-4xl font-bold text-navy-700 dark:text-white">
              Şifre Değiştir
            </h3>

            {/* Password */}
            <InputField
              variant="auth"
              extra="mb-3"
              label="Yeni Şifre*"
              placeholder="Min. 8 characters"
              id="password"
              type="password"
              name="newPassword"
              onChange={(e) => handleValues(e)}
            />
            <InputField
              variant="auth"
              extra="mb-6"
              label="Şifreyi tekrarla*"
              placeholder="Min. 8 characters"
              id="password"
              type="password"
              name="repeatPassword"
              onChange={(e) => handleValues(e)}
            />
            <Button text="Kaydet" />
          </form>
        </div>
      }
    />
  );
}

export default ChangePassword;
