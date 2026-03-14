// ============================================================
// STORAGE LAYER — localStorage CRUD for Culinary Provisions
// Includes daily snapshots, weekly & monthly summaries
// ============================================================

const STORAGE_KEYS = {
  MENU:          'hc_menu',
  CATEGORIES:    'hc_categories',
  STAFF:         'hc_staff',
  ORDERS:        'hc_orders',
  SETTINGS:      'hc_settings',
  DAY_LOG:       'hc_day_log',       // archived daily summaries (full snapshots)
  WEEK_LOG:      'hc_week_log',      // weekly summaries
  MONTH_LOG:     'hc_month_log',     // monthly auto-reports
  BUSINESS_DATE: 'hc_business_date', // simulated current day
  PANTRY:        'hc_pantry',        // master ingredient inventory
  TIME_CLOCK:    'hc_time_clock',    // today's clock-in / clock-out records
};

const Store = {
  // ── Generic helpers ──────────────────────────────────────
  _get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  _set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // ── Initialise on first run ──────────────────────────────
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.MENU)) {
      this._set(STORAGE_KEYS.MENU, DEFAULT_MENU);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      this._set(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STAFF)) {
      this._set(STORAGE_KEYS.STAFF, DEFAULT_STAFF);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      this._set(STORAGE_KEYS.ORDERS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this._set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DAY_LOG)) {
      this._set(STORAGE_KEYS.DAY_LOG, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.WEEK_LOG)) {
      this._set(STORAGE_KEYS.WEEK_LOG, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MONTH_LOG)) {
      this._set(STORAGE_KEYS.MONTH_LOG, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PANTRY)) {
      this._set(STORAGE_KEYS.PANTRY, DEFAULT_PANTRY);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TIME_CLOCK)) {
      this._set(STORAGE_KEYS.TIME_CLOCK, []);
    }
  },

  // ── Menu Items ───────────────────────────────────────────
  getMenu()          { return this._get(STORAGE_KEYS.MENU, []); },
  saveMenu(items)    { this._set(STORAGE_KEYS.MENU, items); },

  addMenuItem(item) {
    const menu = this.getMenu();
    item.id = item.id || 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    item.active = item.active !== undefined ? item.active : true;
    menu.push(item);
    this.saveMenu(menu);
    return item;
  },
  updateMenuItem(id, updates) {
    const menu = this.getMenu();
    const idx = menu.findIndex(i => i.id === id);
    if (idx === -1) return null;
    menu[idx] = { ...menu[idx], ...updates };
    this.saveMenu(menu);
    return menu[idx];
  },
  deleteMenuItem(id) {
    const menu = this.getMenu().filter(i => i.id !== id);
    this.saveMenu(menu);
  },

  // ── Categories ───────────────────────────────────────────
  getCategories()          { return this._get(STORAGE_KEYS.CATEGORIES, []); },
  saveCategories(cats)     { this._set(STORAGE_KEYS.CATEGORIES, cats); },

  addCategory(cat) {
    const cats = this.getCategories();
    cat.id = cat.id || 'cat_' + Date.now();
    cat.order = cat.order || cats.length + 1;
    cats.push(cat);
    this.saveCategories(cats);
    return cat;
  },
  updateCategory(id, updates) {
    const cats = this.getCategories();
    const idx = cats.findIndex(c => c.id === id);
    if (idx === -1) return null;
    cats[idx] = { ...cats[idx], ...updates };
    this.saveCategories(cats);
    return cats[idx];
  },
  deleteCategory(id) {
    const cats = this.getCategories().filter(c => c.id !== id);
    this.saveCategories(cats);
    // Also remove all items in that category
    const menu = this.getMenu().filter(i => i.categoryId !== id);
    this.saveMenu(menu);
  },

  // ── Staff ────────────────────────────────────────────────
  getStaff()          { return this._get(STORAGE_KEYS.STAFF, []); },
  saveStaff(staff)    { this._set(STORAGE_KEYS.STAFF, staff); },

  addStaffMember(member) {
    const staff = this.getStaff();
    member.id = member.id || 'staff_' + Date.now();
    member.active = member.active !== undefined ? member.active : true;
    staff.push(member);
    this.saveStaff(staff);
    return member;
  },
  updateStaffMember(id, updates) {
    const staff = this.getStaff();
    const idx = staff.findIndex(s => s.id === id);
    if (idx === -1) return null;
    staff[idx] = { ...staff[idx], ...updates };
    this.saveStaff(staff);
    return staff[idx];
  },
  deleteStaffMember(id) {
    const staff = this.getStaff().filter(s => s.id !== id);
    this.saveStaff(staff);
  },

  // ── Orders ───────────────────────────────────────────────
  getOrders()          { return this._get(STORAGE_KEYS.ORDERS, []); },
  saveOrders(orders)   { this._set(STORAGE_KEYS.ORDERS, orders); },

  addOrder(order) {
    const orders = this.getOrders();
    order.id = order.id || 'ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    if (!order.createdAt) {
      // Use business date with real clock time
      const bizDate = this.getBusinessDate();
      const now = new Date();
      order.createdAt = new Date(`${bizDate}T${now.toTimeString().split(' ')[0]}`).toISOString();
    }
    order.status = order.status || 'open';
    orders.push(order);
    this.saveOrders(orders);
    return order;
  },
  updateOrder(id, updates) {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return null;
    orders[idx] = { ...orders[idx], ...updates };
    this.saveOrders(orders);
    return orders[idx];
  },
  closeOrder(id) {
    const bizDate = this.getBusinessDate();
    const now = new Date();
    const closedAt = new Date(`${bizDate}T${now.toTimeString().split(' ')[0]}`).toISOString();
    return this.updateOrder(id, { status: 'closed', closedAt });
  },
  deleteOrder(id) {
    const orders = this.getOrders().filter(o => o.id !== id);
    this.saveOrders(orders);
  },

  // ── Business date (simulated day) ────────────────────────
  getBusinessDate() {
    const stored = localStorage.getItem(STORAGE_KEYS.BUSINESS_DATE);
    return stored ? JSON.parse(stored) : new Date().toISOString().split('T')[0];
  },
  setBusinessDate(dateStr) {
    this._set(STORAGE_KEYS.BUSINESS_DATE, dateStr);
  },
  advanceBusinessDate() {
    const current = this.getBusinessDate();
    const d = new Date(current + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    const next = d.toISOString().split('T')[0];
    this.setBusinessDate(next);
    return next;
  },

  // ── Today's orders helper ────────────────────────────────
  getTodayOrders() {
    const today = this.getBusinessDate();
    return this.getOrders().filter(o => o.createdAt && o.createdAt.startsWith(today));
  },

  getOrdersByDate(dateStr) {
    return this.getOrders().filter(o => o.createdAt && o.createdAt.startsWith(dateStr));
  },

  // ── Settings ─────────────────────────────────────────────
  getSettings()           { return this._get(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS); },
  saveSettings(settings)  { this._set(STORAGE_KEYS.SETTINGS, settings); },

  // ══════════════════════════════════════════════════════════
  //  DAY LOG — Full daily snapshots (orders + staff data)
  // ══════════════════════════════════════════════════════════
  getDayLog()          { return this._get(STORAGE_KEYS.DAY_LOG, []); },
  saveDayLog(log)      { this._set(STORAGE_KEYS.DAY_LOG, log); },

  getDaySummary(dateStr) {
    return this.getDayLog().find(d => d.date === dateStr) || null;
  },

  /**
   * Archives a full daily snapshot: KPIs, all orders, per-staff breakdown,
   * and per-item ingredient usage.
   */
  archiveDay(summary) {
    const log = this.getDayLog();
    // Replace if same date exists
    const idx = log.findIndex(l => l.date === summary.date);
    if (idx !== -1) log[idx] = summary;
    else log.push(summary);
    // Keep sorted by date
    log.sort((a, b) => a.date.localeCompare(b.date));
    this.saveDayLog(log);
    // Check if this closes a week or month and auto-generate summaries
    this._checkWeeklySummary(summary.date);
    this._checkMonthlySummary(summary.date);
  },

  /**
   * Build a comprehensive day snapshot with full data
   */
  buildDaySummary(dateStr, closedOrders, staff, vatRate) {
    const totalRevenue = closedOrders.reduce((s, o) => s + (o.total || 0), 0);
    const totalCovers = closedOrders.reduce((s, o) => s + (o.covers || 0), 0);
    const allItems = closedOrders.flatMap(o => o.items || []);
    const totalItems = allItems.reduce((s, i) => s + i.quantity, 0);
    const totalCost = closedOrders.reduce((s, o) => {
      return s + (o.items || []).reduce((c, i) => c + (i.costPrice || 0) * i.quantity, 0);
    }, 0);
    const netRevenue = vatRate > 0 ? totalRevenue / (1 + vatRate / 100) : totalRevenue;
    const vatCollected = totalRevenue - netRevenue;
    const realProfit = netRevenue - totalCost;
    const realMargin = netRevenue > 0 ? (realProfit / netRevenue * 100) : 0;

    // Per-staff breakdown
    const staffPerf = {};
    staff.forEach(s => {
      staffPerf[s.id] = { id: s.id, name: s.name, role: s.role, orders: 0, items: 0, covers: 0, revenue: 0 };
    });
    closedOrders.forEach(order => {
      if (staffPerf[order.staffId]) {
        staffPerf[order.staffId].orders++;
        staffPerf[order.staffId].items += (order.items || []).reduce((s, i) => s + i.quantity, 0);
        staffPerf[order.staffId].revenue += order.total || 0;
        staffPerf[order.staffId].covers += order.covers || 0;
      }
    });

    // Per-item sales & ingredient usage
    const itemSales = {};
    const menu = this.getMenu();
    allItems.forEach(i => {
      const key = i.menuItemId || i.name;
      if (!itemSales[key]) {
        const menuItem = menu.find(m => m.id === key);
        itemSales[key] = {
          name: i.name,
          qty: 0,
          revenue: 0,
          cost: 0,
          ingredients: menuItem?.ingredients || [],
        };
      }
      itemSales[key].qty += i.quantity;
      itemSales[key].revenue += i.price * i.quantity;
      itemSales[key].cost += (i.costPrice || 0) * i.quantity;
    });

    // Aggregate ingredient usage across all sold items
    const ingredientUsage = {};
    Object.values(itemSales).forEach(item => {
      (item.ingredients || []).forEach(ing => {
        const key = ing.name;
        if (!ingredientUsage[key]) {
          ingredientUsage[key] = { name: ing.name, qty: ing.qty || '', totalCost: 0, timesUsed: 0 };
        }
        ingredientUsage[key].totalCost += ing.cost * item.qty;
        ingredientUsage[key].timesUsed += item.qty;
      });
    });

    return {
      date: dateStr,
      totalRevenue,
      netRevenue,
      vatCollected,
      totalCost,
      grossProfit: realProfit,
      profitMargin: realMargin,
      vatRate,
      totalOrders: closedOrders.length,
      totalCovers,
      totalItems,
      avgPerCover: totalCovers > 0 ? totalRevenue / totalCovers : 0,
      avgPerOrder: closedOrders.length > 0 ? totalRevenue / closedOrders.length : 0,
      staffPerformance: Object.values(staffPerf).filter(s => s.orders > 0),
      itemSales: Object.values(itemSales).sort((a, b) => b.revenue - a.revenue),
      ingredientUsage: Object.values(ingredientUsage).sort((a, b) => b.totalCost - a.totalCost),
      orders: closedOrders.map(o => ({
        id: o.id,
        staffId: o.staffId,
        tableNumber: o.tableNumber,
        covers: o.covers,
        items: o.items,
        total: o.total,
        totalCost: o.totalCost || 0,
        createdAt: o.createdAt,
        closedAt: o.closedAt,
      })),
      timesheet: this.buildTimesheet(this.getTimeClock(), staff),
      generatedAt: new Date().toISOString(),
    };
  },

  // ══════════════════════════════════════════════════════════
  //  TIME CLOCK — Staff clock-in / clock-out
  // ══════════════════════════════════════════════════════════
  getTimeClock()       { return this._get(STORAGE_KEYS.TIME_CLOCK, []); },
  saveTimeClock(recs)  { this._set(STORAGE_KEYS.TIME_CLOCK, recs); },

  /** Clock a staff member in. Creates a new record {staffId, clockIn, clockOut:null} */
  clockIn(staffId) {
    const recs = this.getTimeClock();
    // Don't allow double clock-in
    if (recs.find(r => r.staffId === staffId && !r.clockOut)) return null;
    const rec = { staffId, clockIn: new Date().toISOString(), clockOut: null };
    recs.push(rec);
    this.saveTimeClock(recs);
    return rec;
  },

  /** Clock a staff member out. Closes the open record. */
  clockOut(staffId) {
    const recs = this.getTimeClock();
    const open = recs.find(r => r.staffId === staffId && !r.clockOut);
    if (!open) return null;
    open.clockOut = new Date().toISOString();
    this.saveTimeClock(recs);
    return open;
  },

  /** Check if a staff member is currently clocked in */
  isClockedIn(staffId) {
    return !!this.getTimeClock().find(r => r.staffId === staffId && !r.clockOut);
  },

  /** Get all currently clocked-in staff IDs */
  getClockedInStaff() {
    return this.getTimeClock().filter(r => !r.clockOut).map(r => r.staffId);
  },

  /** Build a timesheet summary from time clock records */
  buildTimesheet(records, staff) {
    const staffMap = {};
    staff.forEach(s => { staffMap[s.id] = s.name; });
    const byStaff = {};
    records.forEach(r => {
      if (!byStaff[r.staffId]) byStaff[r.staffId] = { staffId: r.staffId, name: staffMap[r.staffId] || 'Unknown', shifts: [] };
      const clockIn = r.clockIn;
      const clockOut = r.clockOut || new Date().toISOString();
      const ms = new Date(clockOut) - new Date(clockIn);
      byStaff[r.staffId].shifts.push({ clockIn, clockOut: r.clockOut, hours: ms / 3600000 });
    });
    // Calculate totals
    return Object.values(byStaff).map(s => {
      s.totalHours = s.shifts.reduce((sum, sh) => sum + sh.hours, 0);
      return s;
    });
  },

  /** Clear time clock (used at end of day after archiving) */
  clearTimeClock() { this._set(STORAGE_KEYS.TIME_CLOCK, []); },

  // ══════════════════════════════════════════════════════════
  //  WEEK LOG — Weekly summaries
  // ══════════════════════════════════════════════════════════
  getWeekLog()          { return this._get(STORAGE_KEYS.WEEK_LOG, []); },
  saveWeekLog(log)      { this._set(STORAGE_KEYS.WEEK_LOG, log); },

  /** Get Monday's date for a given date string */
  _getWeekStart(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(d);
    monday.setDate(diff);
    return monday.toISOString().split('T')[0];
  },

  /** Get Sunday's date for a given date string */
  _getWeekEnd(dateStr) {
    const monday = new Date(this._getWeekStart(dateStr) + 'T12:00:00');
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return sunday.toISOString().split('T')[0];
  },

  /** Check if the week for this date has ended and generate summary */
  _checkWeeklySummary(dateStr) {
    const weekEnd = this._getWeekEnd(dateStr);
    const today = new Date().toISOString().split('T')[0];
    // Only generate if the week has ended or if today is the last day
    if (dateStr >= weekEnd || today > weekEnd) {
      const weekStart = this._getWeekStart(dateStr);
      this._generateWeeklySummary(weekStart, weekEnd);
    }
  },

  _generateWeeklySummary(weekStart, weekEnd) {
    const dayLog = this.getDayLog();
    const weekDays = dayLog.filter(d => d.date >= weekStart && d.date <= weekEnd);
    if (weekDays.length === 0) return;

    const summary = {
      weekStart,
      weekEnd,
      daysCount: weekDays.length,
      totalRevenue: weekDays.reduce((s, d) => s + d.totalRevenue, 0),
      netRevenue: weekDays.reduce((s, d) => s + d.netRevenue, 0),
      vatCollected: weekDays.reduce((s, d) => s + d.vatCollected, 0),
      totalCost: weekDays.reduce((s, d) => s + d.totalCost, 0),
      grossProfit: weekDays.reduce((s, d) => s + d.grossProfit, 0),
      totalOrders: weekDays.reduce((s, d) => s + d.totalOrders, 0),
      totalCovers: weekDays.reduce((s, d) => s + d.totalCovers, 0),
      totalItems: weekDays.reduce((s, d) => s + (d.totalItems || 0), 0),
      profitMargin: 0,
      avgDailyRevenue: 0,
      bestDay: null,
      worstDay: null,
      // Aggregate staff across week
      staffPerformance: [],
      // Aggregate ingredient usage
      ingredientUsage: [],
      generatedAt: new Date().toISOString(),
    };

    summary.profitMargin = summary.netRevenue > 0 ? (summary.grossProfit / summary.netRevenue * 100) : 0;
    summary.avgDailyRevenue = weekDays.length > 0 ? summary.totalRevenue / weekDays.length : 0;

    // Best/worst day
    const sorted = [...weekDays].sort((a, b) => b.totalRevenue - a.totalRevenue);
    summary.bestDay = sorted[0] ? { date: sorted[0].date, revenue: sorted[0].totalRevenue } : null;
    summary.worstDay = sorted[sorted.length - 1] ? { date: sorted[sorted.length - 1].date, revenue: sorted[sorted.length - 1].totalRevenue } : null;

    // Aggregate staff performance
    const staffAgg = {};
    weekDays.forEach(d => {
      (d.staffPerformance || []).forEach(sp => {
        if (!staffAgg[sp.id]) staffAgg[sp.id] = { id: sp.id, name: sp.name, role: sp.role, orders: 0, items: 0, covers: 0, revenue: 0, daysWorked: 0 };
        staffAgg[sp.id].orders += sp.orders;
        staffAgg[sp.id].items += sp.items;
        staffAgg[sp.id].covers += sp.covers;
        staffAgg[sp.id].revenue += sp.revenue;
        staffAgg[sp.id].daysWorked++;
      });
    });
    summary.staffPerformance = Object.values(staffAgg).sort((a, b) => b.revenue - a.revenue);

    // Aggregate ingredient usage
    const ingAgg = {};
    weekDays.forEach(d => {
      (d.ingredientUsage || []).forEach(iu => {
        if (!ingAgg[iu.name]) ingAgg[iu.name] = { name: iu.name, qty: iu.qty, totalCost: 0, timesUsed: 0 };
        ingAgg[iu.name].totalCost += iu.totalCost;
        ingAgg[iu.name].timesUsed += iu.timesUsed;
      });
    });
    summary.ingredientUsage = Object.values(ingAgg).sort((a, b) => b.totalCost - a.totalCost);

    // Daily breakdown for the chart
    summary.dailyBreakdown = weekDays.map(d => ({
      date: d.date,
      revenue: d.totalRevenue,
      cost: d.totalCost,
      profit: d.grossProfit,
      orders: d.totalOrders,
      covers: d.totalCovers,
    }));

    // Save
    const weekLog = this.getWeekLog();
    const idx = weekLog.findIndex(w => w.weekStart === weekStart);
    if (idx !== -1) weekLog[idx] = summary;
    else weekLog.push(summary);
    weekLog.sort((a, b) => b.weekStart.localeCompare(a.weekStart));
    this.saveWeekLog(weekLog);
  },

  // ══════════════════════════════════════════════════════════
  //  MONTH LOG — Monthly auto-reports
  // ══════════════════════════════════════════════════════════
  getMonthLog()          { return this._get(STORAGE_KEYS.MONTH_LOG, []); },
  saveMonthLog(log)      { this._set(STORAGE_KEYS.MONTH_LOG, log); },

  /** Check if the month for this date has ended and generate report */
  _checkMonthlySummary(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const today = new Date().toISOString().split('T')[0];
    const monthEnd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    const monthStart = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
    // Generate if date is last day of month or month has passed
    if (dateStr >= monthEnd || today > monthEnd) {
      this._generateMonthlySummary(monthStart, monthEnd);
    }
  },

  _generateMonthlySummary(monthStart, monthEnd) {
    const dayLog = this.getDayLog();
    const monthDays = dayLog.filter(d => d.date >= monthStart && d.date <= monthEnd);
    if (monthDays.length === 0) return;

    const monthLabel = new Date(monthStart + 'T12:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    const summary = {
      monthStart,
      monthEnd,
      monthLabel,
      daysCount: monthDays.length,
      totalRevenue: monthDays.reduce((s, d) => s + d.totalRevenue, 0),
      netRevenue: monthDays.reduce((s, d) => s + d.netRevenue, 0),
      vatCollected: monthDays.reduce((s, d) => s + d.vatCollected, 0),
      totalCost: monthDays.reduce((s, d) => s + d.totalCost, 0),
      grossProfit: monthDays.reduce((s, d) => s + d.grossProfit, 0),
      totalOrders: monthDays.reduce((s, d) => s + d.totalOrders, 0),
      totalCovers: monthDays.reduce((s, d) => s + d.totalCovers, 0),
      totalItems: monthDays.reduce((s, d) => s + (d.totalItems || 0), 0),
      profitMargin: 0,
      avgDailyRevenue: 0,
      bestDay: null,
      worstDay: null,
      staffPerformance: [],
      ingredientUsage: [],
      itemSales: [],
      dailyBreakdown: [],
      generatedAt: new Date().toISOString(),
    };

    summary.profitMargin = summary.netRevenue > 0 ? (summary.grossProfit / summary.netRevenue * 100) : 0;
    summary.avgDailyRevenue = monthDays.length > 0 ? summary.totalRevenue / monthDays.length : 0;

    // Best/worst day
    const sorted = [...monthDays].sort((a, b) => b.totalRevenue - a.totalRevenue);
    summary.bestDay = sorted[0] ? { date: sorted[0].date, revenue: sorted[0].totalRevenue } : null;
    summary.worstDay = sorted[sorted.length - 1] ? { date: sorted[sorted.length - 1].date, revenue: sorted[sorted.length - 1].totalRevenue } : null;

    // Aggregate staff
    const staffAgg = {};
    monthDays.forEach(d => {
      (d.staffPerformance || []).forEach(sp => {
        if (!staffAgg[sp.id]) staffAgg[sp.id] = { id: sp.id, name: sp.name, role: sp.role, orders: 0, items: 0, covers: 0, revenue: 0, daysWorked: 0 };
        staffAgg[sp.id].orders += sp.orders;
        staffAgg[sp.id].items += sp.items;
        staffAgg[sp.id].covers += sp.covers;
        staffAgg[sp.id].revenue += sp.revenue;
        staffAgg[sp.id].daysWorked++;
      });
    });
    summary.staffPerformance = Object.values(staffAgg).sort((a, b) => b.revenue - a.revenue);

    // Aggregate ingredient usage
    const ingAgg = {};
    monthDays.forEach(d => {
      (d.ingredientUsage || []).forEach(iu => {
        if (!ingAgg[iu.name]) ingAgg[iu.name] = { name: iu.name, qty: iu.qty, totalCost: 0, timesUsed: 0 };
        ingAgg[iu.name].totalCost += iu.totalCost;
        ingAgg[iu.name].timesUsed += iu.timesUsed;
      });
    });
    summary.ingredientUsage = Object.values(ingAgg).sort((a, b) => b.totalCost - a.totalCost);

    // Aggregate item sales
    const itemAgg = {};
    monthDays.forEach(d => {
      (d.itemSales || []).forEach(is => {
        if (!itemAgg[is.name]) itemAgg[is.name] = { name: is.name, qty: 0, revenue: 0, cost: 0 };
        itemAgg[is.name].qty += is.qty;
        itemAgg[is.name].revenue += is.revenue;
        itemAgg[is.name].cost += is.cost;
      });
    });
    summary.itemSales = Object.values(itemAgg).sort((a, b) => b.revenue - a.revenue);

    // Daily breakdown
    summary.dailyBreakdown = monthDays.map(d => ({
      date: d.date,
      revenue: d.totalRevenue,
      cost: d.totalCost,
      profit: d.grossProfit,
      orders: d.totalOrders,
      covers: d.totalCovers,
    }));

    // Save
    const monthLog = this.getMonthLog();
    const idx = monthLog.findIndex(m => m.monthStart === monthStart);
    if (idx !== -1) monthLog[idx] = summary;
    else monthLog.push(summary);
    monthLog.sort((a, b) => b.monthStart.localeCompare(a.monthStart));
    this.saveMonthLog(monthLog);
  },

  /** Force-generate weekly summary for a specific week */
  generateWeekSummary(dateStr) {
    const weekStart = this._getWeekStart(dateStr);
    const weekEnd = this._getWeekEnd(dateStr);
    this._generateWeeklySummary(weekStart, weekEnd);
  },

  /** Force-generate monthly summary for a specific month */
  generateMonthSummary(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const monthStart = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
    const monthEnd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    this._generateMonthlySummary(monthStart, monthEnd);
  },

  // ── Pantry (master ingredient inventory) ─────────────────
  getPantry()        { return this._get(STORAGE_KEYS.PANTRY, []); },
  savePantry(items)   {
    items.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    this._set(STORAGE_KEYS.PANTRY, items);
  },

  addPantryItem(item) {
    const pantry = this.getPantry();
    item.id = item.id || 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2,5);
    pantry.push(item);
    this.savePantry(pantry);   // savePantry auto-sorts A→Z
    return item;
  },
  updatePantryItem(id, updates) {
    const pantry = this.getPantry();
    const idx = pantry.findIndex(p => p.id === id);
    if (idx === -1) return null;
    pantry[idx] = { ...pantry[idx], ...updates };
    this.savePantry(pantry);   // re-sorts if name changed
    return pantry[idx];
  },
  deletePantryItem(id) {
    const pantry = this.getPantry().filter(p => p.id !== id);
    this.savePantry(pantry);
  },
  /** Get unit cost for a pantry item by id */
  getPantryUnitCost(id) {
    const item = this.getPantry().find(p => p.id === id);
    if (!item) return 0;
    return item.packCost / item.recipeUnitsPerPack;
  },

  // ── Full Reset ───────────────────────────────────────────
  resetAll() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    this.init();
  },

  resetMenuToDefaults() {
    this._set(STORAGE_KEYS.MENU, DEFAULT_MENU);
    this._set(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  },

  resetStaffToDefaults() {
    this._set(STORAGE_KEYS.STAFF, DEFAULT_STAFF);
  },

  resetPantryToDefaults() {
    this._set(STORAGE_KEYS.PANTRY, DEFAULT_PANTRY);
  },

  resetAllToDefaults() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    this.init();
  }
};
