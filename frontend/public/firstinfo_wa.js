// Personalized greeting for WhatsApp link variant.
// Reads: ?name=Max  ?n=Max  ?vorname=Max  (also via #hash)
//        ?g=f|m|w  (f/w = weiblich, m = männlich)
// Safely set as text (no HTML injection). External file so CSP 'self' allows it.
(function () {
  function readParams() {
    var out = { name: null, gender: null };
    try {
      var qs = new URLSearchParams(window.location.search);
      out.name = qs.get('name') || qs.get('n') || qs.get('vorname');
      out.gender = qs.get('g') || qs.get('gender') || qs.get('geschlecht');
      if ((!out.name || !out.gender) && window.location.hash) {
        var hs = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        out.name = out.name || hs.get('name') || hs.get('n') || hs.get('vorname');
        out.gender = out.gender || hs.get('g') || hs.get('gender') || hs.get('geschlecht');
      }
    } catch (e) { /* ignore */ }
    return out;
  }

  function sanitize(raw) {
    if (!raw) return '';
    var name = String(raw).replace(/[\u0000-\u001F\u007F<>]/g, '').trim();
    name = name.replace(/\s+/g, ' ');
    if (name.length > 40) name = name.slice(0, 40);
    if (!/^[\p{L}][\p{L}\s'\-]*$/u.test(name)) return '';
    // Capitalize first letter of each word (after start, space or hyphen).
    // Do NOT use \b — it only recognises ASCII word chars, causing diacritics
    // like è to trigger false boundaries (e.g. "Alès" → "AlÈS").
    name = name.toLocaleLowerCase('de').replace(/(^|[\s-])(\p{L})/gu, function (_, sep, c) {
      return sep + c.toLocaleUpperCase('de');
    });
    return name;
  }

  function normalizeGender(g) {
    if (!g) return null;
    g = String(g).trim().toLowerCase();
    if (g === 'f' || g === 'w' || g === 'female' || g === 'weiblich') return 'f';
    if (g === 'm' || g === 'male' || g === 'maennlich' || g === 'männlich') return 'm';
    return null;
  }

  function guessGender(firstName) {
    if (!firstName) return null;
    var n = firstName.split(/[\s-]/)[0].toLocaleLowerCase('de');

    var maleExceptions = [
      'luca', 'luka', 'noah', 'joshua', 'elia', 'elias', 'tobia',
      'andrea', 'nikita', 'mika', 'attila', 'jona', 'jonah',
      'uwe', 'ole', 'helge', 'arne', 'kai', 'bjarne', 'hauke',
      'enrique', 'jose', 'pascha', 'sascha', 'mischa', 'nemanja'
    ];
    var femaleExceptions = [
      'kim', 'ruth', 'ingeborg', 'astrid', 'ingrid', 'sigrid', 'brigitt',
      'jennifer', 'heather', 'esther', 'ester', 'rahel', 'abigail',
      'gwen', 'carmen', 'doris', 'iris', 'beatrix', 'alix', 'miriam',
      'hannah', 'hanna', 'sarah', 'sara', 'deborah', 'rebekah', 'judith'
    ];
    if (maleExceptions.indexOf(n) !== -1) return 'm';
    if (femaleExceptions.indexOf(n) !== -1) return 'f';

    if (/(?:a|e|ie|ine|ina|ette|elle|ique|een|eke|ah|ya|ja|lla|nna|tta)$/.test(n)) return 'f';

    return 'm';
  }

  var params = readParams();
  var first = sanitize(params.name);
  var gender = normalizeGender(params.gender) || guessGender(first);

  var prefixEl = document.getElementById('greeting-prefix');
  var nameEl = document.getElementById('greeting-name');
  if (!prefixEl || !nameEl) return;
  if (first) {
    prefixEl.textContent = gender === 'f' ? 'Liebe' : 'Lieber';
    nameEl.textContent = ' ' + first;
  } else {
    prefixEl.textContent = 'Hallo';
    nameEl.textContent = '';
  }
})();
