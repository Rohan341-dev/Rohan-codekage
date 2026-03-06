# Rohan-codekage
Rohan Portfolio

## Contact form delivery

This project is deployed as a static GitHub Pages site, so private SMTP usernames and passwords should not be embedded in frontend code.

The contact form now supports:

- direct email delivery through EmailJS
- automatic `mailto:` fallback when EmailJS is not configured yet

## EmailJS setup

1. Create an EmailJS service, template, and public key.
2. Update the `window.contactFormConfig` block near the bottom of `index.html` with:
   - `publicKey`
   - `serviceId`
   - `templateId`
3. Use these template variables in EmailJS:
   - `from_name`
   - `reply_to`
   - `phone`
   - `subject`
   - `message`
   - `to_email`

If the placeholder values remain, the form will open the visitor's email app with a prefilled message instead of sending directly from the page.
