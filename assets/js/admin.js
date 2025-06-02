// assets/js/admin.js

// Yönetici paneli için global değişkenler (admin.js'e özel)
const adminUrunSayisiPerPageLokal = 5;
let currentAdminPageLokal = 1;

const adminUserSayisiPerPage = 5;
let currentAdminUserPage = 1;
let siteKullanicilariGlobal = []; // localStorage'dan veya user.js'den yüklenecek

$(document).ready(function() {
    loadUsersFromStorage(); // Kullanıcıları yükle (Kullanıcı yönetimi için)

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser || loggedInUser.role !== 'yonetici') {
        if (window.location.pathname.endsWith('admin.html') || window.location.pathname.endsWith('kullanici-yonetimi.html')) {
            alert("Bu sayfaya erişim yetkiniz bulunmamaktadır.");
            window.location.href = 'login.html';
            return; 
        }
    }
    // Önce kullanıcı verilerini yükle (eğer kullanıcı yönetimi sayfasındaysak veya adminse genel olarak)
    // Bu, siteKullanicilariGlobal dizisini dolduracak
    // `loadUsersFromStorage` fonksiyonu aşağıda tanımlanacak.
    // Bu fonksiyon, user.js içindeki `siteKullanicilari` dizisini varsayılan olarak kullanır.

    // HANGİ ADMİN SAYFASINDA OLDUĞUMUZA GÖRE İLGİLİ FONKSİYONLARI ÇAĞIR
    if (window.location.pathname.endsWith('admin.html')) {
        // Ürün Yönetimi Sayfası (admin.html)
        if (typeof urunler !== 'undefined') { // urunler.js'den gelen lokal ürünler
            renderAdminProductListLokal();
            kurAdminPaginationLokal();
            // Lokal admin ürün sayfalama tıklama olayı
            $(document).on('click', '#admin-pagination-list .page-link', function(e) {
                e.preventDefault();
                const pageNum = $(this).data('page');
                if (pageNum && pageNum !== currentAdminPageLokal) {
                    const totalPagesAdmin = Math.ceil(urunler.length / adminUrunSayisiPerPageLokal);
                    if (pageNum > 0 && pageNum <= totalPagesAdmin) {
                        currentAdminPageLokal = pageNum;
                        renderAdminProductListLokal();
                        $('html, body').animate({ scrollTop: $('.product-list-table').offset().top - 70 }, 300);
                    }
                }
            });
            // Lokal ürünler için Ekle/Sil/Düzenle olayları buraya eklenebilir.
            // Şimdilik sadece listeleme ve sayfalama mevcut.
            setupAdminProductFormEventsLokal(); // Ürün formu olaylarını kur
        } else {
            $('#product-list-body').html('<tr><td colspan="7" class="text-center text-danger">Ürün verileri (urunler.js) yüklenemedi.</td></tr>');
        }
    } else if (window.location.pathname.endsWith('kullanici-yonetimi.html')) {
        // Kullanıcı Yönetimi Sayfası (kullanici-yonetimi.html)
        renderAdminUserList();
        setupUserManagementEvents(); // Form ve buton olaylarını kur
         // Kullanıcı yönetimi sayfalama tıklama olayı
        $(document).on('click', '#admin-user-pagination-list .page-link', function(e) {
            e.preventDefault();
            const pageNum = $(this).data('page');
            if (pageNum && pageNum !== currentAdminUserPage) {
                const totalPagesAdminUser = Math.ceil(siteKullanicilariGlobal.length / adminUserSayisiPerPage);
                if (pageNum > 0 && pageNum <= totalPagesAdminUser) {
                    currentAdminUserPage = pageNum;
                    renderAdminUserList();
                }
            }
        });
    }
});


// ------------- KULLANICI VERİLERİNİ YÜKLEME/KAYDETME (localStorage) -------------
function loadUsersFromStorage() {
    const storedUsers = localStorage.getItem('storedSiteKullanicilari');
    if (storedUsers) {
        try {
            siteKullanicilariGlobal = JSON.parse(storedUsers);
        } catch (e) {
            console.error("localStorage'daki kullanıcı verisi okunamadı, varsayılan kullanılıyor.", e);
            // Hata durumunda user.js'deki varsayılanları kullan
            initializeDefaultUsers();
        }
    } else {
        initializeDefaultUsers();
    }
}

function initializeDefaultUsers() {
    // user.js dosyasının `siteKullanicilari` adında global bir dizi tanımladığı varsayılır.
    if (typeof siteKullanicilari !== 'undefined') {
        siteKullanicilariGlobal = [...siteKullanicilari]; // user.js'deki orijinal diziyi kopyala
        saveUsersToStorage(); // Varsayılanları localStorage'a ilk kez kaydet
    } else {
        siteKullanicilariGlobal = []; // Boş başlat veya hata ver
        console.error("user.js'den 'siteKullanicilari' yüklenemedi!");
        // Örnek bir admin kullanıcısı ekleyebiliriz, eğer user.js bulunamazsa
        // siteKullanicilariGlobal = [{id: 1, name: "Default Admin", username: "admin", password: "password", role:"yonetici"}];
        // saveUsersToStorage();
    }
}

function saveUsersToStorage() {
    localStorage.setItem('storedSiteKullanicilari', JSON.stringify(siteKullanicilariGlobal));
}

// ------------- YÖNETİCİ PANELİ - KULLANICI YÖNETİMİ FONKSİYONLARI -------------
function renderAdminUserList() {
    const userListBody = $('#user-list-body');
    if (!userListBody.length) return;
    userListBody.empty();

    if (!siteKullanicilariGlobal || siteKullanicilariGlobal.length === 0) {
        userListBody.append('<tr><td colspan="5" class="text-center">Henüz kayıtlı kullanıcı bulunmamaktadır.</td></tr>');
        kurAdminUserPagination();
        return;
    }

    const startIndex = (currentAdminUserPage - 1) * adminUserSayisiPerPage;
    const endIndex = startIndex + adminUserSayisiPerPage;
    let usersToShow = siteKullanicilariGlobal.slice(startIndex, endIndex);

    if (usersToShow.length === 0 && currentAdminUserPage > 1) {
        currentAdminUserPage--;
        const newStartIndex = (currentAdminUserPage - 1) * adminUserSayisiPerPage;
        usersToShow = siteKullanicilariGlobal.slice(newStartIndex, newStartIndex + adminUserSayisiPerPage);
    }
    
    if (usersToShow.length === 0 && siteKullanicilariGlobal.length > 0) {
        userListBody.append('<tr><td colspan="5" class="text-center">Bu sayfada kullanıcı bulunmamaktadır.</td></tr>');
    } else {
        usersToShow.forEach(user => {
            const row = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.username}</td>
                    <td><span class="badge bg-${user.role === 'yonetici' ? 'success' : 'secondary'}">${user.role}</span></td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-info edit-user-btn me-1" data-id="${user.id}" title="Düzenle"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-sm btn-danger delete-user-btn" data-id="${user.id}" title="Sil" ${user.username === 'admin' ? 'disabled' : ''}><i class="bi bi-trash3"></i></button>
                    </td>
                </tr>
            `;
            userListBody.append(row);
        });
    }
    kurAdminUserPagination();
}

function kurAdminUserPagination() {
    const paginationList = $('#admin-user-pagination-list');
    if (!paginationList.length) return;
    paginationList.empty();

    const totalPagesAdminUser = Math.ceil(siteKullanicilariGlobal.length / adminUserSayisiPerPage);
    if (totalPagesAdminUser <= 1) return;

    paginationList.append(`<li class="page-item ${currentAdminUserPage === 1 ? 'disabled' : ''}"><a class="page-link admin-user-page-link" href="#" data-page="${currentAdminUserPage - 1}" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>`);
    for (let i = 1; i <= totalPagesAdminUser; i++) {
        paginationList.append(`<li class="page-item ${currentAdminUserPage === i ? 'active' : ''}"><a class="page-link admin-user-page-link" href="#" data-page="${i}">${i}</a></li>`);
    }
    paginationList.append(`<li class="page-item ${currentAdminUserPage === totalPagesAdminUser ? 'disabled' : ''}"><a class="page-link admin-user-page-link" href="#" data-page="${currentAdminUserPage + 1}" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>`);
}

function resetUserForm() {
    $('#user-form')[0].reset();
    $('#user-id-form').val('');
    $('#user-password-form').attr('placeholder', 'Yeni veya Değiştir').prop('required', false);
    $('#save-user-btn').text('Kullanıcı Ekle').removeClass('btn-primary').addClass('btn-success');
    $('#cancel-edit-user-btn').addClass('d-none');
}

function setupUserManagementEvents() {
    $('#user-form').on('submit', function(e) {
        e.preventDefault();
        const userId = $('#user-id-form').val();
        const userName = $('#user-name-form').val().trim();
        const userUsername = $('#user-username-form').val().trim();
        const userPassword = $('#user-password-form').val();
        const userRole = $('#user-role-form').val();

        if (!userName || !userUsername || !userRole ) {
            alert("Lütfen Ad Soyad, Kullanıcı Adı ve Rol alanlarını doldurun.");
            return;
        }
        // Yeni kullanıcı için şifre zorunluluğu
        if (!userId && !userPassword) {
            alert("Yeni kullanıcı için şifre girmek zorunludur.");
            $('#user-password-form').focus();
            return;
        }

        if (userId) { // Düzenleme Modu
            const userIndex = siteKullanicilariGlobal.findIndex(u => u.id === parseInt(userId));
            if (userIndex > -1) {
                if (siteKullanicilariGlobal.some(u => u.username === userUsername && u.id !== parseInt(userId))) {
                    alert("Bu kullanıcı adı zaten mevcut. Lütfen farklı bir kullanıcı adı seçin.");
                    return;
                }
                siteKullanicilariGlobal[userIndex].name = userName;
                siteKullanicilariGlobal[userIndex].username = userUsername;
                siteKullanicilariGlobal[userIndex].role = userRole;
                if (userPassword) {
                    siteKullanicilariGlobal[userIndex].password = userPassword;
                }
                alert("Kullanıcı başarıyla güncellendi!");
            }
        } else { // Yeni Kullanıcı Ekleme Modu
            if (siteKullanicilariGlobal.some(u => u.username === userUsername)) {
                alert("Bu kullanıcı adı zaten mevcut. Lütfen farklı bir kullanıcı adı seçin.");
                return;
            }
            const newId = siteKullanicilariGlobal.length > 0 ? Math.max(0, ...siteKullanicilariGlobal.map(u => u.id)) + 1 : 1;
            siteKullanicilariGlobal.push({
                id: newId,
                name: userName,
                username: userUsername,
                password: userPassword,
                role: userRole
            });
            alert("Yeni kullanıcı başarıyla eklendi!");
        }
        saveUsersToStorage();
        renderAdminUserList();
        resetUserForm();
    });

    $(document).on('click', '.edit-user-btn', function() {
        const userId = parseInt($(this).data('id'));
        const userToEdit = siteKullanicilariGlobal.find(u => u.id === userId);
        if (userToEdit) {
            $('#user-id-form').val(userToEdit.id);
            $('#user-name-form').val(userToEdit.name);
            $('#user-username-form').val(userToEdit.username);
            $('#user-password-form').val('').attr('placeholder', 'Değiştirmek istemiyorsanız boş bırakın').prop('required', false);
            $('#user-role-form').val(userToEdit.role);
            $('#save-user-btn').text('Kullanıcıyı Güncelle').removeClass('btn-success').addClass('btn-primary');
            $('#cancel-edit-user-btn').removeClass('d-none');
        }
    });

    $('#cancel-edit-user-btn').on('click', function() {
        resetUserForm();
    });

    $(document).on('click', '.delete-user-btn', function() {
        const userId = parseInt($(this).data('id'));
        const userToDelete = siteKullanicilariGlobal.find(u => u.id === userId);

        if (userToDelete && userToDelete.username === 'admin') {
            alert("'admin' kullanıcısı silinemez!");
            return;
        }

        if (confirm(`'${userToDelete ? userToDelete.username : userId}' kullanıcısını silmek istediğinize emin misiniz?`)) {
            siteKullanicilariGlobal = siteKullanicilariGlobal.filter(u => u.id !== userId);
            saveUsersToStorage();
            const totalPagesAfterDelete = Math.ceil(siteKullanicilariGlobal.length / adminUserSayisiPerPage);
            if (currentAdminUserPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
                currentAdminUserPage = totalPagesAfterDelete;
            } else if (totalPagesAfterDelete === 0) {
                currentAdminUserPage = 1;
            }
            renderAdminUserList();
            alert("Kullanıcı başarıyla silindi!");
        }
    });
}


// ------------- YÖNETİCİ PANELİ - ÜRÜN YÖNETİMİ FONKSİYONLARI (LOKAL VERİ İÇİN) -------------
// Bu fonksiyonlar, global `urunler` dizisini (urunler.js'den gelen) kullanır.
// Kalıcılık için ürünlerin de localStorage'a kaydedilmesi veya API kullanılması gerekir.
// Şimdilik ürün CRUD işlemleri bu örnekte tam olarak implemente edilmemiştir.
// Sadece listeleme ve sayfalama.
function renderAdminProductListLokal() {
    const productListBody = $('#product-list-body'); // admin.html'deki ürün tablosu
    if (!productListBody.length || typeof urunler === 'undefined') return;
    productListBody.empty();

    if (urunler.length === 0) {
        productListBody.append('<tr><td colspan="7" class="text-center">Henüz ürün bulunmamaktadır.</td></tr>');
        kurAdminPaginationLokal();
        return;
    }

    const startIndex = (currentAdminPageLokal - 1) * adminUrunSayisiPerPageLokal;
    const endIndex = startIndex + adminUrunSayisiPerPageLokal;
    let urunlerToShowAdmin = urunler.slice(startIndex, endIndex);
    
    if (urunlerToShowAdmin.length === 0 && currentAdminPageLokal > 1) {
        currentAdminPageLokal--;
        const newStartIndex = (currentAdminPageLokal - 1) * adminUrunSayisiPerPageLokal;
        urunlerToShowAdmin = urunler.slice(newStartIndex, newStartIndex + adminUrunSayisiPerPageLokal);
    }
    
    if (urunlerToShowAdmin.length === 0 && urunler.length > 0) {
         productListBody.append('<tr><td colspan="7" class="text-center">Bu sayfada ürün bulunmamaktadır.</td></tr>');
    } else {
        urunlerToShowAdmin.forEach(urun => {
            const row = `
                <tr>
                    <td>${urun.id}</td>
                    <td><img src="${urun.resim || 'assets/images/placeholder.jpg'}" alt="${urun.ad}" style="width: 60px; height: 60px; object-fit: cover; border-radius:4px;"></td>
                    <td>${urun.ad}</td>
                    <td>${(typeof urun.fiyat === 'number' ? urun.fiyat.toFixed(2) : 'N/A')} TL</td>
                    <td>${urun.kategori}</td>
                    <td title="${urun.aciklama}">${urun.aciklama && urun.aciklama.length > 40 ? urun.aciklama.substring(0, 37) + '...' : urun.aciklama}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-info edit-product-btn-lokal me-1" data-id="${urun.id}" title="Düzenle (Lokal)"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-sm btn-danger delete-product-btn-lokal" data-id="${urun.id}" title="Sil (Lokal)"><i class="bi bi-trash3"></i></button>
                    </td>
                </tr>
            `;
            productListBody.append(row);
        });
    }
    kurAdminPaginationLokal();
}

function kurAdminPaginationLokal() {
    const paginationList = $('#admin-pagination-list'); // admin.html'deki ürün sayfalama
    if (!paginationList.length || typeof urunler === 'undefined') return;
    paginationList.empty();
    const totalPagesAdmin = Math.ceil(urunler.length / adminUrunSayisiPerPageLokal);
    if (totalPagesAdmin <= 1) return;

    paginationList.append(`<li class="page-item ${currentAdminPageLokal === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentAdminPageLokal - 1}" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>`);
    for (let i = 1; i <= totalPagesAdmin; i++) {
        paginationList.append(`<li class="page-item ${currentAdminPageLokal === i ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
    }
    paginationList.append(`<li class="page-item ${currentAdminPageLokal === totalPagesAdmin ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentAdminPageLokal + 1}" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>`);
}

// Lokal Ürünler için Ekle/Düzenle/Sil Form Olayları (Örnek Taslak - Detaylı implementasyon gerekir)
function setupAdminProductFormEventsLokal() {
    $('#product-form-lokal').on('submit', function(e) { // admin.html'deki ürün formu ID'si #product-form-lokal olmalı
        e.preventDefault();
        // Formdan veri al
        // Yeni ID ata veya mevcut ID'yi kullan
        // `urunler` dizisini güncelle
        // localStorage'a kaydet (eğer ürünler için de kalıcılık isteniyorsa)
        // renderAdminProductListLokal() çağır
        // Formu resetle
        alert("Lokal ürün ekleme/güncelleme henüz tam olarak implemente edilmedi.");
    });

    $(document).on('click', '.edit-product-btn-lokal', function() {
        // Formu doldur
        alert("Lokal ürün düzenleme formu henüz tam olarak implemente edilmedi.");
    });

     $(document).on('click', '.delete-product-btn-lokal', function() {
        // `urunler` dizisinden sil
        // localStorage'dan güncelle (eğer ürünler için de kalıcılık isteniyorsa)
        // renderAdminProductListLokal() çağır
        alert("Lokal ürün silme henüz tam olarak implemente edilmedi.");
    });
}