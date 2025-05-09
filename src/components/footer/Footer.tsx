const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 lg:px-8 xl:flex-row print:hidden">
      <p className="mb-4 text-center text-sm font-medium text-gray-600 sm:!mb-0 md:text-lg">
        <span className="mb-4 text-center text-sm text-gray-600 sm:!mb-0 md:text-base">
          ©{new Date().getFullYear()} ND Türkiye Proses. Tüm Hakları Saklıdır.
        </span>
      </p>
      <div>
        <ul className="flex flex-wrap items-center gap-3 sm:flex-nowrap md:gap-10">
          <li>
            <a
              target="blank"
              href="https://www.ndindustries.com.tr/iletisim"
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              Yardım Merkezi
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="https://www.ndindustries.com/legal-documents"
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              Lisans
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="https://www.ndindustries.com/legal-documents/"
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              Kullanım Şartları
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="https://www.ndindustries.com/legal-documents/"
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              Gizlilik
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
