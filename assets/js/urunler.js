// js/urunler.js
const urunler = [
    {
        id: 1,
        ad: "Işıltılı Gece Elbisesi",
        fiyat: 500.500,
        resim: "assets/images/urunler/urun1.jpeg",
        aciklama: "%70 Polyester, %30 akrilik kumaştan üretilmiştir.",
        kategori: "Yaz Modası"
    },
    {
        id: 2,
        ad: "Çizgi Desenli Şort",
        fiyat: 249.99,
        resim: "assets/images/urunler/urun2.jpg",
        aciklama: "Esnek ve rahat yüksek bel dokuma şort. Keten kumaştan ürelitmiştir",
        kategori: "Yaz Modası"
    },
    {
        id: 3,
        ad: "Erkek Desenli Gömlek",
        fiyat: 799.99,
        resim: "assets/images/urunler/urun3.jpg",
        aciklama: "Ürün %100 ketenden üretilmiştir. Kolları katlama detaylıdır.",
        kategori: "Yaz Modası"
    },
    {
        id: 4,
        ad: "Klasik Ceket",
        fiyat: 899.99,
        resim: "assets/images/urunler/urun4.jpg",
        aciklama: "Düğme detaylı, dar kesim ceket",
        kategori: "Yaz Modası"
    },
    {
        id: 5,
        ad: "Erkek Kanvas Şort",
        fiyat: 349.99,
        resim: "assets/images/urunler/urun5.jpg",
        aciklama: "Yazlık, hafif kumaştan yapılmış dar kesim şort. ",
        kategori: "Yaz Modası"
    },
    {
        id: 6,
        ad: "Çiçek Desenli Elbise",
        fiyat: 429.99,
        resim: "assets/images/urunler/urun6.jpg",
        aciklama: "Organik dokuma kumaştan üretilmiş, ince hafif elbise",
        kategori: "Yaz Modası"
    },
    {
        id: 7,
        ad: "Yüksek Bel Denim Pantolon",
        fiyat: 249.99,
        resim: "assets/images/urunler/urun7.jpg",
        aciklama: "Yüksek bel, bol kesim kot pantolon",
        kategori: "Yaz Modası"
    },
    {
        id: 8,
        ad: "Kayık yaka elbise",
        fiyat: 1119.99,
        resim: "assets/images/urunler/urun8.jpeg",
        aciklama: "Yüksek kaliteli pamuktan üretilmiş,kısa elbise.Günlük ve özel günler için ideal.",
        kategori: "Yaz Modası"
    },
    {
        id: 9,
        ad: "Polo Yaka Tişört",
        fiyat: 489.99,
        resim: "assets/images/urunler/urun9.jpeg",
        aciklama: "Pamuklu oversize baskılı tişörtHafif ve konforlu spor ayakkabı. Hem spor hem günlük kullanım için uygun.",
        kategori: "Yaz Modası"
    },
    {
        id: 10,
        ad: "Puantiyeli Elbise",
        fiyat: 349.99,
        resim: "assets/images/urunler/urun10.jpg",
        aciklama: "Yazlık, hafif kumaştan yapılmış desenli elbise. Şık ve rahat bir görünüm.",
        kategori: "İlkbahar"
    },
    {
        id: 11,
        ad: "Modern Kesim Tişört",
        fiyat: 129.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Yüksek kaliteli pamuktan üretilmiş, modern kesim tişört. Günlük kullanım için ideal.",
        kategori: "Üst Giyim"
    },
    {
        id: 12,
        ad: "Yüksek Bel Kot Pantolon",
        fiyat: 249.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Esnek ve rahat yüksek bel kot pantolon. Her mevsim giyilebilir.",
        kategori: "Alt Giyim"
    },
    {
        id: 13,
        ad: "Deri Ceket",
        fiyat: 799.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Gerçek deriden üretilmiş, şık ve dayanıklı ceket. Kış aylarının vazgeçilmezi.",
        kategori: "Dış Giyim"
    },
    {
        id: 14,
        ad: "Spor Ayakkabı",
        fiyat: 399.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Hafif ve konforlu spor ayakkabı. Hem spor hem günlük kullanım için uygun.",
        kategori: "Ayakkabı"
    },
    {
        id: 15,
        ad: "Desenli Elbise",
        fiyat: 349.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Yazlık, hafif kumaştan yapılmış desenli elbise. Şık ve rahat bir görünüm.",
        kategori: "Elbise"
    },
    {
        id: 16,
        ad: "Modern Kesim Tişört",
        fiyat: 129.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Yüksek kaliteli pamuktan üretilmiş, modern kesim tişört. Günlük kullanım için ideal.",
        kategori: "Üst Giyim"
    },
    {
        id: 17,
        ad: "Yüksek Bel Kot Pantolon",
        fiyat: 249.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Esnek ve rahat yüksek bel kot pantolon. Her mevsim giyilebilir.",
        kategori: "Alt Giyim"
    },
    {
        id: 18,
        ad: "Deri Ceket",
        fiyat: 799.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Gerçek deriden üretilmiş, şık ve dayanıklı ceket. Kış aylarının vazgeçilmezi.",
        kategori: "Dış Giyim"
    },
    {
        id: 19,
        ad: "Spor Ayakkabı",
        fiyat: 399.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Hafif ve konforlu spor ayakkabı. Hem spor hem günlük kullanım için uygun.",
        kategori: "Ayakkabı"
    },
    {
        id: 20,
        ad: "Desenli Elbise",
        fiyat: 349.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Yazlık, hafif kumaştan yapılmış desenli elbise. Şık ve rahat bir görünüm.",
        kategori: "Elbise"
    },
    {
        id: 21,
        ad: "Modern Kesim Tişört",
        fiyat: 129.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Yüksek kaliteli pamuktan üretilmiş, modern kesim tişört. Günlük kullanım için ideal.",
        kategori: "Üst Giyim"
    },
    {
        id: 22,
        ad: "Yüksek Bel Kot Pantolon",
        fiyat: 249.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Esnek ve rahat yüksek bel kot pantolon. Her mevsim giyilebilir.",
        kategori: "Alt Giyim"
    },
    {
        id: 23,
        ad: "Deri Ceket",
        fiyat: 799.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Gerçek deriden üretilmiş, şık ve dayanıklı ceket. Kış aylarının vazgeçilmezi.",
        kategori: "Dış Giyim"
    },
    {
        id: 24,
        ad: "Spor Ayakkabı",
        fiyat: 399.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Hafif ve konforlu spor ayakkabı. Hem spor hem günlük kullanım için uygun.",
        kategori: "Ayakkabı"
    },
    {
        id: 25,
        ad: "Desenli Elbise",
        fiyat: 349.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Yazlık, hafif kumaştan yapılmış desenli elbise. Şık ve rahat bir görünüm.",
        kategori: "Elbise"
    },
    {
        id: 26,
        ad: "Modern Kesim Tişört",
        fiyat: 129.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Yüksek kaliteli pamuktan üretilmiş, modern kesim tişört. Günlük kullanım için ideal.",
        kategori: "Üst Giyim"
    },
    {
        id: 27,
        ad: "Yüksek Bel Kot Pantolon",
        fiyat: 249.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Esnek ve rahat yüksek bel kot pantolon. Her mevsim giyilebilir.",
        kategori: "Alt Giyim"
    },
    {
        id: 28,
        ad: "Deri Ceket",
        fiyat: 799.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Gerçek deriden üretilmiş, şık ve dayanıklı ceket. Kış aylarının vazgeçilmezi.",
        kategori: "Dış Giyim"
    },
    {
        id: 29,
        ad: "Spor Ayakkabı",
        fiyat: 399.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Hafif ve konforlu spor ayakkabı. Hem spor hem günlük kullanım için uygun.",
        kategori: "Ayakkabı"
    },
    {
        id: 30,
        ad: "Desenli Elbise",
        fiyat: 349.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Yazlık, hafif kumaştan yapılmış desenli elbise. Şık ve rahat bir görünüm.",
        kategori: "Elbise"
    },
    {
        id: 31,
        ad: "Modern Kesim Tişört",
        fiyat: 129.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Yüksek kaliteli pamuktan üretilmiş, modern kesim tişört. Günlük kullanım için ideal.",
        kategori: "Üst Giyim"
    },
    {
        id: 32,
        ad: "Yüksek Bel Kot Pantolon",
        fiyat: 249.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Esnek ve rahat yüksek bel kot pantolon. Her mevsim giyilebilir.",
        kategori: "Alt Giyim"
    },
    {
        id: 33,
        ad: "Deri Ceket",
        fiyat: 799.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Gerçek deriden üretilmiş, şık ve dayanıklı ceket. Kış aylarının vazgeçilmezi.",
        kategori: "Dış Giyim"
    },
    {
        id: 34,
        ad: "Spor Ayakkabı",
        fiyat: 399.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Hafif ve konforlu spor ayakkabı. Hem spor hem günlük kullanım için uygun.",
        kategori: "Ayakkabı"
    },
    {
        id: 35,
        ad: "Desenli Elbise",
        fiyat: 349.99,
        resim: "assets/images/urunler/urun.jpg",
        aciklama: "Yazlık, hafif kumaştan yapılmış desenli elbise. Şık ve rahat bir görünüm.",
        kategori: "Elbise"
    }
];