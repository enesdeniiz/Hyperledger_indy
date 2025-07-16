# Hyperledger Indy Örnekleri

Bu repo, Hyperledger Indy kullanarak Self-Sovereign Identity (SSI) uygulamaları geliştirmek için çeşitli örnekler içermektedir.

## Örnekler

### 1. ChainFlow SSI Login

ChainFlow platformu için SSI tabanlı giriş sistemi. Klasik şifre tabanlı giriş yerine DID ve Doğrulanabilir Kimlik Bilgileri (Verifiable Credentials) kullanarak Sıfır Bilgi İspatı (Zero Knowledge Proof) ile güvenli giriş sağlar.

```
/examples/chainflow-login/
```

#### Özellikler
- DIDComm protokolü ile güvenli iletişim
- Sıfır Bilgi İspatı ile minimal veri paylaşımı
- Sadece gerekli bilgilerin (DID, kanıt ID, kimlik bilgisi sona erme tarihi) saklanması
- Adım adım UI geri bildirimi

#### Kurulum ve Çalıştırma

```bash
cd examples/chainflow-login
pip install -r requirements.txt
python app.py
```

### 2. Diğer Örnekler (Yakında Eklenecek)

## Gereksinimler

- Python 3.10 veya 3.11 (3.13 ile uyumluluk sorunları var)
- Hyperledger Indy SDK
- FastAPI, Uvicorn
- Diğer bağımlılıklar için her örneğin kendi requirements.txt dosyasına bakın

## Katkıda Bulunma

Yeni örnekler eklemek veya mevcut örnekleri geliştirmek için pull request gönderebilirsiniz.

## Lisans

MIT
