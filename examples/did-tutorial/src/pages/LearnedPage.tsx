import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFromLocalStorage } from '../utils/cryptoUtils';

const LearnedPage: React.FC = () => {
  const navigate = useNavigate();
  const [did, setDid] = useState<string>('');
  const [keyPair, setKeyPair] = useState<any>(null);
  const [lastLogin, setLastLogin] = useState<string>('');

  // LocalStorage'dan bilgileri kontrol et
  useEffect(() => {
    const storedDid = getFromLocalStorage('did');
    const storedKeyPair = getFromLocalStorage('didKeyPair');
    const didSubmitted = getFromLocalStorage('didSubmitted');
    const storedLastLogin = localStorage.getItem('lastLogin');
    
    if (!storedDid || !storedKeyPair) {
      // DID veya anahtar çifti yoksa kayıt sayfasına yönlendir
      navigate('/register');
      return;
    }

    if (!didSubmitted) {
      // DID testnet'e gönderilmemişse testnet sayfasına yönlendir
      navigate('/testnet');
      return;
    }
    
    if (!storedLastLogin) {
      // Giriş yapılmamışsa login sayfasına yönlendir
      navigate('/login');
      return;
    }
    
    setDid(storedDid);
    setKeyPair(storedKeyPair);
    setLastLogin(new Date(storedLastLogin).toLocaleString());
  }, [navigate]);

  // PDF indirme fonksiyonu (simüle edilmiş)
  const handleDownloadPDF = () => {
    alert('PDF indirme özelliği şu anda simüle edilmiştir. Gerçek bir uygulamada, jsPDF gibi bir kütüphane kullanılarak PDF oluşturulabilir.');
  };

  return (
    <div className="animate-fade-in">
      <h1 className="heading text-center text-3xl mb-8">Öğrendikleriniz</h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-t-4 border-primary-600">
          <h2 className="text-2xl font-bold text-primary-800 mb-4">Tebrikler!</h2>
          <p className="text-lg mb-6">
            DID ve Verkey kavramlarını başarıyla öğrendiniz ve uyguladınız. 
            Bu sayfada, öğrendiklerinizin bir özetini bulabilirsiniz.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
            <h3 className="font-semibold text-lg mb-2">Sizin DID Bilgileriniz</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">DID</label>
                <div className="input bg-gray-100 overflow-x-auto whitespace-nowrap font-mono text-sm">
                  {did}
                </div>
              </div>
              <div>
                <label className="label">Verkey (Genel Anahtar)</label>
                <div className="input bg-gray-100 overflow-x-auto whitespace-nowrap font-mono text-sm">
                  {keyPair?.publicKeyBase58}
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Son giriş: {lastLogin}
            </div>
          </div>
        </div>

        <div className="step-card">
          <h2 className="subheading">DID (Decentralized Identifier) Nedir?</h2>
          <p className="mb-4">
            DID, merkezi bir otorite tarafından verilmeyen, kullanıcının kendisi tarafından oluşturulabilen 
            ve kontrol edilebilen bir dijital kimliktir. DID'ler:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Benzersizdir ve çakışma olasılığı çok düşüktür</li>
            <li>Genel anahtarınız (Verkey) ile ilişkilendirilir</li>
            <li>Dağıtık bir kayıt defterinde (genellikle blockchain) saklanabilir</li>
            <li>Kimlik doğrulama, veri şifreleme ve dijital imzalama için kullanılabilir</li>
            <li>Kendi kendine egemen kimlik (Self-Sovereign Identity) kavramının temel yapı taşıdır</li>
          </ul>
          <p>
            Örnek bir DID: <code className="bg-gray-100 px-1 rounded">did:example:123456789abcdefghi</code>
          </p>
        </div>

        <div className="step-card">
          <h2 className="subheading">Anahtar Çifti ve Verkey</h2>
          <p className="mb-4">
            DID sistemlerinde kullanılan anahtar çifti, asimetrik kriptografi prensiplerine dayanır:
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Özel Anahtar</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Gizli tutulmalıdır</li>
                <li>Dijital imza oluşturmak için kullanılır</li>
                <li>Kimliğinizi kontrol etmenizi sağlar</li>
                <li>Kaybedilirse, DID üzerindeki kontrolünüzü kaybedersiniz</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Genel Anahtar (Verkey)</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Herkesle paylaşılabilir</li>
                <li>İmzaları doğrulamak için kullanılır</li>
                <li>DID dokümanında yayınlanır</li>
                <li>Kimliğinizi doğrulamanızı sağlar</li>
              </ul>
            </div>
          </div>
          <p>
            Bu uygulamada Ed25519 eliptik eğri kriptografisi kullanılmıştır, bu algoritma 
            hızlı ve güvenli imzalama işlemleri için tercih edilir.
          </p>
        </div>

        <div className="step-card">
          <h2 className="subheading">DID Dokümanı</h2>
          <p className="mb-4">
            DID dokümanı, bir DID hakkındaki temel bilgileri içeren JSON-LD formatında bir belgedir. 
            Bu belge:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>DID'yi genel anahtarlar (Verkey) ile ilişkilendirir</li>
            <li>Kimlik doğrulama yöntemlerini belirtir</li>
            <li>Hizmet uç noktalarını listeleyebilir</li>
            <li>DID ile etkileşim için gerekli bilgileri sağlar</li>
          </ul>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre className="text-xs overflow-auto">
{`{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:example:123456789abcdefghi",
  "verificationMethod": [{
    "id": "did:example:123456789abcdefghi#keys-1",
    "type": "Ed25519VerificationKey2018",
    "controller": "did:example:123456789abcdefghi",
    "publicKeyBase58": "H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
  }],
  "authentication": ["did:example:123456789abcdefghi#keys-1"]
}`}
            </pre>
          </div>
        </div>

        <div className="step-card">
          <h2 className="subheading">İmza ve Doğrulama Süreci</h2>
          <p className="mb-4">
            DID sistemlerinde kimlik doğrulama, dijital imzalama ve doğrulama ile gerçekleştirilir:
          </p>
          
          <div className="relative overflow-hidden mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex flex-col items-center">
                <div className="text-blue-800 font-semibold mb-2">1. İmzalama</div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <div className="text-sm text-center">
                  Kullanıcı özel anahtarı ile mesajı imzalar
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 flex flex-col items-center">
                <div className="text-purple-800 font-semibold mb-2">2. İmza Gönderimi</div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <div className="text-sm text-center">
                  İmza ve mesaj doğrulayıcıya gönderilir
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex flex-col items-center">
                <div className="text-green-800 font-semibold mb-2">3. Doğrulama</div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-center">
                  Doğrulayıcı genel anahtar ile imzayı doğrular
                </div>
              </div>
            </div>
            
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
          </div>
          
          <p>
            Bu süreç, özel anahtarın sahibi olduğunuzu kanıtlamanızı ve böylece DID'nizin 
            kontrolünü göstermenizi sağlar. Hiçbir şifre paylaşmanıza gerek kalmadan güvenli 
            kimlik doğrulama yapabilirsiniz.
          </p>
        </div>

        <div className="step-card">
          <h2 className="subheading">DID'lerin Avantajları</h2>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Merkeziyetsizlik:</strong> Merkezi bir otoriteye bağlı değildir</li>
            <li><strong>Kontrol:</strong> Kimliğiniz tamamen sizin kontrolünüzdedir</li>
            <li><strong>Gizlilik:</strong> Sadece paylaşmak istediğiniz bilgileri açıklarsınız</li>
            <li><strong>Taşınabilirlik:</strong> Kimliğinizi farklı sistemler arasında kullanabilirsiniz</li>
            <li><strong>Güvenlik:</strong> Kriptografik olarak güvenlidir ve taklit edilemez</li>
            <li><strong>Süreklilik:</strong> Hizmet sağlayıcılar değişse bile kimliğiniz kalıcıdır</li>
          </ul>
        </div>

        <div className="step-card">
          <h2 className="subheading">Gerçek Dünya Uygulamaları</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div className="card">
              <h3 className="font-semibold mb-2">Dijital Kimlik Sistemleri</h3>
              <p className="text-sm">
                Devletler ve kurumlar, vatandaşlara ve müşterilere dijital kimlik sağlamak için DID'leri kullanabilir.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2">Doğrulanabilir Kimlik Bilgileri</h3>
              <p className="text-sm">
                Diplomalar, sertifikalar ve lisanslar gibi belgeler DID'ler ile doğrulanabilir.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2">Şifresiz Giriş</h3>
              <p className="text-sm">
                DID'ler, şifre gerektirmeyen güvenli kimlik doğrulama sistemleri için kullanılabilir.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2">Tedarik Zinciri Takibi</h3>
              <p className="text-sm">
                Ürünlerin ve katılımcıların kimliklerini doğrulamak için DID'ler kullanılabilir.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={handleDownloadPDF} 
            className="btn btn-primary px-6 py-3 text-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Özeti PDF Olarak İndir
          </button>
          
          <div className="mt-6">
            <Link to="/" className="text-primary-600 hover:text-primary-800">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnedPage;
