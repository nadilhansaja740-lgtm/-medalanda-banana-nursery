<div align="center">

<img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=85" alt="Green agricultural fields" width="100%" />

# 🌱 Medalanda Agro Bio Tech
## Banana Nursery Management System

**Grow Green • Grow Together • Manage Smarter**

A modern, mobile-friendly banana nursery management system built with **HTML, CSS, JavaScript and Firebase Realtime Database**.

![HTML](https://img.shields.io/badge/HTML5-Frontend-orange?logo=html5)
![CSS](https://img.shields.io/badge/CSS3-Design-blue?logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-Logic-yellow?logo=javascript)
![Firebase](https://img.shields.io/badge/Firebase-Realtime%20Database-ffca28?logo=firebase)
![Hosting](https://img.shields.io/badge/Hosting-Netlify-00c7b7?logo=netlify)

</div>

---

## 🍌 About the Project

The **Medalanda Agro Bio Tech Banana Nursery Management System** is designed to help manage banana plant batches from potting to nursery growth and final sales.

Each batch is tracked independently, including its plant variety, potting date, propagator period, stock changes, sales, and fertilizer or chemical applications.

<div align="center">
<img src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1000&q=85" alt="Banana plants and bananas" width="85%" />
</div>

## ✨ Main Features

| Feature | Description |
|---|---|
| 🌿 Batch Management | Manage Ambun, Kolikuttu, Ambul and other banana varieties with separate batch numbers |
| 🪴 Potting Records | Save potting date and initial plant count |
| 📅 14-Day Propagator | Track each batch's 14-day propagator period |
| 📦 Stock Management | Record stock additions, losses and corrections with history |
| 🧾 Sales Management | Record sales and deduct plants from the selected batch |
| 🧪 Fertilizer Records | Track products such as 20:20:20 |
| 🧴 Chemical Records | Track Mancozeb and other nursery chemical applications |
| 👥 Team Management | Maintain owner, teacher, developer and staff details |
| 📊 Dashboard | View total plants, batches, sales and propagator batches |
| 📄 Reports | Print reports or save them as PDF; export batch data as CSV |
| 📱 Responsive UI | Use the system on a phone, tablet or computer |

## 🧰 Technology

- **Frontend:** HTML5, CSS3, JavaScript
- **Database:** Firebase Realtime Database
- **Authentication:** Firebase Authentication (Email/Password)
- **Source control:** GitHub
- **Hosting:** Netlify

## 🖼️ Project Preview

<div align="center">
<img src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1000&q=85" alt="Green tropical plants" width="85%" />
</div>

## 🚀 Setup Guide

### 1. Create a Firebase Web App

1. Open [Firebase Console](https://console.firebase.google.com/).
2. Select the project connected to your Realtime Database.
3. Open **Project settings → General → Your apps**.
4. Register a Web App if you have not already created one.
5. Copy its Firebase configuration.

### 2. Add Firebase Configuration

Open `firebase-config.js` and replace the placeholder values with your Firebase Web App configuration.

```js
const firebaseConfig = {
  apiKey: "YOUR_WEB_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_WEB_APP_ID"
};
```

Use the exact values shown in Firebase Console. Do not put a service-account private key in this frontend project.

### 3. Enable Admin Sign-in

1. In Firebase Console, open **Authentication → Sign-in method**.
2. Enable **Email/Password**.
3. Open **Users → Add user** and create the administrator account.
4. The website does not provide public sign-up.

### 4. Secure the Realtime Database

The app stores its records under:

```text
banana_nursery/
├── batches/
├── history/
├── sales/
├── applications/
└── team/
```

The existing `/students` data is kept separate.

Before publishing, update Realtime Database Rules using the rules in `firebase-rules.json`, then publish them. These rules require a signed-in Firebase user to access the nursery data. For a multi-user production system, add role-based access rules before creating staff accounts.

### 5. Upload to GitHub

1. Create a repository, for example `medalanda-banana-nursery`.
2. Upload all project files to the repository root.
3. Commit the changes.

### 6. Deploy with Netlify

1. Sign in to [Netlify](https://www.netlify.com/).
2. Choose **Add new site → Import an existing project**.
3. Connect GitHub and select this repository.
4. Leave the build command empty.
5. Set the publish directory to `.` (repository root).
6. Deploy the site.

## 👨‍🌾 Nursery Information

| Role | Name |
|---|---|
| Business | Medalanda Agro Bio Tech Banana Nusare |
| Owner | Mr. Wijekon |
| Teacher | Arjuni Miss |
| Developer | Nadil Hansaja |
| Staff | 3 Staff Members |

## 📱 Use on Mobile

The website is responsive and can be opened in Chrome on Android. For PDF reports, use the browser menu and choose **Print → Save as PDF**.

## 🔐 Security Notes

- Never keep Realtime Database public read/write rules enabled on a live website.
- Keep administrator passwords private.
- Never upload Firebase service-account JSON files or private keys to GitHub.
- A Firebase Web App API key is not a service-account private key, but database access must still be protected by Authentication and Database Rules.

---

<div align="center">

### 🌿 Medalanda Agro Bio Tech
**Empowering Agriculture with Technology**

*Banana Nursery Management System*

</div>
