const statusElement = document.getElementById('status');
const manualLink = document.getElementById('manual-link');
const retryButton = document.getElementById('retry');

function normalizeTunnelUrl(value) {
  const target = new URL(value);
  const isAllowedHost = target.hostname.endsWith('.lhr.life');
  if (target.protocol !== 'https:' || !isAllowedHost) {
    throw new Error('Unsupported tunnel URL');
  }
  target.pathname = '';
  target.search = '';
  target.hash = '';
  return target.toString().replace(/\/$/, '');
}

async function openWebsite() {
  retryButton.hidden = true;
  manualLink.hidden = true;
  statusElement.textContent = 'آدرس فعال سرور در حال بررسی است…';

  try {
    const response = await fetch(`./current.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const websiteUrl = normalizeTunnelUrl(payload.url);
    const loginUrl = `${websiteUrl}/login`;

    manualLink.href = loginUrl;
    manualLink.hidden = false;
    statusElement.textContent = 'آدرس فعال پیدا شد؛ در حال انتقال به صفحه ورود…';

    window.setTimeout(() => window.location.replace(loginUrl), 700);
  } catch {
    statusElement.textContent = 'در حال حاضر آدرس فعال سرور دریافت نشد. چند لحظه دیگر دوباره تلاش کنید.';
    retryButton.hidden = false;
  }
}

retryButton.addEventListener('click', openWebsite);
openWebsite();
