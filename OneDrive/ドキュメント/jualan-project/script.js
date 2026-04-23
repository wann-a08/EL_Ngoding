/* =============================================
   SCRIPT.JS - Admin Panel Sistem Penjualan
   ============================================= */

/* ──────────────────────────────────────────────
   AUTH UTILS
   ────────────────────────────────────────────── */

// Data login yang valid (hardcoded)
const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Key untuk localStorage
const AUTH_KEY = 'adminPanelAuth';
const USER_KEY = 'adminPanelUser';

// Cek apakah user sudah login
function isLoggedIn() {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

// Simpan status login
function saveLogin(username) {
  localStorage.setItem(AUTH_KEY, 'true');
  localStorage.setItem(USER_KEY, username);
}

// Hapus status login (logout)
function clearLogin() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
}

// Ambil nama user yang sedang login
function getLoggedUser() {
  return localStorage.getItem(USER_KEY) || 'Admin';
}

// Proteksi halaman: jika belum login, redirect ke index.html
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

// Jika sudah login, redirect dari login page ke dashboard
function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
  }
}

/* ──────────────────────────────────────────────
   LOGIN PAGE LOGIC
   ────────────────────────────────────────────── */

function initLoginPage() {
  redirectIfLoggedIn(); // Jika sudah login, langsung ke dashboard

  const form = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorMsg = document.getElementById('errorMsg');
  const btnLogin = document.getElementById('btnLogin');
  const togglePassword = document.getElementById('togglePassword');

  // Toggle show/hide password
  if (togglePassword) {
    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type');
      passwordInput.setAttribute('type', type === 'password' ? 'text' : 'password');
      this.textContent = type === 'password' ? '🙈' : '👁️';
    });
  }

  // Handle form submit
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      handleLogin();
    });
  }

  // Handle tombol enter di input
  [usernameInput, passwordInput].forEach(input => {
    if (input) {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') handleLogin();
      });

      // Reset error saat user mulai mengetik
      input.addEventListener('input', function() {
        errorMsg.classList.remove('show');
        this.style.borderColor = '';
      });
    }
  });

  function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Validasi form kosong
    if (!username || !password) {
      showError('⚠️ Username dan password tidak boleh kosong!');
      return;
    }

    // Tampilkan loading state
    btnLogin.textContent = '⏳ Memproses...';
    btnLogin.classList.add('loading');
    errorMsg.classList.remove('show');

    // Simulasi network delay (biar lebih realistis)
    setTimeout(function() {
      if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
        // LOGIN BERHASIL
        btnLogin.textContent = '✅ Berhasil! Mengalihkan...';
        saveLogin(username);

        setTimeout(function() {
          window.location.href = 'dashboard.html';
        }, 800);
      } else {
        // LOGIN GAGAL
        btnLogin.textContent = '🔑 Masuk ke Dashboard';
        btnLogin.classList.remove('loading');
        showError('❌ Username atau password salah. Coba lagi!');

        // Highlight input yang salah
        usernameInput.style.borderColor = 'var(--red)';
        passwordInput.style.borderColor = 'var(--red)';
        passwordInput.value = ''; // Bersihkan password
      }
    }, 1000);
  }

  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
    // Scroll ke error message
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ──────────────────────────────────────────────
   SIDEBAR & TOPBAR LOGIC
   ────────────────────────────────────────────── */

function initSidebar() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  // Toggle sidebar di mobile
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });
  }

  // Tutup sidebar saat klik overlay
  if (overlay) {
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // Update nama user di sidebar
  const userNameEl = document.querySelector('.user-name');
  if (userNameEl) {
    userNameEl.textContent = getLoggedUser().charAt(0).toUpperCase() + getLoggedUser().slice(1);
  }

  // Update avatar
  const avatarEl = document.querySelector('.user-avatar');
  if (avatarEl) {
    avatarEl.textContent = getLoggedUser().charAt(0).toUpperCase();
  }

  // Update tanggal di topbar
  const dateEl = document.getElementById('currentDate');
  if (dateEl) {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('id-ID', options);
  }

  // Logout handler
  const logoutBtns = document.querySelectorAll('.logout-trigger');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      if (confirm('Apakah Anda yakin ingin keluar?')) {
        clearLogin();
        window.location.href = 'index.html';
      }
    });
  });
}

/* ──────────────────────────────────────────────
   DASHBOARD PAGE LOGIC
   ────────────────────────────────────────────── */

// Data dummy untuk dashboard
const dashboardData = {
  stats: {
    totalProduk: 248,
    totalTransaksi: 1_847,
    totalPendapatan: 284_750_000,
    totalPelanggan: 932,
    trendProduk: '+12%',
    trendTransaksi: '+8.4%',
    trendPendapatan: '+23.1%',
    trendPelanggan: '+5.7%'
  },
  transaksiTerbaru: [
    { id: 'TRX-0091', produk: 'Laptop Asus ROG', pelanggan: 'Budi Santoso', jumlah: 1, total: 18_500_000, status: 'success', tanggal: '23 Apr 2025' },
    { id: 'TRX-0090', produk: 'Mouse Logitech G Pro', pelanggan: 'Siti Rahayu', jumlah: 2, total: 1_800_000, status: 'success', tanggal: '23 Apr 2025' },
    { id: 'TRX-0089', produk: 'Monitor Samsung 27"', pelanggan: 'Ahmad Rizki', jumlah: 1, total: 4_200_000, status: 'warning', tanggal: '22 Apr 2025' },
    { id: 'TRX-0088', produk: 'Keyboard Mechanical', pelanggan: 'Dewi Putri', jumlah: 3, total: 2_850_000, status: 'success', tanggal: '22 Apr 2025' },
    { id: 'TRX-0087', produk: 'Headset Sony WH-1000', pelanggan: 'Eko Prasetyo', jumlah: 1, total: 3_600_000, status: 'error', tanggal: '21 Apr 2025' },
    { id: 'TRX-0086', produk: 'Webcam Logitech C920', pelanggan: 'Fitri Handayani', jumlah: 2, total: 2_400_000, status: 'success', tanggal: '21 Apr 2025' },
    { id: 'TRX-0085', produk: 'SSD Samsung 1TB', pelanggan: 'Gilang Ramadan', jumlah: 4, total: 3_200_000, status: 'success', tanggal: '20 Apr 2025' },
  ]
};

// Format angka ke Rupiah
function formatRupiah(angka) {
  if (angka >= 1_000_000_000) return 'Rp ' + (angka / 1_000_000_000).toFixed(1) + ' M';
  if (angka >= 1_000_000) return 'Rp ' + (angka / 1_000_000).toFixed(1) + ' Jt';
  return 'Rp ' + angka.toLocaleString('id-ID');
}

// Format angka biasa
function formatNumber(n) {
  return n.toLocaleString('id-ID');
}

function initDashboard() {
  requireAuth(); // Proteksi halaman
  initSidebar();

  // Render stat cards dengan animasi counting
  animateCounter('statProduk', 0, dashboardData.stats.totalProduk, 1500, formatNumber);
  animateCounter('statTransaksi', 0, dashboardData.stats.totalTransaksi, 1500, formatNumber);
  animateCounter('statPendapatan', 0, dashboardData.stats.totalPendapatan, 1800, formatRupiah);
  animateCounter('statPelanggan', 0, dashboardData.stats.totalPelanggan, 1500, formatNumber);

  // Render tabel transaksi
  renderTransaksiTable();

  // Render chart mini
  renderDashboardChart();
}

// Animasi counter angka
function animateCounter(elementId, start, end, duration, formatter) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const startTime = performance.now();
  const range = end - start;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Easing: ease-out
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + range * eased);
    el.textContent = formatter(current);

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = formatter(end);
  }

  requestAnimationFrame(update);
}

function renderTransaksiTable() {
  const tbody = document.getElementById('transaksiBody');
  if (!tbody) return;

  const statusMap = {
    success: { label: 'Selesai', class: 'success' },
    warning: { label: 'Pending', class: 'warning' },
    error: { label: 'Dibatalkan', class: 'error' }
  };

  tbody.innerHTML = dashboardData.transaksiTerbaru.map(trx => `
    <tr>
      <td><span style="font-family: var(--font-mono); color: var(--accent); font-size: 12px;">${trx.id}</span></td>
      <td style="color: var(--text-primary); font-weight: 500;">${trx.produk}</td>
      <td>${trx.pelanggan}</td>
      <td style="text-align: center;">${trx.jumlah}</td>
      <td style="font-family: var(--font-mono); color: var(--green); font-weight: 600;">${formatRupiah(trx.total)}</td>
      <td><span class="badge ${statusMap[trx.status].class}">${statusMap[trx.status].label}</span></td>
      <td>${trx.tanggal}</td>
    </tr>
  `).join('');
}

function renderDashboardChart() {
  const ctx = document.getElementById('dashboardChart');
  if (!ctx) return;

  const labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const data = [12, 19, 14, 25, 22, 30, 18];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Transaksi',
        data: data,
        backgroundColor: 'rgba(79, 142, 247, 0.3)',
        borderColor: 'rgba(79, 142, 247, 0.8)',
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(79, 142, 247, 0.5)',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e2840',
          borderColor: 'rgba(79, 142, 247, 0.3)',
          borderWidth: 1,
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
          padding: 12,
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#94a3b8', font: { size: 12 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#94a3b8', font: { size: 12 } }
        }
      }
    }
  });
}

/* ──────────────────────────────────────────────
   STATISTICS PAGE LOGIC
   ────────────────────────────────────────────── */

// Data dummy untuk statistik
const statisticsData = {
  penjualanHarian: {
    labels: ['1 Apr','3 Apr','5 Apr','7 Apr','9 Apr','11 Apr','13 Apr','15 Apr','17 Apr','19 Apr','21 Apr','23 Apr'],
    data: [45, 52, 38, 65, 72, 58, 80, 91, 67, 84, 95, 88]
  },
  pendapatanBulanan: {
    labels: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
    data: [185, 220, 195, 284, 310, 275, 340, 295, 320, 380, 355, 410],
    target: [200, 210, 210, 250, 280, 280, 300, 300, 310, 350, 360, 400]
  },
  kategoriProduk: {
    labels: ['Laptop', 'Aksesori', 'Monitor', 'Audio', 'Storage', 'Lainnya'],
    data: [35, 25, 18, 12, 7, 3],
    colors: ['#4f8ef7', '#22d3a0', '#f59e0b', '#a78bfa', '#f87171', '#64748b']
  },
  topProduk: [
    { nama: 'Laptop Asus ROG', terjual: 128, pendapatan: 2_368_000_000, pct: 100 },
    { nama: 'Mouse Logitech G Pro', terjual: 312, pendapatan: 280_800_000, pct: 72 },
    { nama: 'Monitor Samsung 27"', terjual: 84, pendapatan: 352_800_000, pct: 62 },
    { nama: 'Headset Sony WH-1000', terjual: 96, pendapatan: 345_600_000, pct: 54 },
    { nama: 'Keyboard Mechanical', terjual: 156, pendapatan: 148_200_000, pct: 43 },
  ],
  performaMingguan: {
    labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
    online: [120, 145, 132, 168],
    offline: [85, 92, 78, 105]
  }
};

function initStatistics() {
  requireAuth(); // Proteksi halaman
  initSidebar();

  // Render semua chart
  renderSalesLineChart();
  renderRevenueBarChart();
  renderCategoryDonutChart();
  renderWeeklyChart();

  // Render top produk
  renderTopProduk();
}

function renderSalesLineChart() {
  const ctx = document.getElementById('salesLineChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: statisticsData.penjualanHarian.labels,
      datasets: [{
        label: 'Jumlah Transaksi',
        data: statisticsData.penjualanHarian.data,
        borderColor: '#4f8ef7',
        backgroundColor: 'rgba(79, 142, 247, 0.08)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4f8ef7',
        pointBorderColor: '#0a0e1a',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: chartTooltipStyle()
      },
      scales: {
        x: chartAxisStyle(),
        y: {
          ...chartAxisStyle(),
          beginAtZero: true,
        }
      }
    }
  });
}

function renderRevenueBarChart() {
  const ctx = document.getElementById('revenueBarChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: statisticsData.pendapatanBulanan.labels,
      datasets: [
        {
          label: 'Pendapatan (Juta Rp)',
          data: statisticsData.pendapatanBulanan.data,
          backgroundColor: 'rgba(34, 211, 160, 0.3)',
          borderColor: 'rgba(34, 211, 160, 0.8)',
          borderWidth: 2,
          borderRadius: 5,
        },
        {
          label: 'Target (Juta Rp)',
          data: statisticsData.pendapatanBulanan.target,
          backgroundColor: 'rgba(79, 142, 247, 0.15)',
          borderColor: 'rgba(79, 142, 247, 0.6)',
          borderWidth: 2,
          borderRadius: 5,
          borderDash: [5, 5],
          type: 'line',
          fill: false,
          tension: 0.4,
          pointRadius: 3,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { size: 12 }, boxWidth: 12, boxHeight: 12 }
        },
        tooltip: chartTooltipStyle()
      },
      scales: {
        x: chartAxisStyle(),
        y: {
          ...chartAxisStyle(),
          beginAtZero: false,
          ticks: {
            color: '#94a3b8',
            font: { size: 11 },
            callback: v => v + ' Jt'
          }
        }
      }
    }
  });
}

function renderCategoryDonutChart() {
  const ctx = document.getElementById('categoryDonutChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: statisticsData.kategoriProduk.labels,
      datasets: [{
        data: statisticsData.kategoriProduk.data,
        backgroundColor: statisticsData.kategoriProduk.colors.map(c => c + 'cc'),
        borderColor: statisticsData.kategoriProduk.colors,
        borderWidth: 2,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#94a3b8',
            font: { size: 12 },
            boxWidth: 12,
            boxHeight: 12,
            padding: 16,
            usePointStyle: true,
          }
        },
        tooltip: {
          ...chartTooltipStyle(),
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.raw}%`
          }
        }
      }
    }
  });
}

function renderWeeklyChart() {
  const ctx = document.getElementById('weeklyPerformChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: statisticsData.performaMingguan.labels,
      datasets: [
        {
          label: 'Online',
          data: statisticsData.performaMingguan.online,
          backgroundColor: 'rgba(79, 142, 247, 0.5)',
          borderColor: '#4f8ef7',
          borderWidth: 2,
          borderRadius: 5,
        },
        {
          label: 'Offline',
          data: statisticsData.performaMingguan.offline,
          backgroundColor: 'rgba(167, 139, 250, 0.5)',
          borderColor: '#a78bfa',
          borderWidth: 2,
          borderRadius: 5,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { size: 12 }, boxWidth: 12 }
        },
        tooltip: chartTooltipStyle()
      },
      scales: {
        x: chartAxisStyle(),
        y: { ...chartAxisStyle(), beginAtZero: true }
      }
    }
  });
}

function renderTopProduk() {
  const list = document.getElementById('topProdukList');
  if (!list) return;

  const colors = ['var(--accent)', 'var(--green)', 'var(--orange)', 'var(--purple)', 'var(--red)'];

  list.innerHTML = statisticsData.topProduk.map((p, i) => `
    <div class="progress-item">
      <div class="progress-item-label">
        <span class="name">${i + 1}. ${p.nama} <span style="color: var(--text-muted); font-size: 11px;">(${formatNumber(p.terjual)} terjual)</span></span>
        <span class="pct">${p.pct}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 0%; background: ${colors[i]};" data-width="${p.pct}"></div>
      </div>
    </div>
  `).join('');

  // Animasikan progress bar
  setTimeout(() => {
    document.querySelectorAll('.progress-fill').forEach(el => {
      el.style.width = el.dataset.width + '%';
    });
  }, 300);
}

// Helper: style tooltip Chart.js
function chartTooltipStyle() {
  return {
    backgroundColor: '#1e2840',
    borderColor: 'rgba(79, 142, 247, 0.3)',
    borderWidth: 1,
    titleColor: '#f1f5f9',
    bodyColor: '#94a3b8',
    padding: 12,
    cornerRadius: 8,
  };
}

// Helper: style axis Chart.js
function chartAxisStyle() {
  return {
    grid: { color: 'rgba(255,255,255,0.05)' },
    ticks: { color: '#94a3b8', font: { size: 11 } },
    border: { color: 'rgba(255,255,255,0.07)' }
  };
}
