import authImg from '/public/img/auth/nd1.jpg';
import NavLink from 'components/link/NavLink';
import Footer from 'components/footer/FooterAuthDefault';
function Default(props: { maincard: JSX.Element }) {
  const { maincard } = props;
  return (
    <div className="relative flex">
      <div className="mx-auto flex min-h-full w-full flex-col justify-start lg:h-screen">
        <div className="grid  h-full w-full grid-cols-1 md:grid-cols-2">
          {maincard}
          <div className="reletive hidden h-full min-h-screen md:block">
            <div
              // style={{ backgroundImage: authImg ? `url(${authImg})` : '' }}
              className={`flex h-full w-full items-end justify-center overflow-hidden bg-gradient-to-br from-brand-400 to-brand-600 bg-cover bg-center lg:rounded-bl-[120px] xl:rounded-bl-[200px]`}
            >
              <div className="relative flex h-full w-full items-center justify-center">
                <div
                  style={{ backgroundImage: `url(${authImg.src})` }}
                  className="flex h-full w-full flex-col items-center justify-center bg-cover text-white"
                >
                  <div className="mx-auto block max-w-[60%] text-left">
                    <h1 className="block text-4xl font-bold">
                      ND TÜRKİYE PROSES
                    </h1>
                    <p>
                      Bağlanti elemanlari & ki̇li̇tleme kenetleme ve sizdirmazlik
                      ürünleri̇n yöneti̇m platformumuza <b> HOŞGELDINIZ !</b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Default;
