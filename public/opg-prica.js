const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwhtdOZvVYio4FkDLbqxMGeZw9px0efzxwDYH8e-KZYWeXSuEPmpzpHuWqmprK6v9-GnA/exec";

const answers = {};

function selectRadio(id, btn) {
  document.querySelectorAll('#' + id + ' .opt-btn').forEach(function(b) {
    b.classList.remove('selected');
  });
  btn.classList.add('selected');
  answers[id] = btn.textContent.trim();

  if (id === 'q8') {
    var napomena = document.getElementById('q8_napomena');
    var text = btn.textContent;
    var show = text.includes('Da,') || text.includes('mogu napraviti') || text.includes('trebam razmisliti');
    show ? napomena.classList.remove('hidden') : napomena.classList.add('hidden');
  }
}

async function submitForm() {
  var btn = document.getElementById('submitBtn');
  var msg = document.getElementById('sendingMsg');
  btn.disabled = true;
  msg.style.display = 'block';

  var payload = {
    opg_naziv:       document.getElementById('opg_naziv').value.trim(),
    kontakt_ime:     document.getElementById('kontakt_ime').value.trim(),
    kontakt_email:   document.getElementById('kontakt_email').value.trim(),
    kontakt_telefon: document.getElementById('kontakt_telefon').value.trim(),
    q1:  document.getElementById('q1').value.trim(),
    q2:  document.getElementById('q2').value.trim(),
    q3:  document.getElementById('q3').value.trim(),
    q4:  document.getElementById('q4').value.trim(),
    q5:  document.getElementById('q5').value.trim(),
    q6:  document.getElementById('q6').value.trim(),
    q7:  document.getElementById('q7').value.trim(),
    q8:  answers['q8'] || '',
    q8_napomena: document.getElementById('q8_napomena_val').value.trim(),
  };

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'prica', ...payload })
    });
  } catch(e) {
    console.error(e);
  }

  document.getElementById('survey').style.display = 'none';
  document.getElementById('success').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('#q8 .opt-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      selectRadio('q8', btn);
    });
  });

  document.getElementById('submitBtn').addEventListener('click', submitForm);
});
