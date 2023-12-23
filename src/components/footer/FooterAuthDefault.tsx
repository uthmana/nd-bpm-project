/*eslint-disable*/
export default function Footer() {
  return (
    <div
      className={`reletive flex w-full flex-col-reverse justify-center md:absolute md:bottom-8 md:right-0  md:flex-row md:justify-around`}
    >
      <p className="mb-6 mt-4 text-center text-sm text-gray-600 md:mt-0 md:text-base lg:mb-0">
        ©{new Date().getFullYear()} ND TÜRKİYE PROSES. Tüm hakkı saklıdır.
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-4 md:ml-8 md:flex-nowrap md:justify-start">
        <li>
          <a
            target="blank"
            href="#"
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base lg:text-white lg:hover:text-white"
          >
            Yardım Merkezi
          </a>
        </li>
        <li>
          <a
            target="blank"
            href="https://www.ndindustries.com/legal-documents"
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base lg:text-white lg:hover:text-white"
          >
            Lisans
          </a>
        </li>
        <li>
          <a
            target="blank"
            href="https://www.ndindustries.com/terms-and-conditions"
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base lg:text-white lg:hover:text-white"
          >
            Kullanım Şartları
          </a>
        </li>
        <li>
          <a
            target="blank"
            href="https://www.ndindustries.com/privacy-policy"
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base lg:text-white lg:hover:text-white"
          >
            Gizlilik
          </a>
        </li>
      </ul>
    </div>
  );
}
