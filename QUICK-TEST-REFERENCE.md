# Quick Test Reference Guide

## 🎯 All Test Scripts at a Glance

### 1. Customer Reminders (`customer-reminders.spec.ts`)
```bash
npx playwright test tests/customer-reminders.spec.ts
```
- Send Email+SMS reminder
- Send Email-only reminder
- Test filters (Email Only, SMS Only)
- Test sort (Newest/Oldest First)

---

### 2. Customer Documents (`customer-documents.spec.ts`)
```bash
npx playwright test tests/customer-documents.spec.ts
```
- View sent documents
- Switch between Sent/Completed tabs
- Send new document
- Verify checkbox selection

---

### 3. Payment Plans (`customer-payment-plans.spec.ts`)
```bash
npx playwright test tests/customer-payment-plans.spec.ts
```
- Create Biweekly plan (existing card)
- Create Weekly plan (new card)
- Edit first scheduled payment
- Update date & amount
- Pause payment

---

### 4. Subscriptions (`customer-subscriptions.spec.ts`)
```bash
npx playwright test tests/customer-subscriptions.spec.ts
```
- View subscriptions count
- Verify count > 0
- Open subscriptions list

---

### 5. Invoices (`customer-invoices.spec.ts`)
```bash
npx playwright test tests/customer-invoices.spec.ts
```
- View invoice management
- Check invoice count dynamically
- Display "Showing N invoices"

---

### 6. Create Provider (`create-provider.spec.ts`)
```bash
npx playwright test tests/create-provider.spec.ts
```
- Generate fake doctor data (Faker)
- Fill name, contact, specialty
- Set hourly rate
- Select work days/hours
- Create provider profile

---

### 7. Create Appointment (`create-appointment.spec.ts`)
```bash
npx playwright test tests/create-appointment.spec.ts
```
- Select patient & provider
- Find available date (checks 14 days)
- Select time slot
- Set appointment type
- Create appointment

---

### 8. Send Booking Link (`send-booking-link.spec.ts`)
```bash
npx playwright test tests/send-booking-link.spec.ts
```
- Select customer
- Select provider
- Set expiration (7-30 days)
- Enable SMS
- Send link

---

### 9. Delete Appointment (`delete-appointment.spec.ts`)
```bash
npx playwright test tests/delete-appointment.spec.ts
```
- Login
- Filter to provider
- Find date with appointments
- Select appointment
- Delete & confirm

---

### 10. Payment Update (`appointment-payment-update.spec.ts`)
```bash
npx playwright test tests/appointment-payment-update.spec.ts
```
- Create appointment
- Update payment to $0
- Verify payment display
- Delete appointment

---

## 🚀 Run Commands

### All tests:
```bash
npx playwright test tests/
```

### Specific test:
```bash
npx playwright test tests/customer-reminders.spec.ts
```

### With UI:
```bash
npx playwright test --ui
```

### Headed mode:
```bash
npx playwright test --headed
```

### Debug mode:
```bash
npx playwright test tests/create-provider.spec.ts --debug
```

### Generate report:
```bash
npx playwright test
npx playwright show-report
```

---

## 📊 Test File Sizes

| File | Size | Lines |
|------|------|-------|
| customer-payment-plans.spec.ts | 5.7K | 144 |
| create-appointment.spec.ts | 4.4K | 110 |
| create-provider.spec.ts | 3.6K | 78 |
| customer-reminders.spec.ts | 3.5K | 80 |
| delete-appointment.spec.ts | 3.4K | 83 |
| appointment-payment-update.spec.ts | 3.3K | 81 |
| customer-documents.spec.ts | 2.9K | 69 |
| send-booking-link.spec.ts | 2.1K | 50 |
| customer-subscriptions.spec.ts | 1.9K | 50 |
| customer-invoices.spec.ts | 1.8K | 51 |

**Total:** 32.7K, 796 lines

---

## ✨ Features

All tests include:
- ✅ Console logging with emojis
- ✅ Error handling
- ✅ Clear comments
- ✅ Minimal code
- ✅ Dynamic data (where applicable)
- ✅ Validation checks
