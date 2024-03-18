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
import { currencySymbol } from 'utils';

export const offer = ({ offer }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH;

  const totalDiscount = () => {
    const discount = offer?.product?.reduce(
      (a, b) => parseInt(b.discountPrice) + parseInt(a),
      0,
    );
    return offer?.totalAmount - discount || 0;
  };

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
                <Column>
                  <Img
                    src="https://www.ndindustries.com.tr/wp-content/uploads/2018/12/nd.png"
                    width="80"
                    height="auto"
                    alt="Apple Logo"
                  />
                </Column>
                <Column align="right">
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
                <Column>
                  <Text className="mb-1 mt-0 text-xs font-bold leading-4">
                    Fatura Adresi:
                  </Text>
                  <Text className="my-0 text-xs leading-4">
                    İkitelli OSB Metal-İş San. Sit. 4.
                  </Text>
                  <Text className="my-0 text-xs leading-4">
                    Blok No:1 – No: 3
                  </Text>
                  <Text className="my-0 text-xs leading-4">
                    Başakşehir / İstanbul
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-1 mt-0 text-xs font-bold leading-4">
                    Sevkiyat Adresi:
                  </Text>
                  <Text className="my-0 max-w-[160px] text-xs">
                    {offer.address}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="mb-1">
              <Row className="mb-1">
                <Column colSpan={6} className="w-[120px]">
                  <Text className="my-0 text-xs font-bold">Ürün</Text>
                </Column>
                <Column colSpan={1}>
                  <Text className="my-0 text-xs font-bold">Miktar</Text>
                </Column>
                <Column colSpan={1}>
                  <Text className="my-0 text-xs font-bold">Birim Fiyat</Text>
                </Column>
                <Column colSpan={1}>
                  <Text className="my-0 text-xs font-bold">Tutar</Text>
                </Column>
              </Row>
              <Hr className="my-1" />
              {offer?.product?.map((item, idx) => {
                return (
                  <>
                    <Row key={idx} className="mb-2">
                      <Column colSpan={6} className="w-32">
                        <Row className="mb-2">
                          <Column colSpan={1} className="w-12 align-top">
                            <Img
                              src={`${baseUrl}/uploads/${item.image}`}
                              width="48"
                              height="auto"
                              alt="nd industries Logo"
                            />
                          </Column>
                          <Column colSpan={4} className="align-top">
                            <Text className="mb-1 mt-0 max-w-[200px] px-1 text-xs font-bold">
                              {item.name} - {item.application} - {item.standard}
                            </Text>
                            <Text className="my-0 px-1 text-xs">
                              {item.description}
                            </Text>
                          </Column>
                        </Row>
                      </Column>
                      <Column colSpan={1} className="align-top">
                        <Text className="my-0 px-1 text-xs">
                          {item.quantity}
                        </Text>
                      </Column>
                      <Column colSpan={1} className="align-top">
                        <div className="my-0 flex gap-1 text-xs">
                          <Text className="my-0 text-xs line-through">
                            {item?.unitPrice}
                          </Text>
                          <Text className="my-0 text-xs">
                            {currencySymbol[offer?.currency]}
                          </Text>
                        </div>

                        <div className="my-0 flex gap-1 text-xs">
                          <Text className="my-0 text-xs">
                            {item?.discountPrice}
                          </Text>
                          <Text className="my-0 text-xs">
                            {currencySymbol[offer?.currency]}
                          </Text>
                        </div>

                        <div className="my-0 flex gap-1 text-xs">
                          <Text className="my-0 text-xs">
                            {' '}
                            {'('}%{' '}
                            {Math.round(
                              ((item?.unitPrice - item?.discountPrice) /
                                item?.unitPrice) *
                                100,
                            )}{' '}
                            indi.
                            {')'}
                          </Text>
                        </div>
                      </Column>
                      <Column colSpan={1} className="align-top">
                        <Text className="my-0 px-1 text-xs">
                          {item.price} {currencySymbol[offer?.currency]}
                        </Text>
                      </Column>
                    </Row>
                    <Hr className="my-1" />
                  </>
                );
              })}
            </Section>
            <Section className="mb-3">
              <Row>
                <Column align="right">
                  <Text className="my-0 px-10 text-xs">
                    Genel Toplam ({totalDiscount()}
                    {''}
                    {currencySymbol[offer?.currency]} indirim içerir)
                  </Text>
                </Column>
                <Column align="right" className="w-[86px]">
                  <Text className="my-0 text-left text-xs">
                    {' '}
                    {offer.totalAmount} {currencySymbol[offer?.currency]}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="mb-8">
              <Row>
                <Column>
                  <Text className="my-0 text-xs">{offer?.description}</Text>
                </Column>
              </Row>
            </Section>

            <Section className="mb-3">
              <Row>
                <Column>
                  <Row className="mb-6">
                    <Column>
                      <Text className="my-0 text-xs font-bold">
                        Hazırlayan:
                      </Text>
                    </Column>
                    <Column></Column>
                  </Row>
                  <Row className="mb-6">
                    <Column>
                      <Text className="my-0 text-xs font-bold">İmza:</Text>
                    </Column>
                    <Column>
                      <Text className="my-0 text-left text-xs  font-bold"></Text>
                    </Column>
                  </Row>
                  <Row className="mb-6">
                    <Column>
                      <Text className="my-0 text-xs font-bold">İsim:</Text>
                    </Column>
                    <Column>
                      <Text className="my-0 text-xs font-bold">
                        {offer.createdBy}
                      </Text>
                    </Column>
                  </Row>
                </Column>
                <Column align="left">
                  <Row className="mb-6">
                    <Column>
                      <Text className="my-0 text-left text-xs font-bold">
                        Kabul Eden:
                      </Text>
                    </Column>
                    <Column></Column>
                  </Row>
                  <Row className="mb-6">
                    <Column>
                      <Text className="my-0 text-xs font-bold">İmza:</Text>
                    </Column>
                    <Column></Column>
                  </Row>
                  <Row className="mb-6">
                    <Column>
                      <Text className="my-0 text-xs font-bold">İsim:</Text>
                    </Column>
                    <Column></Column>
                  </Row>
                </Column>
              </Row>
            </Section>
            <Section className="mb-10">
              <Text className="my-0 text-center text-xs">
                Yükarıdaki fiyatlandırma KDV ve Nakliye dahil değildir.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default offer;
