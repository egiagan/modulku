// products.js
// This file contains the default product data and functions to manage it in localStorage.
// Default product data - used if no data is found in localStorage
const defaultProducts = [
    {
        id: 'chat-gpt-team',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 1',
        price: 100000,
        originalPrice: 350000,
        stock: 20,
        description: 'Paket eksklusif berisi akses Chat GPT yang dikembangkan untuk kolaborasi tim kecil agar lebih produktif, kreatif, dan efisien!',
        whatYouWillLearn: [
            'Produksi oleh DigiCuan - Terpercaya dan terbukti',
            'Akses menggunakan email pribadi kamu sendiri',
            'Berlaku untuk 1 tim (4 orang)',
            'Penggunaan aktif selama 1 bulan penuh',
            'Garansi Uang Kembali jika tidak bisa digunakan atau gagal aktivasi'
        ],
        bonus: [
            'Cocok untuk:',
            'Tim kreator digital',
            'Bisnis UMKM',
            'Freelancers & agensi kecil',
            'Edukator & pelajar AI'
        ],
        note: 'Buktikan sendiri bagaimana Chat GPT Team ini bisa membantu',
        categories: ['Unggulan', 'Produk Digital'] // Added categories
    },
    {
        id: 'digicuan-mastery',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 2',
        price: 149000,
        originalPrice: 299000,
        stock: 0,
        description: 'Panduan Praktis Ubah Prompt Jadi Cuan! Selamat datang di DigiCuan Mastery, sebuah revolusioner yang akan mengubah cara Anda berinteraksi dengan dunia kecerdasan buatan. Ini bukan sekadar teori, ini adalah panduan praktis yang akan membantu Anda mengubah ide-ide AI menjadi penghasilan nyata. Dibuat khusus untuk kamu yang ingin mulai cuan dari dunia digital, bahkan tanpa harus memiliki pengalaman coding atau desain grafis.',
        whatYouWillLearn: [
            'Cara membuat produk digital berkualitas dari AI',
            'Strategi pemasaran dengan Mind & CTA yang menggigit',
            'Tips membuat iklan yang tepat dan menguntungkan',
            'Cara membuat landing page konversi tinggi dengan AI',
            'Dan masih banyak lagi rahasia di dunia cuan AI!'
        ],
        bonus: [
            'Cocok untuk:',
            'Tim kreator digital',
            'Bisnis UMKM',
            'Freelancers & agensi kecil',
            'Edukator & pelajar AI'
        ],
        note: 'DigiCuan Mastery bukan sekadar ebook, tapi pintu masukmu dunia digital penuh peluang. Dengan ebook ini, kamu tidak hanya mendapatkan ide & prompt, kamu jadi sumber penghasilan digital yang lebih besar. Bangun aset digitalmu hari ini, Belajar, Praktik, Cuan.',
        categories: ['Produk Digital'] // Added categories
    },
    {
        id: 'corita-digicuan',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 3',
        price: 0,
        originalPrice: 0,
        stock: 100,
        description: 'Dapatkan akses ke kisah sukses dan pengalaman dari para kreator AI terkemuka. Pelajari strategi dan tips langsung dari mereka yang telah berhasil di dunia AI.',
        whatYouWillLearn: [],
        bonus: [],
        note: '',
        categories: ['Produk Digital'] // Added categories
    },
    {
        id: 'modul-juta-pertama',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 4',
        price: 100000,
        originalPrice: 200000,
        stock: 3,
        description: 'Pelajari langkah demi langkah untuk menghasilkan satu juta pertama Anda dengan menjual produk prompt AI. Modul ini mencakup identifikasi pasar, pembuatan prompt yang efektif, dan strategi penjualan.',
        whatYouWillLearn: [],
        bonus: [],
        note: '',
        categories: ['Unggulan', 'Produk Digital', 'Pendampingan & Kursus'] // Added categories
    },
    {
        id: 'prompt-mastery',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 5',
        price: 100000,
        originalPrice: 200000,
        stock: 7,
        description: 'Panduan lengkap untuk pemula tentang prompt engineering. Pelajari cara membuat prompt yang efektif untuk berbagai model AI dan mendapatkan hasil yang Anda inginkan.',
        whatYouWillLearn: [],
        bonus: [],
        note: '',
        categories: ['Unggulan', 'Produk Digital', 'Pendampingan & Kursus'] // Added categories
    },
    {
        id: 'tips-aset-ai',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 6',
        price: 100000,
        originalPrice: 200000,
        stock: 1,
        description: 'Dapatkan tips dan trik untuk membuat aset AI yang berharga dan pelajari cara memanfaatkan Adobe Stock untuk menjual karya Anda. Tingkatkan potensi penghasilan Anda dengan aset digital.',
        whatYouWillLearn: [],
        bonus: [],
        note: '',
        categories: ['Template & Desain', 'Produk Digital'] // Added categories
    },
    {
        id: 'paket-terampil',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 7',
        price: 93000,
        originalPrice: 293000,
        stock: 50,
        description: 'BEST SELLER! Full package diskon 200rb!',
        whatYouWillLearn: [],
        bonus: [],
        note: '',
        categories: ['Unggulan', 'Produk Digital'] // Added categories
    },
    {
        id: 'bundling-wordpress',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 8',
        price: 165000,
        originalPrice: 0,
        stock: 100,
        description: 'Materi WordPress lengkap untuk semua tingkatan.',
        whatYouWillLearn: [],
        bonus: [],
        note: '',
        categories: ['Produk Digital'] // Added categories
    },
    {
        id: 'template-flashcard',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 9',
        price: 23000,
        originalPrice: 40000,
        stock: 75,
        description: 'Kumpulan template flashcard yang siap pakai untuk berbagai keperluan edukasi.',
        whatYouWillLearn: [],
        bonus: [],
        note: '',
        categories: ['Produk Digital', 'Template & Desain'] // Added categories
    },
    {
        id: 'buku-induk-siswa',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 10',
        price: 30000,
        originalPrice: 0,
        stock: 120,
        description: 'Buku induk siswa terbaru untuk SMA/SMK.',
        whatYouWillLearn: [],
        bonus: [],
        note: '',
        categories: ['Produk Digital'] // Added categories
    },
    {
        id: 'modul-ajar-cp',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 11',
        price: 0,
        originalPrice: 0,
        stock: 200,
        description: 'Perangkat ajar lengkap untuk guru SMA/MA/SMK.',
        whatYouWillLearn: [],
        bonus: [],
        note: '',
        categories: ['Produk Digital'] // Added categories
    },
    {
        id: 'aktivitas-kreatif',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 12',
        price: 0,
        originalPrice: 0,
        stock: 150,
        description: '24 ide aktivitas kreatif untuk pembelajaran yang interaktif.',
        whatYouWillLearn: [],
        bonus: [],
        note: '',
        categories: ['Produk Digital'] // Added categories
    },
    {
        id: 'template-buku-tulis',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 13',
        price: 20000,
        originalPrice: 0,
        stock: 80,
        description: 'Kumpulan template buku tulis dan desain yang menarik.',
        whatYouWillLearn: [],
        bonus: [],
        note: 'Ini cocok banget buat kamu yang suka desain!',
        categories: ['Template & Desain'] // Added categories
    },
    {
        id: 'ebook-desain-grafis',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 14',
        price: 0,
        originalPrice: 0,
        stock: 90,
        description: 'Pelajari rahasia desain grafis profesional hanya dengan Canva.',
        whatYouWillLearn: [],
        bonus: [],
        note: '',
        categories: ['Template & Desain', 'Produk Digital'] // Added categories
    },
    {
        id: 'pendampingan-ppg',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 15',
        price: 100000,
        originalPrice: 0,
        stock: 30,
        description: 'Pendampingan khusus untuk guru PPG SMK.',
        whatYouWillLearn: [],
        bonus: [],
        note: '',
        categories: ['Pendampingan & Kursus'] // Added categories
    },
    {
        id: 'desain-medsos',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 16',
        price: 100000,
        originalPrice: 0,
        stock: 40,
        description: 'Pelajari cara membuat desain media sosial yang menarik menggunakan Canva dan smartphone.',
        whatYouWillLearn: [],
        bonus: [],
        note: '',
        categories: ['Pendampingan & Kursus', 'Template & Desain'] // Added categories
    },
    {
        id: 'printable-hijaiyyah',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyv150e7RLv-JF8Zms6sol_ML69LLp63RujyTgQhO5hmeD4gRjN5kzm11cCT7AbDU6WYH3IcCWNG2mVxUIGTrKBUDNyzroEUGwLUmE4YKhS1eHcEGY3CHokYb0AVS8c8v8L3RaLBmNZNJ_VfWma3NUSMonjx7q8DgUITALYi8dTwPY7COUDGoB1jQNJHk/s1600/Screenshot_37.png',
        title: 'Contoh Nama Produk Digital 17',
        price: 29000,
        originalPrice: 75000,
        stock: 100,
        description: 'MOHON DIBACA DULU YA. DIKIRIM DALAM BENTUK FILE PDF BISA DI DOWNLOAD LANGSUNG DAN DI CETAK. Printable ini adalah worksheet yang mengajak si kecil untuk mengenal huruf hijaiyyah. Ajak si kecil melingkari, mewarnai, menempel dan menggunting ya parent. Printable ini berisi 57 Halaman yang terdiri dari mengenal huruf hijaiyyah dan aktifitas mengunting dan menempel.',
        whatYouWillLearn: [
            'Boleh Dijual Kembali sebagai produk affiliate lynkid Fee up to 60%',
            'Boleh di cetak untuk personal use/ bahan ajar guru-murid',
            'Hubungi Kreator jika ingin menjual dalam bentuk fisik (sudah di print)',
            'ADD ON Template Canva otomatis produk menjadi berlisensi PRL (hak jual kembali setelah di edit sesuai brand identitymu minimal 40% dari desain original ByDif)'
        ],
        bonus: [],
        note: 'Cocok untuk anak usia 2-5 Tahun (PRESCHOOL)',
        categories: ['Produk Digital', 'Template & Desain'] // Added categories
    }
];

// Make products globally accessible
window.products = [];
const PRODUCTS_STORAGE_KEY = 'digicuanProducts'; // Key for products data in localStorage

// Function to save products data to localStorage
window.saveProductsToLocalStorage = function() {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(window.products));
}

// Function to load products data from localStorage
window.loadProductsFromLocalStorage = function() {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (storedProducts) {
        window.products = JSON.parse(storedProducts);
    } else {
        window.products = [...defaultProducts]; // Use a copy of default products
        window.saveProductsToLocalStorage(); // Save default products to localStorage for the first time
    }
}

// Initial load when the script is first executed.
// This ensures window.products is populated as soon as products.js is loaded.
window.loadProductsFromLocalStorage();
