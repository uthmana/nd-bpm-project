'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { FcGoogle } from 'react-icons/fc';
import Checkbox from 'components/checkbox';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import Button from 'components/button/button';

function ChangePassword() {
  const router = useRouter();
  const handleChangePassword = (e) => {
    e.preventDefault();
  };

  return (
    <Default
      maincard={
        <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
          <form
            onSubmit={handleChangePassword}
            className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]"
          >
            <h3 className="mb-8 text-4xl font-bold text-navy-700 dark:text-white">
              Change Password
            </h3>

            {/* Password */}
            <InputField
              variant="auth"
              extra="mb-3"
              label="New Password*"
              placeholder="Min. 8 characters"
              id="password"
              type="password"
              name="password"
            />
            <InputField
              variant="auth"
              extra="mb-6"
              label="Repeat Password*"
              placeholder="Min. 8 characters"
              id="password"
              type="password"
              name="password"
            />
            <Button text="  Save" />
          </form>
        </div>
      }
    />
  );
}

export default ChangePassword;
