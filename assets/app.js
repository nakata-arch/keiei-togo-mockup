/* 経営統合システム 共通ナビ（構造の正＝screens.yaml v0.3）
   - nav_structure.main: ホーム / 営業（獲得） / 経理処理 / 経営管理 / 人事(A-02仮) / 設定(=adminモード)
   - 設定はページ遷移ではなくモード：サイドバーを ST-01〜07 に差し替える（CLAUDE.md §2-1）
   - バッジはホーム内カードと1対1（CLAUDE.md §2-2 / Q9）。クリックで該当カードへスクロール
   - ブランド表記は「Initial State」のみ（CLAUDE.md §0） */
(function () {

  /* ロール定義（ST-05 スタッフマスタ相当・モック用） */
  var USERS = {
    nakata:   { name: "中田 雄斗", role: "CAIO・管理者/経営", av: "中", home: "home_nakata.html",   set: "admin", homeBadge: 2 },
    kitayama: { name: "北山",      role: "代表・経営（営業）", av: "北", home: "home_kitayama.html", set: "admin", homeBadge: 2 },
    imai:     { name: "今井",      role: "管理部（経理）",     av: "今", home: "home_imai.html",     set: "kanri", homeBadge: 4 },
    kouda:    { name: "幸田 尚大", role: "コンサル部長（PM）", av: "幸", home: "home.html",          set: "bucho", homeBadge: 4 },
    shintani: { name: "新谷 剛士", role: "営業部",             av: "新", home: "home_shintani.html", set: "ippan", homeBadge: 2 },
    arakaki:  { name: "新垣",      role: "アシスタント",       av: "垣", home: "home_arakaki.html",  set: "asst", homeBadge: 2 },
    customer: { name: "豊田 隆",   role: "アストロラボ株式会社 様", av: "豊", home: "portal_customer.html", set: "customer" }
  };

  var saved = null;
  try { saved = localStorage.getItem("kv4_role"); } catch (e) {}
  var ROLE = (saved && USERS[saved]) ? saved : (document.body.getAttribute("data-role") || "kouda");
  var U = USERS[ROLE] || USERS.kouda;
  var S = U.set;

  /* 顧客ロールは社内画面を開けない（P-01のみ） */
  if (S === "customer" && !document.body.hasAttribute("data-customer-page")) {
    location.replace("portal_customer.html");
    return;
  }

  /* SVGアイコン */
  function svg(p) { return '<svg viewBox="0 0 24 24">' + p + "</svg>"; }
  var IC = {
    home:     svg('<path d="M3.5 11.5 12 4.5l8.5 7M6 10.5V19h12v-8.5"/>'),
    company:  svg('<path d="M4 19.5V6.8L12 3.5l8 3.3v12.7M2.5 19.5h19M9.5 19.5v-4h5v4M8.3 9h.01M12 9h.01M15.7 9h.01M8.3 12.3h.01M12 12.3h.01M15.7 12.3h.01"/>'),
    deals:    svg('<rect x="4" y="4" width="4.6" height="15.5" rx="1.2"/><rect x="10.2" y="4" width="4.6" height="10.5" rx="1.2"/><rect x="16.4" y="4" width="4.6" height="7" rx="1.2"/>'),
    invoice:  svg('<path d="M6.5 3h8l4 4v14h-12zM14.5 3v4h4M9.5 12h5.5M9.5 15.5h5.5M9.5 8.5h2.5"/>'),
    recon:    svg('<path d="M4.5 9a8 8 0 0 1 13.6-3.2L20 7.5M20 3.5v4h-4M19.5 15a8 8 0 0 1-13.6 3.2L4 16.5M4 20.5v-4h4"/>'),
    exec:     svg('<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4"/>'),
    design:   svg('<path d="M4 20 20 4M4 20v-5M4 20h5M20 4h-5M20 4v5"/>'),
    budget:   svg('<path d="M4.5 19.5V5M4.5 19.5H20M8.5 16v-5.5M12.5 16V8M16.5 16v-3.5"/>'),
    cash:     svg('<rect x="3" y="7" width="18" height="10.5" rx="2"/><circle cx="12" cy="12.2" r="2.6"/><path d="M6 10h.01M18 14.5h.01"/>'),
    award:    svg('<circle cx="12" cy="9" r="5.2"/><path d="M9.2 13.4 8 21l4-2.1L16 21l-1.2-7.6"/>'),
    clock:    svg('<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.4 2"/>'),
    payslip:  svg('<rect x="4" y="4.5" width="16" height="15" rx="2"/><path d="M8 9.5h8M8 12.7h8M8 15.9h4.5"/>'),
    folder:   svg('<path d="M3 6.2A1.8 1.8 0 0 1 4.8 4.4h4.3L11 7h8.2A1.8 1.8 0 0 1 21 8.8v9A1.8 1.8 0 0 1 19.2 19.6H4.8A1.8 1.8 0 0 1 3 17.8z"/>'),
    portal:   svg('<rect x="7" y="2.7" width="10" height="18.6" rx="2.4"/><path d="M12 6.2l1 2 2.2.3-1.6 1.6.4 2.2-2-1-2 1 .4-2.2L8.8 8.5l2.2-.3z"/>'),
    book:     svg('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21zM4 18.5V5.5M20 18.5H6.5M8.5 7.5h7M8.5 11h7"/>'),
    users:    svg('<circle cx="9" cy="8.5" r="3.5"/><path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5M16 4.6a3.5 3.5 0 0 1 0 7.8M17.5 14.7c2 .7 3 2.3 3 4.8"/>'),
    master:   svg('<path d="M4 6.5C4 5 7.6 4 12 4s8 1 8 2.5S16.4 9 12 9 4 8 4 6.5zM4 6.5v11C4 19 7.6 20 12 20s8-1 8-2.5v-11M4 12c0 1.5 3.6 2.5 8 2.5s8-1 8-2.5"/>'),
    plug:     svg('<path d="M9 7V3.5M15 7V3.5M7 7h10v4a5 5 0 0 1-10 0zM12 16v4.5"/>'),
    gear:     svg('<circle cx="12" cy="12" r="3.1"/><path d="M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21M5.6 5.6l1.9 1.9M16.5 16.5l1.9 1.9M18.4 5.6l-1.9 1.9M7.5 16.5l-1.9 1.9"/>'),
    flow:     svg('<circle cx="6" cy="6" r="2.4"/><circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="12" r="2.4"/><path d="M8.4 6H13a3 3 0 0 1 3 3v.6M8.4 18H13a3 3 0 0 0 3-3v-.6"/>')
  };

  var ALL = ["admin", "kanri", "bucho", "ippan", "asst"];

  /* ===== 主ナビ（screens.yaml nav_structure.main）===== */
  var MAIN = [
    { items: [ { id: "home", file: U.home, ic: IC.home, label: "ホーム",
                 count: U.homeBadge, alert: true, anchor: "#alerts", sets: ALL } ] },
    { label: "営業管理", items: [   /* v0.4 Pillar A: 獲得までの管理（lead→契約締結） */
      { id: "companies", file: "companies.html", ic: IC.company, label: "会社（顧客）",  /* E-01（E-02はここから遷移） */
        sets: ["admin", "kanri", "bucho", "ippan"] },
      { id: "deals",     file: "deals.html",     ic: IC.deals,   label: "営業", sets: ALL } ] },   /* E-03 販売パイプライン */
    { label: "案件管理", items: [   /* v0.4 Pillar A: 契約後の履行管理（役務進行＋請求入金＋売上経費） */
      { id: "projects",  file: "projects.html",  ic: IC.flow,    label: "案件", sets: ALL } ] },   /* E-05 種別別ビュー */
    { label: "経理処理", items: [   /* A-01: 経理処理と経営管理の分離は仮 */
      { id: "invoices",  file: "invoices.html",  ic: IC.invoice, label: "支払処理", count: 4, anchor: "#alerts", sets: ["admin", "kanri"] },   /* K-01 */
      { id: "reconcile", file: "reconcile.html", ic: IC.recon,   label: "入金消込", count: 3, anchor: "#alerts", sets: ["admin", "kanri"] } ] }, /* K-02 */
    { label: "経営管理", items: [
      { id: "exec",     file: "exec.html",     ic: IC.exec,   label: "経営サマリー", sets: ["admin", "kanri", "bucho"] },   /* M-01 */
      { id: "budget",   file: "budget.html",   ic: IC.budget, label: "予算・実績",   sets: ["admin", "kanri", "bucho"] },   /* M-02 閲覧のみ・編集はST-01(A-01仮) */
      { id: "cashflow", file: "cashflow.html", ic: IC.cash,   label: "キャッシュフロー", sets: ["admin", "kanri", "bucho"] } ] }, /* M-03 */
    { label: "人事", items: [   /* A-02: 評価・賞与の「人事」配置は仮 */
      { id: "attendance", file: "attendance.html", ic: IC.clock,   label: "勤怠", sets: ["admin", "kanri", "ippan", "asst"] },  /* J-01 */
      { id: "payslips",   file: "payslips.html",   ic: IC.payslip, label: "給与・報酬明細", sets: ALL },                        /* J-02 */
      { id: "evaluation", file: (S === "ippan" || S === "asst") ? "evaluation_member.html" : "evaluation.html",
        ic: IC.award, label: "評価・賞与", sets: ALL } ] }                                                                       /* J-03 */
  ];

  /* ===== 設定モードのナビ（screens.yaml nav_structure.admin：ST-01〜07）===== */
  var ADMIN = [
    { id: "budget_design", file: "budget_design.html",    ic: IC.design, label: "予算設計（編集）" }, /* ST-01 */
    { id: "rules",         file: "st02_rules.html",       ic: IC.book,   label: "ルール編集" },        /* ST-02 編集エンジン（値の正本）。閲覧はrules.html＝A-11/Z-05 */
    { id: "documents",     file: "documents.html",        ic: IC.folder, label: "文書テンプレート" },  /* ST-03 */
    { id: "portal",        file: "portal.html",           ic: IC.portal, label: "顧客ポータル管理" },  /* ST-04 */
    { id: "settings",      file: "settings.html",         ic: IC.users,  label: "権限・ユーザー" },    /* ST-05 */
    { id: "st06",          file: "st06_master.html",      ic: IC.master, label: "マスタ" },            /* ST-06 */
    { id: "st07",          file: "st07_integrations.html", ic: IC.plug,  label: "連携設定" }           /* ST-07 */
  ];
  var ADMIN_PAGES = ADMIN.map(function (a) { return a.id; });

  var active = document.body.getAttribute("data-page") || "home";
  var isAdminPage = ADMIN_PAGES.indexOf(active) !== -1;

  function item(it) {
    return '<a class="nav-item' + (it.id === active ? " active" : "") + '" href="' + it.file + '">' + it.ic + it.label +
           (it.count ? '<span class="count' + (it.alert ? " alert" : "") + '" data-go="' + it.file + (it.anchor || "") + '">' + it.count + "</span>" : "") + "</a>";
  }

  var el = document.getElementById("nav");

  function renderMain() {
    var h = '<div class="brand"><span class="dot">IS</span><span>経営統合システム<small>Initial State</small></span></div>';
    var first = true;
    MAIN.forEach(function (g) {
      var items = g.items.filter(function (it) { return it.sets.indexOf(S) !== -1; });
      if (!items.length) return;
      if (g.label) {
        h += '<div class="nav-g"><div class="nav-gh">' + g.label + '<span class="gc">▾</span></div><div class="nav-gb">' + items.map(item).join("") + "</div></div>";
      } else {
        if (!first) h += '<div class="nav-sep"></div>';
        h += items.map(item).join("");
      }
      first = false;
    });
    h += '<div class="nav-spacer"></div>';
    /* 設定＝モード切替（ページ遷移ではない・adminロールのみ表示 §2-1） */
    if (S === "admin") h += '<a class="nav-item" id="openAdmin" href="#">' + IC.gear + "設定</a>";
    return h;
  }

  function renderAdmin() {
    var h = '<div class="brand"><span class="dot">IS</span><span>経営統合システム<small>Initial State</small></span></div>';
    h += '<a class="nav-item" id="closeAdmin" href="#" style="color:var(--gold)">' + IC.home + "← 設定を閉じる</a>";
    h += '<div class="nav-sep"></div><div class="nav-gh" style="cursor:default">設定（管理者）</div>';
    ADMIN.forEach(function (a) {
      h += '<a class="nav-item' + (a.id === active ? " active" : "") + '" href="' + a.file + '">' + a.ic + a.label + "</a>";
    });
    h += '<div class="nav-spacer"></div>';
    return h;
  }

  function userFooter() {
    var h = '<div class="userpop" id="userPop"><div class="up-label">アカウントを切替</div>';
    Object.keys(USERS).forEach(function (k) {
      var u = USERS[k];
      if (k === "customer") h += '<div class="up-sep"></div><div class="up-label">顧客（ポータルのデモ）</div>';
      h += '<div class="up-item" data-u="' + k + '"><span class="av" style="background:var(--navy-3)">' + u.av + '</span>' +
           '<span><span class="nm">' + u.name + '</span><br><span class="rl">' + u.role + "</span></span>" +
           (k === ROLE ? '<span class="cur">✓</span>' : "") + "</div>";
    });
    h += '<div class="up-sep"></div><a class="up-item" href="login.html"><span class="av" style="background:rgba(255,255,255,.12)">⎋</span><span class="nm">ログアウト</span></a></div>';
    h += '<div class="side-user" id="userBtn"><div class="av">' + U.av + '</div><div><div class="nm">' + U.name + '</div><div class="rl">' + U.role + '</div></div><span class="chev">▾</span></div>';
    return h;
  }

  function bindNav() {
    el.querySelectorAll(".nav-g .nav-gh").forEach(function (gh) {
      gh.addEventListener("click", function () { gh.parentElement.classList.toggle("closed"); });
    });
    /* バッジクリック→該当カードへ（§2-2） */
    el.querySelectorAll(".count[data-go]").forEach(function (c) {
      c.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); location.href = c.getAttribute("data-go"); });
    });
    var oa = document.getElementById("openAdmin");
    if (oa) oa.addEventListener("click", function (e) { e.preventDefault(); mode = "admin"; paint(); });
    var ca = document.getElementById("closeAdmin");
    if (ca) ca.addEventListener("click", function (e) {
      e.preventDefault();
      if (isAdminPage) { location.href = U.home; }   /* admin画面上で閉じたらホームへ */
      else { mode = "main"; paint(); }
    });
    var btn = document.getElementById("userBtn"), pop = document.getElementById("userPop");
    btn.addEventListener("click", function (e) { e.stopPropagation(); pop.classList.toggle("open"); btn.classList.toggle("open"); });
    pop.querySelectorAll(".up-item[data-u]").forEach(function (row) {
      row.addEventListener("click", function () {
        var k = row.getAttribute("data-u");
        try { localStorage.setItem("kv4_role", k); } catch (e) {}
        location.href = USERS[k].home;
      });
    });
    var lo = pop.querySelector('a[href="login.html"]');
    if (lo) lo.addEventListener("click", function () { try { localStorage.removeItem("kv4_role"); } catch (e) {} });
  }

  var mode = isAdminPage ? "admin" : "main";
  function paint() {
    el.innerHTML = (mode === "admin" ? renderAdmin() : renderMain()) + userFooter();
    bindNav();
  }
  if (el) {
    if (isAdminPage && S !== "admin") { location.replace(U.home); return; }  /* 権限外はST-xxに入れない */
    paint();
    document.addEventListener("click", function () {
      var p = document.getElementById("userPop"), b = document.getElementById("userBtn");
      if (p) p.classList.remove("open"); if (b) b.classList.remove("open");
    });
  }

  /* バッジ遷移先のハイライト（#alerts） */
  if (location.hash === "#alerts") {
    var t = document.getElementById("alerts");
    if (t) { t.scrollIntoView({ block: "center" }); t.classList.add("pulse"); setTimeout(function () { t.classList.remove("pulse"); }, 2400); }
  }

  /* 共通UI挙動 */
  window.openModal  = function (id) { var m = document.getElementById(id); if (m) m.classList.add("open"); };
  window.closeModal = function (id) { var m = document.getElementById(id); if (m) m.classList.remove("open"); };
  window.swTab = function (group, id) {
    document.querySelectorAll('.dtab[data-g="' + group + '"]').forEach(function (t) { t.classList.toggle("on", t.dataset.t === id); });
    document.querySelectorAll('.dpane[data-g="' + group + '"]').forEach(function (p) { p.classList.toggle("on", p.dataset.t === id); });
  };
  window.toast = function (msg) {
    var c = document.getElementById("toastc");
    if (!c) { c = document.createElement("div"); c.id = "toastc"; c.className = "toastc"; document.body.appendChild(c); }
    var t = document.createElement("div"); t.className = "toast"; t.textContent = msg; c.appendChild(t);
    setTimeout(function () { t.classList.add("out"); setTimeout(function () { t.remove(); }, 260); }, 2400);
  };
  /* ===== 案件ステータス（販売パイプライン10ステージ）=====
     正＝domain/anken-status.state.mmd（A-03確定）。next[] は state.mmd の「UIが許可する遷移」。
     本流は前進のみ／失注はアクティブ全段階から／長期リード→アポ確の復帰／その他の逆走は不可（例外はHubSpotで直接修正）。 */
  var STAGES = {
    lead:     { label: "リード",                 badge: "b-sub",  next: ["apo", "longlead", "noneeds"] },
    apo:      { label: "アポ確",                 badge: "b-blue", next: ["shodan", "haiki", "lost"] },
    shodan:   { label: "商談中・提案準備中",       badge: "b-blue", next: ["teiango", "lost"] },
    teiango:  { label: "提案後",                 badge: "b-warn", next: ["closing", "lost"] },
    closing:  { label: "クロージング・契約書締結待", badge: "b-warn", next: ["won", "lost"] },
    won:      { label: "成約・契約書締結済",       badge: "b-good", next: ["cancel"] },
    longlead: { label: "長期リード",             badge: "b-sub",  next: ["apo"] },
    lost:     { label: "失注",                   badge: "b-red",  next: [] },
    noneeds:  { label: "ニーズなし",             badge: "b-sub",  next: [] },
    haiki:    { label: "破棄・ニーズ評価",         badge: "b-red",  next: [] },
    cancel:   { label: "キャンセル",             badge: "b-red",  next: [] }
  };
  window.STAGES = STAGES;
  window.stageBadge = function (k) { var s = STAGES[k]; return s ? '<span class="badge ' + s.badge + '"><span class="d"></span>' + s.label + "</span>" : k; };
  window.openStatus = function (dealNo, cur) {
    var s = STAGES[cur] || STAGES.lead;
    document.querySelectorAll("#stModal").forEach(function (n) { n.remove(); });
    var body, foot;
    if (s.next.length) {
      body = '<div class="hint-t" style="margin-bottom:12px">' + dealNo + ' の現在：' + window.stageBadge(cur) +
             '<br>許可された遷移のみ選べます（正＝anken-status.state.mmd）。逆走・スキップは不可。</div>' +
             s.next.map(function (k) {
               return '<div class="cand" data-k="' + k + '" style="display:flex;gap:10px;align-items:center;padding:11px 13px;border:1.5px solid var(--line);border-radius:10px;cursor:pointer;margin-bottom:8px">' +
                      window.stageBadge(k) + (k === "lost" ? '<span style="font-size:11px;color:var(--faint)">アクティブ全段階から可</span>' : "") + "</div>";
             }).join("");
      foot = '<span class="btn btn-ghost" onclick="closeModal(\'stModal\')">キャンセル</span><span class="btn btn-primary">この段階へ更新</span>';
    } else {
      body = '<div class="hint-t">' + dealNo + ' の現在：' + window.stageBadge(cur) +
             ' は本流の終端です。ここからの前進はありません。失注へ戻す等の例外は HubSpot で直接修正します。</div>';
      foot = '<span class="btn btn-ghost" onclick="closeModal(\'stModal\')">閉じる</span>';
    }
    var m = document.createElement("div"); m.className = "modal-bg open"; m.id = "stModal";
    m.innerHTML = '<div class="modal"><div class="modal-h"><span class="t">ステータスを更新</span><span class="x" onclick="closeModal(\'stModal\')">✕</span></div>' +
                  '<div class="modal-b">' + body + '</div>' +
                  '<div class="modal-f">' + foot +
                  '</div><div class="hint-t" style="padding:0 20px 14px">HubSpot（正本）へ書き込み、成功応答を受けてから画面に反映します（楽観更新なし・CLAUDE.md §1-2）。失敗時は反映せずエラー表示。</div></div>';
    document.body.appendChild(m);
  };

  /* ===== 役務進行（補助金/助成金の consult-status）=====
     正＝domain/consult-status.state.mmd。案件ステータス（販売パイプライン）とは別軸。
     「採択」＝成果報酬の請求トリガー。前進基本・逆走はHubSpotで直接。 */
  var CONSULT = {
    chakushu:     { label: "着手",       badge: "b-sub",  next: ["kofushinsei", "chushi"] },
    kofushinsei:  { label: "交付申請",   badge: "b-warn", next: ["saitaku", "fusaitaku", "chushi"] },
    saitaku:      { label: "採択",       badge: "b-good", next: ["kofukettei"] },
    kofukettei:   { label: "交付決定",   badge: "b-blue", next: ["jisshi"] },
    jisshi:       { label: "実施",       badge: "b-blue", next: ["jissekihokoku"] },
    jissekihokoku:{ label: "実績報告",   badge: "b-warn", next: ["kokahokoku"] },
    kokahokoku:   { label: "効果報告",   badge: "b-warn", next: ["kanryo"] },
    kanryo:       { label: "完了",       badge: "b-good", next: [] },
    fusaitaku:    { label: "不採択",     badge: "b-red",  next: [] },
    chushi:       { label: "中止",       badge: "b-sub",  next: [] }
  };
  window.CONSULT = CONSULT;
  window.consultBadge = function (k) { var s = CONSULT[k]; return s ? '<span class="badge ' + s.badge + '"><span class="d"></span>' + s.label + "</span>" : k; };
  window.openConsult = function (dealNo, cur) {
    var s = CONSULT[cur] || CONSULT.chakushu;
    document.querySelectorAll("#stModal").forEach(function (n) { n.remove(); });
    var body, foot;
    if (s.next.length) {
      body = '<div class="hint-t" style="margin-bottom:12px">' + dealNo + ' の役務ステージ 現在：' + window.consultBadge(cur) +
             '<br>正＝consult-status.state.mmd。前進のみ（逆走はHubSpotで直接）。' +
             (cur === "kofushinsei" ? '「採択」に進むと<b>成果報酬の請求</b>が起票されます。' : "") +
             (cur === "saitaku" || cur === "kofushinsei" ? '交付決定前の発注は警告のみ（ブロックしない）。' : "") + "</div>" +
             s.next.map(function (k) {
               return '<div class="cand" data-k="' + k + '" style="display:flex;gap:10px;align-items:center;padding:11px 13px;border:1.5px solid var(--line);border-radius:10px;cursor:pointer;margin-bottom:8px">' +
                      window.consultBadge(k) + (k === "saitaku" ? '<span style="font-size:11px;color:var(--good)">→ 成果報酬を請求へ</span>' : "") + "</div>";
             }).join("");
      foot = '<span class="btn btn-ghost" onclick="closeModal(\'stModal\')">キャンセル</span><span class="btn btn-primary">この役務ステージへ更新</span>';
    } else {
      body = '<div class="hint-t">' + dealNo + ' の役務ステージ：' + window.consultBadge(cur) + ' はこれ以上進みません。</div>';
      foot = '<span class="btn btn-ghost" onclick="closeModal(\'stModal\')">閉じる</span>';
    }
    var m = document.createElement("div"); m.className = "modal-bg open"; m.id = "stModal";
    m.innerHTML = '<div class="modal"><div class="modal-h"><span class="t">役務ステージを更新</span><span class="x" onclick="closeModal(\'stModal\')">✕</span></div>' +
                  '<div class="modal-b">' + body + '</div><div class="modal-f">' + foot +
                  '</div><div class="hint-t" style="padding:0 20px 14px">HubSpot（正本）へ書き込み、成功応答後に反映（楽観更新なし）。採択＝成果報酬の請求トリガー（board連携）。</div></div>';
    document.body.appendChild(m);
  };

  /* ===== 種別別の役務ステータス（軽量・レポート/BPO/その他）=====
     補助金助成金は consult-status（上の CONSULT）が正。以下は種別ごとの軽量な状態フィールド（v0.4.1）。
     混在させず、案件管理（E-05）の種別タブごとに独立ステータスとして持つ。 */
  var STAGEMAPS = {
    report: { title: "レポート 役務", steps: {
      juchu:  { label: "受注", badge: "b-sub",  next: ["seisaku"] },
      seisaku:{ label: "制作", badge: "b-blue", next: ["nohin"] },
      nohin:  { label: "納品", badge: "b-warn", next: ["kanryo"] },
      kanryo: { label: "完了", badge: "b-good", next: [] } } },
    bpo: { title: "BPO 役務", steps: {
      jisshi: { label: "実施中", badge: "b-blue", next: ["kanryo"] },
      kanryo: { label: "完了",   badge: "b-good", next: [] } } },   /* 完了＝受給が契約と同額の見込み（A-13） */
    other: { title: "その他 役務", steps: {
      hassei: { label: "案件発生", badge: "b-sub",  next: ["jisshi"] },
      jisshi: { label: "実施",     badge: "b-blue", next: ["kanryo"] },
      kanryo: { label: "完了",     badge: "b-good", next: [] } } }
  };
  window.openStage = function (kind, dealNo, cur) {
    var map = STAGEMAPS[kind]; if (!map) return;
    var s = map.steps[cur] || map.steps[Object.keys(map.steps)[0]];
    document.querySelectorAll("#stModal").forEach(function (n) { n.remove(); });
    function bd(k) { var x = map.steps[k]; return x ? '<span class="badge ' + x.badge + '"><span class="d"></span>' + x.label + "</span>" : k; }
    var body, foot;
    if (s.next.length) {
      body = '<div class="hint-t" style="margin-bottom:12px">' + dealNo + '（' + map.title + '） 現在：' + bd(cur) + '<br>前進のみ。' +
             (kind === "bpo" ? "完了＝受給が契約金額と同額の見込み（A-13）。" : "") + "</div>" +
             s.next.map(function (k) { return '<div class="cand" data-k="' + k + '" style="display:flex;gap:10px;align-items:center;padding:11px 13px;border:1.5px solid var(--line);border-radius:10px;cursor:pointer;margin-bottom:8px">' + bd(k) + "</div>"; }).join("");
      foot = '<span class="btn btn-ghost" onclick="closeModal(\'stModal\')">キャンセル</span><span class="btn btn-primary">この役務ステージへ更新</span>';
    } else {
      body = '<div class="hint-t">' + dealNo + '（' + map.title + '） 現在：' + bd(cur) + ' は完了です。</div>';
      foot = '<span class="btn btn-ghost" onclick="closeModal(\'stModal\')">閉じる</span>';
    }
    var m = document.createElement("div"); m.className = "modal-bg open"; m.id = "stModal";
    m.innerHTML = '<div class="modal"><div class="modal-h"><span class="t">' + map.title + 'を更新</span><span class="x" onclick="closeModal(\'stModal\')">✕</span></div>' +
                  '<div class="modal-b">' + body + '</div><div class="modal-f">' + foot +
                  '</div><div class="hint-t" style="padding:0 20px 14px">種別別の軽量ステータス。成功応答後に反映（楽観更新なし）。補助金助成金は consult-status を正とする。</div></div>';
    document.body.appendChild(m);
  };

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.classList && t.classList.contains("modal-bg")) t.classList.remove("open");
    if (t.classList && t.classList.contains("tgl")) t.classList.toggle("on");
    var chk = t.closest ? t.closest(".chk") : null;
    if (chk) { chk.classList.toggle("done"); var bx = chk.querySelector(".bx"); if (bx) bx.textContent = chk.classList.contains("done") ? "✓" : ""; }
    var cand = t.closest ? t.closest(".cand") : null;
    if (cand) { cand.parentElement.querySelectorAll(".cand").forEach(function (c) { c.classList.remove("sel"); }); cand.classList.add("sel"); }
    var ok = t.closest ? t.closest(".modal-f .btn-primary") : null;
    if (ok) {
      var m = ok.closest(".modal-bg"); if (m) m.classList.remove("open");
      window.toast("✓ 「" + ok.textContent.trim() + "」を受け付けました（モックのためデータは変わりません）");
    }
  });

  /* ===== ⌘K 検索パレット ===== */
  var CMDK = [];
  MAIN.forEach(function (b) { b.items.forEach(function (it) { if (it.sets.indexOf(S) !== -1) CMDK.push({ g: "画面", n: it.label, f: it.file }); }); });
  if (S === "admin") ADMIN.forEach(function (a) { CMDK.push({ g: "設定", n: a.label, f: a.file }); });
  [["アストロラボ株式会社", "リピート顧客・BPO契約中"], ["セルプスジャパン株式会社", "リピート顧客"], ["株式会社ティーガイア", "顧客・申請未着手"], ["株式会社リサスティー", "リピート顧客"], ["菱洋エレクトロ株式会社", "顧客・実施中"], ["古山精機株式会社", "見込み"]].forEach(function (c) { CMDK.push({ g: "会社", n: c[0], s: c[1], f: "company_detail.html" }); });
  [["IS-2026-0074", "アストロラボ｜課題解決型・成約（補助金 履行=交付申請/停滞8日）"], ["IS-2026-0081", "セルプスジャパン｜新事業進出・クロージング"], ["IS-2026-0098", "ティーガイア｜省力化投資・アポ確"], ["IS-2026-0032", "菱洋エレクトロ｜省力化投資・成約（履行=実施）"]].forEach(function (d) { CMDK.push({ g: "案件", n: d[0], s: d[1], f: "deal_detail.html" }); });   /* E-04 案件詳細（ステータス=販売パイプライン／A-03確定） */
  CMDK.push({ g: "参照", n: "運用ルール集", s: "現場が読む手引き（閲覧専用・値の正本はST-02）", f: "rules.html" });

  var ckBg = null, ckInp = null, ckList = null, ckSel = 0, ckHits = [];
  function ckRender(q) {
    q = (q || "").toLowerCase();
    ckHits = CMDK.filter(function (x) { return !q || (x.n + " " + (x.s || "") + " " + x.g).toLowerCase().indexOf(q) !== -1; });
    ckSel = 0;
    var h = "", lastG = null;
    ckHits.forEach(function (x, i) {
      if (x.g !== lastG) { h += '<div class="cmdk-g">' + x.g + "</div>"; lastG = x.g; }
      h += '<div class="cmdk-it' + (i === 0 ? " sel" : "") + '" data-i="' + i + '"><b>' + x.n + "</b>" + (x.s ? '<span style="color:var(--faint);font-size:11.5px">' + x.s + "</span>" : "") + '<span class="tag">↵</span></div>';
    });
    ckList.innerHTML = ckHits.length ? h : '<div class="cmdk-empty">該当なし — 会社名・案件番号・画面名で検索できます</div>';
  }
  function ckGo() { if (ckHits[ckSel]) location.href = ckHits[ckSel].f; }
  window.openCmdk = function () {
    if (!ckBg) {
      ckBg = document.createElement("div"); ckBg.className = "cmdk-bg";
      ckBg.innerHTML = '<div class="cmdk"><input placeholder="会社・案件番号（IS-2026-…）・画面を検索" /><div class="cmdk-list"></div></div>';
      document.body.appendChild(ckBg);
      ckInp = ckBg.querySelector("input"); ckList = ckBg.querySelector(".cmdk-list");
      ckInp.addEventListener("input", function () { ckRender(ckInp.value); });
      ckBg.addEventListener("mousedown", function (e) { if (e.target === ckBg) window.closeCmdk(); });
      ckList.addEventListener("click", function (e) { var it = e.target.closest(".cmdk-it"); if (it) { ckSel = +it.getAttribute("data-i"); ckGo(); } });
    }
    ckRender(""); ckInp.value = ""; ckBg.classList.add("open"); setTimeout(function () { ckInp.focus(); }, 30);
  };
  window.closeCmdk = function () { if (ckBg) ckBg.classList.remove("open"); };
  document.querySelectorAll(".search").forEach(function (s) { s.addEventListener("click", window.openCmdk); });

  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); window.openCmdk(); return; }
    if (ckBg && ckBg.classList.contains("open")) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        ckSel = Math.max(0, Math.min(ckHits.length - 1, ckSel + (e.key === "ArrowDown" ? 1 : -1)));
        ckList.querySelectorAll(".cmdk-it").forEach(function (n) { n.classList.toggle("sel", +n.getAttribute("data-i") === ckSel); });
        var cur = ckList.querySelector(".cmdk-it.sel"); if (cur) cur.scrollIntoView({ block: "nearest" });
      }
      if (e.key === "Enter") ckGo();
    }
    if (e.key === "Escape") {
      window.closeCmdk();
      document.querySelectorAll(".modal-bg.open").forEach(function (m) { m.classList.remove("open"); });
      var p = document.getElementById("userPop"); if (p) p.classList.remove("open");
      var b = document.getElementById("userBtn"); if (b) b.classList.remove("open");
    }
  });

  /* ファビコン */
  var fav = document.createElement("link"); fav.rel = "icon";
  fav.href = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#14233D"/><text x="32" y="43" font-family="Arial,sans-serif" font-size="27" font-weight="bold" fill="#FF914C" text-anchor="middle">IS</text></svg>');
  document.head.appendChild(fav);
})();
