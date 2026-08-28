/* =============================================
   GALLERY DOT — AFTER IMAGE LP
   script.js
============================================= */

'use strict';

/* ── Fade-in (IntersectionObserver) ── */
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 60);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
fadeEls.forEach(el => fadeObserver.observe(el));

/* ── スムーススクロール ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── NAV スクロールシャドウ ── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 20
    ? '0 2px 20px rgba(0,0,0,0.5)'
    : 'none';
}, { passive: true });

/* ── フォームバリデーション & 送信 ── */
const form       = document.getElementById('reserve-form');
const submitBtn  = document.getElementById('submit-btn');
const formWrap   = form;
const formDone   = document.getElementById('form-complete');
const shareBtn   = document.getElementById('share-btn');

/* エラー表示ヘルパー */
function showError(inputEl, errorEl, msg) {
  errorEl.textContent = msg;
  inputEl.classList.add('is-error');
}
function clearError(inputEl, errorEl) {
  errorEl.textContent = '';
  inputEl.classList.remove('is-error');
}

/* リアルタイムクリア：入力したらエラーを消す */
['name','email','tel','visit-date','visit-time'].forEach(id => {
  const el = document.getElementById(id);
  const errEl = document.getElementById('err-' + (id === 'visit-date' ? 'date' : id === 'visit-time' ? 'time' : id));
  if (el && errEl) {
    el.addEventListener('input',  () => clearError(el, errEl));
    el.addEventListener('change', () => clearError(el, errEl));
  }
});
document.getElementById('privacy-agree').addEventListener('change', () => {
  clearError(document.getElementById('privacy-agree'), document.getElementById('err-privacy'));
});

/* バリデーション本体 */
function validate() {
  let valid = true;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fields = [
    { id: 'name',       errId: 'err-name',    msg: 'お名前を入力してください' },
    { id: 'email',      errId: 'err-email',   msg: 'メールアドレスを入力してください' },
    { id: 'tel',        errId: 'err-tel',     msg: '電話番号を入力してください' },
    { id: 'visit-date', errId: 'err-date',    msg: '来場日を選択してください' },
    { id: 'visit-time', errId: 'err-time',    msg: '来場時間帯を選択してください' },
  ];

  fields.forEach(({ id, errId, msg }) => {
    const el  = document.getElementById(id);
    const err = document.getElementById(errId);
    const val = el.value.trim();
    if (!val) {
      showError(el, err, msg);
      valid = false;
    } else {
      clearError(el, err);
    }
  });

  /* メール形式チェック */
  const emailEl  = document.getElementById('email');
  const emailErr = document.getElementById('err-email');
  if (emailEl.value.trim() && !EMAIL_RE.test(emailEl.value.trim())) {
    showError(emailEl, emailErr, '正しいメールアドレスの形式で入力してください');
    valid = false;
  }

  /* 規約同意チェック */
  const privacyEl  = document.getElementById('privacy-agree');
  const privacyErr = document.getElementById('err-privacy');
  if (!privacyEl.checked) {
    showError(privacyEl, privacyErr, '個人情報の取扱いおよび利用規約への同意が必要です');
    valid = false;
  } else {
    clearError(privacyEl, privacyErr);
  }

  return valid;
}

/* 送信処理 */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validate()) {
    /* 最初のエラー欄へスクロール */
    const firstErr = form.querySelector('.is-error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  /* ボタン：送信中状態 */
  submitBtn.disabled    = true;
  submitBtn.textContent = '予約中...';

  /*
   * ▼ 実際の送信処理
   *   本番環境では Formspree / Google Apps Script / 独自API のエンドポイントに
   *   fetch() で POST してください。
   *   例: const res = await fetch('https://formspree.io/f/XXXXXX', {
   *         method: 'POST',
   *         body: new FormData(form),
   *         headers: { 'Accept': 'application/json' }
   *       });
   *
   *   現在はモック（1秒後に成功）として動作します。
   */
  await new Promise(resolve => setTimeout(resolve, 1000));

  /* 完了表示 */
  formWrap.style.display = 'none';
  formDone.style.display = 'block';
  formDone.scrollIntoView({ behavior: 'smooth', block: 'center' });

  /* Web Share API（対応ブラウザのみシェアボタンを表示） */
  if (navigator.share) {
    shareBtn.style.display = 'inline-block';
    shareBtn.addEventListener('click', () => {
      navigator.share({
        title: 'GALLERY DOT 10周年記念展「AFTER IMAGE」',
        text:  '2026年1月10日〜26日、東京・神宮前で開催。行ってみよう！',
        url:   'https://gallery-dot.jp/'
      }).catch(() => {});
    });
  }
});
