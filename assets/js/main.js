
const urunSayisiPerPage = 6;
let currentPage = 1;
// filteredUrunler global olarak tanımlanacak ve urunler dizisinden başlatılacak
let filteredUrunler = []; // Bu, sayfa yüklendiğinde urunler dizisiyle doldurulacak


// ------------- SAYFA YÜKLEME VE OLAY YÖNETİMİ -------------
$(document).ready(function() {
    setupGlobalEventHandlers();
    checkUserLoginStatus();

    // urunler dizisi global scope'ta (urunler.js'den) bekleniyor.
    if (typeof urunler !== 'undefined' && urunler.length > 0) {
        filteredUrunler = [...urunler]; // Başlangıçta tüm ürünleri göster
    } else {
        console.error("`urunler` dizisi bulunamadı veya boş. Lütfen urunler.js dosyasının doğru yüklendiğinden emin olun.");
        // Hata durumunda ürün listeleme alanını bilgilendir
        if ($('#urun-listesi').length) {
            $('#urun-listesi').html('<div class="col-12 text-center text-danger"><p>Ürünler yüklenemedi. Lütfen ürün verilerinin doğru yüklendiğinden emin olun.</p></div>');
        }
    }

    // Giriş formu submit olayı (login.html için)
    $('#login-form-element').on('submit', function(e) {
        e.preventDefault();
        const usernameInput = $('#username').val();
        const passwordInput = $('#password').val();
        const errorMessageDiv = $('#login-error-message');

        if (typeof siteKullanicilari !== 'undefined') { // user.js'den gelmeli
            const foundUser = siteKullanicilari.find(user => user.username === usernameInput && user.password === passwordInput);
            if (foundUser) {
                localStorage.setItem('loggedInUser', JSON.stringify({ username: foundUser.username, role: foundUser.role, name: foundUser.name }));
                errorMessageDiv.addClass('d-none');
                alert(`Hoşgeldiniz, ${foundUser.name}!`);
                if (foundUser.role === 'yonetici') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                errorMessageDiv.text('Hatalı kullanıcı adı veya şifre!').removeClass('d-none');
            }
        } else {
            errorMessageDiv.text('Kullanıcı veritabanına erişilemedi. user.js dosyasının yüklendiğinden emin olun.').removeClass('d-none');
            console.error("siteKullanicilari dizisi tanımlanmamış!");
        }
    });
    
    // Sayfa yüklendiğinde ve ürün listesi div'i mevcutsa ürünleri listele
    if ($('#urun-listesi').length && typeof urunler !== 'undefined' && urunler.length > 0) {
        // Kategori filtrelemesi (URL'den kategori gelirse)
        const urlParams = new URLSearchParams(window.location.search);
        const kategoriParam = urlParams.get('kategori');
        if (kategoriParam) {
            // urunler dizisindeki 'kategori' alanı ile karşılaştır
            filteredUrunler = urunler.filter(urun => urun.kategori && urun.kategori.toLowerCase().replace(/\s+/g, '-') === kategoriParam.toLowerCase());
             $('#kategori-basligi, .container h1.mb-4.text-center').text(`${kategoriParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Ürünleri`);
        } else {
            // Kategori yoksa tüm ürünleri göster
            filteredUrunler = [...urunler];
            $('#kategori-basligi, .container h1.mb-4.text-center').text('Tüm Ürünler');
        }
        currentPage = 1;
        renderUrunlerVePagination();
    }

    // Ürün detay sayfasında ürün bilgisini gösterme
    if ($('#urun-detay').length && typeof urunler !== 'undefined') {
        gosterUrunDetay();
    }

    // Favorileri listeleme fonksiyonu (favoriler.html için)
    if ($('#favori-listesi').length && typeof urunler !== 'undefined') {
        listeleFavoriler();
    }
    
    $(document).on('click', '.sepete-ekle-btn', function() {
        const urunId = parseInt($(this).data('id')); // ID'yi integer olarak al
        if (urunId) {
            sepeteEkle(urunId);
        } else {
            console.error("Sepete eklenecek ürün ID'si bulunamadı!");
        }
    });
    
    // Sayfa yüklendiğinde sepet badge'ini de güncelle
    updateSepetBadge(); 
    
    // Sepet sayfasındaysak sepeti listele
    if (window.location.pathname.endsWith('sepet.html')) {
        listeleSepet();
    }

    // Sepetten çıkar ve adet güncelleme olay dinleyicileri (sepet.html için)
    $(document).on('click', '.sepetten-cikar-btn', function() {
        const urunId = parseInt($(this).data('id'));
        sepettenCikar(urunId);
    });

    $(document).on('click', '.adet-artir-btn', function() {
        const urunId = parseInt($(this).data('id'));
        guncelleSepetAdedi(urunId, 1);
    });

    $(document).on('click', '.adet-azalt-btn', function() {
        const urunId = parseInt($(this).data('id'));
        guncelleSepetAdedi(urunId, -1);
    });

    // Slider'a (Carousel) tıklama olayı -> Kategori filtreleme
    $(document).on('click', '.carousel-link', function() {
        if (typeof urunler === 'undefined') return;
        const kategori = $(this).data('category');
        if (kategori && $('#urun-listesi').length) {
            filteredUrunler = urunler.filter(urun => urun.kategori === kategori);
            currentPage = 1;
            renderUrunlerVePagination();
            $('html, body').animate({ scrollTop: $('#urun-listesi').offset().top - 100 }, 500);
            $('#kategori-basligi, .container h1.mb-4.text-center').text(`${kategori} Ürünleri`);
            $('#arama-input').val('');
        }
    });
    
    // Ana sayfa/ürünler sayfası için sayfalama linklerine tıklama olayı
    $(document).on('click', '#pagination-list .page-link', function(e) {
        e.preventDefault();
        const pageNum = $(this).data('page');
        if (pageNum && pageNum !== currentPage) {
            const totalPages = Math.ceil(filteredUrunler.length / urunSayisiPerPage);
            if (pageNum > 0 && pageNum <= totalPages) {
                currentPage = pageNum;
                renderUrunlerVePagination();
                $('html, body').animate({ scrollTop: $('#urun-listesi').offset().top - 100 }, 300);
            }
        }
    });

    

    // Bu kod $(document).ready() içinde olmalı ve sadece login.html'de çalışmalı
if (window.location.pathname.endsWith('login.html')) {
    $('#login-form-element').on('submit', function(e) {
        e.preventDefault();
        const usernameInput = $('#username').val();
        const passwordInput = $('#password').val();
        const errorMessageDiv = $('#login-error-message'); // HTML'de bu ID ile bir div olmalı

        // siteKullanicilariGlobal'in user.js'den yüklenmiş olması ve dolu olması gerekir.
        // loadUsersFromStorage() $(document).ready() başında çağrıldığı için dolu olmalı.
        if (typeof siteKullanicilariGlobal !== 'undefined' && siteKullanicilariGlobal.length > 0) {
            const foundUser = siteKullanicilariGlobal.find(user => user.username === usernameInput && user.password === passwordInput);

            if (foundUser) {
                // Doğru formatta kaydet!
                localStorage.setItem('loggedInUser', JSON.stringify({ 
                    id: foundUser.id, // Kullanıcı ID'sini de saklayalım
                    username: foundUser.username, 
                    role: foundUser.role, 
                    name: foundUser.name 
                }));
                errorMessageDiv.addClass('d-none');
                alert(`Hoşgeldiniz, ${foundUser.name}!`);
                if (foundUser.role === 'yonetici') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                errorMessageDiv.text('Hatalı kullanıcı adı veya şifre!').removeClass('d-none');
            }
        } else {
            errorMessageDiv.text('Kullanıcı verileri yüklenemedi.').removeClass('d-none');
            console.error("siteKullanicilariGlobal dizisi bulunamadı veya user.js yüklenmedi.");
        }
    });
}
}); 

// ------------- KULLANICI OTURUM YÖNETİMİ FONKSİYONU -------------
function checkUserLoginStatus() {
    const loggedInUserString = localStorage.getItem('loggedInUser'); // Standart anahtarımız
    const girisCikisBtn = $('#giris-cikis-btn');
    const yoneticiPaneliDropdown = $('#yonetici-paneli-dropdown'); // Navbar'daki Yönetici Paneli dropdown li elementi
    const aramaInput = $('#arama-input'); // Arama kutusu

    if (loggedInUserString) {
        const loggedInUser = JSON.parse(loggedInUserString);
        // Kullanıcı adını veya tam adını göster
        girisCikisBtn.text(`Çıkış Yap (${loggedInUser.name || loggedInUser.username})`);
        
        // Önceki click olaylarını temizleyip yenisini ekle (önemli!)
        girisCikisBtn.off('click').on('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            alert('Oturum başarıyla sonlandırıldı.');
            // checkUserLoginStatus(); // UI'ı hemen güncelle (sayfa yenileme öncesi)
            // Sayfa yenileme veya yönlendirme
            if (window.location.pathname.includes('admin.html') || 
                window.location.pathname.includes('kullanici-yonetimi.html') ||
                window.location.pathname.endsWith('login.html')) {
                window.location.href = 'index.html'; // Admin veya login sayfasındaysa ana sayfaya yönlendir
            } else {
                window.location.reload(); // Diğer sayfalarda sayfayı yenile
            }
        });

        if (loggedInUser.role === 'yonetici') {
            yoneticiPaneliDropdown.show();
            // Yönetici panelindeyken aramayı gizleyebiliriz veya isteğe bağlı tutabiliriz
            if (window.location.pathname.includes('admin.html') || window.location.pathname.includes('kullanici-yonetimi.html')) {
                aramaInput.hide(); 
            } else {
                aramaInput.show();
            }
        } else { // Müşteri ise
            yoneticiPaneliDropdown.hide();
            aramaInput.show(); // Müşteri için arama her zaman görünür (ürün sayfalarında)
        }
    } else { // Giriş yapılmamışsa
        girisCikisBtn.text('Giriş Yap');
        girisCikisBtn.off('click').on('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.html'; // login.html'e yönlendir
        });
        yoneticiPaneliDropdown.hide();
        aramaInput.show(); // Giriş yapılmamışsa da arama görünür
    }
}

// ------------- ÜRÜN LİSTELEME VE SAYFALAMA -------------
function renderUrunlerVePagination() {
    if (typeof filteredUrunler === 'undefined' || !$('#urun-listesi').length) return;
    listeleUrunler();
    kurPagination();
}

function listeleUrunler() {
    const urunListesi = $('#urun-listesi');
    urunListesi.empty(); 
    const startIndex = (currentPage - 1) * urunSayisiPerPage;
    const endIndex = startIndex + urunSayisiPerPage;
    // filteredUrunler'in bir dizi olduğundan emin ol
    if (typeof filteredUrunler === 'undefined' || !Array.isArray(filteredUrunler)) {
        urunListesi.html('<div class="col-12 text-center text-danger"><p>Ürünler filtrelenirken bir sorun oluştu.</p></div>');
        return;
    }
    const urunlerToShow = filteredUrunler.slice(startIndex, endIndex); 

    if (urunlerToShow.length === 0) {
        urunListesi.html('<div class="col-12 text-center py-5"><p class="lead">Gösterilecek ürün bulunmamaktadır.</p></div>');
        return;
    }
    urunlerToShow.forEach(function(urun) {
        const isFav = isFavori(urun.id); // ID'yi sayı olarak kontrol et
        var fiyatGosterim = (typeof urun.fiyat === 'number' ? urun.fiyat.toFixed(2) : 'N/A');
        var urunKartiHtml =
            '<div class="col-lg-4 col-md-6 mb-4 urun-karti">' +
                '<div class="card h-100 shadow-sm">' +
                    '<a href="urun_detay.html?id=' + urun.id + '" class="text-decoration-none text-dark">' +
                        '<img src="' + (urun.resim || 'assets/images/placeholder.jpg') + '" class="card-img-top" alt="' + urun.ad + '" style="object-fit: cover;">' +
                    '</a>' +
                    '<div class="card-body d-flex flex-column">' +
                        '<h5 class="card-title">' +
                            '<a href="urun_detay.html?id=' + urun.id + '" class="text-decoration-none text-dark">' + urun.ad + '</a>' +
                        '</h5>' +
                        '<p class="card-text text-muted small mb-2">' + (urun.kategori || '') + '</p>' +
                        '<p class="card-text fw-bold fs-5 mb-auto">' + fiyatGosterim + ' TL</p>' +
                        '<div class="d-flex justify-content-between align-items-center pt-3">' +
                            '<button class="btn btn-outline-success btn-sm sepete-ekle-btn" data-id="' + urun.id + '">' +
                                '<i class="bi bi-cart-plus-fill"></i> Sepete Ekle' +
                            '</button>' +
                            '<button class="btn btn-outline-danger btn-sm favori-btn ' + (isFav ? 'active' : '') + '" data-id="' + urun.id + '" title="' + (isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle') + '">' +
                                '<i class="bi ' + (isFav ? 'bi-heart-fill' : 'bi-heart') + '"></i>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        urunListesi.append(urunKartiHtml);
    });
}

function kurPagination() {
    const paginationList = $('#pagination-list');
    if (!paginationList.length) { // Eğer #pagination-list elementi yoksa çık
        return;
    }
    paginationList.empty();

    // filteredUrunler dizisinin tanımlı ve bir dizi olduğundan emin ol
    if (typeof filteredUrunler === 'undefined' || !Array.isArray(filteredUrunler)) {
        console.error("kurPagination: filteredUrunler tanımlı değil veya bir dizi değil!");
        return;
    }
    // urunSayisiPerPage ve currentPage'in sayı olduğundan emin ol
    if (typeof urunSayisiPerPage !== 'number' || typeof currentPage !== 'number') {
        console.error("kurPagination: urunSayisiPerPage veya currentPage sayı değil!");
        return;
    }

    const totalPages = Math.ceil(filteredUrunler.length / urunSayisiPerPage);

    if (totalPages <= 1) { // Tek sayfa veya hiç sayfa yoksa pagination gösterme
        return;
    }

    var prevDisabled = currentPage === 1 ? 'disabled' : '';
    var prevPage = currentPage - 1;
    var prevButtonHtml =
        '<li class="page-item ' + prevDisabled + '">' +
            '<a class="page-link" href="#" data-page="' + prevPage + '" aria-label="Previous">' +
                '<span aria-hidden="true">&laquo;</span>' +
            '</a>' +
        '</li>';
    paginationList.append(prevButtonHtml);

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (totalPages <= 5) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= 3) {
            endPage = 5;
        } else if (currentPage + 2 >= totalPages) {
            startPage = totalPages - 4;
        }
    }

    if (startPage > 1) {
        paginationList.append('<li class="page-item disabled"><span class="page-link">...</span></li>');
    }

    for (let i = startPage; i <= endPage; i++) {
        var activeClass = currentPage === i ? 'active' : '';
        var pageLinkHtml =
            '<li class="page-item ' + activeClass + '">' +
                '<a class="page-link" href="#" data-page="' + i + '">' + i + '</a>' +
            '</li>';
        paginationList.append(pageLinkHtml);
    }

    if (endPage < totalPages) {
        paginationList.append('<li class="page-item disabled"><span class="page-link">...</span></li>');
    }

    var nextDisabled = currentPage === totalPages ? 'disabled' : '';
    var nextPage = currentPage + 1;
    var nextButtonHtml =
        '<li class="page-item ' + nextDisabled + '">' +
            '<a class="page-link" href="#" data-page="' + nextPage + '" aria-label="Next">' +
                '<span aria-hidden="true">&raquo;</span>' +
            '</a>' +
        '</li>';
    paginationList.append(nextButtonHtml);
}

// ------------- ÜRÜN DETAY SAYFASI -------------
function gosterUrunDetay() {
    const urlParams = new URLSearchParams(window.location.search);
    const urunId = parseInt(urlParams.get('id'));
    const urunDetayDiv = $('#urun-detay');

    if (!urunId || typeof urunler === 'undefined') {
        urunDetayDiv.html('<div class="alert alert-danger" role="alert">Geçersiz ürün ID\'si veya ürün verileri yüklenemedi!</div>');
        return;
    }
    const urun = urunler.find(function(p) { return p.id === urunId; });
    
    if (urun) {
        $('#detay-resim').attr('src', urun.resim || 'assets/images/placeholder.jpg').attr('alt', urun.ad);
        $('#detay-ad').text(urun.ad);
        var fiyatTextDetay = (typeof urun.fiyat === 'number' ? urun.fiyat.toFixed(2) : 'N/A') + ' TL';
        $('#detay-fiyat').text(fiyatTextDetay);
        $('#detay-aciklama').html(urun.aciklama ? urun.aciklama.replace(/\n/g, '<br>') : 'Açıklama bulunmamaktadır.');
        $('#detay-kategori').text(urun.kategori || '');

        const isFav = isFavori(urun.id);
        const favoriBtn = $('#detay-favori-btn');
        var favoriBtnIkon = isFav ? 'bi-heart-fill' : 'bi-heart';
        var favoriBtnMetin = isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle';
        var favoriBtnTitle = favoriBtnMetin;

        favoriBtn.attr('data-id', urun.id)
                 .toggleClass('active', isFav)
                 .attr('title', favoriBtnTitle) // Title attribute eklendi
                 .html('<i class="bi ' + favoriBtnIkon + '"></i> ' + favoriBtnMetin);
        
        $('#detay-sepete-ekle-btn').attr('data-id', urun.id);
    } else {
        urunDetayDiv.html('<div class="alert alert-warning" role="alert">Ürün bulunamadı!</div>');
    }
}
// ------------- FAVORİLER İŞLEVLERİ -------------
function getFavoriler() {
    const favoriler = localStorage.getItem('favoriUrunler');
    return favoriler ? JSON.parse(favoriler) : [];
}

function saveFavoriler(favoriler) {
    localStorage.setItem('favoriUrunler', JSON.stringify(favoriler));
}

function isFavori(urunId) { // urunId number olmalı
    // urunId'nin sayı olduğundan emin ol, eğer değilse parse et
    const idToCompare = typeof urunId === 'string' ? parseInt(urunId) : urunId;
    if (isNaN(idToCompare)) return false;
    return getFavoriler().includes(idToCompare);
}

function toggleFavori(urunId) { // urunId number olmalı
    if (isNaN(urunId)) {
        console.error("toggleFavori: Geçersiz ürün ID'si - ", urunId);
        return;
    }
    let favoriler = getFavoriler();
    const urunIndex = favoriler.indexOf(urunId);
    
    // urunler dizisinin global olarak erişilebilir ve dolu olması gerekir
    const urunBilgisi = (typeof urunler !== 'undefined') ? urunler.find(function(p) { return p.id === urunId; }) : null;
    const urunAdi = urunBilgisi ? urunBilgisi.ad : 'Ürün';

    if (urunIndex > -1) {
        favoriler.splice(urunIndex, 1); // Favorilerden çıkar
        alert('"' + urunAdi + '" favorilerden çıkarıldı!');
    } else {
        favoriler.push(urunId); // Favorilere ekle
        alert('"' + urunAdi + '" favorilere eklendi!');
    }
    saveFavoriler(favoriler);
}

function listeleFavoriler() {
    const favoriListesiElementi = $('#favori-listesi');
    if (!favoriListesiElementi.length) return;
    
    if (typeof urunler === 'undefined' || urunler.length === 0) {
        favoriListesiElementi.html('<div class="col-12 text-center text-danger"><p>Favori ürünler listelenirken bir sorun oluştu. Ürün verileri yüklenememiş olabilir.</p></div>');
        return;
    }
    favoriListesiElementi.empty();
    const favoriUrunIdleri = getFavoriler();

    if (favoriUrunIdleri.length === 0) {
        favoriListesiElementi.html('<div class="col-12 py-5"><p class="text-center lead">Henüz favori ürününüz bulunmamaktadır.</p></div>');
        return;
    }

    const favoriUrunler = urunler.filter(function(urun) {
        return favoriUrunIdleri.includes(urun.id);
    });

    if (favoriUrunler.length === 0 && favoriUrunIdleri.length > 0) {
         favoriListesiElementi.html('<div class="col-12 py-5"><p class="text-center lead">Favori olarak işaretlediğiniz bazı ürünler artık mevcut değil veya yüklenemedi.</p></div>');
        return;
    }

    favoriUrunler.forEach(function(urun) {
        var isFavActive = true; // Bu sayfadaki tüm ürünler favori olduğu için buton aktif olmalı
        var fiyatGosterim = (typeof urun.fiyat === 'number' ? urun.fiyat.toFixed(2) : 'N/A');
        
        var urunKartiHtml =
            '<div class="col-lg-4 col-md-6 mb-4 urun-karti">' +
                '<div class="card h-100 shadow-sm">' +
                    '<a href="urun_detay.html?id=' + urun.id + '" class="text-decoration-none text-dark">' +
                        '<img src="' + (urun.resim || 'assets/images/placeholder.jpg') + '" class="card-img-top" alt="' + urun.ad + '" style="object-fit: cover;">' +
                    '</a>' +
                    '<div class="card-body d-flex flex-column">' +
                        '<h5 class="card-title">' +
                            '<a href="urun_detay.html?id=' + urun.id + '" class="text-decoration-none text-dark">' + urun.ad + '</a>' +
                        '</h5>' +
                        '<p class="card-text text-muted small mb-2">' + (urun.kategori || '') + '</p>' +
                        '<p class="card-text fw-bold fs-5 mb-auto">' + fiyatGosterim + ' TL</p>' +
                        '<div class="d-flex justify-content-between align-items-center pt-3">' +
                            '<button class="btn btn-outline-success btn-sm sepete-ekle-btn" data-id="' + urun.id + '">' +
                                '<i class="bi bi-cart-plus-fill"></i> Sepete Ekle' +
                            '</button>' +
                            '<button class="btn btn-outline-danger btn-sm favori-btn ' + (isFavActive ? 'active' : '') + '" data-id="' + urun.id + '" title="Favorilerden Çıkar">' +
                                '<i class="bi ' + (isFavActive ? 'bi-heart-fill' : 'bi-heart') + '"></i>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        favoriListesiElementi.append(urunKartiHtml);
    });
}


// ------------- SEPET FONKSİYONLARI (localStorage KULLANARAK) -------------
// Sepeti localStorage'dan alan fonksiyon
function getSepet() {
    const sepet = localStorage.getItem('sepetUrunler');
    // Her bir sepet öğesi: { id, ad, fiyat, resim, kategori, quantity }
    return sepet ? JSON.parse(sepet) : [];
}

function saveSepet(sepet) {
    localStorage.setItem('sepetUrunler', JSON.stringify(sepet));
    updateSepetBadge(); // Sepet her güncellendiğinde navbar'daki sayıyı da güncelle
}

function updateSepetBadge() {
    const sepet = getSepet();
    const toplamAdet = sepet.reduce(function(toplam, item) { return toplam + (item.quantity || 0); }, 0);
    const sepetBadgeElementi = $('#sepet-badge'); // HTML'de navbar sepet linkinin yanında bu ID ile bir span olmalı

    if (sepetBadgeElementi.length) {
        if (toplamAdet > 0) {
            sepetBadgeElementi.text(toplamAdet).removeClass('d-none');
        } else {
            sepetBadgeElementi.text('0').addClass('d-none'); // Sepet boşsa badge'i gizle
        }
    }
}

function sepeteEkle(urunId) { // urunId alacak, urun objesini urunler'den bulacak
    if (typeof urunler === 'undefined') {
        alert("Ürün verileri henüz yüklenmedi, lütfen biraz bekleyin.");
        return;
    }
    // urunler dizisindeki id'lerin sayısal olduğunu varsayıyoruz
    const eklenecekUrun = urunler.find(function(u) { return u.id === urunId; });

    if (!eklenecekUrun) {
        alert("Eklenecek ürün bulunamadı!");
        return;
    }

    let sepet = getSepet();
    const mevcutUrunIndex = sepet.findIndex(function(item) { return item.id === urunId; });

    if (mevcutUrunIndex > -1) {
        // Ürün zaten sepette, adedini artır
        sepet[mevcutUrunIndex].quantity += 1;
        var alertMesajiGuncelleme = '"' + eklenecekUrun.ad + '" ürününün adedi güncellendi. Yeni adet: ' + sepet[mevcutUrunIndex].quantity;
        alert(alertMesajiGuncelleme);
    } else {
        // Ürün sepette değil, yeni olarak ekle
        sepet.push({
            id: eklenecekUrun.id,
            ad: eklenecekUrun.ad,
            fiyat: eklenecekUrun.fiyat,
            resim: eklenecekUrun.resim,
            kategori: eklenecekUrun.kategori,
            quantity: 1
        });
        var alertMesajiEkleme = '"' + eklenecekUrun.ad + '" ürünü sepete eklendi!';
        alert(alertMesajiEkleme);
    }
    saveSepet(sepet);
}

function sepettenCikar(urunId) {
    let sepet = getSepet();
    sepet = sepet.filter(function(item) { return item.id !== urunId; });
    saveSepet(sepet);
    alert('Ürün sepetten çıkarıldı!');
    if (window.location.pathname.endsWith('sepet.html')) {
        listeleSepet(); // Eğer sepet sayfasındaysak listeyi güncelle
    }
}

function guncelleSepetAdedi(urunId, degisiklik) {
    let sepet = getSepet();
    const urunIndex = sepet.findIndex(function(item) { return item.id === urunId; });
    if (urunIndex > -1) {
        sepet[urunIndex].quantity += degisiklik;
        if (sepet[urunIndex].quantity <= 0) {
            // Adet 0 veya altına düşerse ürünü sepetten çıkar
            sepet.splice(urunIndex, 1);
            alert("Ürün sepetten çıkarıldı (adet sıfırlandı).");
        }
        saveSepet(sepet);
        if (window.location.pathname.endsWith('sepet.html')) {
            listeleSepet(); // Sepet sayfasını güncelle
        }
    }
}

function listeleSepet() {
    const sepetListesiBody = $('#sepet-listesi-body');
    const sepetToplamTutarElementi = $('#sepet-toplam-tutar');
    const sepetBosMesaji = $('#sepet-bos-mesaji');
    const sepetTablosuVeOdeme = $('#sepet-tablosu-ve-odeme');

    if (!sepetListesiBody.length) return;

    sepetListesiBody.empty();
    const sepetUrunleri = getSepet();
    let toplamTutar = 0;

    if (sepetUrunleri.length === 0) {
        if (sepetBosMesaji.length) sepetBosMesaji.removeClass('d-none');
        if (sepetTablosuVeOdeme.length) sepetTablosuVeOdeme.addClass('d-none');
        if (sepetToplamTutarElementi.length) sepetToplamTutarElementi.text('0.00 TL');
        return;
    }

    if (sepetBosMesaji.length) sepetBosMesaji.addClass('d-none');
    if (sepetTablosuVeOdeme.length) sepetTablosuVeOdeme.removeClass('d-none');

    sepetUrunleri.forEach(function(urun) {
        const urunFiyat = (typeof urun.fiyat === 'number' ? urun.fiyat : 0);
        const urunAdet = (typeof urun.quantity === 'number' ? urun.quantity : 0);
        const urunToplamFiyati = urunFiyat * urunAdet;
        toplamTutar += urunToplamFiyati;

        var sepetUrunSatiri =
            '<tr>' +
                '<td style="width:80px;">' +
                    '<img src="' + (urun.resim || 'assets/images/placeholder.jpg') + '" alt="' + (urun.ad || 'Ürün') + '" class="img-fluid rounded" style="max-height: 70px; object-fit: cover;">' +
                '</td>' +
                '<td><a href="urun_detay.html?id=' + urun.id + '">' + (urun.ad || 'Ürün Adı') + '</a><br><small class="text-muted">' + (urun.kategori || '') + '</small></td>' +
                '<td class="text-end">' + urunFiyat.toFixed(2) + ' TL</td>' +
                '<td class="text-center">' +
                    '<div class="input-group input-group-sm justify-content-center" style="width: 120px;">' +
                        '<button class="btn btn-outline-secondary adet-azalt-btn" type="button" data-id="' + urun.id + '"><i class="bi bi-dash-lg"></i></button>' +
                        '<input type="text" class="form-control text-center border-secondary adet-input" value="' + urunAdet + '" data-id="' + urun.id + '" readonly style="background-color: white;">' +
                        '<button class="btn btn-outline-secondary adet-artir-btn" type="button" data-id="' + urun.id + '"><i class="bi bi-plus-lg"></i></button>' +
                    '</div>' +
                '</td>' +
                '<td class="text-end fw-bold">' + urunToplamFiyati.toFixed(2) + ' TL</td>' +
                '<td class="text-center">' +
                    '<button class="btn btn-danger btn-sm sepetten-cikar-btn" data-id="' + urun.id + '" title="Sepetten Çıkar"><i class="bi bi-x-lg"></i></button>' +
                '</td>' +
            '</tr>';
        sepetListesiBody.append(sepetUrunSatiri);
    });

    if (sepetToplamTutarElementi.length) {
        sepetToplamTutarElementi.text(toplamTutar.toFixed(2) + ' TL');
    }
}


function setupGlobalEventHandlers() {

    // Favorilere ekle/çıkar butonu tıklama olayı
    $(document).on('click', '.favori-btn', function() {
        const urunIdString = $(this).data('id');

        if (typeof urunIdString === 'undefined' || urunIdString === null || urunIdString === '') {
            console.error("Favori butonu için ürün ID'si alınamadı veya boş.");
            return;
        }
        const urunId = parseInt(urunIdString); // ID'yi sayıya çevir

        if (isNaN(urunId)) {
            console.error("Favori butonu için geçersiz ürün ID'si:", urunIdString);
            return;
        }
        
        toggleFavori(urunId); // Favori durumunu değiştir ve localStorage'ı güncelle

        // Tıklanan butonun ve sayfadaki diğer aynı ID'li favori butonlarının görünümünü güncelle
        const isFav = isFavori(urunId);
        $('.favori-btn[data-id="' + urunId + '"]').each(function() {
            $(this).toggleClass('active', isFav);
            $(this).find('i').removeClass('bi-heart bi-heart-fill').addClass(isFav ? 'bi-heart-fill' : 'bi-heart');
            $(this).attr('title', isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle');
        });
        
        // Eğer favoriler sayfasındaysak ve bir ürün favorilerden çıkarıldıysa listeyi yeniden render et
        if (window.location.pathname.endsWith('favoriler.html')) {
            listeleFavoriler();
        }
    });
    
}