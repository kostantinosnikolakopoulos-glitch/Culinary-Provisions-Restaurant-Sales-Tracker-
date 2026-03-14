// ============================================================
// MAIN APPLICATION — Culinary Provisions
// ============================================================

const App = {
  currentView: 'dashboard',
  currentOrder: null,       // order being built
  editingItem: null,        // menu item being edited
  editingStaff: null,       // staff member being edited
  charts: {},               // Chart.js instances

  // ── Initialise ─────────────────────────────────────────
  init() {
    Store.init();
    this.applyTheme();
    this.bindNav();
    this.bindMobile();
    // Restore last viewed page (persist across refresh)
    const saved = localStorage.getItem('hc_current_view');
    this.showView(saved || 'dashboard');
    this.updateClock();
    setInterval(() => this.updateClock(), 30000);
    this.updateRestaurantName();
  },

  updateClock() {
    const el = document.getElementById('header-date');
    if (el) {
      const now = new Date();
      el.textContent = now.toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }
  },

  updateRestaurantName() {
    const s = Store.getSettings();
    const el = document.getElementById('restaurant-name');
    if (el) el.textContent = s.restaurantName;
  },

  currency() {
    return Store.getSettings().currency || '€';
  },

  fmt(amount) {
    return this.currency() + amount.toLocaleString('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  /** Format with 4 decimals for unit costs (e.g. €0,0200/g) */
  fmtUnit(amount) {
    return this.currency() + amount.toLocaleString('el-GR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  },

  vatRate() {
    const s = Store.getSettings();
    return s.vatRate != null ? s.vatRate : 13;
  },

  /** Given a VAT-inclusive price, returns the net (ex-VAT) amount */
  netPrice(grossPrice) {
    const vat = this.vatRate();
    return vat > 0 ? grossPrice / (1 + vat / 100) : grossPrice;
  },

  /** Given a net (ex-VAT) amount, returns the VAT-inclusive price */
  grossPrice(netAmount) {
    const vat = this.vatRate();
    return vat > 0 ? netAmount * (1 + vat / 100) : netAmount;
  },

  /** Theme-aware chart colors */
  chartColors() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      text:  dark ? '#e8ecf1' : '#2c2417',
      grid:  dark ? '#2a3a4a' : '#e2ddd3',
      border: dark ? '#15202d' : '#ffffff',
    };
  },

  // ── Navigation ─────────────────────────────────────────
  bindNav() {
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showView(btn.dataset.view);
      });
    });
  },

  // ── Mobile sidebar / overlay ───────────────────────────
  bindMobile() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const hamburger = document.getElementById('hamburger');

    // Hamburger toggles sidebar + overlay
    if (hamburger) {
      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = sidebar.classList.toggle('open');
        overlay.classList.toggle('active', open);
      });
    }

    // Tap overlay to close
    if (overlay) {
      overlay.addEventListener('click', () => this.closeSidebar());
    }

    // Swipe-to-close on sidebar
    let touchStartX = 0;
    sidebar.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    sidebar.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (dx < -60) this.closeSidebar();   // swipe left to close
    }, { passive: true });

    // Swipe from left edge to open sidebar
    document.addEventListener('touchstart', (e) => {
      if (e.touches[0].clientX < 20 && !sidebar.classList.contains('open')) {
        touchStartX = 0;
        sidebar._edgeSwipe = true;
      }
    }, { passive: true });
    document.addEventListener('touchend', (e) => {
      if (sidebar._edgeSwipe && e.changedTouches[0].clientX > 80) {
        sidebar.classList.add('open');
        overlay.classList.add('active');
      }
      sidebar._edgeSwipe = false;
    }, { passive: true });
  },

  closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  },

  // ── Theme (light / dark) ──────────────────────────────
  applyTheme() {
    const saved = localStorage.getItem('hc_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    this.updateThemeIcon(saved);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('hc_theme', next);
    this.updateThemeIcon(next);
    // Update meta theme-color for mobile browser chrome
    const meta = document.getElementById('meta-theme-color');
    if (meta) meta.content = next === 'dark' ? '#0f1923' : '#f5f3ef';
  },

  updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.innerHTML = theme === 'dark'
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
      btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  },

  showView(view) {
    this.currentView = view;
    // Persist across refresh
    localStorage.setItem('hc_current_view', view);
    // Close sidebar on mobile
    this.closeSidebar();
    // Update nav
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    // Hide all views
    document.querySelectorAll('.view-section').forEach(v => v.classList.add('hidden'));
    // Show target
    const target = document.getElementById('view-' + view);
    if (target) target.classList.remove('hidden');
    // Scroll to top
    document.querySelector('.main-body')?.scrollTo(0, 0);
    // Render
    this.renderView(view);
  },

  renderView(view) {
    switch (view) {
      case 'dashboard':  this.renderDashboard(); break;
      case 'new-order':  this.renderNewOrder();  break;
      case 'orders':     this.renderOrders();    break;
      case 'menu':       this.renderMenu();      break;
      case 'pantry':     this.renderPantry();    break;
      case 'staff':      this.renderStaff();     break;
      case 'reports':    this.renderReports();   break;
      case 'history':    this.renderHistory();   break;
      case 'settings':   this.renderSettings();  break;
    }
  },

  // ════════════════════════════════════════════════════════
  //  DASHBOARD
  // ════════════════════════════════════════════════════════
  renderDashboard() {
    // Show business date
    const bizDate = Store.getBusinessDate();
    const dateEl = document.getElementById('dash-date');
    if (dateEl) {
      const d = new Date(bizDate + 'T12:00:00');
      dateEl.textContent = '— ' + d.toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    const orders = Store.getTodayOrders();
    const closed = orders.filter(o => o.status === 'closed');
    const allItems = closed.flatMap(o => o.items || []);
    const totalRevenue = closed.reduce((s, o) => s + (o.total || 0), 0);
    const totalCovers = closed.reduce((s, o) => s + (o.covers || 0), 0);
    const avgPerCover = totalCovers > 0 ? totalRevenue / totalCovers : 0;
    const openCount = orders.filter(o => o.status === 'open').length;

    // KPI Cards
    document.getElementById('kpi-revenue').textContent = this.fmt(totalRevenue);
    document.getElementById('kpi-orders').textContent = closed.length;
    document.getElementById('kpi-covers').textContent = totalCovers;
    document.getElementById('kpi-avg').textContent = this.fmt(avgPerCover);
    document.getElementById('kpi-open').textContent = openCount;

    const totalItems = allItems.reduce((s, i) => s + i.quantity, 0);
    document.getElementById('kpi-items').textContent = totalItems;

    // Profit KPIs (VAT-aware)
    const totalCost = closed.reduce((s, o) => {
      return s + (o.items || []).reduce((c, i) => c + (i.costPrice || 0) * i.quantity, 0);
    }, 0);
    const netRevenue = this.netPrice(totalRevenue);
    const vatCollected = totalRevenue - netRevenue;
    const realProfit = netRevenue - totalCost;
    const realMargin = netRevenue > 0 ? (realProfit / netRevenue * 100) : 0;
    document.getElementById('kpi-cost').textContent = this.fmt(totalCost);
    document.getElementById('kpi-gross-profit').textContent = this.fmt(realProfit);
    const marginEl = document.getElementById('kpi-margin');
    marginEl.textContent = realMargin.toFixed(1) + '%';
    marginEl.style.color = realMargin >= 65 ? 'var(--profit-green)' : realMargin >= 50 ? 'var(--accent)' : 'var(--loss-red)';

    // Category breakdown
    const categories = Store.getCategories();
    const catMap = {};
    categories.forEach(c => { catMap[c.id] = { name: c.name, count: 0, revenue: 0 }; });
    allItems.forEach(item => {
      if (catMap[item.categoryId]) {
        catMap[item.categoryId].count += item.quantity;
        catMap[item.categoryId].revenue += item.price * item.quantity;
      }
    });

    // Category chart
    const catLabels = [], catData = [], catColors = [];
    const palette = ['#b08d4e','#2d9c6f','#e0892e','#4a8fe7','#9064db','#1ba9c4','#d14d7a','#7cb531','#e86c5a','#6c8ebf'];
    Object.keys(catMap).forEach((id, i) => {
      if (catMap[id].revenue > 0) {
        catLabels.push(catMap[id].name);
        catData.push(catMap[id].revenue);
        catColors.push(palette[i % palette.length]);
      }
    });
    const cc = this.chartColors();
    const catTotal = catData.reduce((a, b) => a + b, 0);

    this.renderChart('chart-categories', 'doughnut', {
      labels: catLabels,
      datasets: [{
        data: catData,
        backgroundColor: catColors,
        hoverBackgroundColor: catColors.map(c => c + 'dd'),
        borderWidth: 2,
        borderColor: cc.border,
        hoverOffset: 8,
        spacing: 2,
        borderRadius: 3,
      }]
    }, {
      cutout: '62%',
      animation: { animateRotate: true, duration: 900, easing: 'easeOutQuart' },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: cc.text,
            padding: 14,
            font: { size: 11, weight: '500' },
            usePointStyle: true,
            pointStyleWidth: 10,
          },
        },
        tooltip: {
          backgroundColor: cc.border === '#ffffff' ? '#1a1207ee' : '#0f1923ee',
          titleFont: { size: 13, weight: '600' },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label(ctx) {
              const val = ctx.parsed;
              const pct = catTotal > 0 ? (val / catTotal * 100).toFixed(1) : '0.0';
              return ` ${App.fmt(val)}  (${pct}%)`;
            },
          },
        },
      },
    });

    // Staff breakdown
    const staff = Store.getStaff();
    const staffMap = {};
    staff.forEach(s => { staffMap[s.id] = { name: s.name, orders: 0, items: 0, revenue: 0 }; });
    closed.forEach(order => {
      if (staffMap[order.staffId]) {
        staffMap[order.staffId].orders++;
        staffMap[order.staffId].items += (order.items || []).reduce((s, i) => s + i.quantity, 0);
        staffMap[order.staffId].revenue += order.total || 0;
      }
    });

    // Find top performer
    let topPerformer = null;
    let topRevenue = 0;
    Object.keys(staffMap).forEach(id => {
      if (staffMap[id].revenue > topRevenue) {
        topRevenue = staffMap[id].revenue;
        topPerformer = staffMap[id];
      }
    });

    const starEl = document.getElementById('star-performer');
    if (topPerformer && topRevenue > 0) {
      starEl.innerHTML = `
        <div class="star-card">
          <i class="fa-solid fa-trophy"></i>
          <div>
            <div class="star-name">${topPerformer.name}</div>
            <div class="star-stats">${topPerformer.orders} orders · ${topPerformer.items} items · ${this.fmt(topPerformer.revenue)}</div>
          </div>
        </div>`;
    } else {
      starEl.innerHTML = '<p class="text-muted">No sales recorded yet today</p>';
    }

    // Staff table
    const staffTableBody = document.getElementById('staff-dashboard-body');
    const staffEntries = Object.values(staffMap).sort((a, b) => b.revenue - a.revenue);
    if (staffEntries.length === 0 || staffEntries.every(s => s.orders === 0)) {
      staffTableBody.innerHTML = '<tr><td colspan="4" class="text-muted text-center">No staff sales today</td></tr>';
    } else {
      staffTableBody.innerHTML = staffEntries.map(s => `
        <tr>
          <td>${s.name}</td>
          <td class="text-center">${s.orders}</td>
          <td class="text-center">${s.items}</td>
          <td class="text-right">${this.fmt(s.revenue)}</td>
        </tr>
      `).join('');
    }

    // Top selling items
    const itemSales = {};
    allItems.forEach(i => {
      const key = i.menuItemId || i.name;
      if (!itemSales[key]) itemSales[key] = { name: i.name, qty: 0, revenue: 0 };
      itemSales[key].qty += i.quantity;
      itemSales[key].revenue += i.price * i.quantity;
    });
    const topItems = Object.values(itemSales).sort((a, b) => b.qty - a.qty).slice(0, 8);

    const bcc = this.chartColors();
    this.renderChart('chart-top-items', 'bar', {
      labels: topItems.map(i => i.name.length > 18 ? i.name.slice(0, 16) + '…' : i.name),
      datasets: [{
        label: 'Qty Sold',
        data: topItems.map(i => i.qty),
        backgroundColor: '#b08d4e',
        hoverBackgroundColor: '#c9a84c',
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.7,
      }]
    }, {
      indexAxis: 'y',
      animation: { duration: 700, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: bcc.border === '#ffffff' ? '#1a1207ee' : '#0f1923ee',
          titleFont: { size: 13, weight: '600' },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
        },
      },
      scales: {
        x: { ticks: { color: bcc.text }, grid: { color: bcc.grid, drawBorder: false } },
        y: { ticks: { color: bcc.text, font: { size: 11 } }, grid: { display: false } },
      }
    });

    // Category breakdown table
    const catTableBody = document.getElementById('category-breakdown-body');
    const catEntries = Object.values(catMap).filter(c => c.count > 0);
    if (catEntries.length === 0) {
      catTableBody.innerHTML = '<tr><td colspan="3" class="text-muted text-center">No sales yet</td></tr>';
    } else {
      catTableBody.innerHTML = catEntries.map(c => `
        <tr>
          <td>${c.name}</td>
          <td class="text-center">${c.count}</td>
          <td class="text-right">${this.fmt(c.revenue)}</td>
        </tr>
      `).join('');
    }
  },

  renderChart(canvasId, type, data, options = {}) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    this.charts[canvasId] = new Chart(ctx, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...options,
      }
    });
  },

  // ════════════════════════════════════════════════════════
  //  NEW ORDER
  // ════════════════════════════════════════════════════════
  renderNewOrder() {
    const staff = Store.getStaff().filter(s => s.active);
    const categories = Store.getCategories().sort((a, b) => a.order - b.order);
    const menu = Store.getMenu().filter(m => m.active);

    if (staff.length === 0) {
      document.getElementById('new-order-content').innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-user-plus"></i>
          <h3>No Staff Members</h3>
          <p>Add staff members first before creating orders.</p>
          <button class="btn btn-primary" data-view="staff">Go to Staff Management</button>
        </div>`;
      document.getElementById('new-order-content').querySelector('[data-view]')
        ?.addEventListener('click', () => this.showView('staff'));
      return;
    }

    // Initialise current order if needed
    if (!this.currentOrder) {
      this.currentOrder = {
        staffId: staff[0].id,
        tableNumber: 1,
        covers: 2,
        items: [],
      };
    }

    // Staff & table selectors
    const staffSelect = document.getElementById('order-staff');
    staffSelect.innerHTML = staff.map(s =>
      `<option value="${s.id}" ${s.id === this.currentOrder.staffId ? 'selected' : ''}>${s.name}</option>`
    ).join('');
    staffSelect.onchange = () => { this.currentOrder.staffId = staffSelect.value; };

    const tableInput = document.getElementById('order-table');
    tableInput.value = this.currentOrder.tableNumber;
    tableInput.onchange = () => { this.currentOrder.tableNumber = parseInt(tableInput.value) || 1; };

    const coversInput = document.getElementById('order-covers');
    coversInput.value = this.currentOrder.covers;
    coversInput.onchange = () => { this.currentOrder.covers = parseInt(coversInput.value) || 1; };

    // Category tabs
    const catTabs = document.getElementById('category-tabs');
    const activeTab = catTabs.querySelector('.tab-btn.active')?.dataset?.cat || categories[0]?.id;
    catTabs.innerHTML = categories.map(c =>
      `<button class="tab-btn ${c.id === activeTab ? 'active' : ''}" data-cat="${c.id}">
        <i class="fa-solid ${c.icon}"></i> ${c.name}
      </button>`
    ).join('');

    catTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        catTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderMenuGrid(btn.dataset.cat);
      });
    });

    this.renderMenuGrid(activeTab);
    this.renderOrderSummary();
  },

  renderMenuGrid(categoryId) {
    const menu = Store.getMenu().filter(m => m.active && m.categoryId === categoryId);
    const grid = document.getElementById('menu-grid');

    if (menu.length === 0) {
      grid.innerHTML = '<p class="text-muted">No items in this category</p>';
      return;
    }

    grid.innerHTML = menu.map(item => {
      const inOrder = (this.currentOrder?.items || []).find(i => i.menuItemId === item.id);
      const qty = inOrder ? inOrder.quantity : 0;
      return `
        <div class="menu-card ${qty > 0 ? 'in-order' : ''}" data-id="${item.id}">
          <div class="menu-card-name">${item.name}</div>
          <div class="menu-card-price">${this.fmt(item.price)}</div>
          ${qty > 0 ? `<div class="menu-card-qty">
            <button class="qty-btn minus" data-id="${item.id}">−</button>
            <span>${qty}</span>
            <button class="qty-btn plus" data-id="${item.id}">+</button>
          </div>` : ''}
        </div>`;
    }).join('');

    // Click to add
    grid.querySelectorAll('.menu-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('qty-btn')) return;
        this.addToOrder(card.dataset.id);
      });
    });

    // +/- buttons
    grid.querySelectorAll('.qty-btn.plus').forEach(btn => {
      btn.addEventListener('click', () => this.addToOrder(btn.dataset.id));
    });
    grid.querySelectorAll('.qty-btn.minus').forEach(btn => {
      btn.addEventListener('click', () => this.removeFromOrder(btn.dataset.id));
    });
  },

  addToOrder(menuItemId) {
    if (!this.currentOrder) return;
    const menuItem = Store.getMenu().find(m => m.id === menuItemId);
    if (!menuItem) return;

    const existing = this.currentOrder.items.find(i => i.menuItemId === menuItemId);
    if (existing) {
      existing.quantity++;
    } else {
      this.currentOrder.items.push({
        menuItemId: menuItem.id,
        name: menuItem.name,
        categoryId: menuItem.categoryId,
        price: menuItem.price,
        costPrice: menuItem.costPrice || 0,
        quantity: 1,
      });
    }
    // Re-render active category grid & summary
    const activeTab = document.querySelector('#category-tabs .tab-btn.active');
    if (activeTab) this.renderMenuGrid(activeTab.dataset.cat);
    this.renderOrderSummary();
  },

  removeFromOrder(menuItemId) {
    if (!this.currentOrder) return;
    const idx = this.currentOrder.items.findIndex(i => i.menuItemId === menuItemId);
    if (idx === -1) return;
    this.currentOrder.items[idx].quantity--;
    if (this.currentOrder.items[idx].quantity <= 0) {
      this.currentOrder.items.splice(idx, 1);
    }
    const activeTab = document.querySelector('#category-tabs .tab-btn.active');
    if (activeTab) this.renderMenuGrid(activeTab.dataset.cat);
    this.renderOrderSummary();
  },

  renderOrderSummary() {
    const container = document.getElementById('order-summary');
    if (!this.currentOrder || this.currentOrder.items.length === 0) {
      container.innerHTML = '<p class="text-muted text-center">No items added yet</p>';
      document.getElementById('order-total').textContent = this.fmt(0);
      return;
    }

    const settings = Store.getSettings();
    const subtotal = this.currentOrder.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = subtotal * (settings.taxRate / 100);
    const service = subtotal * (settings.serviceCharge / 100);
    const total = subtotal + tax + service;

    container.innerHTML = this.currentOrder.items.map(item => `
      <div class="summary-item">
        <div class="summary-item-info">
          <span class="summary-qty">${item.quantity}×</span>
          <span class="summary-name">${item.name}</span>
        </div>
        <div class="summary-item-actions">
          <span class="summary-price">${this.fmt(item.price * item.quantity)}</span>
          <button class="btn-icon remove-item" data-id="${item.menuItemId}" title="Remove">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    `).join('');

    // Show tax/service if configured
    let extras = '';
    if (settings.taxRate > 0) extras += `<div class="summary-extra"><span>Tax (${settings.taxRate}%)</span><span>${this.fmt(tax)}</span></div>`;
    if (settings.serviceCharge > 0) extras += `<div class="summary-extra"><span>Service (${settings.serviceCharge}%)</span><span>${this.fmt(service)}</span></div>`;
    if (extras) container.innerHTML += `<div class="summary-extras">${extras}</div>`;

    document.getElementById('order-total').textContent = this.fmt(total);

    // Remove buttons
    container.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentOrder.items = this.currentOrder.items.filter(i => i.menuItemId !== btn.dataset.id);
        const activeTab = document.querySelector('#category-tabs .tab-btn.active');
        if (activeTab) this.renderMenuGrid(activeTab.dataset.cat);
        this.renderOrderSummary();
      });
    });
  },

  submitOrder() {
    if (!this.currentOrder || this.currentOrder.items.length === 0) {
      this.toast('Add items to the order first', 'warning');
      return;
    }
    const settings = Store.getSettings();
    const subtotal = this.currentOrder.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = subtotal * (settings.taxRate / 100);
    const service = subtotal * (settings.serviceCharge / 100);
    const total = subtotal + tax + service;

    const order = Store.addOrder({
      staffId: this.currentOrder.staffId,
      tableNumber: this.currentOrder.tableNumber,
      covers: this.currentOrder.covers,
      items: [...this.currentOrder.items],
      subtotal,
      totalCost: this.currentOrder.items.reduce((s, i) => s + (i.costPrice || 0) * i.quantity, 0),
      tax,
      serviceCharge: service,
      total,
      status: 'open',
    });

    this.toast(`Order #${order.id.slice(-5).toUpperCase()} created!`, 'success');
    this.currentOrder = null;
    this.renderNewOrder();
  },

  submitAndCloseOrder() {
    if (!this.currentOrder || this.currentOrder.items.length === 0) {
      this.toast('Add items to the order first', 'warning');
      return;
    }
    const settings = Store.getSettings();
    const subtotal = this.currentOrder.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = subtotal * (settings.taxRate / 100);
    const service = subtotal * (settings.serviceCharge / 100);
    const total = subtotal + tax + service;

    const order = Store.addOrder({
      staffId: this.currentOrder.staffId,
      tableNumber: this.currentOrder.tableNumber,
      covers: this.currentOrder.covers,
      items: [...this.currentOrder.items],
      subtotal,
      totalCost: this.currentOrder.items.reduce((s, i) => s + (i.costPrice || 0) * i.quantity, 0),
      tax,
      serviceCharge: service,
      total,
      status: 'closed',
      closedAt: (() => { const bd = Store.getBusinessDate(); const n = new Date(); return new Date(`${bd}T${n.toTimeString().split(' ')[0]}`).toISOString(); })(),
    });

    this.toast(`Order #${order.id.slice(-5).toUpperCase()} submitted & closed!`, 'success');
    this.currentOrder = null;
    this.renderNewOrder();
  },

  clearOrder() {
    this.currentOrder = null;
    this.renderNewOrder();
  },

  // ════════════════════════════════════════════════════════
  //  ACTIVE ORDERS
  // ════════════════════════════════════════════════════════
  renderOrders() {
    const orders = Store.getTodayOrders();
    const staff = Store.getStaff();
    const staffMap = {};
    staff.forEach(s => { staffMap[s.id] = s.name; });

    const container = document.getElementById('orders-list');
    const openOrders = orders.filter(o => o.status === 'open');
    const closedOrders = orders.filter(o => o.status === 'closed');

    if (orders.length === 0) {
      container.innerHTML = `<div class="empty-state">
        <i class="fa-solid fa-receipt"></i>
        <h3>No Orders Today</h3>
        <p>Create your first order to get started.</p>
      </div>`;
      return;
    }

    let html = '';

    if (openOrders.length > 0) {
      html += '<h3 class="section-subtitle"><i class="fa-solid fa-clock"></i> Open Orders</h3>';
      html += '<div class="orders-grid">';
      html += openOrders.map(o => this.renderOrderCard(o, staffMap)).join('');
      html += '</div>';
    }

    if (closedOrders.length > 0) {
      html += '<h3 class="section-subtitle" style="margin-top:1.5rem"><i class="fa-solid fa-check-circle"></i> Closed Orders</h3>';
      html += '<div class="orders-grid">';
      html += closedOrders.map(o => this.renderOrderCard(o, staffMap)).join('');
      html += '</div>';
    }

    container.innerHTML = html;

    // Bind actions
    container.querySelectorAll('.btn-close-order').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.closeOrder(btn.dataset.id);
        this.toast('Order closed', 'success');
        this.renderOrders();
      });
    });
    container.querySelectorAll('.btn-delete-order').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this order? This cannot be undone.')) {
          Store.deleteOrder(btn.dataset.id);
          this.toast('Order deleted', 'info');
          this.renderOrders();
        }
      });
    });
  },

  renderOrderCard(order, staffMap) {
    const time = new Date(order.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const isOpen = order.status === 'open';
    return `
      <div class="order-card ${isOpen ? 'order-open' : 'order-closed'}">
        <div class="order-card-header">
          <div>
            <span class="order-id">#${order.id.slice(-5).toUpperCase()}</span>
            <span class="order-badge ${isOpen ? 'badge-open' : 'badge-closed'}">${isOpen ? 'Open' : 'Closed'}</span>
          </div>
          <span class="order-time">${time}</span>
        </div>
        <div class="order-card-meta">
          <span><i class="fa-solid fa-user"></i> ${staffMap[order.staffId] || 'Unknown'}</span>
          <span><i class="fa-solid fa-chair"></i> Table ${order.tableNumber}</span>
          <span><i class="fa-solid fa-users"></i> ${order.covers} covers</span>
        </div>
        <div class="order-card-items">
          ${(order.items || []).map(i => `<div class="order-item-line"><span>${i.quantity}× ${i.name}</span><span>${this.fmt(i.price * i.quantity)}</span></div>`).join('')}
        </div>
        <div class="order-card-footer">
          <span class="order-total">Total: ${this.fmt(order.total)}</span>
          <div class="order-actions">
            ${isOpen ? `<button class="btn btn-sm btn-success btn-close-order" data-id="${order.id}"><i class="fa-solid fa-check"></i> Close</button>` : ''}
            <button class="btn btn-sm btn-danger btn-delete-order" data-id="${order.id}"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </div>`;
  },

  // ════════════════════════════════════════════════════════
  //  MENU MANAGEMENT
  // ════════════════════════════════════════════════════════
  renderMenu() {
    const categories = Store.getCategories().sort((a, b) => a.order - b.order);
    const menu = Store.getMenu();
    const container = document.getElementById('menu-management');

    let html = `<div class="menu-mgmt-header">
      <button class="btn btn-primary" id="btn-add-item"><i class="fa-solid fa-plus"></i> Add Item</button>
      <button class="btn btn-outline" id="btn-add-category"><i class="fa-solid fa-folder-plus"></i> Add Category</button>
      <button class="btn btn-outline btn-danger-outline" id="btn-reset-menu"><i class="fa-solid fa-rotate-left"></i> Reset to Defaults</button>
      <span class="vat-badge"><i class="fa-solid fa-percent"></i> VAT ${this.vatRate()}%</span>
    </div>`;

    const vr = this.vatRate();

    categories.forEach(cat => {
      const items = menu.filter(m => m.categoryId === cat.id);
      html += `
        <div class="menu-category-section">
          <div class="menu-category-header">
            <h3><i class="fa-solid ${cat.icon}"></i> ${cat.name} <span class="badge-count">${items.length}</span></h3>
            <div>
              <button class="btn btn-sm btn-outline btn-edit-cat" data-id="${cat.id}" title="Edit Category"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-sm btn-danger btn-delete-cat" data-id="${cat.id}" title="Delete Category"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
          <div class="menu-items-table">
            <table>
              <thead><tr>
                <th>Item</th>
                <th class="text-center">Price <small class="th-sub">(inc. VAT)</small></th>
                <th class="text-center">VAT <small class="th-sub">(${this.vatRate()}%)</small></th>
                <th class="text-center">Net <small class="th-sub">(ex. VAT)</small></th>
                <th class="text-center">Cost <small class="th-sub">(wholesale)</small></th>
                <th class="text-center">Profit</th>
                <th class="text-center">Margin</th>
                <th class="text-center">Status</th>
                <th class="text-center">Actions</th>
              </tr></thead>
              <tbody>
                ${items.length === 0 ? '<tr><td colspan="9" class="text-muted text-center">No items</td></tr>' : ''}
                ${items.map(item => {
                  const cost = item.costPrice || 0;
                  const net = this.netPrice(item.price);
                  const vatAmount = item.price - net;
                  const profit = net - cost;
                  const margin = net > 0 ? (profit / net * 100) : 0;
                  const marginClass = margin >= 65 ? 'margin-good' : margin >= 50 ? 'margin-warn' : 'margin-bad';
                  return `
                  <tr class="${item.active ? '' : 'inactive-row'}">
                    <td>${item.name}${(item.ingredients && item.ingredients.length > 0) ? '<span class="ingredient-count" title="' + item.ingredients.length + ' ingredients"><i class="fa-solid fa-leaf"></i> ' + item.ingredients.length + '</span>' : ''}</td>
                    <td class="text-center">${this.fmt(item.price)}</td>
                    <td class="text-center text-muted">${this.fmt(vatAmount)}</td>
                    <td class="text-center">${this.fmt(net)}</td>
                    <td class="text-center">${this.fmt(cost)}</td>
                    <td class="text-center ${profit >= 0 ? 'profit-positive' : 'profit-negative'}">${this.fmt(profit)}</td>
                    <td class="text-center"><span class="${marginClass}">${margin.toFixed(0)}%</span></td>
                    <td class="text-center">
                      <span class="status-dot ${item.active ? 'dot-active' : 'dot-inactive'}"></span>
                      ${item.active ? 'Active' : 'Inactive'}
                    </td>
                    <td class="text-center">
                      <button class="btn-icon btn-edit-item" data-id="${item.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                      <button class="btn-icon btn-toggle-item" data-id="${item.id}" title="${item.active ? 'Deactivate' : 'Activate'}">
                        <i class="fa-solid ${item.active ? 'fa-eye-slash' : 'fa-eye'}"></i>
                      </button>
                      <button class="btn-icon btn-delete-item" data-id="${item.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
    });

    container.innerHTML = html;

    // Bind events
    document.getElementById('btn-add-item')?.addEventListener('click', () => this.showItemModal());
    document.getElementById('btn-add-category')?.addEventListener('click', () => this.showCategoryModal());
    document.getElementById('btn-reset-menu')?.addEventListener('click', () => {
      if (confirm('Reset menu to default items? This will remove all custom items.')) {
        Store.resetMenuToDefaults();
        this.toast('Menu reset to defaults', 'info');
        this.renderMenu();
      }
    });

    container.querySelectorAll('.btn-edit-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = Store.getMenu().find(i => i.id === btn.dataset.id);
        if (item) this.showItemModal(item);
      });
    });
    container.querySelectorAll('.btn-toggle-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = Store.getMenu().find(i => i.id === btn.dataset.id);
        if (item) {
          Store.updateMenuItem(btn.dataset.id, { active: !item.active });
          this.renderMenu();
        }
      });
    });
    container.querySelectorAll('.btn-delete-item').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this item?')) {
          Store.deleteMenuItem(btn.dataset.id);
          this.toast('Item deleted', 'info');
          this.renderMenu();
        }
      });
    });
    container.querySelectorAll('.btn-edit-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = Store.getCategories().find(c => c.id === btn.dataset.id);
        if (cat) this.showCategoryModal(cat);
      });
    });
    container.querySelectorAll('.btn-delete-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this category and ALL its items?')) {
          Store.deleteCategory(btn.dataset.id);
          this.toast('Category deleted', 'info');
          this.renderMenu();
        }
      });
    });
  },

  showItemModal(item = null) {
    const categories = Store.getCategories();
    const isEdit = !!item;
    const ingredients = isEdit && item.ingredients ? [...item.ingredients] : [];
    const modal = document.getElementById('modal');

    function renderIngredients() {
      const list = modal.querySelector('#ingredient-list');
      if (!list) return;
      if (ingredients.length === 0) {
        list.innerHTML = '<p class="text-muted" style="font-size:.82rem;">No ingredients added yet</p>';
      } else {
        list.innerHTML = ingredients.map((ing, idx) => `
          <div class="ingredient-tag">
            <span>${ing.name} ${ing.qty ? '<em class="ing-qty">(' + ing.qty + ')</em>' : ''} — ${App.fmt(ing.cost)} <small class="text-muted">(ex-VAT)</small></span>
            <button class="ingredient-remove" data-idx="${idx}" title="Remove">&times;</button>
          </div>
        `).join('');
        list.querySelectorAll('.ingredient-remove').forEach(btn => {
          btn.addEventListener('click', () => {
            ingredients.splice(parseInt(btn.dataset.idx), 1);
            renderIngredients();
            updateCostSummary();
          });
        });
      }
    }

    function updateCostSummary() {
      const totalCost = ingredients.reduce((s, i) => s + i.cost, 0);
      const costEl = modal.querySelector('#ingredient-total-cost');
      const marginEl = modal.querySelector('#ingredient-margin');
      const costInput = modal.querySelector('#modal-item-cost');
      if (costEl) costEl.textContent = App.fmt(totalCost);
      if (costInput) costInput.value = totalCost.toFixed(2);
      const price = parseFloat(modal.querySelector('#modal-item-price')?.value) || 0;
      const vatPct = App.vatRate();
      const net = vatPct > 0 ? price / (1 + vatPct / 100) : price;
      const vatAmount = price - net;
      const profit = net - totalCost;
      const margin = net > 0 ? (profit / net * 100) : 0;

      // Update VAT breakdown
      const netEl = modal.querySelector('#vat-net-price');
      const vatEl = modal.querySelector('#vat-amount');
      const profitEl = modal.querySelector('#vat-profit');
      const suggestedEl = modal.querySelector('#vat-suggested');
      if (netEl) netEl.textContent = App.fmt(net);
      if (vatEl) vatEl.textContent = App.fmt(vatAmount);
      if (profitEl) {
        profitEl.textContent = App.fmt(profit);
        profitEl.className = profit >= 0 ? 'profit-positive' : 'profit-negative';
      }
      // Suggested price: target 30% food cost (70% margin) → sell at cost/0.30 * (1 + vat/100)
      if (suggestedEl) {
        const suggested = totalCost > 0 ? (totalCost / 0.30) * (1 + vatPct / 100) : 0;
        suggestedEl.textContent = App.fmt(suggested);
      }
      if (marginEl) {
        marginEl.textContent = margin.toFixed(1) + '%';
        marginEl.className = margin >= 65 ? 'margin-good' : margin >= 50 ? 'margin-warn' : 'margin-bad';
      }
    }

    modal.innerHTML = `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-box" style="max-width:520px;">
          <h3>${isEdit ? 'Edit Item' : 'Add New Item'}</h3>
          <div class="form-group">
            <label>Item Name</label>
            <input type="text" id="modal-item-name" value="${isEdit ? item.name.replace(/"/g,'&quot;') : ''}" placeholder="e.g. Grilled Salmon" />
          </div>
          <div class="form-group">
            <label>Category</label>
            <select id="modal-item-cat">
              ${categories.map(c => `<option value="${c.id}" ${isEdit && item.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-row" style="gap:.75rem;">
            <div class="form-group" style="flex:1">
              <label>Selling Price inc. VAT (${this.currency()})</label>
              <input type="number" step="0.50" min="0" id="modal-item-price" value="${isEdit ? item.price : ''}" placeholder="0.00" />
            </div>
            <div class="form-group" style="flex:1">
              <label>Total Cost ex-VAT (${this.currency()})</label>
              <input type="number" step="0.01" min="0" id="modal-item-cost" value="${isEdit ? (item.costPrice || 0).toFixed(2) : '0.00'}" placeholder="0.00" readonly style="opacity:.7;cursor:default;" />
            </div>
          </div>

          <div class="form-group" style="margin-top:.5rem;">
            <label><i class="fa-solid fa-leaf"></i> Ingredients <small class="text-muted">(from Pantry — cost auto-calculated)</small></label>
            <div class="ingredient-input-row" style="position:relative;">
              <div style="flex:2;position:relative;">
                <input type="text" id="ing-name" placeholder="Search pantry..." autocomplete="off" />
                <div id="ing-autocomplete" class="ing-autocomplete hidden"></div>
              </div>
              <input type="number" step="0.1" min="0" id="ing-qty" placeholder="Qty" style="flex:1;max-width:80px;" />
              <span id="ing-unit-label" class="ing-unit-label"></span>
              <input type="number" step="0.01" min="0" id="ing-cost" placeholder="Cost" style="flex:1;max-width:80px;" readonly tabindex="-1" />
              <button class="btn btn-sm btn-primary" id="btn-add-ingredient" type="button"><i class="fa-solid fa-plus"></i></button>
            </div>
            <div id="ingredient-list" style="margin-top:.5rem;"></div>
            <div class="cost-summary" style="margin-top:.5rem;">
              <div class="cost-summary-row">
                <span><i class="fa-solid fa-boxes-stacked"></i> Ingredient Cost (ex-VAT):</span>
                <span id="ingredient-total-cost">${this.currency()}0.00</span>
              </div>
              <hr style="border-color:var(--border);margin:.35rem 0;" />
              <div class="cost-summary-row">
                <span><i class="fa-solid fa-receipt"></i> Net Revenue (ex-VAT):</span>
                <span id="vat-net-price">${this.currency()}0.00</span>
              </div>
              <div class="cost-summary-row">
                <span><i class="fa-solid fa-percent"></i> VAT (${this.vatRate()}%):</span>
                <span id="vat-amount">${this.currency()}0.00</span>
              </div>
              <div class="cost-summary-row">
                <span><i class="fa-solid fa-coins"></i> Profit (net − cost):</span>
                <span id="vat-profit" class="profit-positive">${this.currency()}0.00</span>
              </div>
              <div class="cost-summary-row">
                <span><i class="fa-solid fa-chart-line"></i> Real Margin:</span>
                <span id="ingredient-margin" class="margin-good">0%</span>
              </div>
              <hr style="border-color:var(--border);margin:.35rem 0;" />
              <div class="cost-summary-row text-muted" style="font-size:.78rem;">
                <span><i class="fa-solid fa-lightbulb"></i> Suggested price (70% target margin):</span>
                <span id="vat-suggested">${this.currency()}0.00</span>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn btn-outline" id="modal-cancel">Cancel</button>
            <button class="btn btn-primary" id="modal-save">${isEdit ? 'Update' : 'Add Item'}</button>
          </div>
        </div>
      </div>`;
    modal.classList.remove('hidden');

    renderIngredients();
    updateCostSummary();

    // ── Pantry autocomplete wiring ──
    let selectedPantryItem = null;
    const nameInput = modal.querySelector('#ing-name');
    const acContainer = modal.querySelector('#ing-autocomplete');
    const qtyInput = modal.querySelector('#ing-qty');
    const costInput = modal.querySelector('#ing-cost');
    const unitLabel = modal.querySelector('#ing-unit-label');
    const pantryList = Store.getPantry();

    function showAutocomplete(term) {
      if (!term) { acContainer.classList.add('hidden'); return; }
      const matches = pantryList.filter(p => p.name.toLowerCase().includes(term.toLowerCase())).slice(0, 12);
      if (matches.length === 0) { acContainer.classList.add('hidden'); return; }
      acContainer.innerHTML = matches.map(p => {
        const uc = p.recipeUnitsPerPack > 0 ? p.packCost / p.recipeUnitsPerPack : 0;
        return `<div class="ac-option" data-id="${p.id}">
          <span class="ac-name">${p.name}</span>
          <span class="ac-detail">${App.fmtUnit(uc)} / ${p.recipeUnit}</span>
        </div>`;
      }).join('');
      acContainer.classList.remove('hidden');
      acContainer.querySelectorAll('.ac-option').forEach(opt => {
        opt.addEventListener('mousedown', (e) => {
          e.preventDefault();
          const pi = pantryList.find(pp => pp.id === opt.dataset.id);
          if (pi) selectPantryItem(pi);
        });
      });
    }

    function selectPantryItem(pi) {
      selectedPantryItem = pi;
      nameInput.value = pi.name;
      unitLabel.textContent = pi.recipeUnit;
      acContainer.classList.add('hidden');
      recalcIngCost();
      qtyInput.focus();
    }

    function recalcIngCost() {
      if (!selectedPantryItem) { costInput.value = ''; return; }
      const qty = parseFloat(qtyInput.value) || 0;
      const uc = selectedPantryItem.recipeUnitsPerPack > 0
        ? selectedPantryItem.packCost / selectedPantryItem.recipeUnitsPerPack : 0;
      costInput.value = (qty * uc).toFixed(2);
    }

    nameInput.addEventListener('input', () => {
      selectedPantryItem = null;
      unitLabel.textContent = '';
      showAutocomplete(nameInput.value.trim());
    });
    nameInput.addEventListener('blur', () => {
      setTimeout(() => acContainer.classList.add('hidden'), 200);
    });
    qtyInput.addEventListener('input', recalcIngCost);

    // Add ingredient button
    modal.querySelector('#btn-add-ingredient').onclick = () => {
      const ingName = nameInput.value.trim();
      const qty = parseFloat(qtyInput.value);
      const ingCost = parseFloat(costInput.value);
      if (!ingName || isNaN(qty) || qty <= 0 || isNaN(ingCost)) {
        App.toast('Select an ingredient and enter quantity', 'warning');
        return;
      }
      const ing = { name: ingName, cost: ingCost };
      const unit = selectedPantryItem ? selectedPantryItem.recipeUnit : '';
      ing.qty = qty + (unit ? unit : '');
      if (selectedPantryItem) ing.pantryId = selectedPantryItem.id;
      ingredients.push(ing);
      nameInput.value = '';
      qtyInput.value = '';
      costInput.value = '';
      unitLabel.textContent = '';
      selectedPantryItem = null;
      nameInput.focus();
      renderIngredients();
      updateCostSummary();
    };

    // Update margin when price changes
    modal.querySelector('#modal-item-price').addEventListener('input', updateCostSummary);

    document.getElementById('modal-cancel').onclick = () => modal.classList.add('hidden');
    document.getElementById('modal-overlay').onclick = (e) => { if (e.target.id === 'modal-overlay') modal.classList.add('hidden'); };
    document.getElementById('modal-save').onclick = () => {
      const name = document.getElementById('modal-item-name').value.trim();
      const categoryId = document.getElementById('modal-item-cat').value;
      const price = parseFloat(document.getElementById('modal-item-price').value);
      const costPrice = ingredients.reduce((s, i) => s + i.cost, 0);
      if (!name || isNaN(price) || price < 0) { this.toast('Please fill all fields correctly', 'warning'); return; }
      if (isEdit) {
        Store.updateMenuItem(item.id, { name, categoryId, price, costPrice, ingredients: [...ingredients] });
        this.toast('Item updated', 'success');
      } else {
        Store.addMenuItem({ name, categoryId, price, costPrice, ingredients: [...ingredients] });
        this.toast('Item added', 'success');
      }
      modal.classList.add('hidden');
      this.renderMenu();
    };
  },

  showCategoryModal(cat = null) {
    const isEdit = !!cat;
    const icons = ['fa-seedling','fa-utensils','fa-ice-cream','fa-glass-water','fa-wine-glass','fa-wine-bottle','fa-beer-mug-empty','fa-mug-hot','fa-burger','fa-pizza-slice','fa-fish','fa-drumstick-bite','fa-martini-glass','fa-champagne-glasses','fa-cookie','fa-bowl-rice','fa-jar','fa-lemon','fa-pepper-hot','fa-cheese'];
    const modal = document.getElementById('modal');
    modal.innerHTML = `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-box">
          <h3>${isEdit ? 'Edit Category' : 'Add New Category'}</h3>
          <div class="form-group">
            <label>Category Name</label>
            <input type="text" id="modal-cat-name" value="${isEdit ? cat.name : ''}" placeholder="e.g. Appetizers" />
          </div>
          <div class="form-group">
            <label>Icon</label>
            <div class="icon-picker">
              ${icons.map(ic => `<button class="icon-btn ${isEdit && cat.icon === ic ? 'selected' : ''}" data-icon="${ic}"><i class="fa-solid ${ic}"></i></button>`).join('')}
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-outline" id="modal-cancel">Cancel</button>
            <button class="btn btn-primary" id="modal-save">${isEdit ? 'Update' : 'Add Category'}</button>
          </div>
        </div>
      </div>`;
    modal.classList.remove('hidden');

    let selectedIcon = isEdit ? cat.icon : icons[0];
    modal.querySelectorAll('.icon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedIcon = btn.dataset.icon;
      });
    });

    document.getElementById('modal-cancel').onclick = () => modal.classList.add('hidden');
    document.getElementById('modal-overlay').onclick = (e) => { if (e.target.id === 'modal-overlay') modal.classList.add('hidden'); };
    document.getElementById('modal-save').onclick = () => {
      const name = document.getElementById('modal-cat-name').value.trim();
      if (!name) { this.toast('Enter a category name', 'warning'); return; }
      if (isEdit) {
        Store.updateCategory(cat.id, { name, icon: selectedIcon });
        this.toast('Category updated', 'success');
      } else {
        Store.addCategory({ name, icon: selectedIcon });
        this.toast('Category added', 'success');
      }
      modal.classList.add('hidden');
      this.renderMenu();
    };
  },

  // ════════════════════════════════════════════════════════
  //  PANTRY — Ingredient Inventory
  // ════════════════════════════════════════════════════════
  _pantrySearch: '',

  renderPantry() {
    const pantry = Store.getPantry();
    const container = document.getElementById('pantry-management');
    const search = this._pantrySearch || '';
    const filtered = search
      ? pantry.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      : pantry;

    // Group by first letter
    const groups = {};
    filtered.forEach(p => {
      const letter = p.name[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(p);
    });
    const letters = Object.keys(groups).sort();

    let html = `
      <div class="pantry-header">
        <button class="btn btn-primary" id="btn-add-pantry"><i class="fa-solid fa-plus"></i> Add Ingredient</button>
        <button class="btn btn-outline btn-danger-outline" id="btn-reset-pantry"><i class="fa-solid fa-rotate-left"></i> Reset to Defaults</button>
        <div class="pantry-search-box">
          <i class="fa-solid fa-search"></i>
          <input type="text" id="pantry-search" placeholder="Search ingredients..." value="${search.replace(/"/g,'&quot;')}" />
        </div>
        <span class="badge-count" style="margin-left:auto;font-size:.85rem;">${filtered.length} / ${pantry.length} items</span>
      </div>`;

    if (filtered.length === 0) {
      html += `<div class="empty-state">
        <i class="fa-solid fa-warehouse"></i>
        <h3>${search ? 'No matching ingredients' : 'Pantry Empty'}</h3>
        <p>${search ? 'Try a different search term.' : 'Add ingredients to start tracking your inventory costs.'}</p>
      </div>`;
    } else {
      html += `<div class="pantry-table-wrap">
        <table class="pantry-table">
          <thead><tr>
            <th>Ingredient</th>
            <th class="text-center">Pack Size</th>
            <th class="text-center">Pack Cost</th>
            <th class="text-center">Recipe Unit</th>
            <th class="text-center">Units / Pack</th>
            <th class="text-center">Unit Cost</th>
            <th class="text-center">Actions</th>
          </tr></thead>
          <tbody>`;

      letters.forEach(letter => {
        html += `<tr class="pantry-letter-row"><td colspan="7">${letter}</td></tr>`;
        groups[letter].forEach(p => {
          const unitCost = p.recipeUnitsPerPack > 0 ? p.packCost / p.recipeUnitsPerPack : 0;
          html += `
            <tr>
              <td class="pantry-item-name">${p.name}</td>
              <td class="text-center">${p.packSize} ${p.packUnit}</td>
              <td class="text-center">${this.fmt(p.packCost)}</td>
              <td class="text-center">${p.recipeUnit}</td>
              <td class="text-center">${p.recipeUnitsPerPack}</td>
              <td class="text-center pantry-unit-cost">${this.fmtUnit(unitCost)}/${p.recipeUnit}</td>
              <td class="text-center">
                <button class="btn-icon btn-edit-pantry" data-id="${p.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon btn-delete-pantry" data-id="${p.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>`;
        });
      });

      html += `</tbody></table></div>`;
    }

    container.innerHTML = html;

    // Bind
    document.getElementById('btn-add-pantry')?.addEventListener('click', () => this.showPantryModal());
    document.getElementById('btn-reset-pantry')?.addEventListener('click', () => {
      if (confirm('Reset pantry to default 247 ingredients? Custom items will be lost.')) {
        Store.resetPantryToDefaults();
        this._pantrySearch = '';
        this.toast('Pantry reset to defaults', 'info');
        this.renderPantry();
      }
    });

    const searchInput = document.getElementById('pantry-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this._pantrySearch = searchInput.value;
        this.renderPantry();
      });
      if (search) searchInput.focus();
    }

    container.querySelectorAll('.btn-edit-pantry').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = Store.getPantry().find(p => p.id === btn.dataset.id);
        if (item) this.showPantryModal(item);
      });
    });
    container.querySelectorAll('.btn-delete-pantry').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this ingredient?')) {
          Store.deletePantryItem(btn.dataset.id);
          this.toast('Ingredient deleted', 'info');
          this.renderPantry();
        }
      });
    });
  },

  showPantryModal(item = null) {
    const isEdit = !!item;
    const modal = document.getElementById('modal');

    function calcUnitCost() {
      const packCost = parseFloat(modal.querySelector('#pantry-pack-cost')?.value) || 0;
      const unitsPerPack = parseFloat(modal.querySelector('#pantry-units-per-pack')?.value) || 0;
      const el = modal.querySelector('#pantry-unit-cost-display');
      const recipeUnit = modal.querySelector('#pantry-recipe-unit')?.value || '';
      if (el) {
        const uc = unitsPerPack > 0 ? packCost / unitsPerPack : 0;
        el.textContent = App.fmtUnit(uc) + (recipeUnit ? ' / ' + recipeUnit : '');
      }
    }

    modal.innerHTML = `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-box" style="max-width:460px;">
          <h3>${isEdit ? 'Edit Ingredient' : 'Add Ingredient'}</h3>
          <div class="form-group">
            <label>Ingredient Name</label>
            <input type="text" id="pantry-name" value="${isEdit ? item.name.replace(/"/g,'&quot;') : ''}" placeholder="e.g. Olive oil" />
          </div>
          <div class="form-row" style="gap:.75rem;">
            <div class="form-group" style="flex:1">
              <label>Pack Size</label>
              <input type="number" step="0.01" min="0" id="pantry-pack-size" value="${isEdit ? item.packSize : '1'}" />
            </div>
            <div class="form-group" style="flex:1">
              <label>Pack Unit</label>
              <input type="text" id="pantry-pack-unit" value="${isEdit ? item.packUnit : ''}" placeholder="e.g. bottle, bag, kg" />
            </div>
          </div>
          <div class="form-group">
            <label>Pack Cost (${this.currency()})</label>
            <input type="number" step="0.01" min="0" id="pantry-pack-cost" value="${isEdit ? item.packCost.toFixed(2) : ''}" placeholder="0.00" />
          </div>
          <div class="form-row" style="gap:.75rem;">
            <div class="form-group" style="flex:1">
              <label>Recipe Unit</label>
              <input type="text" id="pantry-recipe-unit" value="${isEdit ? item.recipeUnit : ''}" placeholder="e.g. ml, g, pc" />
            </div>
            <div class="form-group" style="flex:1">
              <label>Recipe Units / Pack</label>
              <input type="number" step="0.01" min="0" id="pantry-units-per-pack" value="${isEdit ? item.recipeUnitsPerPack : ''}" placeholder="e.g. 1000" />
            </div>
          </div>
          <div class="pantry-unit-cost-display">
            <i class="fa-solid fa-calculator"></i> Unit Cost: <strong id="pantry-unit-cost-display">${this.currency()}0.0000</strong>
          </div>
          <div class="modal-actions">
            <button class="btn btn-outline" id="modal-cancel">Cancel</button>
            <button class="btn btn-primary" id="modal-save">${isEdit ? 'Update' : 'Add Ingredient'}</button>
          </div>
        </div>
      </div>`;
    modal.classList.remove('hidden');

    // Live unit cost
    ['pantry-pack-cost', 'pantry-units-per-pack', 'pantry-recipe-unit'].forEach(id => {
      modal.querySelector('#' + id)?.addEventListener('input', calcUnitCost);
    });
    calcUnitCost();

    document.getElementById('modal-cancel').onclick = () => modal.classList.add('hidden');
    document.getElementById('modal-overlay').onclick = (e) => { if (e.target.id === 'modal-overlay') modal.classList.add('hidden'); };
    document.getElementById('modal-save').onclick = () => {
      const name = modal.querySelector('#pantry-name').value.trim();
      const packSize = parseFloat(modal.querySelector('#pantry-pack-size').value) || 1;
      const packUnit = modal.querySelector('#pantry-pack-unit').value.trim();
      const packCost = parseFloat(modal.querySelector('#pantry-pack-cost').value);
      const recipeUnit = modal.querySelector('#pantry-recipe-unit').value.trim();
      const recipeUnitsPerPack = parseFloat(modal.querySelector('#pantry-units-per-pack').value);
      if (!name || isNaN(packCost) || !recipeUnit || isNaN(recipeUnitsPerPack)) {
        App.toast('Fill all fields correctly', 'warning');
        return;
      }
      const obj = { name, packSize, packUnit, packCost, recipeUnit, recipeUnitsPerPack };
      if (isEdit) {
        Store.updatePantryItem(item.id, obj);
        App.toast('Ingredient updated', 'success');
      } else {
        Store.addPantryItem(obj);
        App.toast('Ingredient added', 'success');
      }
      modal.classList.add('hidden');
      App.renderPantry();
    };
  },

  // ════════════════════════════════════════════════════════
  //  STAFF MANAGEMENT
  // ════════════════════════════════════════════════════════
  renderStaff() {
    const staff = Store.getStaff();
    const container = document.getElementById('staff-management');
    const clockedIn = Store.getClockedInStaff();
    const timeRecs = Store.getTimeClock();

    // ── On-Duty panel ──
    const onDuty = staff.filter(s => clockedIn.includes(s.id));
    let html = `<div class="staff-header">
      <button class="btn btn-primary" id="btn-add-staff"><i class="fa-solid fa-user-plus"></i> Add Staff Member</button>
    </div>`;

    // Clocked-in summary bar
    html += `<div class="clock-summary">
      <div class="clock-summary-icon"><i class="fa-solid fa-user-clock"></i></div>
      <div class="clock-summary-text">
        <strong>${onDuty.length}</strong> staff on duty right now
      </div>
      ${onDuty.length > 0 ? `<div class="clock-summary-names">${onDuty.map(s => s.name.split(' ')[0]).join(', ')}</div>` : ''}
    </div>`;

    if (staff.length === 0) {
      html += `<div class="empty-state">
        <i class="fa-solid fa-users"></i>
        <h3>No Staff Members</h3>
        <p>Add your team members to start tracking their performance.</p>
      </div>`;
    } else {
      html += '<div class="staff-grid">';
      html += staff.map(s => {
        const isClocked = clockedIn.includes(s.id);
        const openRec = timeRecs.find(r => r.staffId === s.id && !r.clockOut);
        const clockInTime = openRec ? new Date(openRec.clockIn).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';
        const staffRecs = timeRecs.filter(r => r.staffId === s.id);
        const pendingCount = staffRecs.filter(r => (r.status || 'pending') === 'pending' && r.clockOut).length;
        return `
        <div class="staff-card ${s.active ? '' : 'staff-inactive'} ${isClocked ? 'staff-clocked-in' : ''}">
          <div class="staff-avatar ${isClocked ? 'avatar-on-duty' : ''}">${s.name.split(' ').map(n => n[0]).join('').toUpperCase()}</div>
          <div class="staff-info">
            <h4 class="staff-name-link" data-id="${s.id}">${s.name}</h4>
            <span class="staff-role">${s.role || 'Server'}</span>
            ${isClocked
              ? `<span class="status-dot dot-clocked-in"><i class="fa-solid fa-circle-dot"></i> On duty since ${clockInTime}</span>`
              : `<span class="status-dot ${s.active ? 'dot-active' : 'dot-inactive'}">${s.active ? 'Off duty' : 'Inactive'}</span>`}
            ${pendingCount > 0 ? `<span class="badge-pending-count">${pendingCount} pending</span>` : ''}
          </div>
          <div class="staff-actions">
            ${s.active ? (isClocked
              ? `<button class="btn btn-sm btn-clock-out" data-id="${s.id}" title="Clock Out"><i class="fa-solid fa-right-from-bracket"></i> Out</button>`
              : `<button class="btn btn-sm btn-clock-in" data-id="${s.id}" title="Clock In"><i class="fa-solid fa-right-to-bracket"></i> In</button>`
            ) : ''}
            <button class="btn-icon btn-edit-staff" data-id="${s.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-icon btn-toggle-staff" data-id="${s.id}" title="${s.active ? 'Deactivate' : 'Activate'}">
              <i class="fa-solid ${s.active ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
            </button>
            <button class="btn-icon btn-delete-staff" data-id="${s.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>`;
      }).join('');
      html += '</div>';
    }

    // ── Today's Timesheet ──
    if (timeRecs.length > 0) {
      const timesheet = Store.buildTimesheet(timeRecs, staff);
      const totalHours = timesheet.reduce((s, t) => s + t.totalHours, 0);
      const approvedHours = timesheet.reduce((s, t) => s + t.approvedHours, 0);
      html += `
      <div class="timesheet-section">
        <h3><i class="fa-solid fa-clipboard-list"></i> Today's Timesheet</h3>
        <table class="report-table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th class="text-center">Clock In</th>
              <th class="text-center">Clock Out</th>
              <th class="text-right">Hours</th>
              <th class="text-center">Open Tables</th>
              <th class="text-center">Status</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${timesheet.map(t => t.shifts.map(sh => {
              const inTime = new Date(sh.clockIn).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
              const outTime = sh.clockOut ? new Date(sh.clockOut).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—';
              const hrs = sh.hours;
              const isOpen = !sh.clockOut;
              const st = sh.status || 'pending';
              const statusBadge = isOpen
                ? '<span class="badge-on-duty">On Duty</span>'
                : st === 'approved' ? '<span class="badge-approved">Approved</span>'
                : st === 'declined' ? '<span class="badge-declined">Declined</span>'
                : '<span class="badge-pending">Pending</span>';
              const actions = (!isOpen && st === 'pending') ? `
                <button class="btn-icon btn-approve-shift" data-rec="${sh.id}" title="Approve"><i class="fa-solid fa-check"></i></button>
                <button class="btn-icon btn-decline-shift" data-rec="${sh.id}" title="Decline"><i class="fa-solid fa-xmark"></i></button>
              ` : '';
              return `<tr>
                <td class="staff-name-link" data-id="${t.staffId}" style="cursor:pointer">${t.name}</td>
                <td class="text-center">${inTime}</td>
                <td class="text-center">${outTime}</td>
                <td class="text-right">${hrs.toFixed(2)}h</td>
                <td class="text-center">${isOpen ? '—' : (sh.openTables || 0)}</td>
                <td class="text-center">${statusBadge}</td>
                <td class="text-center">${actions}</td>
              </tr>`;
            }).join('')).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3"><strong>Total</strong></td>
              <td class="text-right"><strong>${totalHours.toFixed(2)}h</strong></td>
              <td></td>
              <td class="text-center text-muted">${approvedHours.toFixed(2)}h approved</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>`;
    }

    container.innerHTML = html;

    // ── Event bindings ──
    document.getElementById('btn-add-staff')?.addEventListener('click', () => this.showStaffModal());

    // Click staff name → detail modal
    container.querySelectorAll('.staff-name-link').forEach(el => {
      el.addEventListener('click', () => this.showStaffDetail(el.dataset.id));
    });

    // Approve / Decline shifts inline
    container.querySelectorAll('.btn-approve-shift').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.approveShift(btn.dataset.rec);
        this.toast('Shift approved', 'success');
        this.renderStaff();
      });
    });
    container.querySelectorAll('.btn-decline-shift').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.declineShift(btn.dataset.rec);
        this.toast('Shift declined', 'info');
        this.renderStaff();
      });
    });

    // Clock in/out
    container.querySelectorAll('.btn-clock-in').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.clockIn(btn.dataset.id);
        const member = staff.find(s => s.id === btn.dataset.id);
        this.toast(`${member?.name || 'Staff'} clocked in`, 'success');
        this.renderStaff();
      });
    });
    container.querySelectorAll('.btn-clock-out').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.clockOut(btn.dataset.id);
        const member = staff.find(s => s.id === btn.dataset.id);
        this.toast(`${member?.name || 'Staff'} clocked out`, 'info');
        this.renderStaff();
      });
    });

    container.querySelectorAll('.btn-edit-staff').forEach(btn => {
      btn.addEventListener('click', () => {
        const member = Store.getStaff().find(s => s.id === btn.dataset.id);
        if (member) this.showStaffModal(member);
      });
    });
    container.querySelectorAll('.btn-toggle-staff').forEach(btn => {
      btn.addEventListener('click', () => {
        const member = Store.getStaff().find(s => s.id === btn.dataset.id);
        if (member) {
          Store.updateStaffMember(btn.dataset.id, { active: !member.active });
          this.renderStaff();
        }
      });
    });
    container.querySelectorAll('.btn-delete-staff').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Remove this staff member?')) {
          Store.deleteStaffMember(btn.dataset.id);
          this.toast('Staff member removed', 'info');
          this.renderStaff();
        }
      });
    });
  },

  /** Staff detail modal — all shifts, approve/decline, edit times */
  showStaffDetail(staffId) {
    const staff = Store.getStaff();
    const member = staff.find(s => s.id === staffId);
    if (!member) return;
    const timeRecs = Store.getTimeClock().filter(r => r.staffId === staffId);
    const orders = Store.getOrders();
    const openOrders = orders.filter(o => o.staffId === staffId && o.status === 'open');
    const closedToday = orders.filter(o => o.staffId === staffId && o.status === 'closed');
    const isClocked = Store.isClockedIn(staffId);

    let totalHours = 0;
    let approvedHours = 0;
    timeRecs.forEach(r => {
      const ms = (r.clockOut ? new Date(r.clockOut) : new Date()) - new Date(r.clockIn);
      const h = ms / 3600000;
      totalHours += h;
      if (r.status === 'approved') approvedHours += h;
    });

    const modal = document.getElementById('modal');
    modal.innerHTML = `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-box modal-wide">
          <div class="staff-detail-header">
            <div class="staff-avatar ${isClocked ? 'avatar-on-duty' : ''}" style="width:56px;height:56px;font-size:1.1rem;">
              ${member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <h3>${member.name}</h3>
              <span class="staff-role">${member.role || 'Server'}</span>
              ${isClocked ? '<span class="badge-on-duty" style="margin-left:.5rem">On Duty</span>' : ''}
            </div>
          </div>

          <div class="staff-detail-stats">
            <div class="detail-stat">
              <span class="detail-stat-val">${totalHours.toFixed(2)}h</span>
              <span class="detail-stat-label">Total Hours</span>
            </div>
            <div class="detail-stat">
              <span class="detail-stat-val">${approvedHours.toFixed(2)}h</span>
              <span class="detail-stat-label">Approved</span>
            </div>
            <div class="detail-stat">
              <span class="detail-stat-val">${timeRecs.length}</span>
              <span class="detail-stat-label">Shifts</span>
            </div>
            <div class="detail-stat">
              <span class="detail-stat-val">${openOrders.length}</span>
              <span class="detail-stat-label">Open Tables</span>
            </div>
            <div class="detail-stat">
              <span class="detail-stat-val">${closedToday.length}</span>
              <span class="detail-stat-label">Orders Today</span>
            </div>
          </div>

          ${timeRecs.length > 0 ? `
          <h4 style="margin:1rem 0 .5rem"><i class="fa-solid fa-clock"></i> Shift Records</h4>
          <table class="report-table">
            <thead>
              <tr>
                <th class="text-center">Clock In</th>
                <th class="text-center">Clock Out</th>
                <th class="text-right">Hours</th>
                <th class="text-center">Open Tables</th>
                <th class="text-center">Status</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${timeRecs.map(r => {
                const inTime = new Date(r.clockIn).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                const outTime = r.clockOut ? new Date(r.clockOut).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—';
                const ms = (r.clockOut ? new Date(r.clockOut) : new Date()) - new Date(r.clockIn);
                const hrs = (ms / 3600000).toFixed(2);
                const isOpen = !r.clockOut;
                const st = r.status || 'pending';
                const statusBadge = isOpen ? '<span class="badge-on-duty">On Duty</span>'
                  : st === 'approved' ? '<span class="badge-approved">Approved</span>'
                  : st === 'declined' ? '<span class="badge-declined">Declined</span>'
                  : '<span class="badge-pending">Pending</span>';
                // Extract HH:MM for time inputs
                const inVal = r.clockIn.slice(11, 16);
                const outVal = r.clockOut ? r.clockOut.slice(11, 16) : '';
                return `<tr>
                  <td class="text-center">
                    <input type="time" class="shift-time-input" data-rec="${r.id}" data-field="clockIn" value="${inVal}" ${st === 'approved' ? 'disabled' : ''} />
                  </td>
                  <td class="text-center">
                    ${r.clockOut ? `<input type="time" class="shift-time-input" data-rec="${r.id}" data-field="clockOut" value="${outVal}" ${st === 'approved' ? 'disabled' : ''} />` : '—'}
                  </td>
                  <td class="text-right">${hrs}h</td>
                  <td class="text-center">${isOpen ? '—' : (r.openTables || 0)}</td>
                  <td class="text-center">${statusBadge}</td>
                  <td class="text-center">
                    ${!isOpen && st !== 'approved' ? `<button class="btn btn-sm btn-approve-detail" data-rec="${r.id}"><i class="fa-solid fa-check"></i> Approve</button>` : ''}
                    ${!isOpen && st !== 'declined' ? `<button class="btn btn-sm btn-decline-detail" data-rec="${r.id}" style="margin-left:.3rem"><i class="fa-solid fa-xmark"></i> Decline</button>` : ''}
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>` : '<p class="text-muted" style="margin-top:1rem;">No shifts recorded today.</p>'}

          <div class="modal-actions" style="margin-top:1.2rem;">
            <button class="btn btn-outline" id="modal-cancel">Close</button>
          </div>
        </div>
      </div>`;
    modal.classList.remove('hidden');

    // Close modal
    document.getElementById('modal-cancel').onclick = () => modal.classList.add('hidden');
    document.getElementById('modal-overlay').onclick = (e) => { if (e.target.id === 'modal-overlay') modal.classList.add('hidden'); };

    // Time adjustments
    modal.querySelectorAll('.shift-time-input').forEach(input => {
      input.addEventListener('change', () => {
        const recId = input.dataset.rec;
        const field = input.dataset.field;
        const rec = Store.getTimeClock().find(r => r.id === recId);
        if (!rec) return;
        const dateBase = rec[field] ? rec[field].slice(0, 10) : rec.clockIn.slice(0, 10);
        const newISO = new Date(`${dateBase}T${input.value}:00`).toISOString();
        Store.updateShift(recId, { [field]: newISO });
        this.toast('Time adjusted', 'info');
        this.showStaffDetail(staffId);
      });
    });

    // Approve / Decline inside detail modal
    modal.querySelectorAll('.btn-approve-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.approveShift(btn.dataset.rec);
        this.toast('Shift approved', 'success');
        this.showStaffDetail(staffId);
        this.renderStaff();
      });
    });
    modal.querySelectorAll('.btn-decline-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.declineShift(btn.dataset.rec);
        this.toast('Shift declined', 'info');
        this.showStaffDetail(staffId);
        this.renderStaff();
      });
    });
  },

  showStaffModal(member = null) {
    const isEdit = !!member;
    const modal = document.getElementById('modal');
    modal.innerHTML = `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-box">
          <h3>${isEdit ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="modal-staff-name" value="${isEdit ? member.name : ''}" placeholder="e.g. Maria Garcia" />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select id="modal-staff-role">
              <option value="Server" ${isEdit && member.role === 'Server' ? 'selected' : ''}>Server</option>
              <option value="Head Server" ${isEdit && member.role === 'Head Server' ? 'selected' : ''}>Head Server</option>
              <option value="Bartender" ${isEdit && member.role === 'Bartender' ? 'selected' : ''}>Bartender</option>
              <option value="Host" ${isEdit && member.role === 'Host' ? 'selected' : ''}>Host</option>
              <option value="Manager" ${isEdit && member.role === 'Manager' ? 'selected' : ''}>Manager</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="btn btn-outline" id="modal-cancel">Cancel</button>
            <button class="btn btn-primary" id="modal-save">${isEdit ? 'Update' : 'Add Member'}</button>
          </div>
        </div>
      </div>`;
    modal.classList.remove('hidden');

    document.getElementById('modal-cancel').onclick = () => modal.classList.add('hidden');
    document.getElementById('modal-overlay').onclick = (e) => { if (e.target.id === 'modal-overlay') modal.classList.add('hidden'); };
    document.getElementById('modal-save').onclick = () => {
      const name = document.getElementById('modal-staff-name').value.trim();
      const role = document.getElementById('modal-staff-role').value;
      if (!name) { this.toast('Enter a name', 'warning'); return; }
      if (isEdit) {
        Store.updateStaffMember(member.id, { name, role });
        this.toast('Staff updated', 'success');
      } else {
        Store.addStaffMember({ name, role });
        this.toast('Staff member added', 'success');
      }
      modal.classList.add('hidden');
      this.renderStaff();
    };
  },

  // ════════════════════════════════════════════════════════
  //  REPORTS
  // ════════════════════════════════════════════════════════
  renderReports() {
    const container = document.getElementById('reports-content');
    const today = Store.getBusinessDate();

    // Date picker
    let selectedDate = today;
    const dateInput = document.getElementById('report-date');
    if (dateInput) {
      dateInput.value = selectedDate;
      dateInput.max = today;
      dateInput.onchange = () => {
        selectedDate = dateInput.value;
        this.generateReport(selectedDate);
      };
    }

    this.generateReport(selectedDate);
  },

  generateReport(dateStr) {
    const orders = Store.getOrdersByDate(dateStr);
    const closed = orders.filter(o => o.status === 'closed');
    const staff = Store.getStaff();
    const categories = Store.getCategories();
    const container = document.getElementById('reports-content');

    const totalRevenue = closed.reduce((s, o) => s + (o.total || 0), 0);
    const totalCovers = closed.reduce((s, o) => s + (o.covers || 0), 0);
    const totalItems = closed.flatMap(o => o.items || []).reduce((s, i) => s + i.quantity, 0);
    const avgPerCover = totalCovers > 0 ? totalRevenue / totalCovers : 0;
    const avgPerOrder = closed.length > 0 ? totalRevenue / closed.length : 0;

    // Profit analysis
    const totalCost = closed.reduce((s, o) => {
      return s + (o.items || []).reduce((c, i) => c + (i.costPrice || 0) * i.quantity, 0);
    }, 0);
    const grossProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const foodCostPct = totalRevenue > 0 ? (totalCost / totalRevenue) * 100 : 0;

    // VAT analysis
    const vatPct = this.vatRate();
    const netRevenue = this.netPrice(totalRevenue);
    const vatCollected = totalRevenue - netRevenue;
    const realProfit = netRevenue - totalCost;
    const realMargin = netRevenue > 0 ? (realProfit / netRevenue * 100) : 0;

    // Category breakdown
    const catMap = {};
    categories.forEach(c => { catMap[c.id] = { name: c.name, count: 0, revenue: 0 }; });
    closed.flatMap(o => o.items || []).forEach(item => {
      if (catMap[item.categoryId]) {
        catMap[item.categoryId].count += item.quantity;
        catMap[item.categoryId].revenue += item.price * item.quantity;
      }
    });

    // Staff breakdown
    const staffMap = {};
    staff.forEach(s => { staffMap[s.id] = { name: s.name, orders: 0, items: 0, revenue: 0, covers: 0 }; });
    closed.forEach(order => {
      if (staffMap[order.staffId]) {
        staffMap[order.staffId].orders++;
        staffMap[order.staffId].items += (order.items || []).reduce((s, i) => s + i.quantity, 0);
        staffMap[order.staffId].revenue += order.total || 0;
        staffMap[order.staffId].covers += order.covers || 0;
      }
    });

    // Top seller
    const staffSorted = Object.values(staffMap).filter(s => s.orders > 0).sort((a, b) => b.revenue - a.revenue);
    const topSeller = staffSorted[0] || null;

    // Item sales
    const itemSales = {};
    closed.flatMap(o => o.items || []).forEach(i => {
      const key = i.menuItemId || i.name;
      if (!itemSales[key]) itemSales[key] = { name: i.name, qty: 0, revenue: 0, cost: 0 };
      itemSales[key].qty += i.quantity;
      itemSales[key].revenue += i.price * i.quantity;
      itemSales[key].cost += (i.costPrice || 0) * i.quantity;
    });
    const topItemsSorted = Object.values(itemSales).sort((a, b) => b.revenue - a.revenue);

    // Hourly breakdown
    const hourlyData = {};
    closed.forEach(o => {
      const hour = new Date(o.createdAt).getHours();
      if (!hourlyData[hour]) hourlyData[hour] = { orders: 0, revenue: 0 };
      hourlyData[hour].orders++;
      hourlyData[hour].revenue += o.total || 0;
    });

    const dateFormatted = new Date(dateStr + 'T12:00:00').toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    let html = `
      <div class="report-header-info">
        <h3><i class="fa-solid fa-calendar-day"></i> Report for ${dateFormatted}</h3>
        <button class="btn btn-outline" id="btn-print-report"><i class="fa-solid fa-print"></i> Print Report</button>
      </div>`;

    if (closed.length === 0) {
      html += '<div class="empty-state"><i class="fa-solid fa-chart-bar"></i><h3>No Closed Orders</h3><p>No completed orders found for this date.</p></div>';
      container.innerHTML = html;
      return;
    }

    // Summary KPIs
    html += `
      <div class="report-kpis">
        <div class="report-kpi"><span class="report-kpi-value">${this.fmt(totalRevenue)}</span><span class="report-kpi-label">Gross Revenue (inc. VAT)</span></div>
        <div class="report-kpi"><span class="report-kpi-value">${this.fmt(netRevenue)}</span><span class="report-kpi-label">Net Revenue (ex. VAT)</span></div>
        <div class="report-kpi"><span class="report-kpi-value text-muted">${this.fmt(vatCollected)}</span><span class="report-kpi-label">VAT Collected (${vatPct}%)</span></div>
        <div class="report-kpi"><span class="report-kpi-value">${this.fmt(totalCost)}</span><span class="report-kpi-label">Cost of Goods (ex. VAT)</span></div>
        <div class="report-kpi"><span class="report-kpi-value ${realProfit >= 0 ? 'profit-positive' : 'profit-negative'}">${this.fmt(realProfit)}</span><span class="report-kpi-label">Net Profit</span></div>
        <div class="report-kpi"><span class="report-kpi-value ${realMargin >= 65 ? 'profit-positive' : realMargin >= 50 ? '' : 'profit-negative'}">${realMargin.toFixed(1)}%</span><span class="report-kpi-label">Real Margin (ex. VAT)</span></div>
        <div class="report-kpi"><span class="report-kpi-value">${closed.length}</span><span class="report-kpi-label">Orders Closed</span></div>
        <div class="report-kpi"><span class="report-kpi-value">${totalCovers}</span><span class="report-kpi-label">Total Covers</span></div>
        <div class="report-kpi"><span class="report-kpi-value">${totalItems}</span><span class="report-kpi-label">Items Sold</span></div>
        <div class="report-kpi"><span class="report-kpi-value">${this.fmt(avgPerCover)}</span><span class="report-kpi-label">Avg / Cover</span></div>
        <div class="report-kpi"><span class="report-kpi-value">${this.fmt(avgPerOrder)}</span><span class="report-kpi-label">Avg / Order</span></div>
        <div class="report-kpi"><span class="report-kpi-value">${foodCostPct.toFixed(1)}%</span><span class="report-kpi-label">Food Cost %</span></div>
      </div>`;

    // Star Performer
    if (topSeller) {
      html += `
        <div class="report-section">
          <div class="star-card star-card-report">
            <i class="fa-solid fa-trophy"></i>
            <div>
              <div class="star-name">${topSeller.name} — Most Efficient Server</div>
              <div class="star-stats">${topSeller.orders} orders · ${topSeller.items} items · ${topSeller.covers} covers · ${this.fmt(topSeller.revenue)} revenue</div>
            </div>
          </div>
        </div>`;
    }

    // Charts row
    html += `
      <div class="report-charts-row">
        <div class="report-chart-box">
          <h4>Revenue by Category</h4>
          <div class="chart-container"><canvas id="report-chart-cat"></canvas></div>
        </div>
        <div class="report-chart-box">
          <h4>Orders by Hour</h4>
          <div class="chart-container"><canvas id="report-chart-hourly"></canvas></div>
        </div>
      </div>`;

    // Category Table
    html += `
      <div class="report-section">
        <h4>Category Breakdown</h4>
        <table class="report-table">
          <thead><tr><th>Category</th><th class="text-center">Items Sold</th><th class="text-right">Revenue</th><th class="text-right">% of Total</th></tr></thead>
          <tbody>
            ${Object.values(catMap).filter(c => c.count > 0).sort((a, b) => b.revenue - a.revenue).map(c => `
              <tr>
                <td>${c.name}</td>
                <td class="text-center">${c.count}</td>
                <td class="text-right">${this.fmt(c.revenue)}</td>
                <td class="text-right">${(c.revenue / totalRevenue * 100).toFixed(1)}%</td>
              </tr>
            `).join('')}
            <tr class="table-total-row">
              <td><strong>Total</strong></td>
              <td class="text-center"><strong>${totalItems}</strong></td>
              <td class="text-right"><strong>${this.fmt(totalRevenue)}</strong></td>
              <td class="text-right"><strong>100%</strong></td>
            </tr>
          </tbody>
        </table>
      </div>`;

    // Staff Table
    html += `
      <div class="report-section">
        <h4>Server Performance</h4>
        <table class="report-table">
          <thead><tr><th>Server</th><th class="text-center">Orders</th><th class="text-center">Items</th><th class="text-center">Covers</th><th class="text-right">Revenue</th><th class="text-right">Avg/Order</th></tr></thead>
          <tbody>
            ${staffSorted.map((s, i) => `
              <tr class="${i === 0 ? 'top-performer-row' : ''}">
                <td>${i === 0 ? '<i class="fa-solid fa-star" style="color:#f59e0b"></i> ' : ''}${s.name}</td>
                <td class="text-center">${s.orders}</td>
                <td class="text-center">${s.items}</td>
                <td class="text-center">${s.covers}</td>
                <td class="text-right">${this.fmt(s.revenue)}</td>
                <td class="text-right">${this.fmt(s.orders > 0 ? s.revenue / s.orders : 0)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;

    // Top Items Table
    html += `
      <div class="report-section">
        <h4>Items Sold — Revenue, Cost &amp; VAT Breakdown</h4>
        <table class="report-table">
          <thead><tr><th>#</th><th>Item</th><th class="text-center">Qty</th><th class="text-right">Revenue <small>(inc. VAT)</small></th><th class="text-right">Net <small>(ex. VAT)</small></th><th class="text-right">Cost <small>(wholesale)</small></th><th class="text-right">Profit</th><th class="text-right">Margin</th></tr></thead>
          <tbody>
            ${topItemsSorted.map((item, i) => {
              const netRev = this.netPrice(item.revenue);
              const profit = netRev - item.cost;
              const margin = netRev > 0 ? (profit / netRev * 100) : 0;
              return `
              <tr>
                <td>${i + 1}</td>
                <td>${item.name}</td>
                <td class="text-center">${item.qty}</td>
                <td class="text-right">${this.fmt(item.revenue)}</td>
                <td class="text-right text-muted">${this.fmt(netRev)}</td>
                <td class="text-right">${this.fmt(item.cost)}</td>
                <td class="text-right ${profit >= 0 ? 'profit-positive' : 'profit-negative'}">${this.fmt(profit)}</td>
                <td class="text-right"><span class="${margin >= 65 ? 'margin-good' : margin >= 50 ? 'margin-warn' : 'margin-bad'}">${margin.toFixed(0)}%</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;

    container.innerHTML = html;

    // Render charts
    const catLabels = [], catData2 = [], catColors2 = [];
    const palette = ['#b08d4e','#2d9c6f','#e0892e','#4a8fe7','#9064db','#1ba9c4','#d14d7a','#7cb531','#e86c5a','#6c8ebf'];
    Object.values(catMap).filter(c => c.revenue > 0).forEach((c, i) => {
      catLabels.push(c.name);
      catData2.push(c.revenue);
      catColors2.push(palette[i % palette.length]);
    });
    const rcc = this.chartColors();
    const rCatTotal = catData2.reduce((a, b) => a + b, 0);

    this.renderChart('report-chart-cat', 'doughnut', {
      labels: catLabels,
      datasets: [{
        data: catData2,
        backgroundColor: catColors2,
        hoverBackgroundColor: catColors2.map(c => c + 'dd'),
        borderWidth: 2,
        borderColor: rcc.border,
        hoverOffset: 8,
        spacing: 2,
        borderRadius: 3,
      }]
    }, {
      cutout: '62%',
      animation: { animateRotate: true, duration: 900, easing: 'easeOutQuart' },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: rcc.text,
            padding: 14,
            font: { size: 11, weight: '500' },
            usePointStyle: true,
            pointStyleWidth: 10,
          },
        },
        tooltip: {
          backgroundColor: rcc.border === '#ffffff' ? '#1a1207ee' : '#0f1923ee',
          titleFont: { size: 13, weight: '600' },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label(ctx) {
              const val = ctx.parsed;
              const pct = rCatTotal > 0 ? (val / rCatTotal * 100).toFixed(1) : '0.0';
              return ` ${App.fmt(val)}  (${pct}%)`;
            },
          },
        },
      },
    });

    // Hourly chart
    const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6am to midnight
    this.renderChart('report-chart-hourly', 'bar', {
      labels: hours.map(h => `${h}:00`),
      datasets: [{
        label: 'Revenue',
        data: hours.map(h => hourlyData[h]?.revenue || 0),
        backgroundColor: '#b08d4e',
        hoverBackgroundColor: '#c9a84c',
        borderRadius: 5,
        borderSkipped: false,
        barPercentage: 0.65,
      }]
    }, {
      animation: { duration: 700, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: rcc.border === '#ffffff' ? '#1a1207ee' : '#0f1923ee',
          titleFont: { size: 13, weight: '600' },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: { label(ctx) { return ` ${App.fmt(ctx.parsed.y)}`; } },
        },
      },
      scales: {
        x: { ticks: { color: rcc.text, maxRotation: 45 }, grid: { color: rcc.grid, drawBorder: false } },
        y: { ticks: { color: rcc.text, callback: v => App.fmt(v) }, grid: { color: rcc.grid, drawBorder: false } },
      }
    });

    // Print button
    document.getElementById('btn-print-report')?.addEventListener('click', () => {
      window.print();
    });
  },

  // ════════════════════════════════════════════════════════
  //  SETTINGS
  // ════════════════════════════════════════════════════════
  renderSettings() {
    const s = Store.getSettings();
    document.getElementById('setting-name').value = s.restaurantName;
    document.getElementById('setting-currency').value = s.currency;
    document.getElementById('setting-tax').value = s.taxRate;
    document.getElementById('setting-service').value = s.serviceCharge;
    document.getElementById('setting-vat').value = s.vatRate != null ? s.vatRate : 13;
  },

  saveSettings() {
    const settings = {
      restaurantName: document.getElementById('setting-name').value.trim() || 'My Restaurant',
      currency: document.getElementById('setting-currency').value || '€',
      taxRate: parseFloat(document.getElementById('setting-tax').value) || 0,
      serviceCharge: parseFloat(document.getElementById('setting-service').value) || 0,
      vatRate: parseFloat(document.getElementById('setting-vat').value) || 0,
    };
    Store.saveSettings(settings);
    this.updateRestaurantName();
    this.toast('Settings saved', 'success');
  },

  resetAllData() {
    if (confirm('⚠️ This will delete ALL data including orders, menu, and staff. Are you sure?')) {
      if (confirm('This action cannot be undone. Proceed?')) {
        Store.resetAll();
        this.toast('All data reset', 'info');
        this.showView('dashboard');
      }
    }
  },

  loadDemoData() {
    // Ensure staff & menu defaults are loaded
    Store.resetStaffToDefaults();
    Store.resetMenuToDefaults();
    const orders = generateDemoDay();
    if (orders && orders.length > 0) {
      const total = orders.reduce((s, o) => s + o.total, 0);
      this.toast(`Demo day loaded: ${orders.length} orders, ${this.fmt(total)} revenue`, 'success');
      this.showView('dashboard');
    } else {
      this.toast('Could not generate demo data', 'warning');
    }
  },

  resetToDefaults() {
    if (confirm('Reset menu and staff to defaults? Orders will be kept.')) {
      Store.resetMenuToDefaults();
      Store.resetStaffToDefaults();
      this.toast('Menu & staff reset to defaults', 'info');
      this.showView('menu');
    }
  },

  exportData() {
    const data = {
      menu: Store.getMenu(),
      categories: Store.getCategories(),
      staff: Store.getStaff(),
      orders: Store.getOrders(),
      settings: Store.getSettings(),
      pantry: Store.getPantry(),
      dayLog: Store.getDayLog(),
      weekLog: Store.getWeekLog(),
      monthLog: Store.getMonthLog(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `culinary-provisions-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('Data exported', 'success');
  },

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.menu) Store.saveMenu(data.menu);
          if (data.categories) Store.saveCategories(data.categories);
          if (data.staff) Store.saveStaff(data.staff);
          if (data.orders) Store.saveOrders(data.orders);
          if (data.settings) Store.saveSettings(data.settings);
          if (data.pantry) Store.savePantry(data.pantry);
          if (data.dayLog) Store.saveDayLog(data.dayLog);
          if (data.weekLog) Store.saveWeekLog(data.weekLog);
          if (data.monthLog) Store.saveMonthLog(data.monthLog);
          this.toast('Data imported successfully', 'success');
          this.updateRestaurantName();
          this.showView('dashboard');
        } catch {
          this.toast('Invalid file format', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  },

  // ── End of Day ─────────────────────────────────────────
  endOfDay() {
    const today = Store.getBusinessDate();
    const orders = Store.getTodayOrders();
    const openOrders = orders.filter(o => o.status === 'open');

    if (openOrders.length > 0) {
      if (!confirm(`There are ${openOrders.length} open orders. Close them all and run end-of-day?`)) return;
      openOrders.forEach(o => Store.closeOrder(o.id));
    }

    const closed = Store.getTodayOrders().filter(o => o.status === 'closed');
    const staff = Store.getStaff();
    const vatRate = this.vatRate();

    // Build comprehensive daily snapshot
    const summary = Store.buildDaySummary(today, closed, staff, vatRate);
    Store.archiveDay(summary);

    // Clock out any staff still on the clock
    Store.getClockedInStaff().forEach(id => Store.clockOut(id));
    Store.clearTimeClock();

    // Remove today's closed orders so the next day starts fresh
    const allOrders = Store.getOrders();
    const remaining = allOrders.filter(o => {
      // Keep orders that are NOT from today
      if (!o.createdAt || !o.createdAt.startsWith(today)) return true;
      // Keep any today order that is still open (shouldn't exist after above, but safety)
      return o.status === 'open';
    });
    Store.saveOrders(remaining);

    // Advance to next business day
    const nextDay = Store.advanceBusinessDate();

    this.toast(`Day closed & archived! Now on ${nextDay}.`, 'success');
    this.showView('dashboard');
  },

  // ════════════════════════════════════════════════════════
  //  HISTORY — Daily / Weekly / Monthly
  // ════════════════════════════════════════════════════════
  _historyTab: 'daily',

  renderHistory() {
    const container = document.getElementById('history-content');
    const tabs = document.querySelectorAll('#view-history .tab-btn[data-htab]');
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.htab === this._historyTab);
      tab.onclick = () => {
        this._historyTab = tab.dataset.htab;
        this.renderHistory();
      };
    });

    switch (this._historyTab) {
      case 'daily':   this.renderDailyHistory(container); break;
      case 'weekly':  this.renderWeeklyHistory(container); break;
      case 'monthly': this.renderMonthlyHistory(container); break;
    }
  },

  // ── Daily History ────────────────────────────────────────
  renderDailyHistory(container) {
    const dayLog = Store.getDayLog();
    if (dayLog.length === 0) {
      container.innerHTML = `<div class="empty-state">
        <i class="fa-solid fa-calendar-xmark"></i>
        <h3>No Daily Records</h3>
        <p>Run "End of Day" to archive daily snapshots. Each day's data (orders, staff, ingredients) is saved independently.</p>
      </div>`;
      return;
    }

    // Show list of archived days
    const sorted = [...dayLog].sort((a, b) => b.date.localeCompare(a.date));
    let html = `<div class="history-list">
      <table class="report-table">
        <thead>
          <tr>
            <th>Date</th>
            <th class="text-right">Revenue</th>
            <th class="text-right">Cost</th>
            <th class="text-right">Profit</th>
            <th class="text-center">Margin</th>
            <th class="text-center">Orders</th>
            <th class="text-center">Covers</th>
            <th class="text-center">Items</th>
            <th class="text-center">Staff</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(d => {
            const dateFormatted = new Date(d.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
            const marginClass = d.profitMargin >= 65 ? 'margin-good' : d.profitMargin >= 50 ? 'margin-warn' : 'margin-bad';
            return `<tr>
              <td><strong>${dateFormatted}</strong></td>
              <td class="text-right">${this.fmt(d.totalRevenue)}</td>
              <td class="text-right">${this.fmt(d.totalCost)}</td>
              <td class="text-right ${d.grossProfit >= 0 ? 'profit-positive' : 'profit-negative'}">${this.fmt(d.grossProfit)}</td>
              <td class="text-center"><span class="${marginClass}">${d.profitMargin.toFixed(1)}%</span></td>
              <td class="text-center">${d.totalOrders}</td>
              <td class="text-center">${d.totalCovers}</td>
              <td class="text-center">${d.totalItems || 0}</td>
              <td class="text-center">${(d.staffPerformance || []).length}</td>
              <td class="text-center"><button class="btn btn-sm btn-outline btn-view-day" data-date="${d.date}"><i class="fa-solid fa-eye"></i> View</button></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;

    container.innerHTML = html;

    // View day detail buttons
    container.querySelectorAll('.btn-view-day').forEach(btn => {
      btn.addEventListener('click', () => this.showDayDetail(btn.dataset.date));
    });
  },

  showDayDetail(dateStr) {
    const day = Store.getDaySummary(dateStr);
    if (!day) { this.toast('Day record not found', 'warning'); return; }

    const container = document.getElementById('history-content');
    const dateFormatted = new Date(dateStr + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const marginClass = day.profitMargin >= 65 ? 'margin-good' : day.profitMargin >= 50 ? 'margin-warn' : 'margin-bad';

    let html = `
      <div class="history-detail">
        <button class="btn btn-outline" id="btn-back-daily" style="margin-bottom:1rem;"><i class="fa-solid fa-arrow-left"></i> Back to Daily History</button>
        <h3 style="margin-bottom:1rem;"><i class="fa-solid fa-calendar-day"></i> ${dateFormatted}</h3>

        <div class="report-kpis">
          <div class="report-kpi"><span class="report-kpi-value">${this.fmt(day.totalRevenue)}</span><span class="report-kpi-label">Revenue</span></div>
          <div class="report-kpi"><span class="report-kpi-value">${this.fmt(day.totalCost)}</span><span class="report-kpi-label">Cost (ex-VAT)</span></div>
          <div class="report-kpi"><span class="report-kpi-value ${day.grossProfit >= 0 ? 'profit-positive' : 'profit-negative'}">${this.fmt(day.grossProfit)}</span><span class="report-kpi-label">Net Profit</span></div>
          <div class="report-kpi"><span class="report-kpi-value"><span class="${marginClass}">${day.profitMargin.toFixed(1)}%</span></span><span class="report-kpi-label">Real Margin</span></div>
          <div class="report-kpi"><span class="report-kpi-value">${day.totalOrders}</span><span class="report-kpi-label">Orders</span></div>
          <div class="report-kpi"><span class="report-kpi-value">${day.totalCovers}</span><span class="report-kpi-label">Covers</span></div>
          <div class="report-kpi"><span class="report-kpi-value">${day.totalItems || 0}</span><span class="report-kpi-label">Items Sold</span></div>
          <div class="report-kpi"><span class="report-kpi-value">${this.fmt(day.avgPerCover || 0)}</span><span class="report-kpi-label">Avg/Cover</span></div>
          <div class="report-kpi"><span class="report-kpi-value text-muted">${this.fmt(day.vatCollected)}</span><span class="report-kpi-label">VAT (${day.vatRate}%)</span></div>
        </div>`;

    // Staff Performance
    if (day.staffPerformance && day.staffPerformance.length > 0) {
      const staffSorted = [...day.staffPerformance].sort((a, b) => b.revenue - a.revenue);
      html += `
        <div class="report-section">
          <h4><i class="fa-solid fa-users"></i> Staff Performance</h4>
          <table class="report-table">
            <thead><tr><th>Server</th><th class="text-center">Orders</th><th class="text-center">Items</th><th class="text-center">Covers</th><th class="text-right">Revenue</th><th class="text-right">Avg/Order</th></tr></thead>
            <tbody>
              ${staffSorted.map((s, i) => `
                <tr class="${i === 0 ? 'top-performer-row' : ''}">
                  <td>${i === 0 ? '<i class="fa-solid fa-star" style="color:#f59e0b"></i> ' : ''}${s.name}</td>
                  <td class="text-center">${s.orders}</td>
                  <td class="text-center">${s.items}</td>
                  <td class="text-center">${s.covers}</td>
                  <td class="text-right">${this.fmt(s.revenue)}</td>
                  <td class="text-right">${this.fmt(s.orders > 0 ? s.revenue / s.orders : 0)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`;
    }

    // Item Sales
    if (day.itemSales && day.itemSales.length > 0) {
      html += `
        <div class="report-section">
          <h4><i class="fa-solid fa-utensils"></i> Items Sold</h4>
          <table class="report-table">
            <thead><tr><th>#</th><th>Item</th><th class="text-center">Qty</th><th class="text-right">Revenue</th><th class="text-right">Cost</th><th class="text-right">Profit</th></tr></thead>
            <tbody>
              ${day.itemSales.map((item, i) => {
                const profit = (this.netPrice(item.revenue)) - item.cost;
                return `<tr>
                  <td>${i + 1}</td>
                  <td>${item.name}</td>
                  <td class="text-center">${item.qty}</td>
                  <td class="text-right">${this.fmt(item.revenue)}</td>
                  <td class="text-right">${this.fmt(item.cost)}</td>
                  <td class="text-right ${profit >= 0 ? 'profit-positive' : 'profit-negative'}">${this.fmt(profit)}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>`;
    }

    // Ingredient Usage
    if (day.ingredientUsage && day.ingredientUsage.length > 0) {
      html += `
        <div class="report-section">
          <h4><i class="fa-solid fa-leaf"></i> Ingredient Usage</h4>
          <table class="report-table">
            <thead><tr><th>#</th><th>Ingredient</th><th class="text-center">Portion Size</th><th class="text-center">Times Used</th><th class="text-right">Total Cost</th></tr></thead>
            <tbody>
              ${day.ingredientUsage.slice(0, 30).map((ing, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${ing.name}</td>
                  <td class="text-center">${ing.qty || '—'}</td>
                  <td class="text-center">${ing.timesUsed}×</td>
                  <td class="text-right">${this.fmt(ing.totalCost)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>`;
    }

    // Timesheet
    if (day.timesheet && day.timesheet.length > 0) {
      const totalHrs = day.timesheet.reduce((s, t) => s + t.totalHours, 0);
      const approvedHrs = day.timesheet.reduce((s, t) => s + (t.approvedHours || 0), 0);
      html += `
        <div class="report-section">
          <h4><i class="fa-solid fa-user-clock"></i> Staff Timesheet</h4>
          <table class="report-table">
            <thead><tr><th>Staff Member</th><th class="text-center">Clock In</th><th class="text-center">Clock Out</th><th class="text-right">Hours</th><th class="text-center">Open Tables</th><th class="text-center">Status</th></tr></thead>
            <tbody>
              ${day.timesheet.map(t => t.shifts.map(sh => {
                const inT = new Date(sh.clockIn).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                const outT = sh.clockOut ? new Date(sh.clockOut).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—';
                const st = sh.status || 'pending';
                const badge = st === 'approved' ? '<span class="badge-approved">Approved</span>'
                  : st === 'declined' ? '<span class="badge-declined">Declined</span>'
                  : '<span class="badge-pending">Pending</span>';
                return `<tr><td>${t.name}</td><td class="text-center">${inT}</td><td class="text-center">${outT}</td><td class="text-right">${sh.hours.toFixed(2)}h</td><td class="text-center">${sh.openTables || 0}</td><td class="text-center">${badge}</td></tr>`;
              }).join('')).join('')}
            </tbody>
            <tfoot><tr><td colspan="3"><strong>Total Hours</strong></td><td class="text-right"><strong>${totalHrs.toFixed(2)}h</strong></td><td></td><td class="text-center text-muted">${approvedHrs.toFixed(2)}h approved</td></tr></tfoot>
          </table>
        </div>`;
    }

    // Orders list
    if (day.orders && day.orders.length > 0) {
      const staff = Store.getStaff();
      const staffMap = {};
      staff.forEach(s => { staffMap[s.id] = s.name; });
      (day.staffPerformance || []).forEach(s => { staffMap[s.id] = s.name; });

      html += `
        <div class="report-section">
          <h4><i class="fa-solid fa-receipt"></i> All Orders (${day.orders.length})</h4>
          <table class="report-table">
            <thead><tr><th>Order</th><th>Time</th><th>Server</th><th class="text-center">Table</th><th class="text-center">Covers</th><th class="text-center">Items</th><th class="text-right">Total</th></tr></thead>
            <tbody>
              ${day.orders.map(o => {
                const time = new Date(o.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                const itemCount = (o.items || []).reduce((s, i) => s + i.quantity, 0);
                return `<tr>
                  <td>#${(o.id || '').slice(-5).toUpperCase()}</td>
                  <td>${time}</td>
                  <td>${staffMap[o.staffId] || 'Unknown'}</td>
                  <td class="text-center">${o.tableNumber}</td>
                  <td class="text-center">${o.covers}</td>
                  <td class="text-center">${itemCount}</td>
                  <td class="text-right">${this.fmt(o.total)}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>`;
    }

    html += '</div>';
    container.innerHTML = html;

    document.getElementById('btn-back-daily')?.addEventListener('click', () => {
      this._historyTab = 'daily';
      this.renderHistory();
    });
  },

  // ── Weekly History ───────────────────────────────────────
  renderWeeklyHistory(container) {
    const weekLog = Store.getWeekLog();
    if (weekLog.length === 0) {
      container.innerHTML = `<div class="empty-state">
        <i class="fa-solid fa-calendar-week"></i>
        <h3>No Weekly Summaries</h3>
        <p>Weekly summaries are generated automatically when a week ends, or you can generate one manually.</p>
        <button class="btn btn-primary" id="btn-gen-week"><i class="fa-solid fa-calculator"></i> Generate This Week's Summary</button>
      </div>`;
      document.getElementById('btn-gen-week')?.addEventListener('click', () => {
        const today = new Date().toISOString().split('T')[0];
        Store.generateWeekSummary(today);
        this.toast('Weekly summary generated', 'success');
        this.renderHistory();
      });
      return;
    }

    let html = `<div style="margin-bottom:1rem;"><button class="btn btn-outline btn-sm" id="btn-gen-week-top"><i class="fa-solid fa-calculator"></i> Regenerate Current Week</button></div>`;

    html += `<div class="history-list">
      ${weekLog.map(w => {
        const startFormatted = new Date(w.weekStart + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        const endFormatted = new Date(w.weekEnd + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const marginClass = w.profitMargin >= 65 ? 'margin-good' : w.profitMargin >= 50 ? 'margin-warn' : 'margin-bad';
        return `
          <div class="history-week-card">
            <div class="history-week-header">
              <h4><i class="fa-solid fa-calendar-week"></i> Week: ${startFormatted} — ${endFormatted}</h4>
              <span class="text-muted">${w.daysCount} day${w.daysCount > 1 ? 's' : ''} recorded</span>
            </div>
            <div class="report-kpis" style="margin-bottom:.8rem;">
              <div class="report-kpi"><span class="report-kpi-value">${this.fmt(w.totalRevenue)}</span><span class="report-kpi-label">Revenue</span></div>
              <div class="report-kpi"><span class="report-kpi-value">${this.fmt(w.totalCost)}</span><span class="report-kpi-label">Cost</span></div>
              <div class="report-kpi"><span class="report-kpi-value ${w.grossProfit >= 0 ? 'profit-positive' : 'profit-negative'}">${this.fmt(w.grossProfit)}</span><span class="report-kpi-label">Profit</span></div>
              <div class="report-kpi"><span class="report-kpi-value"><span class="${marginClass}">${w.profitMargin.toFixed(1)}%</span></span><span class="report-kpi-label">Margin</span></div>
              <div class="report-kpi"><span class="report-kpi-value">${w.totalOrders}</span><span class="report-kpi-label">Orders</span></div>
              <div class="report-kpi"><span class="report-kpi-value">${w.totalCovers}</span><span class="report-kpi-label">Covers</span></div>
              <div class="report-kpi"><span class="report-kpi-value">${w.totalItems || 0}</span><span class="report-kpi-label">Items</span></div>
              <div class="report-kpi"><span class="report-kpi-value">${this.fmt(w.avgDailyRevenue)}</span><span class="report-kpi-label">Avg/Day</span></div>
            </div>
            ${w.bestDay ? `<div style="font-size:.82rem;color:var(--text-muted);margin-bottom:.4rem;"><i class="fa-solid fa-arrow-up" style="color:var(--profit-green)"></i> Best: ${new Date(w.bestDay.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} (${this.fmt(w.bestDay.revenue)}) &nbsp; <i class="fa-solid fa-arrow-down" style="color:var(--loss-red)"></i> Lowest: ${w.worstDay ? new Date(w.worstDay.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' (' + this.fmt(w.worstDay.revenue) + ')' : '—'}</div>` : ''}
            ${w.staffPerformance && w.staffPerformance.length > 0 ? `
              <details class="history-details">
                <summary><i class="fa-solid fa-users"></i> Staff Performance (${w.staffPerformance.length})</summary>
                <table class="report-table" style="margin-top:.5rem;">
                  <thead><tr><th>Server</th><th class="text-center">Days</th><th class="text-center">Orders</th><th class="text-center">Items</th><th class="text-center">Covers</th><th class="text-right">Revenue</th></tr></thead>
                  <tbody>
                    ${w.staffPerformance.map((s, i) => `<tr class="${i === 0 ? 'top-performer-row' : ''}"><td>${i === 0 ? '<i class="fa-solid fa-star" style="color:#f59e0b"></i> ' : ''}${s.name}</td><td class="text-center">${s.daysWorked || '—'}</td><td class="text-center">${s.orders}</td><td class="text-center">${s.items}</td><td class="text-center">${s.covers}</td><td class="text-right">${this.fmt(s.revenue)}</td></tr>`).join('')}
                  </tbody>
                </table>
              </details>
            ` : ''}
            ${w.dailyBreakdown && w.dailyBreakdown.length > 0 ? `
              <details class="history-details">
                <summary><i class="fa-solid fa-chart-line"></i> Daily Breakdown</summary>
                <table class="report-table" style="margin-top:.5rem;">
                  <thead><tr><th>Day</th><th class="text-right">Revenue</th><th class="text-right">Cost</th><th class="text-right">Profit</th><th class="text-center">Orders</th><th class="text-center">Covers</th></tr></thead>
                  <tbody>
                    ${w.dailyBreakdown.map(d => {
                      const dayName = new Date(d.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
                      return `<tr><td>${dayName}</td><td class="text-right">${this.fmt(d.revenue)}</td><td class="text-right">${this.fmt(d.cost)}</td><td class="text-right ${d.profit >= 0 ? 'profit-positive' : 'profit-negative'}">${this.fmt(d.profit)}</td><td class="text-center">${d.orders}</td><td class="text-center">${d.covers}</td></tr>`;
                    }).join('')}
                  </tbody>
                </table>
              </details>
            ` : ''}
          </div>`;
      }).join('')}
    </div>`;

    container.innerHTML = html;

    document.getElementById('btn-gen-week-top')?.addEventListener('click', () => {
      const today = new Date().toISOString().split('T')[0];
      Store.generateWeekSummary(today);
      this.toast('Weekly summary regenerated', 'success');
      this.renderHistory();
    });
  },

  // ── Monthly History ──────────────────────────────────────
  renderMonthlyHistory(container) {
    const monthLog = Store.getMonthLog();
    if (monthLog.length === 0) {
      container.innerHTML = `<div class="empty-state">
        <i class="fa-solid fa-calendar"></i>
        <h3>No Monthly Reports</h3>
        <p>Monthly reports are generated automatically at the end of each month, or you can generate one manually.</p>
        <button class="btn btn-primary" id="btn-gen-month"><i class="fa-solid fa-calculator"></i> Generate This Month's Report</button>
      </div>`;
      document.getElementById('btn-gen-month')?.addEventListener('click', () => {
        const today = new Date().toISOString().split('T')[0];
        Store.generateMonthSummary(today);
        this.toast('Monthly report generated', 'success');
        this.renderHistory();
      });
      return;
    }

    let html = `<div style="margin-bottom:1rem;"><button class="btn btn-outline btn-sm" id="btn-gen-month-top"><i class="fa-solid fa-calculator"></i> Regenerate Current Month</button></div>`;

    html += `<div class="history-list">
      ${monthLog.map(m => {
        const marginClass = m.profitMargin >= 65 ? 'margin-good' : m.profitMargin >= 50 ? 'margin-warn' : 'margin-bad';
        return `
          <div class="history-month-card">
            <div class="history-month-header">
              <h4><i class="fa-solid fa-calendar"></i> ${m.monthLabel}</h4>
              <span class="text-muted">${m.daysCount} day${m.daysCount > 1 ? 's' : ''} recorded</span>
            </div>

            <div class="report-kpis" style="margin-bottom:.8rem;">
              <div class="report-kpi"><span class="report-kpi-value">${this.fmt(m.totalRevenue)}</span><span class="report-kpi-label">Total Revenue</span></div>
              <div class="report-kpi"><span class="report-kpi-value">${this.fmt(m.totalCost)}</span><span class="report-kpi-label">Total Cost</span></div>
              <div class="report-kpi"><span class="report-kpi-value ${m.grossProfit >= 0 ? 'profit-positive' : 'profit-negative'}">${this.fmt(m.grossProfit)}</span><span class="report-kpi-label">Net Profit</span></div>
              <div class="report-kpi"><span class="report-kpi-value"><span class="${marginClass}">${m.profitMargin.toFixed(1)}%</span></span><span class="report-kpi-label">Real Margin</span></div>
              <div class="report-kpi"><span class="report-kpi-value">${m.totalOrders}</span><span class="report-kpi-label">Total Orders</span></div>
              <div class="report-kpi"><span class="report-kpi-value">${m.totalCovers}</span><span class="report-kpi-label">Total Covers</span></div>
              <div class="report-kpi"><span class="report-kpi-value">${m.totalItems || 0}</span><span class="report-kpi-label">Items Sold</span></div>
              <div class="report-kpi"><span class="report-kpi-value">${this.fmt(m.avgDailyRevenue)}</span><span class="report-kpi-label">Avg/Day</span></div>
              <div class="report-kpi"><span class="report-kpi-value text-muted">${this.fmt(m.vatCollected)}</span><span class="report-kpi-label">VAT Collected</span></div>
            </div>

            ${m.bestDay ? `<div style="font-size:.82rem;color:var(--text-muted);margin-bottom:.6rem;"><i class="fa-solid fa-arrow-up" style="color:var(--profit-green)"></i> Best day: ${new Date(m.bestDay.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} (${this.fmt(m.bestDay.revenue)}) &nbsp; <i class="fa-solid fa-arrow-down" style="color:var(--loss-red)"></i> Weakest: ${m.worstDay ? new Date(m.worstDay.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' (' + this.fmt(m.worstDay.revenue) + ')' : '—'}</div>` : ''}

            ${m.staffPerformance && m.staffPerformance.length > 0 ? `
              <details class="history-details" open>
                <summary><i class="fa-solid fa-users"></i> Staff Efficiency (${m.staffPerformance.length} servers)</summary>
                <table class="report-table" style="margin-top:.5rem;">
                  <thead><tr><th>Server</th><th class="text-center">Days</th><th class="text-center">Orders</th><th class="text-center">Items</th><th class="text-center">Covers</th><th class="text-right">Revenue</th><th class="text-right">Avg/Day</th></tr></thead>
                  <tbody>
                    ${m.staffPerformance.map((s, i) => `<tr class="${i === 0 ? 'top-performer-row' : ''}"><td>${i === 0 ? '<i class="fa-solid fa-trophy" style="color:#f59e0b"></i> ' : ''}${s.name}</td><td class="text-center">${s.daysWorked || '—'}</td><td class="text-center">${s.orders}</td><td class="text-center">${s.items}</td><td class="text-center">${s.covers}</td><td class="text-right">${this.fmt(s.revenue)}</td><td class="text-right">${this.fmt(s.daysWorked ? s.revenue / s.daysWorked : 0)}</td></tr>`).join('')}
                  </tbody>
                </table>
              </details>
            ` : ''}

            ${m.ingredientUsage && m.ingredientUsage.length > 0 ? `
              <details class="history-details">
                <summary><i class="fa-solid fa-leaf"></i> Total Ingredient Usage (${m.ingredientUsage.length} ingredients)</summary>
                <table class="report-table" style="margin-top:.5rem;">
                  <thead><tr><th>#</th><th>Ingredient</th><th class="text-center">Portion</th><th class="text-center">Times Used</th><th class="text-right">Total Cost</th></tr></thead>
                  <tbody>
                    ${m.ingredientUsage.slice(0, 40).map((ing, i) => `<tr><td>${i + 1}</td><td>${ing.name}</td><td class="text-center">${ing.qty || '—'}</td><td class="text-center">${ing.timesUsed}×</td><td class="text-right">${this.fmt(ing.totalCost)}</td></tr>`).join('')}
                  </tbody>
                </table>
              </details>
            ` : ''}

            ${m.itemSales && m.itemSales.length > 0 ? `
              <details class="history-details">
                <summary><i class="fa-solid fa-utensils"></i> Item Sales (${m.itemSales.length} items)</summary>
                <table class="report-table" style="margin-top:.5rem;">
                  <thead><tr><th>#</th><th>Item</th><th class="text-center">Qty Sold</th><th class="text-right">Revenue</th><th class="text-right">Cost</th></tr></thead>
                  <tbody>
                    ${m.itemSales.slice(0, 30).map((item, i) => `<tr><td>${i + 1}</td><td>${item.name}</td><td class="text-center">${item.qty}</td><td class="text-right">${this.fmt(item.revenue)}</td><td class="text-right">${this.fmt(item.cost)}</td></tr>`).join('')}
                  </tbody>
                </table>
              </details>
            ` : ''}

            ${m.dailyBreakdown && m.dailyBreakdown.length > 0 ? `
              <details class="history-details">
                <summary><i class="fa-solid fa-chart-line"></i> Daily Breakdown (${m.dailyBreakdown.length} days)</summary>
                <table class="report-table" style="margin-top:.5rem;">
                  <thead><tr><th>Date</th><th class="text-right">Revenue</th><th class="text-right">Cost</th><th class="text-right">Profit</th><th class="text-center">Orders</th><th class="text-center">Covers</th></tr></thead>
                  <tbody>
                    ${m.dailyBreakdown.map(d => {
                      const dayName = new Date(d.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
                      return `<tr><td>${dayName}</td><td class="text-right">${this.fmt(d.revenue)}</td><td class="text-right">${this.fmt(d.cost)}</td><td class="text-right ${d.profit >= 0 ? 'profit-positive' : 'profit-negative'}">${this.fmt(d.profit)}</td><td class="text-center">${d.orders}</td><td class="text-center">${d.covers}</td></tr>`;
                    }).join('')}
                  </tbody>
                </table>
              </details>
            ` : ''}
          </div>`;
      }).join('')}
    </div>`;

    container.innerHTML = html;

    document.getElementById('btn-gen-month-top')?.addEventListener('click', () => {
      const today = new Date().toISOString().split('T')[0];
      Store.generateMonthSummary(today);
      this.toast('Monthly report regenerated', 'success');
      this.renderHistory();
    });
  },

  // ── Toast notifications ────────────────────────────────
  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
