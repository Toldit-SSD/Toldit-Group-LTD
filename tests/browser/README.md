# Browser regression checks

`motion.mjs` runs against a served build and requires Playwright plus Chromium in the QA environment. These are QA tools, not website runtime dependencies.

```sh
TOLDIT_PLAYWRIGHT_MODULE=/workspace/toldit-qa/node_modules/playwright/index.mjs \
TOLDIT_PREVIEW_URL=http://127.0.0.1:4174 \
TOLDIT_QA_REPORT=/tmp/toldit-motion.json \
node tests/browser/motion.mjs
```

When Playwright is installed in the checkout, omit TOLDIT_PLAYWRIGHT_MODULE. The browser executable in the tested managed environment is /usr/bin/chromium; adapt that launch option for other environments.

The test uses device-capability and visibility fixtures explicitly. It sends no enquiries, changes no product records and performs no live payments. It checks pause hit targets, repeated motion preferences, retained manual pause, offscreen stopping, the hidden-document boundary, constrained/touch fallback and native alt text after image failure. The Node motion tests also cover the race where a frame sees a changed preference before the media-query change callback arrives.
