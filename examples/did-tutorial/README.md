# DID Tutorial - İnteraktif Öğrenme Uygulaması

Bu uygulama, Dijital Kimlik (DID) ve doğrulama anahtarı (Verkey) kavramlarını görsel ve interaktif bir şekilde öğreten bir React ve Tailwind CSS uygulamasıdır. Anders Brownworth'un blockchain demo sitesinden ilham alınmıştır.

## Özellikler

- Ed25519 anahtar çifti oluşturma ve DID oluşturma
- DID'in simüle edilmiş bir testnet'e kaydedilmesi
- DID dokümanı görüntüleme
- Dijital imza oluşturma ve doğrulama
- Öğrenilen kavramların özeti

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

1. **Kayıt Ol**: Ed25519 anahtar çifti oluşturun ve DID elde edin.
2. **Testnet'e Gönder**: DID'inizi simüle edilmiş bir testnet'e gönderin ve DID dokümanını görün.
3. **Giriş Yap**: Özel anahtarınızla mesaj imzalayarak kimliğinizi doğrulayın.
4. **Öğrendiklerim**: DID, Verkey ve imzalama kavramlarını özetleyen bilgileri inceleyin.

## Not

Bu uygulama tamamen istemci tarafında çalışır ve hiçbir gerçek blockchain veya DID kaydı yapmaz. Tüm işlemler tarayıcınızda gerçekleşir ve özel anahtarınız yalnızca tarayıcınızın yerel depolama alanında saklanır.

## Lisans

MIT
