'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { useRouter } from 'next/navigation';
import Button from 'components/button/button';
import nd_logo from '/public/img/auth/nd_logo.webp';

function ChangePassword() {
  const router = useRouter();
  const handleChangePassword = (e) => {
    e.preventDefault();
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
              name="password"
            />
            <InputField
              variant="auth"
              extra="mb-6"
              label="Şifreyi tekrarla*"
              placeholder="Min. 8 characters"
              id="password"
              type="password"
              name="password"
            />
            <Button text="Kaydet" />
          </form>
        </div>
      }
    />
  );
}

export default ChangePassword;
