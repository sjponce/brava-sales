const translate = require('./translateModel');

describe('translate', () => {
  test('test_translate_known_model', () => {
    expect(translate('user')).toBe('usuario');
  });

  test('test_translate_unknown_model', () => {
    expect(translate('admin')).toBe('admin');
  });

  test('test_translate_case_insensitivity', () => {
    expect(translate('User')).toBe('usuario');
    expect(translate('USER')).toBe('usuario');
    expect(translate('user')).toBe('usuario');
  });
});