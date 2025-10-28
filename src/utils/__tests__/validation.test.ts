import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  sanitizeHtml,
  validateMediaFile
} from '../validation';

describe('validation helpers', () => {
  describe('validateEmail', () => {
    it('accepts valid email addresses', () => {
      expect(validateEmail('user@example.com').valid).toBe(true);
      expect(validateEmail('test+tag@domain.co.uk').valid).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('notanemail').valid).toBe(false);
      expect(validateEmail('missing@domain').valid).toBe(false);
    });

    it('returns error message for invalid email', () => {
      const result = validateEmail('invalid');
      expect(result.error).toBeDefined();
      expect(result.error).toContain('email');
    });
  });

  describe('validatePassword', () => {
    it('accepts strong passwords', () => {
      expect(validatePassword('ValidPass123').valid).toBe(true);
      expect(validatePassword('MySecure1Password').valid).toBe(true);
    });

    it('rejects weak passwords', () => {
      expect(validatePassword('short').valid).toBe(false);
      expect(validatePassword('nouppercase1').valid).toBe(false);
      expect(validatePassword('NOLOWERCASE1').valid).toBe(false);
      expect(validatePassword('NoNumbers').valid).toBe(false);
    });

    it('returns appropriate error messages', () => {
      expect(validatePassword('short').error).toContain('8 characters');
      expect(validatePassword('nouppercase1').error).toContain('uppercase');
      expect(validatePassword('NoNumbers').error).toContain('number');
    });
  });

  describe('validateUsername', () => {
    it('accepts valid usernames', () => {
      expect(validateUsername('user123').valid).toBe(true);
      expect(validateUsername('adventure_hero').valid).toBe(true);
      expect(validateUsername('quest-master').valid).toBe(true);
    });

    it('rejects invalid usernames', () => {
      expect(validateUsername('ab').valid).toBe(false);
      expect(validateUsername('a'.repeat(21)).valid).toBe(false);
      expect(validateUsername('user@invalid').valid).toBe(false);
      expect(validateUsername('user name').valid).toBe(false);
    });
  });

  describe('sanitizeHtml', () => {
    it('escapes HTML special characters', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
      expect(sanitizeHtml("<img src='x' onerror='alert(1)'>")).toBe('&lt;img src=&#x27;x&#x27; onerror=&#x27;alert(1)&#x27;&gt;');
    });

    it('leaves plain text unchanged', () => {
      const plainText = 'This is safe text';
      expect(sanitizeHtml(plainText)).toBe(plainText);
    });
  });

  describe('validateMediaFile', () => {
    it('accepts valid image files', () => {
      expect(validateMediaFile({ name: 'photo.jpg', size: 1024 * 1024, type: 'image/jpeg' }).valid).toBe(true);
      expect(validateMediaFile({ name: 'pic.png', size: 500000, type: 'image/png' }).valid).toBe(true);
    });

    it('accepts valid video files', () => {
      expect(validateMediaFile({ name: 'video.mp4', size: 5 * 1024 * 1024, type: 'video/mp4' }).valid).toBe(true);
    });

    it('rejects files over 10MB', () => {
      const result = validateMediaFile({ name: 'large.jpg', size: 11 * 1024 * 1024, type: 'image/jpeg' });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('10MB');
    });

    it('rejects invalid file types', () => {
      const result = validateMediaFile({ name: 'doc.pdf', size: 1024, type: 'application/pdf' });
      expect(result.valid).toBe(false);
    });
  });
});
