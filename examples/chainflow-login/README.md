# ChainFlow SSI Login System

Bu proje, Self-Sovereign Identity (SSI) tabanlı bir kimlik doğrulama sistemi kullanarak ChainFlow platformuna giriş yapılmasını sağlar.

## Proje Hakkında

ChainFlow SSI Login sistemi, kullanıcıların klasik şifre yerine SSI temelli dijital kimliklerini kullanarak platforma giriş yapmasını sağlar. Bu süreçte:

- Kullanıcının cüzdanında bir DID (Decentralized Identifier) bulunur
- Kullanıcı, kurumdan almış olduğu "Onaylı ChainFlow Kullanıcısı" Verifiable Credential (VC) ile login olur
- Zero Knowledge Proof ile sadece gerekli bilgileri paylaşır

## Roller

- **User (Holder)**: DID ve Credential sahibidir
- **ChainFlow Admin (Verifier)**: Kimliği doğrulamak isteyen uygulamadır
- **SSI Türkiye (Issuer)**: Kullanıcıya VC veren otoritedir

## Kurulum

```bash
# Gerekli paketleri yükleyin
pip install -r requirements.txt

# Ortam değişkenlerini ayarlayın
cp .env.example .env
# .env dosyasını düzenleyin

# Uygulamayı başlatın
python app.py
```

## Senaryo Akışı

1. Kullanıcı "DID ile Giriş Yap" seçer
2. ChainFlow, kullanıcının wallet'ı ile DIDComm üzerinden bağlantı kurar
3. ChainFlow, kullanıcıdan credential sunmasını ister
4. Kullanıcı onaylar ve proof gönderir
5. ChainFlow proof'u doğrular ve giriş tamamlanır

## Demo Modu

Bu örnek, Hyperledger Indy bağımlılıkları olmadan da çalışabilecek bir demo modu içerir. Demo modunda:

1. Gerçek Hyperledger Indy bağlantıları yerine simüle edilmiş yanıtlar kullanılır
2. QR kodları gerçek bir cüzdan uygulamasıyla kullanılamaz
3. Kimlik doğrulama otomatik olarak simüle edilir

## Gerçek Sisteme Geçiş İçin Yapılması Gerekenler

Gerçek Hyperledger Indy tabanlı SSI sistemi için:

1. Python 3.10 veya 3.11 kullanın (Python 3.13 ile uyumluluk sorunları var)
2. Bağımlılıkları kurun: `pip install python3-indy aiohttp pydantic fastapi uvicorn python-dotenv`
3. Gerçek bir Indy ağına bağlanmak için doğru genesis.txn dosyasını yapılandırın
4. Mobil cihazınıza Hyperledger Indy uyumlu bir SSI cüzdanı kurun
5. Test için, bir kimlik bilgisi veren servisten geçerli bir kimlik bilgisi alın
