import React from 'react';
import {
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Document,
  pdf,
  Font,
} from '@react-pdf/renderer';
import { formatCurrency, formatDateTime } from 'utils';

//TODO: fix currencySymbol
const currencySymbol = {
  TL: '₺',
  USD: '$',
  EUR: '€',
};

const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';

Font.register({
  family: 'DM Sans',
  fonts: [
    { src: `${prefix}/fonts/dm-sans/DMSans-Regular.ttf` },
    { src: `${prefix}/fonts/dm-sans/DMSans-Bold.ttf`, fontWeight: 'bold' },
    { src: `${prefix}/fonts/dm-sans/DMSans-Italic.ttf`, fontStyle: 'italic' },
    {
      src: `${prefix}/fonts/dm-sans/DMSans-BoldItalic.ttf`,
      fontWeight: 'bold',
      fontStyle: 'italic',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 45,
    fontSize: 10,
    lineHeight: 1.5,
    fontFamily: 'DM Sans',
    color: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.8,
    borderBottomColor: '#dadeed',
    paddingBottom: 10,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 90,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    marginBottom: 25,
    width: '100%',
  },

  infoFlex: {
    width: '50%',
  },

  infoFlexItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  infoBoldText: {
    fontWeight: 'bold',
    marginRight: 8,
    width: 12,
  },
  infoRightBoldText: {
    fontWeight: 'bold',
    width: 70,
  },
  infoTextwrap: {
    maxWidth: 140,
  },
  addressSection: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    marginBottom: 25,
  },
  textSmall: {
    fontSize: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 0.7,
    borderBottomColor: '#dadeed',
    paddingBottom: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    padding: 3,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 18,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 8,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 8,
    fontSize: 10,
  },
  descSection: {
    fontSize: 10,
    marginBottom: 18,
  },
  boldText: {
    fontWeight: 'bold',
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  flexItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
    minWidth: 160,
  },
  signatureImage: {
    width: 50,
    height: 30,
  },
});

const OfferDocPDF = ({ offer }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Image
            src={`${prefix}/img/auth/nd.png`}
            style={styles.logo}
            alt="nd logo"
          />
        </View>
        <View>
          <Text>ND Industries Türkiye</Text>
          <Text>İkitelli OSB Metal-İş San. Sit.</Text>
          <Text>4. Blok No:1 – No: 3</Text>
          <Text>Başakşehir / İstanbul</Text>
          <Text>+90 (212) 549-0545</Text>
          <Text>www.ndindustries.com.tr</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>TEKLİF</Text>

      {/* Customer Info */}
      <View style={styles.infoSection}>
        <View style={styles.infoFlex}>
          <View style={styles.infoFlexItem}>
            <Text style={styles.infoRightBoldText}>Müşteri:</Text>
            <Text style={styles.infoTextwrap}>
              {offer?.company_name || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoFlexItem}>
            <Text style={styles.infoRightBoldText}>İlgili:</Text>
            <Text>{offer?.rep_name || 'N/A'}</Text>
          </View>
          <View style={styles.infoFlexItem}>
            <Text style={styles.infoRightBoldText}>E-posta:</Text>
            <Text>{offer?.email || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.infoFlex}>
          <View style={styles.infoFlexItem}>
            <Text style={styles.infoRightBoldText}>Referans No:</Text>
            <Text>{offer?.barcode || 'N/A'}</Text>
          </View>
          <View style={styles.infoFlexItem}>
            <Text style={styles.infoRightBoldText}>Teklif Tarihi:</Text>
            <Text>{formatDateTime(offer?.startDate) || 'DD-MM-YYYY'}</Text>
          </View>
          <View style={styles.infoFlexItem}>
            <Text style={styles.infoRightBoldText}> Son Geçerlilik:</Text>
            <Text>{formatDateTime(offer?.endDate) || 'DD-MM-YYYY'}</Text>
          </View>
        </View>
      </View>

      {/* Address */}
      <View style={styles.addressSection}>
        <Text style={styles.infoRightBoldText}>Adres:</Text>
        <Text>{offer?.address || 'N/A'}</Text>
      </View>

      {/* Product Table */}
      <View style={styles.tableSection}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCell}>Ürün</Text>
          <Text style={styles.tableCell}>Uygulama</Text>
          <Text style={styles.tableCell}>Standart</Text>
          <Text style={styles.tableCell}>Miktar</Text>
          <Text style={styles.tableCell}>Birim Fiyat</Text>
          <Text style={styles.tableCell}>Tutar</Text>
        </View>
        {offer?.product?.map((item, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item?.name || ''}</Text>
            <Text style={styles.tableCell}>{item?.application || ''}</Text>
            <Text style={styles.tableCell}>{item?.standard || ''}</Text>
            <Text style={styles.tableCell}>
              {formatCurrency(item?.quantity, 'int') || ''}
            </Text>
            <Text style={styles.tableCell}>
              {formatCurrency(item?.unitPrice) || ''} {offer?.currency}
            </Text>
            <Text style={styles.tableCell}>
              {formatCurrency(item?.price) || ''} {offer?.currency}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totalSection}>
        <Text>
          Toplam: {formatCurrency(offer?.totalAmount)} {offer?.currency}
        </Text>
      </View>

      <View>
        {offer?.description ? (
          <Text style={styles.descSection}>{offer?.description}</Text>
        ) : null}
      </View>

      <View style={styles.flexContainer}>
        <View style={styles.flexColumn}>
          <View style={styles.flexItem}>
            <Text style={styles.boldText}>Hazırlayan </Text>
            <Text>{''}</Text>
          </View>
          <View style={styles.flexItem}>
            <Text style={styles.boldText}>İmza:</Text>
            <Text>
              {offer?.creatorTitle ? (
                <Image
                  src={offer?.creatorTitle}
                  style={styles.signatureImage}
                  alt="imza"
                />
              ) : null}
            </Text>
          </View>
          <View style={styles.flexItem}>
            <Text style={styles.boldText}>İsim:</Text>
            <Text>{offer.createdBy}</Text>
          </View>
        </View>

        <View style={styles.flexColumn}>
          <View style={styles.flexItem}>
            <Text style={styles.boldText}>Kabul Eden </Text>
            <Text>{''}</Text>
          </View>
          <View style={styles.flexItem}>
            <Text style={styles.boldText}>İmza:</Text>
            <Text>{''}</Text>
          </View>
          <View style={styles.flexItem}>
            <Text style={styles.boldText}>İsim:</Text>
            <Text>{''}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Yukarıdaki fiyatlandırma KDV ve Nakliye dahil değildir.
      </Text>
    </Page>
  </Document>
);

export const UploadOfferPDF = async ({ offer }) => {
  try {
    const blob = await pdf(<OfferDocPDF offer={offer} />).toBlob();
    const formData = new FormData();
    formData.append('file', blob, `Offer_${offer?.barcode || 'default'}.pdf`);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to upload PDF');
    }
    const result = await res.json();
    return { ...result, status: res.status };
  } catch (error) {
    return { status: error.status, message: error.message };
  }
};

export default UploadOfferPDF;
