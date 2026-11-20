# Medalanda Banana Nursery – GitHub / Netlify

## 1. Firebase Web App Config
1. Firebase Console → Project settings → General → Your apps → Web app.
2. Copy the Firebase config object.
3. Open `firebase-config.js` and replace:
   - `PASTE_API_KEY_HERE`
   - `PASTE_MESSAGING_SENDER_ID`
   - `PASTE_APP_ID`
4. Keep `databaseURL` as your Realtime Database URL.

## 2. Enable Login
Firebase Console → Authentication → Get started → Sign-in method → Email/Password → Enable.
Then Authentication → Users → Add user. Create the admin email/password there.
This website intentionally has no public sign-up form.

## 3. Secure Database Rules
Firebase Console → Realtime Database → Rules. Replace the current public rules with the content of `firebase-rules.json`, then Publish.
These rules allow signed-in Firebase users to read/write `banana_nursery` only. Keep admin user credentials private. If you later add staff logins, use role-based rules before giving them access.

## 4. GitHub upload from Android
1. Extract the ZIP on your phone.
2. Open GitHub in Chrome and sign in.
3. Create a repository, e.g. `medalanda-banana-nursery`.
4. Choose Add file → Upload files.
5. Upload all files in this folder (index.html, style.css, app.js, firebase-config.js, firebase-rules.json, README_SI.md).
6. Commit changes.

## 5. Netlify
1. Open Netlify and sign in.
2. Add new site → Import an existing project → GitHub.
3. Select your repository.
4. Build command: leave blank.
5. Publish directory: `/` (repository root).
6. Deploy.

## Database paths
All app data is stored under `banana_nursery/` and will not overwrite the existing `/students` data.

## Features in this starter
- Admin email/password login
- Batch creation with independent variety + batch number
- Automatic 14-day propagator end date
- Propagator count / move to nursery
- Stock add, loss, correction history
- Sales reduce stock from selected batch
- Fertilizer and chemical application log
- Team records
- Dashboard totals, CSV batch export, print-to-PDF report

## Important
- Do not leave public `.read: true` / `.write: true` rules enabled.
- Firebase API key is a web app identifier, not a service-account private key. Never upload service-account JSON or private private keys.
- This is a browser-based Firebase app, not PHP. Firebase SDK loads from Google's CDN, so the deployed website needs internet access.
- Reports use browser print. On Android Chrome choose Print → Save as PDF.
