Moda Dünyası E-Ticaret Sitesi (Client-Side)
1. Projeye Genel Bakış
•	Amaç: "Moda Dünyası", kullanıcıların ürünleri listeleyebileceği, detaylarını görebileceği, favorilerine ekleyebileceği, alışveriş sepetine atabileceği ve yönetici arayüzü üzerinden ürün ve kullanıcıları (lokal olarak) yönetebileceği bir e-ticaret sitesi prototipidir.
•	Kapsam: Proje, tamamen istemci tarafında (client-side) çalışmakta olup, veri saklama işlemleri için JavaScript dizileri (urunler.js, user.js) ve tarayıcının localStorage özelliğini kullanmaktadır. Herhangi bir sunucu tarafı (backend) bağlantısı veya veritabanı entegrasyonu bulunmamaktadır.
•	Hedef Kitle: 
o	Müşteriler: Siteyi gezerek ürünleri inceleyen, favorilerine ekleyen ve sepet oluşturan genel kullanıcılar.
o	Yöneticiler: Siteye özel bir arayüzden giriş yaparak kullanıcıları ve (kısmen) ürünleri yönetebilen yetkili kullanıcılar.
2. Kullanılan Teknolojiler
•	Frontend: 
o	HTML5
o	CSS3 (Bootstrap 5 ve özel stiller - assets/css/stye.css)
o	JavaScript (ES6+)
o	jQuery 3.7.1
o	Bootstrap 5.3.3 (CSS & JS)
o	Bootstrap Icons 1.11.3
•	Veri Saklama (Client-Side): 
o	assets/js/urunler.js: Ürünlerin statik listesini içeren JavaScript dizisi (urunler).
o	assets/js/user.js: Varsayılan kullanıcı bilgilerini (admin dahil) içeren JavaScript dizisi (siteKullanicilari).
o	localStorage: 
	loggedInUser: Giriş yapan kullanıcının bilgilerini (id, username, name, role) saklar.
	favoriUrunler: Favoriye eklenen ürünlerin ID'lerini saklar.
	sepetUrunler: Sepete eklenen ürünlerin detaylarını (id, ad, fiyat, resim, kategori, quantity) saklar.
	storedSiteKullanicilari: Kullanıcı yönetimi sayfasında yapılan değişiklikleri (ekleme, silme, düzenleme) kalıcı kılmak için kullanıcı listesini saklar.
3. Proje Dosya Yapısı
 
4. Sayfa Yapıları ve İşlevleri
•	Genel Kullanıcı Arayüzü Sayfaları:
o	index.html (Ana Sayfa / Ürünler): 
	Bootstrap Carousel ile oluşturulmuş, kategorilere yönlendirme yapabilen bir slider içerir.
	urunler.js dosyasından alınan ürünleri kartlar halinde listeler.
	Ürünleri isme göre arama (#arama-input) işlevselliği sunar.
	Slider üzerinden veya (ileride eklenebilecek) kategori menüsüyle ürünleri kategoriye göre filtreler.
	Ürün listesi için sayfalama (#pagination-list) içerir.
	Navbar üzerinden diğer sayfalara (Favorilerim, Sepetim, Giriş Yap/Çıkış Yap, Yönetici Paneli) erişim sağlar.
o	urun_detay.html: 
	URL'den aldığı ürün ID'sine göre urunler.js'den ürün bilgilerini çeker ve gösterir.
	Ürünü favorilere ekleme/çıkarma (#detay-favori-btn) ve sepete ekleme (#detay-sepete-ekle-btn) butonları içerir.
o	favoriler.html: 
	localStorage'dan favori ürün ID'lerini okur ve urunler.js'den bu ürünlerin detaylarını alarak listeler.
	Favorilerden çıkarma ve sepete ekleme işlevleri sunar.
o	sepet.html: 
	localStorage'dan sepet içeriğini okur ve tablo halinde listeler.
	Ürünlerin adetlerini artırma/azaltma ve sepetten çıkarma işlevleri sunar.
	Sepetteki ürünlerin genel toplam tutarını gösterir.
	"Alışverişe Devam Et" ve (işlevsiz) "Ödemeye Geç" butonları içerir.
o	login.html: 
	Kullanıcı adı ve şifre ile giriş yapılmasını sağlayan bir form içerir.
	Başarılı girişte kullanıcı bilgilerini localStorage'e kaydeder ve rolüne göre ilgili sayfaya yönlendirir.
	Başarısız girişte hata mesajı gösterir.
•	Yönetici Paneli Sayfaları (Yönetici olarak giriş yapıldığında erişilebilir):
o	admin.html (Ürün Yönetimi): 
	urunler.js dosyasındaki mevcut ürünleri bir tabloda listeler ve sayfalama sunar.
	Lokal ürün ekleme/güncelleme için bir form (#product-form-lokal) içerir. (Not: Bu formun CRUD işlemleri admin.js içinde henüz tam olarak implemente edilmemiştir, değişiklikler urunler dizisinde kalıcı olmaz.)
	Navbar'da "Ürün Yönetimi" ve "Kullanıcı Yönetimi" linkleri bulunur.
o	kullanici-yonetimi.html: 
	user.js ve localStorage'dan alınan kullanıcıları bir tabloda listeler ve sayfalama sunar.
	Yeni kullanıcı ekleme, mevcut kullanıcıyı düzenleme (ad, kullanıcı adı, şifre, rol) ve silme işlemleri için bir form (#user-form) içerir.
	Değişiklikler localStorage'a kaydedilerek kalıcı hale getirilir.
	admin kullanıcısının silinmesi engellenmiştir.
5. Temel JavaScript Fonksiyonları ve Mantığı
•	assets/js/main.js:
o	$(document).ready(): Sayfa yüklendiğinde çalışır. loadUsersFromStorage (kullanıcıları yükler), checkUserLoginStatus (navbar'ı ayarlar), urunler dizisini filteredUrunler'e aktarır ve mevcut sayfaya göre ilgili render fonksiyonlarını (örn: renderUrunlerVePagination, gosterUrunDetay vb.) çağırır. Genel olay dinleyicilerini (setupGlobalEventHandlers) kurar.
o	checkUserLoginStatus(): localStorage'daki loggedInUser bilgisini kontrol ederek navbar'daki "Giriş Yap/Çıkış Yap" butonunun metnini ve işlevini ayarlar. Kullanıcının rolüne göre "Yönetici Paneli" dropdown menüsünü gösterir/gizler. Çıkış yapıldığında localStorage'ı temizler ve sayfayı yönlendirir/yeniler.
o	setupGlobalEventHandlers(): Login formu, favori, sepet, arama, slider ve ana sayfa sayfalama gibi genel olay dinleyicilerini merkezi olarak yönetir.
o	Ürün Listeleme/Filtreleme/Sayfalama: renderUrunlerVePagination, listeleUrunler, kurPagination fonksiyonları filteredUrunler dizisini kullanarak ana sayfada ürünleri gösterir. Arama ve kategori filtreleme filteredUrunler dizisini günceller.
o	Ürün Detay: gosterUrunDetay fonksiyonu URL'den aldığı ID ile urunler dizisinden ürünü bulup urun_detay.html'de gösterir.
o	Favori İşlemleri: getFavoriler, saveFavoriler, isFavori, toggleFavori, listeleFavoriler fonksiyonları localStorage kullanarak favori ürünleri yönetir ve favoriler.html'de listeler.
o	Sepet İşlemleri: getSepet, saveSepet, sepeteEkle, sepettenCikar, guncelleSepetAdedi, listeleSepet, updateSepetBadge fonksiyonları localStorage kullanarak alışveriş sepetini yönetir, sepet.html'de listeler ve navbar'daki sepet sayısını günceller.
•	assets/js/admin.js:
o	$(document).ready(): Sayfa yüklendiğinde çalışır. loadUsersFromStorage ile kullanıcı verilerini siteKullanicilariGlobal dizisine yükler. Yönetici rol kontrolü yapar; yetkisiz erişimde login.html'e yönlendirir. Mevcut admin sayfasına (admin.html veya kullanici-yonetimi.html) göre ilgili listeleme ve olay ayarlama fonksiyonlarını çağırır.
o	Kullanıcı Veri Yönetimi (localStorage): loadUsersFromStorage, initializeDefaultUsers, saveUsersToStorage fonksiyonları kullanıcı verilerinin user.js'den ilk yüklenmesini ve sonraki değişikliklerin localStorage'da (storedSiteKullanicilari) saklanmasını sağlar.
o	Kullanıcı Yönetimi (CRUD): renderAdminUserList (kullanıcıları listeler), kurAdminUserPagination (kullanıcı listesi için sayfalama yapar), resetUserForm (formu temizler), setupUserManagementFormEvents (kullanıcı ekleme/düzenleme/silme form ve buton olaylarını yönetir).
o	Ürün Yönetimi (Lokal - Listeleme/Sayfalama): renderAdminProductList (eski renderAdminProductListLokal - urunler dizisindeki ürünleri listeler), kurAdminProductPagination (eski kurAdminPaginationLokal - ürün listesi için sayfalama yapar), setupAdminProductFormEvents (eski setupAdminProductFormEventsLokal - ürün ekleme/düzenleme formu için olayları ayarlar, ancak CRUD işlemleri henüz tam olarak implemente edilmemiştir ve değişiklikler kalıcı değildir).
•	assets/js/urunler.js: Global urunler adında bir JavaScript dizisi tanımlar ve sitenin kullanacağı tüm ürünlerin verilerini (id, ad, resim, kategori, fiyat, açıklama) içerir.
•	assets/js/user.js: Global siteKullanicilari adında bir JavaScript dizisi tanımlar ve varsayılan kullanıcıları (id, username, password, role, name) içerir. Bu, localStorage boş olduğunda ilk kullanıcı listesini oluşturmak için kullanılır.
6. Veri Akışı ve Saklama
•	Ürün Verileri: Statik olarak urunler.js dosyasında tanımlanır ve main.js tarafından okunarak kullanılır. Yönetici panelindeki ürün listesi de bu statik veriyi kullanır. Ürün yönetimi formundaki değişiklikler (eğer implemente edilirse) şu an için urunler dizisinde kalıcı olmaz.
•	Kullanıcı Verileri: 
o	Varsayılan kullanıcılar user.js dosyasında tanımlanır.
o	İlk çalıştırmada veya localStorage boşsa, user.js'deki veriler localStorage'a (storedSiteKullanicilari) kopyalanır.
o	kullanici-yonetimi.html sayfasında yapılan tüm kullanıcı ekleme, düzenleme ve silme işlemleri siteKullanicilariGlobal dizisini günceller ve bu güncel dizi localStorage'a kaydedilerek kalıcılık sağlanır.
•	Oturum Bilgisi: Giriş yapan kullanıcının temel bilgileri (id, username, name, role) localStorage'da loggedInUser anahtarıyla saklanır.
•	Favoriler: Favoriye eklenen ürünlerin ID'leri localStorage'da favoriUrunler anahtarıyla bir dizi olarak saklanır.
•	Sepet: Sepete eklenen ürünlerin detayları (ID, ad, fiyat, resim, kategori, adet) localStorage'da sepetUrunler anahtarıyla bir dizi olarak saklanır.
•	Kullanıcı Deneyimi (UX): 
o	İşlemler sırasında (örn: sepete ekleme, giriş yapma) kullanıcıya daha iyi görsel geri bildirimler (toast bildirimleri, yükleniyor göstergeleri) sunulabilir.
o	"Ödemeye Geç" butonu işlevsel hale getirilebilir (çok adımlı bir sipariş süreci).
o	"Kayıt Ol" sayfası ve işlevselliği eklenebilir.
•	CSS ve Tasarım: stye.css dosyasındaki stiller daha da geliştirilerek siteye özgün bir görünüm kazandırılabilir.

