'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from 'components/button/button';
import nd_logo from '/public/img/auth/nd_logo.webp';
import { useState } from 'react';
import { changePassword } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import NextLink from 'next/link';

function ChangePassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [repeatPwdState, setRepeatPwdState] = useState('');
  const [pwdState, setPwState] = useState('');
  const [values, setValues] = useState({
    token: '',
    newPassword: '',
    repeatPassword: '',
  });
  // console.log('useSearchParams', token);

  const handleValues = (event) => {
    setError(false);
    setRepeatPwdState('');
    setPwState('');
    const key = event.target?.name;
    const value = event.target?.value;
    const newVal = { [key]: value };
    setValues({ token: token, ...values, ...newVal });
    //console.log({ token: token, ...values, ...newVal });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!values.newPassword && !values.repeatPassword) {
      setRepeatPwdState('error');
      setPwState('error');
      return;
    }
    if (!values.newPassword) {
      setPwState('error');
      return;
    }
    if (!values.repeatPassword) {
      setRepeatPwdState('error');
      return;
    }
    if (values.newPassword !== values.repeatPassword) {
      setError(true);
      return;
    }

    setSubmitting(true);
    const { status, data } = await changePassword({
      token,
      newPassword: values.newPassword,
    });

    if (status === 200) {
      toast.success('Şifre yenileme işlemi başarılı');
      router.push('/auth/sign-in');
      return;
    } else {
      toast.error('Şifre yenileme işlemi başarısız. Geçersiz token!');
    }
    setSubmitting(false);
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

            <NextLink
              href="/auth/sign-in"
              className="mb-4 inline-block text-sm font-medium dark:text-white"
            >
              {'<'} Giriş
            </NextLink>

            <h3 className="mb-8 text-4xl font-bold text-navy-700 dark:text-white">
              Şifre Değiştir
            </h3>

            {error ? (
              <p className="mb-3 w-full rounded-md bg-red-500 p-2 text-center text-sm  font-bold text-white">
                Şifreler aynı olmalıdır
              </p>
            ) : null}

            <InputField
              variant="auth"
              extra="mb-3"
              label="Yeni Şifre*"
              placeholder="Min. 8 characters"
              id="password"
              type="password"
              name="newPassword"
              onChange={(e: any) => handleValues(e)}
              state={pwdState}
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
              state={repeatPwdState}
            />
            <Button loading={isSubmitting} text="Kaydet" />
          </form>
        </div>
      }
    />
  );
}

export default ChangePassword;
