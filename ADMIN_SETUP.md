# Portfolio admin setup

The admin screen may be hidden from the public navigation, but the URL is not a
security control. Firebase Authentication identifies the user; Firestore and
Storage rules decide what that user is allowed to change.

## 1. Enable the Firebase products

In the Firebase console for `myportfolio26-e4dea`:

1. Open **Authentication > Sign-in method** and enable **Email/Password**.
2. Open **Authentication > Users** and create one account for yourself. Do not
   add public account registration to the portfolio.
3. Create the default **Cloud Firestore** database if it does not exist.
4. Enable **Cloud Storage** if it does not exist.
5. Under **Authentication > Settings > Authorized domains**, keep localhost for
   development and add every production domain that can host the admin screen.

Use a unique password and enable multi-factor authentication on the owning
Google/Firebase account. Never place the admin password or a service-account
JSON file in this repository.

## 2. Grant the owner account admin access

Copy the Firebase Authentication UID of the owner account. In Firestore, create:

```text
Collection: admins
Document ID: <the Firebase Authentication UID>
Field: active = true (boolean)
```

Create this document in the Firebase console, not from the website. The checked
in rules intentionally prevent every browser client, including a signed-in
admin, from creating or modifying admin records.

To revoke portfolio editing immediately, change `active` to `false` in the
Firebase console. Also reset the password and revoke refresh tokens if the
account or phone may be compromised.

## 3. Live content document

The public site reads one document directly:

```text
/portfolio/published
```

Anonymous visitors may get this exact document, but cannot list the `portfolio`
collection or read any other document. The authenticated admin may create or
update it. The rules prevent deleting `published` accidentally.

Everything stored in `portfolio/published` must be treated as public. Do not put
passwords, private notes, access tokens, draft contact details, or other secrets
inside it. Keep the hardcoded portfolio content as a frontend fallback so a
temporary Firebase failure never leaves an empty website.

## 4. Deploy the security rules

From the repository root, while logged into the correct Firebase account:

```powershell
firebase use myportfolio26-e4dea
firebase deploy --only firestore:rules,storage
```

Storage authorization reads `/admins/{uid}` from Firestore. On the first rules
deployment, Firebase may ask to enable the permission that lets Storage Rules
consult the default Firestore database. Approve that project-scoped permission;
otherwise every protected upload will be denied.

Deploying Hosting does not automatically make undeployed console rules safe.
Deploy and test these rule files before exposing the admin route.

## 5. Allowed uploads

The Storage rules permit only these paths:

| Purpose | Path | Types | Maximum |
| --- | --- | --- | --- |
| Profile image | `portfolio/profile/<file>` | JPEG, PNG, WebP, AVIF | 5 MB |
| Project image | `portfolio/projects/<project-id>/<file>` | JPEG, PNG, WebP, AVIF | 8 MB |
| Resume | `portfolio/resume/<file>.pdf` | PDF | 10 MB |

File and project identifiers may contain letters, numbers, `_`, `-`, and the
allowed filename may additionally contain dots. Normalize uploaded names before
calling Storage; resume filenames must end in lowercase `.pdf`.

Use a unique path for each replacement. Upload the new file first, obtain its
download URL, update `/portfolio/published`, and only then delete the old file.
If the Firestore update fails, remove the newly uploaded orphan.

For a Resume button that reliably downloads instead of opening a cross-origin
PDF, upload with metadata like:

```js
{
  contentType: 'application/pdf',
  contentDisposition: 'attachment; filename="Tushar-Anand-Resume.pdf"',
}
```

The HTML `download` attribute can be ignored for cross-origin URLs, so the
Storage `contentDisposition` metadata is the important part.

## 6. Firebase client configuration

`firebase.js` exports `app`, `auth`, `db`, and `storage`; Analytics is available
as the non-blocking `analyticsPromise`. It reuses the app during Vite hot reloads
and safely skips Analytics when the browser does not support it.

Firebase web configuration is a public client identifier, not an administrator
secret. The existing values remain as working fallbacks. A different Firebase
project can override them at build time:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Every `VITE_*` value is embedded in the browser bundle. Never use that mechanism
for passwords, Admin SDK credentials, service-account keys, or any value that
must remain secret. Before creating `.env.local` or environment-specific files,
also extend `.gitignore`; it currently ignores only the exact `.env` filename.

## 7. Security checks before launch

- Signed out: `/portfolio/published` loads; other Firestore documents, listing,
  uploads, replacements, and deletes fail.
- Signed in with a non-admin account: the same operations still fail.
- Signed in as the active owner: content saves and valid uploads succeed.
- Rename the resume to an uppercase `.PDF`, upload a non-image, or exceed a size
  limit: Storage rejects the request.
- Set the owner's `active` field to `false`: new edits and uploads fail.
- The admin interface has a clear sign-out action and does not render saved HTML
  using `dangerouslySetInnerHTML`.

Firebase's official rule guidance is available in the
[Firestore rules documentation](https://firebase.google.com/docs/firestore/security/rules-conditions)
and [Storage rules documentation](https://firebase.google.com/docs/storage/security/rules-conditions).
