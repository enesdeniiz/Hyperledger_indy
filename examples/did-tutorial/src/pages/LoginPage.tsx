import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFromLocalStorage, signMessage, verifySignature } from '../utils/cryptoUtils';

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

  // Sabit mesaj
  const loginMessage = "DID ile Giriş Yapıyorum";

  // LocalStorage'dan DID ve anahtar çiftini kontrol et
  useEffect(() => {
    const storedDid = getFromLocalStorage('did');
    const storedKeyPair = getFromLocalStorage('didKeyPair');
    const didSubmitted = getFromLocalStorage('didSubmitted');
    
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
    
    setDid(storedDid);
    setKeyPair(storedKeyPair);
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
          setCurrentStep(2);
          
          // Başarılı giriş bilgisini kaydet
          localStorage.setItem('lastLogin', new Date().toISOString());
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
