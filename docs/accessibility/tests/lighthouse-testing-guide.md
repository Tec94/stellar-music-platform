# Lighthouse Accessibility Testing Guide

**Purpose:** Guide for running and interpreting Lighthouse accessibility audits for the Adventure Quest Platform

---

## Overview

Lighthouse is an automated tool for improving web page quality. It audits performance, accessibility, progressive web apps, SEO, and more.

**Target Accessibility Score:** ≥ 90

---

## Prerequisites

### Installation

Lighthouse is included via `@lhci/cli` in dev dependencies. No additional installation needed.

### Build Requirements

Before running Lighthouse, the application must be built:

```bash
npm run build
```

---

## Running Lighthouse Tests

### Option 1: Lighthouse CI (Recommended)

**Configuration:** `.lighthouserc.js`

```bash
# Build the application
npm run build

# Run Lighthouse CI
npm run qa:performance
```

**Output:**
- Console report with scores
- HTML reports in `.lighthouseci/` directory
- Assertions pass/fail status

### Option 2: Chrome DevTools

1. Open the application in Chrome
2. Open DevTools (F12)
3. Navigate to "Lighthouse" tab
4. Select "Accessibility" category
5. Select "Desktop" preset
6. Click "Analyze page load"

### Option 3: Command Line

```bash
# Install globally (if not done)
npm install -g lighthouse

# Run on local server
lighthouse http://localhost:4173 --only-categories=accessibility --view
```

---

## Understanding the Report

### Score Ranges

| Score | Status | Action |
|-------|--------|--------|
| 90-100 | ✅ Pass | Maintain compliance |
| 50-89 | ⚠️ Warning | Investigate issues |
| 0-49 | ❌ Fail | Immediate fixes required |

### Key Metrics

**Manual checks:** Items that require human verification
**Passed audits:** Automated checks that passed
**Not applicable:** Checks that don't apply to this page

---

## Common Audit Items

### Passed Audits (Expected)

✅ **`[aria-*]` attributes are valid**
- All ARIA attributes use correct names and values

✅ **`[role]` values are valid**
- All ARIA roles are from the WAI-ARIA specification

✅ **Elements with `[role]` have required attributes**
- Elements with specific roles include required ARIA attributes

✅ **Buttons have an accessible name**
- All `<button>` elements have text content or `aria-label`

✅ **Links have a discernible name**
- All `<a>` elements have text content or `aria-label`

✅ **Form elements have associated labels**
- All form inputs have `<label>` elements or `aria-label`

✅ **Image elements have `[alt]` attributes**
- All `<img>` elements have alt text (can be empty for decorative)

✅ **Heading elements are in sequentially descending order**
- Headings follow h1 → h2 → h3 hierarchy

✅ **Lists contain only `<li>` elements**
- `<ul>` and `<ol>` only contain `<li>` children

✅ **Document has a `<title>` element**
- HTML document has a descriptive title

✅ **`<html>` element has a `[lang]` attribute**
- Root element declares language (e.g., `lang="en"`)

✅ **Background and foreground colors have sufficient contrast**
- Text meets WCAG AA contrast ratios (4.5:1 for normal, 3:1 for large)

✅ **`<frame>` or `<iframe>` elements have a title**
- All frames have descriptive titles (if present)

✅ **ARIA hidden elements do not contain focusable content**
- Elements with `aria-hidden="true"` don't have interactive children

✅ **IDs are unique**
- All `id` attributes are unique within the page

### Manual Checks

⚠️ **Interactive controls are keyboard focusable**
- Verify all interactive elements can be reached with Tab key
- **How to test:** Navigate page using only keyboard

⚠️ **Interactive elements indicate their purpose and state**
- Screen reader announces element purpose clearly
- **How to test:** Use NVDA/VoiceOver to verify

⚠️ **Custom controls have ARIA roles**
- Non-native controls have appropriate roles
- **How to test:** Inspect custom components

⚠️ **The page has a logical tab order**
- Tab order follows visual order
- **How to test:** Tab through page and verify flow

⚠️ **Custom controls have keyboard support**
- Custom widgets respond to keyboard events
- **How to test:** Keyboard-only navigation

---

## Page-by-Page Testing

### Testing Checklist

Run Lighthouse on each major page:

- [ ] Home Page (`/`)
- [ ] Login Page (`/login`)
- [ ] Register Page (`/register`)
- [ ] Dashboard Page (`/dashboard`)
- [ ] Quests Page (`/quests`)
- [ ] Tiers Page (`/tiers`)
- [ ] Gallery Page (`/gallery`)
- [ ] Media Upload Page (`/media`)
- [ ] Chat Page (`/chat`)
- [ ] Checkout Page (`/checkout`)

### Expected Scores by Page

| Page | Target Score | Notes |
|------|--------------|-------|
| Home | ≥90 | Simple, semantic structure |
| Login | ≥90 | Form with proper labels |
| Register | ≥90 | Multi-step form |
| Dashboard | ≥90 | Complex with dialogs |
| Quests | ≥90 | Interactive cards |
| Tiers | ≥90 | Card grid layout |
| Gallery | ≥90 | Image gallery with lightbox |
| Media | ≥90 | File upload interface |
| Chat | ≥90 | Live region for messages |
| Checkout | ≥90 | Payment form |

---

## Interpreting Results

### If Score is Below 90

1. **Review Failed Audits**
   - Check which specific audits failed
   - Note the affected elements

2. **Prioritize Fixes**
   - Critical: Broken keyboard navigation, missing labels
   - High: Color contrast issues, missing alt text
   - Medium: ARIA attribute issues
   - Low: Best practice recommendations

3. **Fix and Re-test**
   - Implement fixes
   - Run Lighthouse again
   - Verify score improvement

### Common Issues and Fixes

**Issue:** Buttons have no accessible name
- **Fix:** Add text content or `aria-label` to buttons

**Issue:** Form elements do not have associated labels
- **Fix:** Add `<label>` with `htmlFor` or `aria-label`

**Issue:** Links do not have a discernible name
- **Fix:** Add text content or `aria-label` to links

**Issue:** Image elements do not have `[alt]` attributes
- **Fix:** Add descriptive `alt` attribute to all images

**Issue:** Background and foreground colors do not have sufficient contrast
- **Fix:** Adjust colors to meet WCAG AA ratios

---

## CI/CD Integration

### GitHub Actions (Example)

```yaml
name: Accessibility Audit

on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run qa:performance
```

### Fail Criteria

Build fails if:
- Accessibility score < 90
- Critical audits fail

---

## Continuous Monitoring

### Scheduled Testing

Run Lighthouse audits:
- On every pull request
- Daily on main branch
- Before each release

### Tracking Over Time

- Store Lighthouse reports in `/docs/accessibility/tests/lighthouse-reports/`
- Track score trends
- Investigate score drops

---

## Troubleshooting

### Lighthouse Not Running

**Problem:** `npm run qa:performance` fails

**Solutions:**
1. Ensure build is successful: `npm run build`
2. Check if preview server is available
3. Verify `.lighthouserc.js` configuration
4. Check Node.js version (v18+ recommended)

### Low Scores Despite Fixes

**Problem:** Score doesn't improve after fixes

**Solutions:**
1. Clear browser cache
2. Rebuild application
3. Run in incognito mode
4. Check if fixes are actually deployed

### Inconsistent Scores

**Problem:** Scores vary between runs

**Solutions:**
1. Run multiple times (Lighthouse CI runs 3 times by default)
2. Use median score
3. Check for dynamic content affecting results
4. Ensure stable test environment

---

## Resources

### Official Documentation
- [Lighthouse Accessibility Scoring](https://web.dev/accessibility-scoring/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)

### Related Docs
- [Manual Testing Log](/docs/accessibility/tests/manual-testing-log.md)
- [Color Contrast Audit](/docs/accessibility/tests/color-contrast-audit.md)
- [Accessibility Documentation](/docs/accessibility.md)

---

## Maintenance

**Review Frequency:** Monthly  
**Update on:** Major UI changes  
**Owner:** Engineering Team

---

**Last Updated:** 2024-10-30  
**Version:** 1.0
