/* ========================
   SHO-KEN - main.js
   アニメーション・インタラクション
   ======================== */

'use strict';

// ── スクロールで Header にクラスを付与 ──
const header = document.getElementById('header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });

// ── Intersection Observer：fade-in ──
const fadeEls = document.querySelectorAll('.fade-in');
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
fadeEls.forEach(el => io.observe(el));

// ── ヒーロー画像のズームアニメーション ──
const heroImg = document.getElementById('heroImg');
if (heroImg) {
  heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
  if (heroImg.complete) heroImg.classList.add('loaded');
}

// ── ハンバーガーメニュー ──
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

const toggleMenu = () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  document.body.style.overflow = isOpen ? 'hidden' : '';
};

hamburger.addEventListener('click', toggleMenu);
hamburger.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
});

// モバイルナビのリンクをクリックしたら閉じる
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── スムーススクロール（href="#..."） ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70; // ヘッダー高さ
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── フォームのバリデーションと送信 ──
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 簡易バリデーション
    const name    = contactForm.querySelector('#name').value.trim();
    const email   = contactForm.querySelector('#email').value.trim();
    const service = contactForm.querySelector('#service').value;

    if (!name || !email || !service) {
      showNotification('⚠️ 必須項目を入力してください', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNotification('⚠️ 正しいメールアドレスを入力してください', 'error');
      return;
    }

    // 送信
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        contactForm.reset();
        showNotification('✅ 送信完了！担当者より2営業日以内にご連絡いたします。', 'success');
      } else {
        throw new Error('送信失敗');
      }
    } catch {
      showNotification('❌ 送信エラーが発生しました。お手数ですが、時間をおいて再度お試しください。', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '送信する（無料・24時間受付）';
    }
  });
}

// ── 通知トースト ──
function showNotification(msg, type = 'success') {
  const existing = document.querySelector('.toast-notif');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notif';
  toast.textContent = msg;
  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '2rem',
    left:         '50%',
    transform:    'translateX(-50%) translateY(20px)',
    background:   type === 'success' ? '#1a3a5c' : '#c0392b',
    color:        '#fff',
    padding:      '.9rem 2rem',
    borderRadius: '50px',
    fontSize:     '.88rem',
    fontWeight:   '600',
    zIndex:       '9999',
    opacity:      '0',
    transition:   'opacity .3s ease, transform .3s ease',
    maxWidth:     '90vw',
    textAlign:    'center',
    boxShadow:    '0 8px 24px rgba(0,0,0,.2)'
  });
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

// ── CTA ボタンのクリック計測（将来的なGA連携用） ──
document.getElementById('hero-cta-main')?.addEventListener('click', () => {
  // gtag('event', 'click', { event_category: 'CTA', event_label: 'hero' });
  console.log('[SHO-KEN] CTA clicked: hero');
});
