import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateKeyPair, generateDID, saveToLocalStorage, getFromLocalStorage, saveUserData } from '../utils/cryptoUtils';

const RegisterPage: React.FC = () => {
  const [keyPair, setKeyPair] = useState<any>(null);
  const [did, setDid] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [userDataSubmitted, setUserDataSubmitted] = useState<boolean>(false);
  const [ageVerified, setAgeVerified] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // LocalStorage'dan mevcut anahtar çiftini kontrol et, sayfa yenilenince form verilerini temizle
  useEffect(() => {
    const storedKeyPair = getFromLocalStorage('didKeyPair');
    const storedDid = getFromLocalStorage('did');
    const storedStep = getFromLocalStorage('currentStep');
    
    if (storedKeyPair && storedDid) {
      setKeyPair(storedKeyPair);
      setDid(storedDid);
      setIsGenerated(true);
      
      // Anahtar çifti oluşturulduysa en az 2. adıma geçmiş demektir
      if (storedStep && storedStep > 1) {
        setCurrentStep(storedStep);
      } else {
        setCurrentStep(2);
        saveToLocalStorage('currentStep', 2);
      }
    }
    
    // Form verilerini sayfa yenilenince temizle
    setFirstName('');
    setLastName('');
    setBirthDate('');
    
    // Kullanıcı verilerini kontrol et ama sadece isim ve soyisim al
    const storedUserData = getFromLocalStorage('userData');
    const storedCredential = getFromLocalStorage('userCredential');
    
    if (storedUserData) {
      setUserDataSubmitted(true);
      if (storedStep && storedStep > 2) {
        setCurrentStep(storedStep);
      } else if (isGenerated) {
        setCurrentStep(3);
        saveToLocalStorage('currentStep', 3);
      }
    }
    
    if (storedCredential) {
      setAgeVerified(storedCredential.isAdult);
    }
  }, []);

  const handleGenerateKeyPair = () => {
    setIsGenerating(true);
    
    // Animasyon için kısa bir gecikme
    setTimeout(() => {
      const newKeyPair = generateKeyPair();
      const newDid = generateDID(newKeyPair.publicKeyBase58);
      
      setKeyPair(newKeyPair);
      setDid(newDid);
      setIsGenerated(true);
      setIsGenerating(false);
      setCurrentStep(2);
      
      // LocalStorage'a kaydet
      saveToLocalStorage('didKeyPair', newKeyPair);
      saveToLocalStorage('did', newDid);
      saveToLocalStorage('currentStep', 2);
    }, 1500);
  };

  const handleReset = () => {
    if (window.confirm('Bu işlem mevcut DID, anahtar çiftinizi ve kullanıcı bilgilerinizi silecektir. Devam etmek istiyor musunuz?')) {
      localStorage.removeItem('didKeyPair');
      localStorage.removeItem('did');
      localStorage.removeItem('userData');
      localStorage.removeItem('userCredential');
      localStorage.removeItem('ageCredential');
      localStorage.removeItem('currentStep');
      setKeyPair(null);
      setDid('');
      setIsGenerated(false);
      setShowPrivateKey(false);
      setFirstName('');
      setLastName('');
      setBirthDate('');
      setUserDataSubmitted(false);
      setAgeVerified(false);
      setCurrentStep(1);
    }
  };
  
  const handleNextStep = () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    saveToLocalStorage('currentStep', nextStep);
  };
  
  const handleUserDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !birthDate) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }
    
    // Kullanıcı verilerini kaydet ve yaş doğrulamasını yap
    const userData = {
      firstName,
      lastName,
      birthDate
    };
    
    const credential = saveUserData(userData);
    setUserDataSubmitted(true);
    setAgeVerified(credential.isAdult);
    setCurrentStep(5); // Direk 5. adıma git
    saveToLocalStorage('currentStep', 5); // LocalStorage'da da 5. adımı kaydet
    
    // Doğum tarihini temizle - sadece yaş doğrulaması için kullanıldı
    setBirthDate('');
  };

  return (
    <div className="animate-fade-in">
      <h1 className="heading text-center text-3xl mb-8">Dijital Kimlik (DID) Oluşturma</h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="step-card">
          <h2 className="subheading flex items-center">
            <span className="step-number">1</span>
            DID ve Anahtar Çifti Nedir?
          </h2>
          <div className="prose">
            <p className="mb-4">
              <strong>Dijital Kimlik (DID)</strong>, internette sizi benzersiz şekilde tanımlayan bir kimliktir. 
              Merkezi bir otorite tarafından verilmez, kendiniz oluşturabilirsiniz.
            </p>
            <p className="mb-4">
              <strong>Anahtar Çifti</strong>, bir özel anahtar (private key) ve bir genel anahtardan (public key) oluşur:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li><strong>Özel Anahtar:</strong> Gizli tutmanız gereken, dijital imza oluşturmak için kullanılan anahtardır.</li>
              <li><strong>Genel Anahtar (Verkey):</strong> Herkesle paylaşabileceğiniz, imzalarınızı doğrulamak için kullanılan anahtardır.</li>
            </ul>
          </div>
          
          {currentStep === 1 && (
            <div className="text-center mt-4">
              <button 
                onClick={handleNextStep} 
                className="btn btn-primary px-6 py-2"
              >
                Devam Et
              </button>
            </div>
          )}
        </div>

        {currentStep >= 2 && (
          <div className="step-card">
            <h2 className="subheading flex items-center">
              <span className="step-number">2</span>
               Anahtar Çifti Oluşturun
            </h2>
            
            {!isGenerated ? (
              <div className="text-center py-4">
                <button 
                  onClick={handleGenerateKeyPair} 
                  disabled={isGenerating}
                  className={`btn btn-primary px-6 py-3 text-lg ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isGenerating ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Anahtar Çifti Oluşturuluyor...
                    </span>
                  ) : 'Anahtar Çifti Oluştur'}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Bu işlem tamamen tarayıcınızda gerçekleşir ve hiçbir veri sunucuya gönderilmez.
                </p>
              </div>
            ) : (
              <div className="animate-slide-in">
                <div className="success-box">
                  <p className="font-semibold">Anahtar çifti başarıyla oluşturuldu!</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="label">Genel Anahtar (Verkey - Base58)</label>
                    <div className="input bg-gray-50 overflow-x-auto whitespace-nowrap font-mono text-sm">
                      {keyPair?.publicKeyBase58}
                    </div>
                  </div>
                  <div>
                    <label className="label flex justify-between">
                      <span>Özel Anahtar (Base58)</span>
                      <button 
                        onClick={() => setShowPrivateKey(!showPrivateKey)} 
                        className="text-xs text-primary-600 hover:text-primary-800"
                      >
                        {showPrivateKey ? 'Gizle' : 'Göster'}
                      </button>
                    </label>
                    <div className="input bg-gray-50 overflow-x-auto whitespace-nowrap font-mono text-sm">
                      {showPrivateKey ? keyPair?.privateKeyBase58 : '•••••••••••••••••••••••••••••••••••••••••••••••••••'}
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                      Özel anahtarınızı kimseyle paylaşmayın! Bu anahtar, dijital kimliğinizi kontrol etmenizi sağlar.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <button 
                    onClick={handleReset}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Sıfırla ve Yeni Anahtar Çifti Oluştur
                  </button>
                  
                  {currentStep === 2 && (
                    <button 
                      onClick={handleNextStep} 
                      className="btn btn-primary px-6 py-2"
                    >
                      Devam Et
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep >= 3 && isGenerated && (
          <div className="step-card animate-slide-in">
            <h2 className="subheading flex items-center">
              <span className="step-number">3</span>
              DID'iniz Oluşturuldu
            </h2>
            
            <div className="did-card mb-6">
              <div className="did-card-inner">
                <div className="did-card-chip"></div>
                <div className="mb-4">
                  <div className="text-xs opacity-70">Dijital Kimlik (DID)</div>
                  <div className="text-xl font-mono break-all">{did}</div>
                </div>
                <div className="mb-4">
                  <div className="text-xs opacity-70">Verkey</div>
                  <div className="text-sm font-mono break-all">{keyPair?.publicKeyBase58}</div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-xs opacity-70">Oluşturulma Tarihi</div>
                  <div className="text-sm">{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
            
            <div className="info-box">
              <p className="font-medium">DID'iniz başarıyla oluşturuldu!</p>
              <p className="text-sm mt-1">
                DID'iniz <span className="text-highlight">{did}</span> olarak oluşturuldu. Bu kimlik, test amaçlı oluşturuldu.
              </p>
            </div>
            
            <div className="text-center mt-4">
              <button 
                onClick={handleNextStep} 
                className="btn btn-primary px-6 py-2"
              >
                Devam Et
              </button>
            </div>
          </div>
        )}
        
        {currentStep >= 4 && isGenerated && (
          <div className="step-card animate-slide-in">
            <h2 className="subheading flex items-center">
              <span className="step-number">4</span>
              Kişisel Bilgilerinizi Girin
            </h2>
            
            <div className="relative">
              <form onSubmit={handleUserDataSubmit} className="mt-4 relative">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="label">Ad</label>
                    <input 
                      type="text" 
                      className="input" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Soyad</label>
                    <input 
                      type="text" 
                      className="input" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="label">Doğum Tarihi</label>
                  <input 
                    type="date" 
                    className="input" 
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    * Doğum tarihiniz sadece yaş doğrulaması için kullanılacak ve saklanmayacaktır.
                  </p>
                </div>
                
                <div className="text-center">
                  <button type="submit" className="btn btn-primary px-6 py-2">
                    Bilgileri Kaydet ve Devam Et
                  </button>
                </div>
                
                {userDataSubmitted && (
                  <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center animate-fade-in z-10">
                    <div className="rounded-full bg-green-100 p-3 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Bilgileriniz Başarıyla Kaydedildi!</h3>
                    <p className="text-center text-gray-600 mb-4">Kimlik doğrulamanız tamamlandı.</p>
                    <button 
                      onClick={handleNextStep}
                      className="btn btn-primary px-6 py-2"
                    >
                      Dijital Cüzdanıma Git
                    </button>
                  </div>
                )}
              </form>
            </div>
            
            {userDataSubmitted && (
              <div className="animate-slide-in">
                <h2 className="subheading flex items-center">
                  <span className="step-number">5</span>
                  Dijital Cüzdanınız Oluşturuldu
                </h2>
                
                <div className="did-card mb-6 mt-4">
                  <div className="did-card-inner">
                    <div className="did-card-chip"></div>
                    <div className="mb-4">
                      <div className="text-xs opacity-70">Dijital Kimlik (DID)</div>
                      <div className="text-xl font-mono break-all">{did}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs opacity-70">Verkey</div>
                      <div className="text-sm font-mono break-all">{keyPair?.publicKeyBase58}</div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-xs opacity-70">Oluşturulma Tarihi</div>
                      <div className="text-sm">{new Date().toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="info-box">
                  <p className="font-medium">Dijital kimliğiniz başarıyla oluşturuldu!</p>
                  <p className="text-sm mt-1">
                    DID'iniz ve anahtar çiftiniz başarıyla oluşturuldu. Kişisel bilgileriniz doğrulandı ve yaş doğrulama kimliğiniz hazır.
                  </p>
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/testnet" className="btn btn-primary px-6 py-2">
                    Kimliği Test Ağına Gönder
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
