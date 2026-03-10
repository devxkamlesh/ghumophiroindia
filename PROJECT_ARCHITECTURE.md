# 🏰 Ghumo Firo India - Project Architecture

## 📋 What This Project Does

This is a **tour booking website** for Rajasthan tourism. It has three main parts:

1. **Public Website** - Where visitors can browse tours and book trips
2. **User Account** - Where customers can see their bookings
3. **Admin Panel** - Where you manage tours, bookings, and customer requests

---

## 🎨 Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 GHUMO FIRO INDIA                      │
│                  (Tour Booking Website)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   FRONTEND   │    │   BACKEND    │    │   DATABASE   │
│  (Website)   │◄───┤   (Server)   │◄───┤ (PostgreSQL) │
│   Next.js    │    │   Node.js    │    │   + Redis    │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 🏠 Frontend (Website) - What Visitors See

### 1. **Public Pages** (Anyone can visit)
```
┌─────────────────────────────────────┐
│         🏠 Home Page                │
│  • Hero section with animations     │
│  • Search tours                     │
│  • Featured tours                   │
│  • Why choose us                    │
└─────────────────────────────────────┘
         │
         ├──► 🗺️ Tours Page (Browse all tours)
         ├──► 📞 Contact Page (Send inquiries)
         ├──► ℹ️ About Page (Company info)
         └──► ✨ Custom Tour Page (Request custom trips)
```

### 2. **User Account** (For customers who book tours)
```
┌─────────────────────────────────────┐
│      👤 My Account                  │
│  • View profile                     │
│  • See booking history              │
│  • Track tour status                │
└─────────────────────────────────────┘
```

### 3. **Admin Panel** (Only for admin users)
```
┌─────────────────────────────────────┐
│      🔐 Admin Dashboard             │
│  • Overview (stats & numbers)       │
│  • Manage Tours                     │
│  • View Bookings                    │
│  • Handle Inquiries                 │
│  • Custom Requests                  │
│  • Analytics                        │
└─────────────────────────────────────┘
```

---

## 🔧 Backend (Server) - The Brain

```
┌─────────────────────────────────────┐
│         🧠 SERVER                   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Authentication             │   │
│  │  • Login/Register           │   │
│  │  • Password security        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Tours Management           │   │
│  │  • Create/Edit/Delete       │   │
│  │  • Search & Filter          │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Bookings                   │   │
│  │  • Create bookings          │   │
│  │  • Track status             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Inquiries & Requests       │   │
│  │  • Contact form             │   │
│  │  • Custom tour requests     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 💾 Database - Where Everything is Stored

```
┌─────────────────────────────────────┐
│      📦 DATABASE TABLES             │
│                                     │
│  👥 Users                           │
│     • Name, email, password         │
│     • Role (admin/user)             │
│                                     │
│  🗺️ Tours                           │
│     • Title, description            │
│     • Price, duration               │
│     • Images, itinerary             │
│                                     │
│  📅 Bookings                        │
│     • Customer details              │
│     • Tour selection                │
│     • Dates, travelers              │
│     • Payment status                │
│                                     │
│  💬 Inquiries                       │
│     • Customer questions            │
│     • Contact requests              │
│                                     │
│  ✨ Custom Tour Requests            │
│     • Special trip requests         │
│     • Budget, preferences           │
└─────────────────────────────────────┘
```

---

## 🎯 How It All Works Together

### Example: Booking a Tour

```
1. 👤 Customer visits website
         ↓
2. 🔍 Browses tours on Tours Page
         ↓
3. 📝 Fills booking form
         ↓
4. 📤 Form sent to Backend Server
         ↓
5. 💾 Server saves to Database
         ↓
6. ✅ Customer sees confirmation
         ↓
7. 🔐 Admin sees booking in Admin Panel
```

### Example: Admin Managing Tours

```
1. 🔐 Admin logs into Admin Panel
         ↓
2. ➕ Clicks "Add New Tour"
         ↓
3. 📝 Fills tour details (title, price, images)
         ↓
4. 💾 Saves to Database
         ↓
5. 🌐 Tour appears on public website
         ↓
6. 👥 Customers can now book it
```

---

## 🎨 Design Features

### Colors & Theme
- **Primary Colors**: Orange & Pink gradients
- **Style**: Modern, clean, floating cards
- **Effects**: Smooth animations, blur effects, shadows

### Special Features
- **Floating Navbar**: Glassmorphism effect (blurred background)
- **Hero Animation**: Scrolling image gallery with 3D effects
- **Responsive**: Works on phones, tablets, and computers
- **Dark Mode**: Automatic light/dark theme switching

---

## 🔐 Security & Access

```
┌─────────────────────────────────────┐
│      🔒 ACCESS LEVELS               │
│                                     │
│  🌐 Public (Everyone)               │
│     • View tours                    │
│     • Contact us                    │
│     • Register/Login                │
│                                     │
│  👤 Logged-in Users                 │
│     • Book tours                    │
│     • View their bookings           │
│     • Edit profile                  │
│                                     │
│  🔐 Admin Users                     │
│     • Everything users can do       │
│     • Manage all tours              │
│     • View all bookings             │
│     • Handle inquiries              │
│     • See analytics                 │
└─────────────────────────────────────┘
```

---

## 📱 Pages Overview

### Public Website
1. **Home** - Landing page with hero, featured tours
2. **Tours** - Browse all available tours
3. **Tour Details** - See full info about one tour
4. **Contact** - Send messages to company
5. **About** - Company information
6. **Custom Tour** - Request personalized trips
7. **Login/Register** - Create account or sign in

### User Panel
1. **My Account** - Profile overview
2. **My Bookings** - See all booked tours

### Admin Panel
1. **Dashboard** - Overview with statistics
2. **Tours Management** - Add/Edit/Delete tours
3. **Bookings** - View all customer bookings
4. **Destinations** - Manage tour locations
5. **Custom Requests** - Handle special requests
6. **Inquiries** - Respond to customer questions
7. **Analytics** - View business metrics

---

## 🚀 Technology Stack (Simple Explanation)

- **Frontend**: Next.js (Makes the website fast and smooth)
- **Backend**: Node.js + Express (Handles requests and logic)
- **Database**: PostgreSQL (Stores all data safely)
- **Cache**: Redis (Makes things load faster)
- **Styling**: Tailwind CSS (Makes it look beautiful)
- **Animations**: Framer Motion (Smooth movements)

---

## 📊 Current Status

✅ **Completed**
- Public website with all pages
- User authentication (login/register)
- Tour browsing and viewing
- Booking system
- Admin panel with dashboard
- Tours management
- Bookings view
- User account panel
- Responsive design
- Dark mode support

🚧 **To Be Completed**
- Destinations management page
- Custom requests handling page
- Inquiries management page
- Analytics dashboard
- Payment integration
- Email notifications
- Tour editing interface
- Image upload system

---

## 🎯 Key Features

1. **Beautiful Design** - Modern, clean, professional look
2. **Fast Performance** - Quick loading, smooth animations
3. **Mobile Friendly** - Works perfectly on all devices
4. **Easy to Use** - Simple navigation, clear buttons
5. **Secure** - Protected admin area, safe data storage
6. **Scalable** - Can handle many users and tours

---

## 📞 Support

For admin access or questions:
- Email: kamleshgchoudhary007@gmail.com
- Current Admin: Kamlesh Choudhary
- Server: VPS at 187.127.151.137
