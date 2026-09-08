const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const script = fs.readFileSync('assets/js/language-suggestion.js', 'utf8');

function visit({ language = 'tr-TR', pageLanguage = 'en', session = new Map(), blocked = false, present = true } = {}) {
  let dismiss;
  const notice = { hidden: true, querySelector: () => ({ addEventListener: (_, fn) => { dismiss = fn; } }) };
  vm.runInNewContext(script, {
    document: { documentElement: { lang: pageLanguage }, getElementById: () => present ? notice : null },
    navigator: { languages: [language] },
    sessionStorage: {
      getItem: key => { if (blocked) throw Error('disabled'); return session.get(key); },
      setItem: (key, value) => session.set(key, value)
    },
    // Any navigation attempt is a regression, including opening another tab.
    window: new Proxy({}, { get() { throw Error('Unexpected navigation'); } })
  });
  return { notice, dismiss, session };
}

test('Turkish preference on an English page shows a dismissible notice', () => {
  const first = visit();
  assert.equal(first.notice.hidden, false);
  first.dismiss();
  assert.equal(first.notice.hidden, true);
  assert.equal(visit({ session: first.session }).notice.hidden, true);
});
test('navigation or reload does not repeat even without dismissal', () => {
  const first = visit();
  assert.equal(visit({ session: first.session }).notice.hidden, true);
});
test('a new session shows the suggestion again', () => {
  visit();
  assert.equal(visit().notice.hidden, false);
});
test('English, French and invalid language values do not get a Turkish prompt', () => {
  for (const language of ['en-US', 'fr-FR', 'tricky', '']) assert.equal(visit({ language }).notice.hidden, true);
});
test('Turkish page does not consume the session suggestion', () => {
  const tr = visit({ pageLanguage: 'tr' });
  assert.equal(tr.notice.hidden, true);
  assert.equal(tr.session.size, 0);
  assert.equal(visit({ session: tr.session }).notice.hidden, false);
});
test('missing alternate page does not consume the session', () => {
  assert.equal(visit({ present: false }).session.size, 0);
});
test('blocked session storage fails quietly without repeating a notice', () => {
  assert.equal(visit({ blocked: true }).notice.hidden, true);
});
