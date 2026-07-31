# Auth emails from support@carprise.co.uk

Supabase’s built-in mailer sends from a Supabase address.  
To send signup / reset emails **from Carprise**, use **custom SMTP** (Resend is already used on the marketing site).

## 1. Resend domain

In [Resend](https://resend.com):

1. **Domains** → add / verify `carprise.co.uk` (DNS: SPF, DKIM, etc.).
2. Confirm you can send as `support@carprise.co.uk`  
   (same as `RESEND_FROM_EMAIL` on the website if already set that way).
3. Open **Settings → SMTP** and copy:
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: your **Resend API key**

## 2. Supabase custom SMTP

In the **new** Supabase project (`xfukghylbjtnywhymqrm`):

1. **Authentication → Emails → SMTP Settings**  
   (or Project Settings → Authentication → SMTP)
2. **Enable Custom SMTP**
3. Fill in:

| Field | Value |
|--------|--------|
| Sender email | `support@carprise.co.uk` |
| Sender name | `Carprise` |
| Host | `smtp.resend.com` |
| Port number | `465` |
| Username | `resend` |
| Password | Resend API key |
| Minimum interval | `60` (or default) |

4. Save.

## 3. Site URL and redirects (fixes localhost in email links)

If confirmation links show `redirect_to=http://localhost:3000`, Supabase is still using the default Site URL.

**Authentication → URL Configuration**

| Field | Value |
|--------|--------|
| **Site URL** | `https://www.carprise.co.uk/drive` |
| **Redirect URLs** (add all of these) | `https://www.carprise.co.uk/drive` |
| | `https://www.carprise.co.uk/drive/**` |
| | `https://www.carprise.co.uk/**` |
| | `carprise://**` (native app later) |
| | `http://localhost:8081/drive/**` (local web only) |

Remove `http://localhost:3000` from Site URL if it is still there.

After saving, **new** signups get the correct link. Old emails already sent keep the old redirect.

## 4. Email templates (Carprise branding)

**Authentication → Emails → Templates**

### Confirm signup – Subject
```
Confirm your Carprise driver account
```

### Confirm signup – Body
```html
<h2>Welcome to Carprise</h2>
<p>Hi{{ if .Data.first_name }} {{ .Data.first_name }}{{ end }},</p>
<p>Thanks for joining the Carprise driver network. Confirm your email to activate your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm email address</a></p>
<p>If you did not create this account, you can ignore this email.</p>
<p>- The Carprise team<br/>support@carprise.co.uk</p>
```

### Reset password – Subject
```
Reset your Carprise password
```

### Reset password – Body
```html
<h2>Password reset</h2>
<p>We received a request to reset your Carprise driver password.</p>
<p><a href="{{ .ConfirmationURL }}">Choose a new password</a></p>
<p>If you did not request this, you can ignore this email.</p>
<p>- The Carprise team<br/>support@carprise.co.uk</p>
```

## 5. Test

1. Sign up a new driver at https://www.carprise.co.uk/drive  
2. Inbox should show **From: Carprise &lt;support@carprise.co.uk&gt;**  
3. Confirm link should open the driver app on carprise.co.uk  

## Optional: skip confirmation during pilot

**Authentication → Providers → Email** → turn off **Confirm email**  
Users can sign in immediately (no email). Turn confirmation back on before public launch.

## App code

`signUp` already sets:

```ts
emailRedirectTo: 'https://www.carprise.co.uk/drive'
```

Override with `EXPO_PUBLIC_AUTH_REDIRECT_URL` if needed, then rebuild the web export.
