const translate = require('./translateModel');

describe('translate', () => {
  test('test_translate_known_model', () => {
    expect(translate('user')).toBe('vendedor');
  });

  test('test_translate_unknown_model', () => {
    expect(translate('admin')).toBe('admin');
  });

  test('test_translate_case_insensitivity', () => {
    expect(translate('User')).toBe('vendedor');
    expect(translate('USER')).toBe('vendedor');
    expect(translate('user')).toBe('vendedor');
  });
});