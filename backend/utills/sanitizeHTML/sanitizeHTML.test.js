/* eslint-disable no-undef */
const sanitizeEditorJSHTML = require('./sanitizeHTML');

describe(`${sanitizeEditorJSHTML.name} should clean HTML`, () => {
  it('should remove all denied charset for comment', () => {
    const string = `
      <p>allow this <b>bold</b></p>
      <p>allow this&nbsp;<i>italic</i></p>
      <p>allow this&nbsp;<a href="https:/google.com">link</a></p>
      <p>deny this custom <strong>strong</strong> tag</p>
      <h2>deny this heading tag</h2>
      <p>deny iframe below</p><br />
      <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" />
      <p>deny image below</p>
      <img src="https://raw.githubusercontent.com/apostrophecms/sanitize-html/main/logos/logo-box-madefor.png" alt="logo" />
      <p>end</p>
    `;

    expect(sanitizeEditorJSHTML('comment', string)).not.toMatch(
      /<strong|<h2|<iframe|<img/gm
    );
  });

  it('should remove all denied charset for post', () => {
    const string = `
      <p>allow this <b>bold</b></p>
      <p>allow this&nbsp;<i>italic</i></p>
      <p>allow this&nbsp;<a href="https:/google.com">link</a></p>
      <p>deny iframe with unknown src below</p>
      <iframe src="https://google.com" />
      <p>deny img with onerror attribute</p>
      <img onerror="function(){}" src="https://raw.githubusercontent.com/apostrophecms/sanitize-html/main/logos/logo-box-madefor.png" />
      <p>end</p>
    `;

    expect(sanitizeEditorJSHTML('comment', string)).not.toMatch(
      /<strong|src="https:\/\/google\.com"/gm
    );
  });
});
