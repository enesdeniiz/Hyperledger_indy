import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFromLocalStorage, generateDIDDocument } from '../utils/cryptoUtils';

const TestnetPage: React.FC = () => {
  const navigate = useNavigate();
  const [did, setDid] = useState<string>('');
  const [keyPair, setKeyPair] = useState<any>(null);
  const [didDocument, setDidDocument] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showJson, setShowJson] = useState<boolean>(false);

  // LocalStorage'dan DID ve anahtar çiftini kontrol et
  useEffect(() => {
    const storedDid = getFromLocalStorage('did');
    const storedKeyPair = getFromLocalStorage('didKeyPair');
    
    if (!storedDid || !storedKeyPair) {
      // DID veya anahtar çifti yoksa kayıt sayfasına yönlendir
      navigate('/register');
      return;
    }
    
    setDid(storedDid);
    setKeyPair(storedKeyPair);
    
    // DID dokümanı oluştur
    const doc = generateDIDDocument(storedDid, storedKeyPair.publicKeyBase58);
    setDidDocument(doc);
    
    // Daha önce testnet'e gönderilmiş mi kontrol et
    const didSubmitted = getFromLocalStorage('didSubmitted');
    if (didSubmitted) {
      setIsSubmitted(true);
      setCurrentStep(3); // Son adıma atla
    }
  }, [navigate]);

  const simulateSubmission = () => {
    setIsSubmitting(true);
    setCurrentStep(1);
    
    // Adım 1: DID gönderiliyor
    setTimeout(() => {
      setCurrentStep(2);
      
      // Adım 2: DID doğrulanıyor
      setTimeout(() => {
        setCurrentStep(3);
        setIsSubmitting(false);
        setIsSubmitted(true);
        
        // LocalStorage'a kaydedildi olarak işaretle
        localStorage.setItem('didSubmitted', 'true');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="heading text-center text-3xl mb-8">DID'i Testnet'e Gönderme</h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="step-card">
          <h2 className="subheading flex items-center">
            <span className="step-number">1</span>
            DID ve Testnet Hakkında
          </h2>
          <div className="prose">
            <p className="mb-4">
              Gerçek bir DID sistemi, kimliğinizin dağıtık bir ağda (genellikle bir blok zincirinde) 
              kaydedilmesini gerektirir. Bu kayıt işlemi, DID'inizin ve ilişkili genel anahtarınızın 
              (Verkey) herkes tarafından doğrulanabilir olmasını sağlar.
            </p>
            <p>
              Bu adımda, DID'inizi simüle edilmiş bir testnet'e gönderme sürecini deneyimleyeceksiniz. 
              Gerçek bir testnet'e gönderim yapmıyoruz, ancak süreç benzer şekilde işler.
            </p>
          </div>
        </div>

        <div className="step-card">
          <h2 className="subheading flex items-center">
            <span className="step-number">2</span>
            DID Dokümanı
          </h2>
          
          {didDocument && (
            <div>
              <p className="mb-4">
                DID dokümanı, kimliğinizle ilgili temel bilgileri içeren bir JSON belgesidir. 
                Bu belge, DID'iniz ve genel anahtarınız (Verkey) arasındaki bağlantıyı doğrular.
              </p>
              
              <div className="bg-gray-800 text-white p-4 rounded-md mb-4 relative">
                <button 
                  onClick={() => setShowJson(!showJson)} 
                  className="absolute top-2 right-2 text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                >
                  {showJson ? 'Özet Görünüm' : 'JSON Görünümü'}
                </button>
                
                {showJson ? (
                  <pre className="text-xs overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(didDocument, null, 2)}
                  </pre>
                ) : (
                  <div className="text-sm">
                    <div className="mb-2">
                      <span className="text-blue-300">@context:</span> {didDocument['@context']}
                    </div>
                    <div className="mb-2">
                      <span className="text-blue-300">id:</span> {didDocument.id}
                    </div>
                    <div className="mb-2">
                      <span className="text-blue-300">verificationMethod:</span> [
                      <div className="pl-4">
                        <div><span className="text-green-300">id:</span> {didDocument.verificationMethod[0].id}</div>
                        <div><span className="text-green-300">type:</span> {didDocument.verificationMethod[0].type}</div>
                        <div><span className="text-green-300">controller:</span> {didDocument.verificationMethod[0].controller}</div>
                        <div><span className="text-green-300">publicKeyBase58:</span> {didDocument.verificationMethod[0].publicKeyBase58}</div>
                      </div>
                      ]
                    </div>
                    <div className="mb-2">
                      <span className="text-blue-300">authentication:</span> [{didDocument.authentication[0]}]
                    </div>
                    <div className="mb-2">
                      <span className="text-blue-300">created:</span> {didDocument.created}
                    </div>
                    <div>
                      <span className="text-blue-300">updated:</span> {didDocument.updated}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="step-card">
          <h2 className="subheading flex items-center">
            <span className="step-number">3</span>
            DID'i Testnet'e Gönder
          </h2>
          
          {isSubmitted ? (
            <div className="animate-slide-in">
              <div className="success-box">
                <p className="font-semibold">DID'iniz başarıyla testnet'e kaydedildi!</p>
                <p className="text-sm mt-1">
                  DID'iniz <span className="text-highlight">{did}</span> artık simüle edilmiş testnet'te kayıtlı ve doğrulanabilir durumda.
                </p>
              </div>
              
              <div className="mt-6 text-center">
                <Link to="/login" className="btn btn-primary px-6 py-2">
                  Devam Et: DID ile Giriş Yap
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4">
                Aşağıdaki DID'i simüle edilmiş testnet'e göndermek için "Gönder" butonuna tıklayın:
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
                <div className="font-mono break-all">{did}</div>
              </div>
              
              {isSubmitting ? (
                <div className="animate-slide-in">
                  <div className="relative pt-1 mb-6">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-500"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="text-center text-sm text-gray-600">
                      {currentStep === 1 && (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          DID testnet'e gönderiliyor...
                        </div>
                      )}
                      {currentStep === 2 && (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          DID doğrulanıyor ve kaydediliyor...
                        </div>
                      )}
                      {currentStep === 3 && "İşlem tamamlandı!"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <button 
                    onClick={simulateSubmission} 
                    className="btn btn-primary px-6 py-2"
                  >
                    Testnet'e Gönder
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestnetPage;
