ITech Development Charities - Fund Tracker

A secure, single-page web application designed to track Restricted Funds (Special Projects) versus Unrestricted Operating Funds for ITech Development Charities.

This application ensures financial transparency by reconciling the "Total Cash on Hand" against specific project allocations (e.g., Solar Project, Kiosk Setup), helping administrators visualize exactly how much capital is available for general use.

🌟 Features

Organization-Wide Sync: Data is stored in a shared Firestore path (/public/data), ensuring all administrators see the same financial data in real-time.

Secure Corporate Login: Uses Microsoft Azure AD (Single Sign-On) to restrict access strictly to organization members (Single Tenant).

Restricted Fund Management: Create specific projects with target goals and track donations/expenses independently.

Cash Reconciliation: Automatically calculates Unallocated Cash based on Total Cash minus Restricted Funds.

Printable Reports: Generates professional HTML reports for board meetings or records.

Zero-Install: Runs entirely in the browser as a single HTML file using React and Tailwind via CDN.

🚀 Usage

Running Locally

Clone this repository:

git clone [https://github.com/Xiurzeph/itech-development-charities.git](https://github.com/Xiurzeph/itech-development-charities.git)


Navigate to the folder and simply double-click ITechFundTracker.html.

Sign in using your corporate Microsoft account.

Live Deployment

This project is designed to be hosted on GitHub Pages.

Go to the repository Settings.

Navigate to Pages.

Select the main branch as the source.

The app will be live at https://xiurzeph.github.io/itech-development-charities/ITechFundTracker.html.

⚙️ Configuration

The application relies on two cloud services: Google Firebase (Database) and Microsoft Azure (Authentication).

1. Firebase Firestore Rules

To ensure data is shared correctly among admins but secured from the public, the following Security Rules are applied in the Firebase Console:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Shared Organization Data
    match /artifacts/itech-charity-default/public/data/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}


2. Azure AD Setup (Single Tenant)

App Registration: Registered as "ITech Fund Tracker" in the Azure Portal.

Tenant ID: 0b13aea2-8f34-4af4-bd7a-d950720cd00a (Hardcoded in ITechFundTracker.html to enforce organization-only login).

Authentication Flow: Uses OAuth 2.0 Implicit/Hybrid flow via Firebase Auth.

🛠️ Modifying the App

The entire application logic resides inside ITechFundTracker.html.

Styling: Uses Tailwind CSS utility classes.

Logic: React (v18) components defined in the Babel script tag.

Icons: Inline SVGs (Lucide React style) to avoid external dependencies.

🔒 Security Note

API Keys: The Firebase API keys included in the source code are public identifiers. Security is enforced via Domain Restrictions (configured in Google Cloud Console) and Firestore Security Rules.

Access Control: Access is strictly controlled via the Azure Tenant ID. Only users belonging to the specific Azure Directory can generate a valid token to read/write database data.

© 2025 ITech Development Charities
