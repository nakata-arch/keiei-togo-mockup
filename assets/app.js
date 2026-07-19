/* 経営統合システム カンプ v4.1 共通ナビ（ロール対応・フラットメニュー）
   - グループ見出しは廃止。薄い区切り線のみでブロックを分ける
   - アイコンは絵文字をやめSVGで統一
   - アカウント切替はサイドバー下部のユーザーカード → ポップオーバー（実UIの作法） */
(function () {

  /* ロール定義（⓪スタッフマスタ相当・カンプ用） */
  var USERS = {
    nakata:   { name: "中田 雄斗", role: "CAIO・管理者/経営", av: "中", home: "exec.html",          set: "admin" },
    kitayama: { name: "北山",      role: "代表・経営（営業）", av: "北", home: "home_kitayama.html", set: "admin" },
    imai:     { name: "今井",      role: "管理部（経理）",     av: "今", home: "home_imai.html",     set: "kanri" },
    kouda:    { name: "幸田 尚大", role: "コンサル部長（PM）", av: "幸", home: "home.html",          set: "bucho" },
    shintani: { name: "新谷 剛士", role: "営業部",             av: "新", home: "home_shintani.html", set: "ippan" },
    arakaki:  { name: "新垣",      role: "アシスタント",       av: "垣", home: "home_arakaki.html",  set: "asst" }
  };

  /* ログイン中ロールは localStorage が正（ページ遷移で役職が変わらない）。
     data-role はそのページの初期表示用フォールバック。 */
  var saved = null;
  try { saved = localStorage.getItem("kv4_role"); } catch (e) {}
  var ROLE = (saved && USERS[saved]) ? saved : (document.body.getAttribute("data-role") || "kouda");
  var U = USERS[ROLE] || USERS.kouda;
  var S = U.set;

  /* SVGアイコン（stroke 1.7 / 24box） */
  function svg(p) { return '<svg viewBox="0 0 24 24">' + p + "</svg>"; }
  var IC = {
    home:     svg('<path d="M3.5 11.5 12 4.5l8.5 7M6 10.5V19h12v-8.5"/>'),
    company:  svg('<path d="M4 19.5V6.8L12 3.5l8 3.3v12.7M2.5 19.5h19M9.5 19.5v-4h5v4M8.3 9h.01M12 9h.01M15.7 9h.01M8.3 12.3h.01M12 12.3h.01M15.7 12.3h.01"/>'),
    deals:    svg('<rect x="4" y="4" width="4.6" height="15.5" rx="1.2"/><rect x="10.2" y="4" width="4.6" height="10.5" rx="1.2"/><rect x="16.4" y="4" width="4.6" height="7" rx="1.2"/>'),
    invoice:  svg('<path d="M6.5 3h8l4 4v14h-12zM14.5 3v4h4M9.5 12h5.5M9.5 15.5h5.5M9.5 8.5h2.5"/>'),
    recon:    svg('<path d="M4.5 9a8 8 0 0 1 13.6-3.2L20 7.5M20 3.5v4h-4M19.5 15a8 8 0 0 1-13.6 3.2L4 16.5M4 20.5v-4h4"/>'),
    exec:     svg('<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4"/>'),
    budget:   svg('<path d="M4.5 19.5V5M4.5 19.5H20M8.5 16v-5.5M12.5 16V8M16.5 16v-3.5"/>'),
    cash:     svg('<rect x="3" y="7" width="18" height="10.5" rx="2"/><circle cx="12" cy="12.2" r="2.6"/><path d="M6 10h.01M18 14.5h.01"/>'),
    award:    svg('<circle cx="12" cy="9" r="5.2"/><path d="M9.2 13.4 8 21l4-2.1L16 21l-1.2-7.6"/>'),
    clock:    svg('<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.4 2"/>'),
    payslip:  svg('<rect x="4" y="4.5" width="16" height="15" rx="2"/><path d="M8 9.5h8M8 12.7h8M8 15.9h4.5"/>'),
    folder:   svg('<path d="M3 6.2A1.8 1.8 0 0 1 4.8 4.4h4.3L11 7h8.2A1.8 1.8 0 0 1 21 8.8v9A1.8 1.8 0 0 1 19.2 19.6H4.8A1.8 1.8 0 0 1 3 17.8z"/>'),
    portal:   svg('<rect x="7" y="2.7" width="10" height="18.6" rx="2.4"/><path d="M12 6.2l1 2 2.2.3-1.6 1.6.4 2.2-2-1-2 1 .4-2.2L8.8 8.5l2.2-.3z"/>'),
    gear:     svg('<circle cx="12" cy="12" r="3.1"/><path d="M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21M5.6 5.6l1.9 1.9M16.5 16.5l1.9 1.9M18.4 5.6l-1.9 1.9M7.5 16.5l-1.9 1.9"/>'),
    book:     svg('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21zM4 18.5V5.5M20 18.5H6.5M8.5 7.5h7M8.5 11h7"/>')
  };

  /* メニュー（見出しなし・ブロック区切りのみ。sets＝⑨権限マトリクス準拠） */
  var ALL = ["admin", "kanri", "bucho", "ippan", "asst"];
  var BLOCKS = [
    [ { id: "home", file: U.home, ic: IC.home, label: "ホーム", count: "5", alert: true, sets: ALL } ],
    [ { id: "companies", file: "companies.html", ic: IC.company, label: "会社", sets: ["admin", "kanri", "bucho", "ippan"] },
      { id: "deals",     file: "deals.html",     ic: IC.deals,   label: "案件", sets: ALL } ],
    [ { id: "invoices",  file: "invoices.html",  ic: IC.invoice, label: "支払処理", count: "4", sets: ["admin", "kanri"] },
      { id: "reconcile", file: "reconcile.html", ic: IC.recon,   label: "入金消込", count: "3", sets: ["admin", "kanri"] } ],
    [ { id: "exec",       file: "exec.html",     ic: IC.exec,   label: "経営サマリー", sets: ["admin", "kanri", "bucho"] },
      { id: "budget",     file: "budget.html",   ic: IC.budget, label: "予算・実績",   sets: ["admin", "kanri", "bucho"] },
      { id: "cashflow",   file: "cashflow.html", ic: IC.cash,   label: "キャッシュフロー", sets: ["admin", "kanri", "bucho"] },
      { id: "evaluation", file: (S === "ippan" || S === "asst") ? "evaluation_member.html" : "evaluation.html",
        ic: IC.award, label: "評価・賞与", sets: ALL } ],
    [ { id: "attendance", file: "attendance.html", ic: IC.clock,   label: "勤怠", sets: ["admin", "kanri", "ippan", "asst"] },
      { id: "payslips",   file: "payslips.html",   ic: IC.payslip, label: "給与・報酬明細", sets: ALL },
      /* 文書は会社・案件詳細のタブが主導線。独立ページは電帳法検索を担う管理系のみ */
      { id: "documents",  file: "documents.html",  ic: IC.folder,  label: "文書", sets: ["admin", "kanri"] } ],
    [ { id: "portal", file: "portal.html", ic: IC.portal, label: "顧客ポータル", sets: ["admin", "kanri", "bucho"] },
      { id: "rules",  file: "rules.html",  ic: IC.book,   label: "ルール", sets: ALL } ]
  ];
  var TAIL = { id: "settings", file: "settings.html", ic: IC.gear, label: "設定", sets: ["admin"] };

  var active = document.body.getAttribute("data-page") || "home";

  function item(it) {
    return '<a class="nav-item' + (it.id === active ? " active" : "") + '" href="' + it.file + '">' + it.ic + it.label +
           (it.count ? '<span class="count' + (it.alert ? " alert" : "") + '">' + it.count + "</span>" : "") + "</a>";
  }

  var el = document.getElementById("nav");
  if (el) {
    var h = '<div class="brand"><span class="dot">IS</span><span>経営統合システム<small>Initial State / Bizplan</small></span></div>';
    var first = true;
    BLOCKS.forEach(function (block) {
      var items = block.filter(function (it) { return it.sets.indexOf(S) !== -1; });
      if (!items.length) return;
      if (!first) h += '<div class="nav-sep"></div>';
      first = false;
      items.forEach(function (it) { h += item(it); });
    });
    h += '<div class="nav-spacer"></div>';
    if (TAIL.sets.indexOf(S) !== -1) h += item(TAIL);

    /* アカウントメニュー（ユーザーカード → ポップオーバー） */
    h += '<div class="userpop" id="userPop"><div class="up-label">アカウントを切替</div>';
    Object.keys(USERS).forEach(function (k) {
      var u = USERS[k];
      h += '<div class="up-item" data-u="' + k + '"><span class="av" style="background:var(--navy-3)">' + u.av + '</span>' +
           '<span><span class="nm">' + u.name + '</span><br><span class="rl">' + u.role + "</span></span>" +
           (k === ROLE ? '<span class="cur">✓</span>' : "") + "</div>";
    });
    h += '<div class="up-sep"></div><a class="up-item" href="login.html"><span class="av" style="background:rgba(255,255,255,.12)">⎋</span><span class="nm">ログアウト</span></a></div>';
    h += '<div class="side-user" id="userBtn"><div class="av">' + U.av + '</div><div><div class="nm">' + U.name + '</div><div class="rl">' + U.role + '</div></div><span class="chev">▾</span></div>';
    el.innerHTML = h;

    var btn = document.getElementById("userBtn"), pop = document.getElementById("userPop");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      pop.classList.toggle("open");
      btn.classList.toggle("open");
    });
    pop.querySelectorAll(".up-item[data-u]").forEach(function (row) {
      row.addEventListener("click", function () {
        var k = row.getAttribute("data-u");
        try { localStorage.setItem("kv4_role", k); } catch (e) {}
        location.href = USERS[k].home;
      });
    });
    var lo = pop.querySelector('a[href="login.html"]');
    if (lo) lo.addEventListener("click", function () { try { localStorage.removeItem("kv4_role"); } catch (e) {} });
    document.addEventListener("click", function () { pop.classList.remove("open"); btn.classList.remove("open"); });
  }

  /* 共通UI挙動 */
  window.openModal  = function (id) { var m = document.getElementById(id); if (m) m.classList.add("open"); };
  window.closeModal = function (id) { var m = document.getElementById(id); if (m) m.classList.remove("open"); };
  window.swTab = function (group, id) {
    document.querySelectorAll('.dtab[data-g="' + group + '"]').forEach(function (t) { t.classList.toggle("on", t.dataset.t === id); });
    document.querySelectorAll('.dpane[data-g="' + group + '"]').forEach(function (p) { p.classList.toggle("on", p.dataset.t === id); });
  };

  /* トースト（保存・実行の手応え） */
  window.toast = function (msg) {
    var c = document.getElementById("toastc");
    if (!c) { c = document.createElement("div"); c.id = "toastc"; c.className = "toastc"; document.body.appendChild(c); }
    var t = document.createElement("div"); t.className = "toast"; t.textContent = msg; c.appendChild(t);
    setTimeout(function () { t.classList.add("out"); setTimeout(function () { t.remove(); }, 260); }, 2400);
  };

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.classList && t.classList.contains("modal-bg")) t.classList.remove("open");
    if (t.classList && t.classList.contains("tgl")) t.classList.toggle("on");
    var chk = t.closest ? t.closest(".chk") : null;
    if (chk) { chk.classList.toggle("done"); var bx = chk.querySelector(".bx"); if (bx) bx.textContent = chk.classList.contains("done") ? "✓" : ""; }
    var cand = t.closest ? t.closest(".cand") : null;
    if (cand) { cand.parentElement.querySelectorAll(".cand").forEach(function (c) { c.classList.remove("sel"); }); cand.classList.add("sel"); }
    /* モーダルの主ボタン＝閉じてトースト（全モーダル共通の手応え） */
    var ok = t.closest ? t.closest(".modal-f .btn-primary") : null;
    if (ok) {
      var m = ok.closest(".modal-bg"); if (m) m.classList.remove("open");
      window.toast("✓ 「" + ok.textContent.trim() + "」を受け付けました（カンプのためデータは変わりません）");
    }
  });

  /* ===== ⌘K 検索パレット（画面・会社・案件・ルールを横断） ===== */
  var CMDK = [];
  BLOCKS.forEach(function (b) { b.forEach(function (it) { if (it.sets.indexOf(S) !== -1) CMDK.push({ g: "画面", n: it.label, f: it.file }); }); });
  if (TAIL.sets.indexOf(S) !== -1) CMDK.push({ g: "画面", n: TAIL.label, f: TAIL.file });
  [["アストロラボ株式会社", "リピート顧客・BPO契約中"], ["セルプスジャパン株式会社", "リピート顧客"], ["株式会社ティーガイア", "顧客・申請未着手"], ["株式会社リサスティー", "リピート顧客"], ["菱洋エレクトロ株式会社", "顧客・実施中"], ["古山精機株式会社", "見込み"]].forEach(function (c) { CMDK.push({ g: "会社", n: c[0], s: c[1], f: "company_detail.html" }); });
  [["IS-2026-0074", "アストロラボ｜課題解決型（申請・停滞8日）"], ["IS-2026-0081", "セルプスジャパン｜新事業進出（申請）"], ["IS-2026-0055", "リサスティー｜経営力強化（交付決定）"], ["IS-2026-0032", "菱洋エレクトロ｜省力化投資（実施）"]].forEach(function (d) { CMDK.push({ g: "案件", n: d[0], s: d[1], f: "deal_detail.html" }); });
  [["停滞の判定", "7営業日 動きなし"], ["受給目標", "BPO契約金額×2"], ["承認のしきい値", "50万円以上＝経営層会議"], ["締め→翌月請求", "レポート/BPO/着手金/成果報酬"]].forEach(function (r) { CMDK.push({ g: "ルール", n: r[0], s: r[1], f: "rules.html" }); });

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
    ckList.innerHTML = ckHits.length ? h : '<div class="cmdk-empty">該当なし — 会社名・案件番号・ルール名で検索できます</div>';
  }
  function ckGo() { if (ckHits[ckSel]) location.href = ckHits[ckSel].f; }
  window.openCmdk = function () {
    if (!ckBg) {
      ckBg = document.createElement("div"); ckBg.className = "cmdk-bg";
      ckBg.innerHTML = '<div class="cmdk"><input placeholder="会社・案件番号（IS-2026-…）・画面・ルールを検索" /><div class="cmdk-list"></div></div>';
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

  /* ファビコン（全ページ共通・タブで見分けがつく） */
  var fav = document.createElement("link"); fav.rel = "icon";
  fav.href = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#14233D"/><text x="32" y="43" font-family="Arial,sans-serif" font-size="27" font-weight="bold" fill="#FF914C" text-anchor="middle">IS</text></svg>');
  document.head.appendChild(fav);
})();
