import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateKeyPair, generateDID, saveToLocalStorage, getFromLocalStorage } from '../utils/cryptoUtils';

const RegisterPage: React.FC = () => {
  const [keyPair, setKeyPair] = useState<any>(null);
  const [did, setDid] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);

  // LocalStorage'dan mevcut anahtar çiftini kontrol et
  useEffect(() => {
    const storedKeyPair = getFromLocalStorage('didKeyPair');
    const storedDid = getFromLocalStorage('did');
    
    if (storedKeyPair && storedDid) {
      setKeyPair(storedKeyPair);
      setDid(storedDid);
      setIsGenerated(true);
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
      
      // LocalStorage'a kaydet
      saveToLocalStorage('didKeyPair', newKeyPair);
      saveToLocalStorage('did', newDid);
    }, 1500);
  };

  const handleReset = () => {
    if (window.confirm('Bu işlem mevcut DID ve anahtar çiftinizi silecektir. Devam etmek istiyor musunuz?')) {
      localStorage.removeItem('didKeyPair');
      localStorage.removeItem('did');
      setKeyPair(null);
      setDid('');
      setIsGenerated(false);
      setShowPrivateKey(false);
    }
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
        </div>

        <div className="step-card">
          <h2 className="subheading flex items-center">
            <span className="step-number">2</span>
            Ed25519 Anahtar Çifti Oluşturun
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
                    {showPrivateKey ? keyPair?.privateKeyBase58 : '••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Özel anahtarınızı kimseyle paylaşmayın! Bu anahtar, dijital kimliğinizi kontrol etmenizi sağlar.
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <button 
                  onClick={handleReset}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Sıfırla ve Yeni Anahtar Çifti Oluştur
                </button>
              </div>
            </div>
          )}
        </div>

        {isGenerated && (
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
                DID'iniz <span className="text-highlight">{did}</span> olarak oluşturuldu. Bu kimlik, genel anahtarınızın (Verkey) ilk 16 karakteri kullanılarak oluşturuldu.
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <Link to="/testnet" className="btn btn-primary px-6 py-2">
                Devam Et: DID'i Testnet'e Gönder
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
