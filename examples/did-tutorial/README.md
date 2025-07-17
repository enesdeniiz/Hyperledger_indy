# DID Tutorial - Dijital Kimlik Öğretici

Bu uygulama, Merkezi Olmayan Kimlik Tanımlayıcıları (DID) ve Dijital Kimlik kavramlarını görsel ve interaktif bir şekilde öğreten bir eğitim aracıdır. Uygulama, kullanıcılara adım adım DID oluşturma, imzalama, doğrulama ve yaş doğrulama süreçlerini deneyimleme imkanı sağlar.

## Özellikler

- **Ed25519 Anahtar Çifti Oluşturma**: Güvenli kriptografik anahtar çiftleri oluşturma
- **DID Oluşturma**: Merkezi olmayan kimlik tanımlayıcıları oluşturma
- **DID Dokümanı Görüntüleme**: DID'lerin yapısını ve içeriğini anlama
- **Testnet Simülasyonu**: DID'lerin blok zincirinde nasıl yayınlandığını görme
- **Sıfır-Bilgi Kanıtları**: Bilgiyi açıklamadan doğrulama kavramını öğrenme
- **Yaş Doğrulama**: Verifiable Credentials ile yaş doğrulama örneği
- **İnteraktif Öğrenme**: Adım adım rehberlik eden bir öğretici akışı

## Teknolojiler

- React
- TypeScript
- Tailwind CSS
- TweetNaCl.js (Ed25519 kriptografi)
- BS58 (Base58 kodlama)
- React Router

## Kurulum

1. Bağımlılıkları yükleyin:
   ```
   npm install
   ```

2. Geliştirme sunucusunu başlatın:
   ```
   npm start
   ```

3. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

## Kullanım

Uygulama dört ana adımdan oluşur:

1. **Kayıt Ol**:  Anahtar çifti oluşturun ve DID elde edin.
2. **Testnet'e Gönder**: DID'inizi simüle edilmiş bir testnet'e gönderin ve DID dokümanını görün.
3. **Giriş Yap**: Özel anahtarınızla mesaj imzalayarak kimliğinizi doğrulayın.
4. **Öğrendiklerim**: DID, Verkey ve imzalama kavramlarını özetleyen bilgileri inceleyin.

## Not

Bu uygulama tamamen istemci tarafında çalışır ve hiçbir gerçek blockchain veya DID kaydı yapmaz. Tüm işlemler tarayıcınızda gerçekleşir ve özel anahtarınız yalnızca tarayıcınızın yerel depolama alanında saklanır.

## Lisans

MIT
