/**
 * Web Audio API synthesized harmonic bell chime for notifications
 * & Native System OS Notification delivery (Windows / Mac / Android)
 * "ovoz chiqarsa bo'ldi, gapirmasin" -> Pure melodic chime, no speech/talking
 */

let audioCtx: AudioContext | null = null;
let titleFlashTimer: ReturnType<typeof setInterval> | null = null;
let originalDocumentTitle =
  typeof document !== 'undefined' ? document.title : "45-Maktab Sun'iy Intellekt OS";

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Generate a crisp raster PNG Data URL icon using HTML Canvas
 * Windows Action Center and macOS notification centers require PNG raster images,
 * and fail silently if given an SVG file!
 */
export function getNotificationIconPng(): string {
  if (typeof document === 'undefined') return '';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 192;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Dark cyber rounded badge background
    ctx.fillStyle = '#050713';
    ctx.beginPath();
    ctx.arc(96, 96, 90, 0, Math.PI * 2);
    ctx.fill();

    // Cyan glowing outer ring
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Shield frame
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(96, 26);
    ctx.lineTo(156, 52);
    ctx.lineTo(156, 126);
    ctx.lineTo(96, 166);
    ctx.lineTo(36, 126);
    ctx.lineTo(36, 52);
    ctx.closePath();
    ctx.stroke();

    // Inscribed "45" logo text
    ctx.font = 'bold 58px "Orbitron", -apple-system, sans-serif';
    ctx.fillStyle = '#00f2fe';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('45', 96, 92);

    // AI OS badge at bottom
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(60, 136, 72, 22);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 136, 72, 22);

    ctx.font = 'bold 12px "Orbitron", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('AI OS', 96, 148);

    return canvas.toDataURL('image/png');
  } catch {
    return '';
  }
}

/**
 * Play a rich, pleasant harmonic bell chime (pure chime, no speech)
 */
export function playBellSound(
  type: 'grade' | 'homework' | 'success' | 'warning' | 'generic' = 'generic'
) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Frequencies tailored to notification types (in Hz)
    let chord: number[];
    if (type === 'grade') {
      // Golden celebratory chime (C5 - E5 - G5 - C6)
      chord = [523.25, 659.25, 783.99, 1046.5];
    } else if (type === 'homework') {
      // Modern alert chime (F5 - A5 - C6 - E6)
      chord = [698.46, 880.0, 1046.5, 1318.51];
    } else if (type === 'warning') {
      // Urgent double chime for payment / warning (E5 - G#5 - B5)
      chord = [659.25, 830.61, 987.77, 1318.51];
    } else if (type === 'success') {
      // Warm chime (D5 - F#5 - A5 - D6)
      chord = [587.33, 739.99, 880.0, 1174.66];
    } else {
      // Pleasant dual chime
      chord = [659.25, 830.61, 1046.5];
    }

    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      const noteStart = now + idx * 0.07;
      const duration = 1.1;

      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.linearRampToValueAtTime(0.22 / (idx + 1), noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + duration);
    });
  } catch (err) {
    console.warn('Audio playback error (Web Audio):', err);
  }
}

/**
 * Register Service Worker for background / external notifications
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  try {
    const swUrl = new URL('sw.js', window.location.href).href;
    const reg = await navigator.serviceWorker.register(swUrl);
    return reg;
  } catch (err) {
    console.warn('Service worker registration failed:', err);
    return null;
  }
}

/**
 * Request native browser notification permission
 */
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    getAudioContext();
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      registerServiceWorker().catch(() => {});
    }
    return permission;
  } catch {
    return Notification.permission;
  }
}

/**
 * Flash tab title when user is on another tab/outside
 */
export function flashTabTitle(alertText: string) {
  if (typeof document === 'undefined') return;
  if (!originalDocumentTitle) originalDocumentTitle = document.title;

  if (titleFlashTimer) {
    clearInterval(titleFlashTimer);
  }

  let toggle = false;
  titleFlashTimer = setInterval(() => {
    document.title = toggle ? `🔔 ${alertText}` : originalDocumentTitle;
    toggle = !toggle;
  }, 900);

  const resetOnFocus = () => {
    if (titleFlashTimer) {
      clearInterval(titleFlashTimer);
      titleFlashTimer = null;
    }
    document.title = originalDocumentTitle;
    window.removeEventListener('focus', resetOnFocus);
    document.removeEventListener('visibilitychange', resetOnFocus);
  };

  window.addEventListener('focus', resetOnFocus);
  document.addEventListener('visibilitychange', resetOnFocus);
}

/**
 * Helper to get absolute logo URL
 */
function getLogoUrl(): string {
  if (typeof window !== 'undefined') {
    try {
      return new URL('logo.svg', window.location.href).href;
    } catch {
      return '/logo.svg';
    }
  }
  return '/logo.svg';
}

/**
 * Deliver Chrome / System Desktop Notification
 * Works even when user is OUTSIDE the site (saytdan tashqarida turganda ham chiqadi)
 */
export function showSystemNotification(options: {
  title: string;
  body: string;
  tag?: string;
  type?: 'grade' | 'homework' | 'success' | 'warning' | 'generic';
}) {
  if (typeof window === 'undefined') return;

  const { title, body, tag, type = 'generic' } = options;

  // 1. Ovozli qo'ng'iroq (nutqsiz faqat jarangdor ohang)
  playBellSound(type);

  // 2. Agar foydalanuvchi boshqa tabda bo'lsa, tab nomini miltillatamiz
  if (typeof document !== 'undefined' && document.hidden) {
    flashTabTitle(title);
  }

  // 3. Haqiqiy Chrome / Tizim bildirishnomasi
  if (!('Notification' in window)) {
    return;
  }

  const logoUrl = getLogoUrl();
  const pngIcon = getNotificationIconPng() || logoUrl;
  const notifTag = tag || `maktab45-${Date.now()}`;

  const deliverChromeNotification = async () => {
    let delivered = false;

    // Desktop Chrome / Edge / Firefox / Windows notification
    try {
      const notif = new Notification(title, {
        body,
        icon: pngIcon,
        badge: pngIcon,
        tag: notifTag,
        requireInteraction: true,
      } as NotificationOptions);

      notif.onclick = () => {
        window.focus();
        notif.close();
      };
      delivered = true;
    } catch {
      // Direct constructor may fail on mobile Chrome, fallback to SW below
      delivered = false;
    }

    // Android Chrome or SW-required environments
    if (!delivered && 'serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        if (reg && reg.showNotification) {
          await reg.showNotification(title, {
            body,
            icon: pngIcon,
            badge: pngIcon,
            tag: notifTag,
            data: { url: window.location.href },
            vibrate: [250, 100, 250],
            requireInteraction: true,
          } as NotificationOptions);
        }
      } catch (err) {
        console.warn('SW notification fallback failed:', err);
      }
    }
  };

  if (Notification.permission === 'granted') {
    deliverChromeNotification();
  } else if (Notification.permission === 'default') {
    // If permission has not been asked, request it
    Notification.requestPermission()
      .then((perm) => {
        if (perm === 'granted') {
          deliverChromeNotification();
        }
      })
      .catch(() => {});
  }
}

/**
 * Backward compatibility helper
 */
export function playNotificationAudio(
  type: 'grade' | 'homework' | 'success' | 'warning' | 'generic' = 'generic',
  _title?: string,
  _enableVoice: boolean = false
) {
  playBellSound(type);
}
