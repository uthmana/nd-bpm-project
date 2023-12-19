'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import Button from 'components/button/button';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { login, getUsers } from '../../../app/lib/apiRequest';

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
    //setSubmitting(true);
    //TOD: Handle submit
    //const { status, data } = await login(values);
    //console.log(status, data);
    try {
      await signIn('credentials', { ...values, redirect: false });
      // router.push('/admin');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Default
      maincard={
        <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
          {/* Sign in section */}
          <form
            onSubmit={handleLogIn}
            className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]"
          >
            <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
              Sign In
            </h3>
            <p className="mb-9 ml-1 text-base text-gray-600">
              Enter your email and password to sign in!
            </p>
            <InputField
              variant="auth"
              extra="mb-3"
              label="Email*"
              placeholder="mail@simmmple.com"
              id="email"
              type="text"
              name="email"
              onChange={(e) => handleValues(e)}
            />

            {/* Password */}
            <InputField
              variant="auth"
              extra="mb-3"
              label="Password*"
              placeholder="Min. 8 characters"
              id="password"
              type="password"
              name="password"
              onChange={(e) => handleValues(e)}
            />
            {/* Checkbox */}
            <div className="mb-4 flex items-center justify-between px-2">
              {/* <div className="mt-2 flex items-center">
                <Checkbox />
                <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                  Keep me logged In
                </p>
              </div> */}
              <NextLink
                href="/auth/forgot-password"
                className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              >
                Forgot Password?
              </NextLink>
            </div>

            <Button loading={submitting} text="Sign In" />
          </form>
        </div>
      }
    />
  );
}

export default SignInDefault;
