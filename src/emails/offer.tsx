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
import { currencySymbol, formatDateTime } from 'utils';

export const offer = ({ offer }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH;

  const totalDiscount = () => {
    const _discount = offer?.product?.map((item) => {
      let totalDisc = 0;
      return (
        (totalDisc += parseInt(item.unitPrice) * parseInt(item.quantity)) -
        item.price
      );
    });
    return _discount?.reduce((a, b) => b + a, 0) || 0;
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
                  <div className="mb-[2px] flex">
                    <Text className="mb-1 mt-0 w-20 text-xs font-bold leading-4">
                      Müşteri:
                    </Text>
                    <Text className="my-0 max-w-[200px] text-left text-xs capitalize leading-4">
                      {offer?.companyName?.toLowerCase() ||
                        offer?.company_name?.toLowerCase() ||
                        offer?.Customer?.company_name?.toLowerCase()}
                    </Text>
                  </div>
                  <div className="mb-[2px] flex ">
                    <Text className="mb-1 mt-0 w-20 text-xs font-bold leading-4">
                      İlgili:
                    </Text>
                    <Text className="my-0 text-xs leading-4">
                      {offer?.rep_name}
                    </Text>
                  </div>
                  <div className="mb-[2px] flex ">
                    <Text className="mb-1 mt-0 w-20 text-xs font-bold leading-4">
                      E-posta:
                    </Text>
                    <Text className="my-0 text-xs leading-4">
                      {offer?.email}
                    </Text>
                  </div>
                </Column>
                <Column colSpan={1}>
                  <div className="ml-auto w-fit">
                    <div className="mb-[2px] flex">
                      <Text className="mb-1 mt-0 w-24 text-xs font-bold leading-4">
                        Referans No:
                      </Text>
                      <Text className="my-0 text-xs leading-4">
                        {offer?.barcode}
                      </Text>
                    </div>
                    <div className="mb-[2px] flex ">
                      <Text className="mb-1 mt-0 w-24 text-xs font-bold leading-4">
                        Teklif Tarihi:
                      </Text>
                      <Text className="my-0 text-xs leading-4">
                        {offer?.startDate
                          ? formatDateTime(offer?.startDate).split(' ')[0]
                          : 'DD-MM-YYYY'}
                      </Text>
                    </div>
                    <div className="mb-[2px] flex ">
                      <Text className="mb-1 mt-0 w-24 text-xs font-bold leading-4">
                        Son Geçerlilik:
                      </Text>
                      <Text className="my-0 text-xs leading-4">
                        {offer?.endDate
                          ? formatDateTime(offer?.endDate).split(' ')[0]
                          : 'DD-MM-YYYY'}
                      </Text>
                    </div>
                  </div>
                </Column>
              </Row>
            </Section>

            <Section className="mb-8">
              <Row>
                <Column colSpan={1} className="w-1/2 align-top">
                  <div>
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
                  </div>
                </Column>
                <Column colSpan={1} className="w-1/2 align-top">
                  <div className="my-0">
                    <Text className="mb-1 mt-0 text-xs font-bold leading-4">
                      Sevkiyat Adresi:
                    </Text>
                    <Text className="my-0 max-w-[64%] text-xs capitalize">
                      {offer?.address?.toLowerCase()}
                    </Text>
                  </div>
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
                  <div key={idx}>
                    <Row className="mb-2">
                      <Column colSpan={6} className="w-32">
                        <Row className="mb-2">
                          {item?.image ? (
                            <Column colSpan={1} className="w-12 align-top">
                              <Img
                                src={`${baseUrl}/uploads/${item.image}`}
                                width="48"
                                height="auto"
                                alt="nd industries Logo"
                              />
                            </Column>
                          ) : null}

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
                  </div>
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
                <Column className="w-1/2">
                  <div className="mb-6 flex gap-1">
                    <Text className="my-0 w-20 text-xs font-bold">
                      Hazırlayan:
                    </Text>
                    <Text className="my-0 text-xs font-bold"></Text>
                  </div>
                  <div className="mb-6 flex gap-1">
                    <Text className="my-0 w-20 text-xs font-bold">İmza:</Text>
                    {offer?.creatorTitle ? (
                      <Img
                        src={offer?.creatorTitle}
                        width="54"
                        height="auto"
                        alt="imza"
                      />
                    ) : null}
                  </div>
                  <div className="mb-6 flex gap-1">
                    <Text className="my-0 w-20 text-xs font-bold">İsim:</Text>
                    <Text className="my-0 text-xs font-bold">
                      {offer.createdBy}
                    </Text>
                  </div>
                </Column>
                <Column align="left">
                  <div className="mb-6 flex gap-1">
                    <Text className="my-0 w-20 text-xs font-bold">
                      Kabul Eden:
                    </Text>
                    <Text className="my-0 text-xs font-bold"></Text>
                  </div>
                  <div className="mb-6 flex gap-1">
                    <Text className="my-0 w-20 text-xs font-bold">İmza:</Text>
                  </div>
                  <div className="mb-6 flex gap-1">
                    <Text className="my-0 w-20 text-xs font-bold">İsim:</Text>
                    <Text className="my-0 text-xs font-bold"></Text>
                  </div>
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
