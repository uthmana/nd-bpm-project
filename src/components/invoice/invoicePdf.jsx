import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
  pdf,
} from '@react-pdf/renderer';

import { formatDateTime, formatCurrency } from 'utils';

// Register the DM Sans font
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

// Styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 45,
    fontSize: 10,
    lineHeight: 1.5,
    fontFamily: 'DM Sans',
    color: '#000',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid black',
    marginBottom: 15,
  },
  logoSection: {
    width: 180,
  },
  logo: {
    width: 90,
    height: 90,
  },
  addressText: {
    fontSize: 10,
    marginTop: 5,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  barcode: {
    width: 180,
    textAlign: 'center',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  datesSection: {
    backgroundColor: '#f5f4f4',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 4,
  },
  rowItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid black',
    fontWeight: 'bold',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5,
    borderBottom: '1px solid #ddd',
    paddingBottom: 5,
  },
  tableCell: {
    flex: 1,
    padding: '0 5px',
  },
  footer: {
    paddingTop: 10,
    width: 200,
    marginLeft: 'auto',
  },
});

const InvoiceDoc = ({ invoice }) => {
  console.log({ invoice });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Image
              src={`${prefix}/img/auth/nd.png`}
              style={styles.logo}
              alt="nd logo"
            />
            <Text style={styles.addressText}>
              İkitelli OSB Metal-İş San. Sit. 4. Blok No:1 – No: 3 Başakşehir /
              İstanbul
            </Text>
          </View>
          <View style={styles.barcode}>
            <Text style={styles.title}>İrsaliye</Text>
            <Image
              src={`data:image/png;base64, ${invoice.barcodeImage}`}
              alt="irsaliye barkodu"
            />
            <Text>{invoice.barcode}</Text>
          </View>
        </View>

        {/* Customer Info Section */}

        <View style={styles.infoSection}>
          <View
            style={[
              styles.section,
              { display: 'flex', flexDirection: 'column', gap: 8 },
            ]}
          >
            <Text style={[styles.boldText, { fontSize: 14 }]}>Sayın:</Text>
            <Text>{invoice?.rep_name}</Text>
            <Text>{invoice?.address}</Text>
            <View style={styles.rowItem}>
              <Text style={styles.boldText}>Vergi Dairesi:</Text>
              <Text>{invoice?.tax_Office || 'N/A'}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.boldText}>Vergi No:</Text>
              <Text>{invoice?.taxNo || 'N/A'}</Text>
            </View>
          </View>

          {/* Dates Section */}
          <View style={[styles.datesSection]}>
            <View style={styles.row}>
              <Text style={styles.boldText}>Düzenlenme Tarihi:</Text>
              <Text>{formatDateTime(invoice?.createdAt)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.boldText}>Fiili Sevk Tarihi:</Text>
              <Text>{formatDateTime(invoice?.invoiceDate)}</Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        {invoice?.description && (
          <View style={styles.section}>
            <Text>{invoice.description}</Text>
          </View>
        )}

        {/* Table Section */}
        <View style={[{ marginVertical: 40 }]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 1 }]}>No</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Ürün</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>Uygulama</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Standart</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Renk</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Miktar</Text>
          </View>
          {invoice?.process?.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1 }]}>{idx + 1}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {item?.product}
              </Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>
                {item?.application}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {item?.standard}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{item?.color}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {formatCurrency(item?.shipmentQty || 0)}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <View
            style={[
              styles.row,
              {
                backgroundColor: '#f5f4f4',
                paddingHorizontal: 10,
                paddingVertical: 5,
              },
            ]}
          >
            <Text style={[styles.boldText]}>Tel:</Text>
            <Text>0212 549 05 45</Text>
          </View>
          <View
            style={[styles.row, { paddingHorizontal: 10, paddingVertical: 5 }]}
          >
            <Text style={[styles.boldText]}>Fax:</Text>
            <Text>0212 549 05 90</Text>
          </View>
          <View
            style={[
              styles.row,
              {
                backgroundColor: '#f5f4f4',
                paddingHorizontal: 10,
                paddingVertical: 5,
              },
            ]}
          >
            <Text style={[styles.boldText]}>Whatsapp:</Text>
            <Text>0542 696 37 69</Text>
          </View>
          <View
            style={[styles.row, { paddingHorizontal: 10, paddingVertical: 5 }]}
          >
            <Text style={[styles.boldText]}>E-Posta:</Text>
            <Text>info@ndindustries.com.tr</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const UploadInvoicePDF = async ({ invoice }) => {
  try {
    const blob = await pdf(<InvoiceDoc invoice={invoice} />).toBlob();
    const formData = new FormData();
    formData.append('file', blob, `Offer_${invoice?.id || 'default'}.pdf`);

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

export default UploadInvoicePDF;
