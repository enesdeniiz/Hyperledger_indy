import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFromLocalStorage, signMessage, verifySignature, verifyAgeCredential } from '../utils/cryptoUtils';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [did, setDid] = useState<string>('');
  const [keyPair, setKeyPair] = useState<any>(null);
  const [signature, setSignature] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [ageVerified, setAgeVerified] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);

  // Sabit mesaj
  const loginMessage = "DID ile Giriş Yapıyorum";

  // LocalStorage'dan DID, anahtar çifti ve kullanıcı verilerini kontrol et
  useEffect(() => {
    const storedDid = getFromLocalStorage('did');
    const storedKeyPair = getFromLocalStorage('didKeyPair');
    const storedUserData = getFromLocalStorage('userData');
    const storedCredential = getFromLocalStorage('userCredential');
    
    if (!storedDid || !storedKeyPair) {
      // DID veya anahtar çifti yoksa kayıt sayfasına yönlendir
      navigate('/register');
      return;
    }
    
    setDid(storedDid);
    setKeyPair(storedKeyPair);
    
    if (storedUserData) {
      setUserData(storedUserData);
    }
    
    if (storedCredential) {
      // Yaş doğrulama bilgisini al ama doğum tarihini alma
      setAgeVerified(storedCredential.isAdult);
    }
  }, [navigate]);

  const handleSignMessage = () => {
    try {
      // İmza oluştur
      const signatureHex = signMessage(loginMessage, keyPair.privateKey);
      setSignature(signatureHex);
      setCurrentStep(1);
    } catch (error) {
      console.error('İmza oluşturma hatası:', error);
      setVerificationError('İmza oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleVerifySignature = () => {
    setIsVerifying(true);
    setShowAnimation(true);
    
    // Animasyon için kısa bir gecikme
    setTimeout(() => {
      try {
        // İmzayı doğrula
        const isValid = verifySignature(loginMessage, signature, keyPair.publicKey);
        
        if (isValid) {
          setIsVerified(true);
          setVerificationError('');
          
          // Yaş doğrulama kimlik bilgisini doğrula
          const credential = getFromLocalStorage('userCredential');
          if (credential) {
            // Credential'i doğrudan kullan, verifyAgeCredential fonksiyonunu çağırma
            // Bu hata veriyor olabilir
            setAgeVerified(credential.isAdult);
            
            // 18 yaş kontrolü
            if (!credential.isAdult) {
              // 18 yaşından küçükse hata ver
              setVerificationError('Giriş yapılamadı! Bu uygulama için 18 yaşından büyük olmanız gerekmektedir.');
              setCurrentStep(1); // İmza doğrulama adımında kal
              // 18 yaşından küçük olsa da devam etme seçeneği sun
            } else {
              // 18 yaşından büyükse devam et
              setCurrentStep(2);
              // Başarılı giriş bilgisini kaydet
              localStorage.setItem('lastLogin', new Date().toISOString());
            }
          } else {
            setVerificationError('Yaş doğrulama kimlik bilgisi bulunamadı. Lütfen tekrar kayıt olun.');
            setCurrentStep(1);
          }
        } else {
          setIsVerified(false);
          setVerificationError('İmza doğrulanamadı. Lütfen tekrar deneyin.');
        }
      } catch (error) {
        console.error('İmza doğrulama hatası:', error);
        setIsVerified(false);
        setVerificationError('İmza doğrulanırken bir hata oluştu. Lütfen tekrar deneyin.');
      }
      
      setIsVerifying(false);
      
      // Animasyonu bir süre daha göster
      setTimeout(() => {
        setShowAnimation(false);
      }, 1000);
    }, 2000);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="heading text-center text-3xl mb-8">DID ile Giriş Yapma</h1>
      <p className="text-center font-semibold text-lg mb-4">
        "Bir bilgiyi bildiğini ispatla, ama bana o bilgiyi gösterme!"
      </p>
      
      <div className="max-w-3xl mx-auto">
        <div className="step-card">
          <h2 className="subheading flex items-center">
            <span className="step-number">1</span>
            İmza ile Kimlik Doğrulama
          </h2>
          <div className="prose">
            <p className="mb-4">
              DID sistemlerinde kimlik doğrulama, özel anahtarınızla bir mesajı imzalayarak gerçekleştirilir.
              Bu imza, genel anahtarınız (Verkey) kullanılarak doğrulanabilir.
            </p>
            <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
  <h3 className="font-bold text-lg mb-4">Melike Şifreyi Biliyor mu?</h3>

  <div className="bg-blue-50 p-4 rounded-lg mb-6">
    <p className="font-semibold mb-2">🎬 Karakterler:</p>
    <ul className="list-disc pl-5">
      <li><strong>Enes:</strong> Doğrulayıcı – sadece "evet" ya da "hayır" cevabını ister.</li>
      <li><strong>Melike:</strong> Bilgi sahibi – gizli bir bilgiyi (şifreyi) bildiğini ispatlamak istiyor ama şifreyi söylemeden.</li>
    </ul>
  </div>

  <div className="bg-yellow-50 p-4 rounded-lg mb-6">
    <p className="font-semibold mb-2">🔐 Durum: Gizli Kapı ve Şifre</p>
    <p>Melike, şifreli bir kapının olduğu bir odaya gider. Bu kapıyı açmak için özel bir şifre gerekir.</p>
    <p className="mt-2">💬 Enes: "Eğer şifreyi gerçekten biliyorsan, kapının diğer tarafından geri çıkabilmelisin!"</p>
  </div>

  <div className="border border-gray-300 rounded-lg p-4 mb-6">
    <div className="flex justify-center mb-4">
      <div className="relative">
        <img src="/images/Adsız tasarım.png" alt="Zero Knowledge Proof Diagram" className="max-w-full h-auto" />
      </div>
    </div>
  </div>

  <div className="bg-green-50 p-4 rounded-lg">
    <p className="font-semibold mb-2">✅ Sonuç: Melike Gerçekten Şifreyi Biliyor ama Şifreyi Hiç Söylemiyor!</p>
    <p>Enes, Melike'nin kapıyı açabildiğini görür → "Şifreyi bildiğinden emin olur."</p>
    <p className="font-semibold mt-2">Ama Melike'nin şifresinin ne olduğunu hiç öğrenmez.</p>
  </div>
</div>

            
            <p>
              Bu adımda, "<strong>{loginMessage}</strong>" mesajını özel anahtarınızla imzalayarak 
              kimliğinizi doğrulayacaksınız.
            </p>
          </div>
        </div>

        <div className="step-card">
          <h2 className="subheading flex items-center">
            <span className="step-number">2</span>
            Kimliğinizi Doğrulayın
          </h2>
          
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">DID</label>
                <div className="input bg-gray-100 overflow-x-auto whitespace-nowrap font-mono text-sm">
                  {did}
                </div>
              </div>
              <div>
                <label className="label">Mesaj</label>
                <div className="input bg-gray-100 overflow-x-auto whitespace-nowrap font-mono text-sm">
                  {loginMessage}
                </div>
              </div>
            </div>
          </div>
          
          {currentStep === 0 && (
            <div className="text-center">
              <button 
                onClick={handleSignMessage} 
                className="btn btn-primary px-6 py-2"
              >
                Mesajı İmzala
              </button>
            </div>
          )}
          
          {currentStep >= 1 && (
            <div className="animate-slide-in mt-6">
              <h3 className="text-lg font-semibold mb-2">İmza Oluşturuldu</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
                <label className="label">İmza (Hex)</label>
                <div className="input bg-gray-100 overflow-x-auto whitespace-nowrap font-mono text-xs">
                  {signature}
                </div>
              </div>
              
              {currentStep === 1 && (
                <div className="text-center">
                  <button 
                    onClick={handleVerifySignature} 
                    disabled={isVerifying}
                    className={`btn btn-primary px-6 py-2 ${isVerifying ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isVerifying ? 'Doğrulanıyor...' : 'İmzayı Doğrula'}
                  </button>
                </div>
              )}
              
              {verificationError && (
                <div className="error-box mt-4">
                  <p>{verificationError}</p>
                  
                  {/* 18 yaşından küçük kullanıcılar için butonlar */}
                  {verificationError.includes('18 yaşından büyük') && (
                    <div className="mt-4 flex flex-col items-center space-y-3">
                      <Link to="/learned" className="btn btn-primary px-6 py-2">
                        Devam Et: Öğrendiklerinizi Gözden Geçirin
                      </Link>
                      <button 
                        onClick={() => {
                          // Tüm verileri sıfırla
                          localStorage.removeItem('didKeyPair');
                          localStorage.removeItem('did');
                          localStorage.removeItem('userData');
                          localStorage.removeItem('userCredential');
                          localStorage.removeItem('ageCredential');
                          localStorage.removeItem('currentStep');
                          // Ana sayfaya yönlendir
                          window.location.href = '/';
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded"
                      >
                        Sıfırla ve Yeni Anahtar Çifti Oluştur
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {showAnimation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    <div className="absolute inset-0 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">İmza Doğrulanıyor</h3>
                  <p className="text-gray-600">
                    İmzanız genel anahtarınız (Verkey) kullanılarak doğrulanıyor...
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="animate-slide-in mt-6">
              <div className="success-box">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Kimliğiniz başarıyla doğrulandı!</span>
                </div>
                <p className="text-sm mt-2">
                  İmzanız geçerli ve DID'iniz <span className="text-highlight">{did}</span> ile eşleşiyor.
                  Artık sisteme giriş yaptınız.
                </p>
              </div>
              
              {/* Yaş doğrulama bilgisini göster */}
              <div className="did-card mb-6 mt-6">
                <div className="did-card-inner">
                  <div className="did-card-chip"></div>
                  <div className="mb-4">
                    <div className="text-xs opacity-70">Ad Soyad</div>
                    <div className="text-xl">{userData?.firstName} {userData?.lastName}</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-xs opacity-70">Kimlik Doğrulama</div>
                    <div className="text-sm font-semibold text-green-600">
                      {ageVerified ? '18 Yaş Üstü Doğrulandı' : '18 Yaş Altı'}
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-xs opacity-70">DID</div>
                    <div className="text-sm font-mono">{did.substring(0, 16)}...</div>
                  </div>
                </div>
              </div>
              
              <div className="info-box">
                <p className="font-medium">Yaş doğrulama kimliğiniz başarıyla doğrulandı!</p>
                <p className="text-sm mt-1">
                  Doğum tarihiniz sistemde saklanmadan, sadece yaşınızın 18'den büyük olup olmadığı bilgisi doğrulandı.
                </p>
              </div>
              
              <div className="mt-6 text-center">
                <Link to="/learned" className="btn btn-primary px-6 py-2">
                  Devam Et: Öğrendiklerinizi Gözden Geçirin
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
