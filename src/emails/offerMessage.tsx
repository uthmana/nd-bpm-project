import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
  Row,
  Column,
  Hr,
} from '@react-email/components';

export const offerMessage = ({ offer }) => {
  return (
    <Html>
      <Head />
      <Preview>Teklif | ND Industries</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#007291',
              },
            },
          },
        }}
      >
        <Body className="font-sans">
          <Container className="mx-auto my-0 w-[660px] max-w-full py-10">
            <Section>
              <Row>
                <Column colSpan={1}>
                  <Img
                    src="https://www.ndindustries.com.tr/wp-content/uploads/2018/12/nd.png"
                    width="80"
                    height="auto"
                    alt="ndindustries Logo"
                  />
                </Column>
                <Column colSpan={1}>
                  <div className="ml-auto w-fit">
                    <Text className="my-0 text-xs leading-4">
                      ND Industries Türkiye
                    </Text>
                    <Text className="my-0 text-xs leading-4">
                      İkitelli OSB Metal-İş San. Sit. 4.
                    </Text>
                    <Text className="my-0 text-xs leading-4">
                      Blok No:1 – No: 3 Başakşehir / İstanbul
                    </Text>
                    <Text className="my-0 text-xs leading-4">
                      +90 (212) 549-0545
                    </Text>
                    <Text className="my-0 text-xs leading-4">
                      www.ndindustries.com.tr
                    </Text>
                  </div>
                </Column>
              </Row>
            </Section>
            <Hr className="my-4" />
            <Section className="mb-3">
              <Row>
                <Column align="center">
                  <Text className="my-1 font-bold">TEKLİF</Text>
                </Column>
              </Row>
            </Section>
            <Section className="mb-8">
              <Row>
                <Column colSpan={1}>
                  <Text>Sayın ,</Text>
                </Column>
              </Row>
              <Row>
                <Column colSpan={1}>
                  <Text>
                    Aşağıdaki ürün/hizmetler için fiyat teklifimizi sunmaktan
                    memnuniyet duyarız:
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column colSpan={1}>
                  <Text>
                    Lütfen ekte detaylı bir fiyat listesini PDF formatında
                    bulun.
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column colSpan={1}>
                  <Text>
                    Herhangi bir sorunuz veya daha fazla bilgiye ihtiyacınız
                    varsa, lütfen bizimle iletişime geçmekten çekinmeyin.
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column colSpan={1}>
                  <Text>Saygılarımla,</Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default offerMessage;
