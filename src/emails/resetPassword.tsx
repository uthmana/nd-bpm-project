import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ResetPasswordEmailProps {
  userName?: string;
  resetPasswordLink?: string;
  token?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH;

export const ResetPasswordEmail = ({
  userName,
  token,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>ND Industries TR Proses şifrenizi sıfırlayın</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://www.ndindustries.com.tr/wp-content/uploads/2018/12/nd.png"
            width="100"
            height="auto"
            alt="ND Industries"
          />
          <Section>
            <Text style={text}>Merhaba {userName},</Text>
            <Text style={text}>
              Birisi yakın zamanda ND Proses'ınız için şifre değişikliği
              talebinde bulundu hesap. Eğer bu sizseniz, buradan yeni bir şifre
              belirleyebilirsiniz:
            </Text>
            <Button
              style={button}
              href={`${baseUrl}/auth/change-password?token=${token}`}
            >
              Şifreyi sıfırla
            </Button>
            <Text style={text}>
              Şifrenizi değiştirmek istemiyorsanız veya bunu talep etmediyseniz
              görmezden gelin ve bu mesajı silin.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  userName: 'ND Industries',
  resetPasswordLink: `${baseUrl}/auth/change-password`,
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};

const anchor = {
  textDecoration: 'underline',
};
