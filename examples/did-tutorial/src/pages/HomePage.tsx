import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary-800 mb-4">Dijital Kimlik (DID) Öğretici</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Bu interaktif uygulama ile Dijital Kimlik (DID), Verkey ve imzalama kavramlarını
          pratik yaparak öğrenin.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card card-hover bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="step-number">1</div>
          <h3 className="step-title mb-2">Kayıt Ol</h3>
          <p className="text-gray-600 mb-4">
            Ed25519 anahtar çifti oluşturun ve kendi DID'inizi elde edin.
          </p>
          <Link to="/register" className="btn btn-primary block text-center">Başla</Link>
        </div>

        <div className="card card-hover bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
          <div className="step-number">2</div>
          <h3 className="step-title mb-2">Testnet'e Gönder</h3>
          <p className="text-gray-600 mb-4">
            DID'inizi simüle edilmiş bir testnet'e gönderin ve DID dokümanını görün.
          </p>
          <Link to="/testnet" className="btn btn-primary block text-center">Keşfet</Link>
        </div>

        <div className="card card-hover bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="step-number">3</div>
          <h3 className="step-title mb-2">Giriş Yap</h3>
          <p className="text-gray-600 mb-4">
            Özel anahtarınızla mesaj imzalayarak kimliğinizi doğrulayın.
          </p>
          <Link to="/login" className="btn btn-primary block text-center">Dene</Link>
        </div>

        <div className="card card-hover bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="step-number">4</div>
          <h3 className="step-title mb-2">Öğrendiklerim</h3>
          <p className="text-gray-600 mb-4">
            DID, Verkey ve imzalama kavramlarını özetleyen bilgileri inceleyin.
          </p>
          <Link to="/learned" className="btn btn-primary block text-center">Özetle</Link>
        </div>
      </div>

      <div className="bg-secondary-50 rounded-lg p-6 border border-secondary-200 mb-8">
        <h2 className="text-2xl font-bold text-secondary-800 mb-4">Bu Uygulama Hakkında</h2>
        <p className="mb-4">
          Bu uygulama, Anders Brownworth'un blockchain demo sitesinden ilham alınarak, 
          dijital kimlik kavramlarını interaktif bir şekilde öğretmek için tasarlanmıştır.
        </p>
        <p className="mb-4">
          Tüm işlemler tarayıcınızda gerçekleşir ve hiçbir veri sunucuya gönderilmez. 
          Özel anahtarınız yalnızca tarayıcınızın yerel depolama alanında saklanır.
        </p>
        <p>
          <strong>Not:</strong> Bu uygulama eğitim amaçlıdır ve gerçek bir DID sistemi ile bağlantılı değildir.
        </p>
      </div>

      <div className="text-center">
        <Link to="/register" className="btn btn-primary px-8 py-3 text-lg">
          Hemen Başla
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
