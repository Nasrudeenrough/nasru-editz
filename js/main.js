/* ==========================================================================
   NASRU EDITZ — site behaviour
   ========================================================================== */
(function(){
  "use strict";

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- nav: scroll state + mobile toggle ---------- */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function onScroll(){
    if(window.scrollY > 30) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener('click', function(){
    var open = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- waveform (decorative, generated once) ---------- */
  var waveform = document.getElementById('waveform');
  if(waveform){
    var bars = 40, frag = document.createDocumentFragment();
    for(var i=0;i<bars;i++){
      var span = document.createElement('span');
      var h = 20 + Math.round(Math.sin(i*0.7)*40 + Math.random()*35);
      span.style.height = Math.max(10, Math.min(100, h)) + '%';
      frag.appendChild(span);
    }
    waveform.appendChild(frag);
  }

  /* ---------- reveal-on-scroll (section headings only — restrained, single pattern.
     Deliberately excludes anything interactive like the pricing form, so no control
     can ever be left invisible if a browser is slow to fire the observer.) ---------- */
  var revealTargets = document.querySelectorAll('.section-head');
  revealTargets.forEach(function(el){ el.classList.add('reveal'); });

  var skillFills = document.querySelectorAll('.skillbar__fill');

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  revealTargets.forEach(function(el){ io.observe(el); });

  // skillbars use their own observer instance so the two concerns stay independent
  var skillIo = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-in');
        skillIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillFills.forEach(function(el){ skillIo.observe(el); });

  /* ---------- count-up stats ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var isDecimal = String(target).indexOf('.') !== -1;
    var start = 0, duration = 1400, startTime = null;

    function tick(ts){
      if(!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = start + (target - start) * eased;
      el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
      if(progress < 1) requestAnimationFrame(tick);
      else el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
    }
    requestAnimationFrame(tick);
  }
  var countIo = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        animateCount(entry.target);
        countIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function(el){ countIo.observe(el); });

  /* ==========================================================================
     VIDEO SHOWCASE
     Google Drive file IDs supplied by the client. We try Drive's public
     thumbnail endpoint for the poster frame and fall back to a styled
     placeholder if a thumbnail can't be fetched (private/restricted file).
     Clicking a card opens the actual video in a Drive "preview" iframe.
     ========================================================================== */
  var VIDEOS = [
    { id: '1WDkhzlpJhInxv3GnTdOTha2L2I2zl4KI', title: 'Best Edit — 01', cat: 'editing', label: 'Best Edits', wide:false },
    { id: '1SQConmT092ts3L61EMTZcYWM7vPQfZ1s', title: 'Best Edit — 02', cat: 'editing', label: 'Best Edits', wide:false },
    { id: '1he6TwneAYuC9gt61Uu1YZzs3OG0HOg-G', title: 'Best Edit — 03', cat: 'editing', label: 'Best Edits', wide:false },
    { id: '1gPNUUrBA73Hc9Rihokx3NJ4rxaFah2_T', title: 'Best Edit — 04', cat: 'editing', label: 'Best Edits', wide:false },
    { id: '1M7F1AzV2jiJXNgLSkgtDikhRzg8eUt-5', title: 'Best Edit — 05', cat: 'editing', label: 'Best Edits', wide:false },
    { id: '1UdIiYr_BufgJ4TS_JwVHiEGcYH5cPXdc', title: 'Explainer — 01', cat: 'explainer', label: 'Explainer', wide:true },
    { id: '1O8iE8vN2H6mJI7kNnVy5NjJo-y4ehBC1', title: 'Explainer — 02', cat: 'explainer', label: 'Explainer', wide:true },
    { id: '1wr6mC-U80MQHvprLTccN-i2M-TvX9rx8', title: 'Motion Graphics — 01', cat: 'motion', label: 'Motion Graphics', wide:false },
    { id: '1iPHhvxIlWKjhDnhW3YEifY--Tyryb5ew', title: 'Motion Graphics — 02', cat: 'motion', label: 'Motion Graphics', wide:false },
    { id: '1c7M7qIzYnsHFPivHb_HkDNbTYCiOo3z5', title: 'Motion Graphics — 03', cat: 'motion', label: 'Motion Graphics', wide:false },
    { id: '1qACmuZGvsYdL4mKLgCMDUM0ImJS3Gfwk', title: 'Comparison — 01', cat: 'comparison', label: 'Comparison', wide:false },
    { id: '1p9KVKAuL-_KEKwjr1TTJDcRp0nmCJPcf', title: 'Comparison — 02', cat: 'comparison', label: 'Comparison', wide:false },
    { id: '1z9qbsrv70TS2gg_4wmAgoYO3OnsXi3MV', title: 'Comparison — 03', cat: 'comparison', label: 'Comparison', wide:false },
    { id: '1VJebOPl9ohSaP1sq-q6SyG9v-j1LUeHF', title: 'Showreel 2026', cat: 'showreel', label: 'Showreel', wide:false },
    { id: '13RzPSPSLmLiIRyWzmKFegWRrK_gnr594', title: 'YouTube Podcast', cat: 'podcast', label: 'YouTube Podcast', wide:'youtube' }
  ];

  var PLAY_ICON = '<svg viewBox="0 0 24 24"><path d="M8 5v14l12-7z"/></svg>';

  var grid = document.getElementById('videoGrid');

  function cardHTML(v){
    var thumb = 'https://drive.google.com/thumbnail?id=' + v.id + '&sz=w640';
    var wideClass = v.wide === true ? ' video-card--wide' : (v.wide === 'youtube' ? ' video-card--youtube' : '');
    var wideAttr = v.wide ? String(v.wide) : 'false';
    return (
      '<div class="video-card' + wideClass + '" data-cat="' + v.cat + '" data-id="' + v.id + '" data-wide="' + wideAttr + '" role="button" tabindex="0" aria-label="Play ' + v.title + '">' +
        '<div class="video-card__media">' +
          '<div class="video-card__fallback"><span style="font-family:Space Grotesk,sans-serif;color:var(--text-faint);font-size:2rem;">' + v.label.charAt(0) + '</span></div>' +
          '<img src="' + thumb + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">' +
        '</div>' +
        '<div class="video-card__scrim"></div>' +
        '<div class="video-card__play">' + PLAY_ICON + '</div>' +
        '<div class="video-card__info">' +
          '<div class="video-card__cat">' + v.label + '</div>' +
          '<div class="video-card__title">' + v.title + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  if(grid){
    grid.innerHTML = VIDEOS.map(cardHTML).join('');
  }

  /* ---------- tab filtering ---------- */
  var tabs = document.querySelectorAll('#workTabs .tab');
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      var filter = tab.getAttribute('data-filter');
      document.querySelectorAll('.video-card').forEach(function(card){
        var show = filter === 'all' || card.getAttribute('data-cat') === filter;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ==========================================================================
     LIGHTBOXES
     ========================================================================== */
  var videoLightbox = document.getElementById('videoLightbox');
  var lightboxFrame = document.getElementById('lightboxFrame');
  var imageLightbox = document.getElementById('imageLightbox');
  var lightboxImg = document.getElementById('lightboxImg');

  function openVideo(id, wide){
    var isWide = wide === 'true' || wide === true || wide === 'youtube';
    lightboxFrame.className = 'lightbox__frame' + (isWide ? ' is-wide' : '');
    lightboxFrame.innerHTML = '<iframe src="https://drive.google.com/file/d/' + id + '/preview" allow="autoplay" allowfullscreen></iframe>';
    videoLightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeVideo(){
    videoLightbox.classList.remove('is-open');
    lightboxFrame.innerHTML = '';
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function(e){
    var card = e.target.closest('.video-card');
    if(card){
      openVideo(card.getAttribute('data-id'), card.getAttribute('data-wide'));
    }
  });
  document.addEventListener('keydown', function(e){
    var card = document.activeElement;
    if(e.key === 'Enter' && card && card.classList && card.classList.contains('video-card')){
      openVideo(card.getAttribute('data-id'), card.getAttribute('data-wide'));
    }
  });

  function openImage(src, alt){
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    imageLightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeImage(){
    imageLightbox.classList.remove('is-open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox]').forEach(function(fig){
    fig.addEventListener('click', function(){
      var src = fig.getAttribute('data-lightbox');
      var img = fig.querySelector('img');
      openImage(src, img ? img.alt : '');
    });
  });

  document.querySelectorAll('[data-close]').forEach(function(el){
    el.addEventListener('click', function(){
      closeVideo();
      closeImage();
    });
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ closeVideo(); closeImage(); }
  });

  /* ==========================================================================
     PRICING / QUOTE BUILDER
     ========================================================================== */
  var videoTypeWrap = document.getElementById('videoType');
  var addonsWrap = document.getElementById('addons');
  var extrasWrap = document.getElementById('extras');
  var videosSlider = document.getElementById('videosPerMonth');
  var videosLabel = document.getElementById('videosPerMonthLabel');

  var totalPriceEl = document.getElementById('totalPrice');
  var perVideoPriceEl = document.getElementById('perVideoPrice');
  var tagTypeEl = document.getElementById('tagType');
  var tagCountEl = document.getElementById('tagCount');

  var TYPE_LABELS = { reels: 'Reels', youtube: 'YouTube', brand: 'Brand', explainer: 'Explainer' };

  function selectedChip(wrap){
    return wrap.querySelector('.chip.is-active');
  }
  function selectedChips(wrap){
    return Array.prototype.slice.call(wrap.querySelectorAll('.chip.is-active'));
  }

  function formatINR(n){
    return Math.round(n).toLocaleString('en-IN');
  }

  function recalc(){
    var typeChip = selectedChip(videoTypeWrap);
    var basePrice = typeChip ? parseFloat(typeChip.getAttribute('data-price')) : 0;
    var typeValue = typeChip ? typeChip.getAttribute('data-value') : 'reels';

    var addonTotal = selectedChips(addonsWrap).reduce(function(sum, chip){
      return sum + parseFloat(chip.getAttribute('data-price'));
    }, 0);

    var perVideo = basePrice + addonTotal;
    var videosPerMonth = parseInt(videosSlider.value, 10);

    var extraChips = selectedChips(extrasWrap);
    var flatExtras = 0;
    extraChips.forEach(function(chip){
      var val = chip.getAttribute('data-value');
      var price = parseFloat(chip.getAttribute('data-price'));
      if(val === 'source') flatExtras += price;               // flat monthly
      else if(val === 'rush') perVideo += price;               // per video
    });

    var monthlyTotal = perVideo * videosPerMonth + flatExtras;

    videosLabel.textContent = videosPerMonth;
    perVideoPriceEl.textContent = '₹' + formatINR(perVideo);
    totalPriceEl.textContent = formatINR(monthlyTotal);
    tagTypeEl.textContent = TYPE_LABELS[typeValue] || typeValue;
    tagCountEl.textContent = videosPerMonth + ' / month';

    return { typeValue: typeValue, typeLabel: TYPE_LABELS[typeValue], perVideo: perVideo, videosPerMonth: videosPerMonth, monthlyTotal: monthlyTotal,
      addons: selectedChips(addonsWrap).map(function(c){ return c.textContent.trim(); }),
      extras: extraChips.map(function(c){ return c.textContent.trim(); }) };
  }

  videoTypeWrap.querySelectorAll('.chip').forEach(function(chip){
    chip.addEventListener('click', function(){
      videoTypeWrap.querySelectorAll('.chip').forEach(function(c){ c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      recalc();
    });
  });

  [addonsWrap, extrasWrap].forEach(function(wrap){
    wrap.querySelectorAll('.chip').forEach(function(chip){
      chip.addEventListener('click', function(){ chip.classList.toggle('is-active'); recalc(); });
    });
  });

  videosSlider.addEventListener('input', recalc);

  recalc();

  /* ---------- send quote to WhatsApp ---------- */
  var sendQuoteBtn = document.getElementById('sendQuoteBtn');
  sendQuoteBtn.addEventListener('click', function(){
    var data = recalc();
    var name = document.getElementById('clientName').value.trim();
    var phone = document.getElementById('clientPhone').value.trim();
    var notes = document.getElementById('clientNotes').value.trim();

    var lines = [
      'Hi Nasru, I\'d like a quote:',
      'Video type: ' + data.typeLabel,
      'Videos per month: ' + data.videosPerMonth,
      data.addons.length ? 'Add-ons: ' + data.addons.join(', ') : null,
      data.extras.length ? 'Extras: ' + data.extras.join(', ') : null,
      'Estimated monthly: ₹' + formatINR(data.monthlyTotal) + ' (₹' + formatINR(data.perVideo) + '/video)',
      name ? 'Name: ' + name : null,
      phone ? 'My WhatsApp: ' + phone : null,
      notes ? 'Notes: ' + notes : null
    ].filter(Boolean);

    var message = encodeURIComponent(lines.join('\n'));
    window.open('https://wa.me/918438629947?text=' + message, '_blank');
  });

})();
