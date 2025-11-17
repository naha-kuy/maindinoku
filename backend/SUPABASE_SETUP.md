# Supabase PostgreSQL Setup

## Database Configuration

Backend sudah dikonfigurasi untuk menggunakan PostgreSQL di Supabase.

### Cara Setup:

1. **Dapatkan Database Password dari Supabase Dashboard:**
   - Buka: https://supabase.com/dashboard/project/doxybmgfluqbayqsrxgs/settings/database
   - Copy database password (bukan API key)

2. **Setup Environment Variables:**

   Buat file `.env` di folder `backend/` dengan isi:

   ```env
   # Option 1: Use individual config values
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASS=your_database_password_here
   DB_HOST=db.doxybmgfluqbayqsrxgs.supabase.co
   DB_PORT=5432
   ```

   **ATAU** gunakan connection string:

   ```env
   # Option 2: Use connection string (recommended)
   DATABASE_URL=postgresql://postgres:your_password@db.doxybmgfluqbayqsrxgs.supabase.co:5432/postgres
   ```

3. **Install Dependencies:**

   ```bash
   cd backend
   npm install
   ```

4. **Run Server:**

   ```bash
   npm run dev
   ```

### Catatan Penting:

- **API Key** yang diberikan adalah untuk Supabase REST API, **BUKAN** untuk database connection
- Untuk database connection, Anda perlu **database password** dari Supabase dashboard
- Supabase menggunakan SSL, sudah dikonfigurasi di `models/index.js`
- Port default: 5432 (direct connection) atau 6543 (pooler)

### Connection String Format:

**Direct Connection:**
```
postgresql://postgres:[PASSWORD]@db.doxybmgfluqbayqsrxgs.supabase.co:5432/postgres
```

**Pooler Connection (recommended for production):**
```
postgresql://postgres.doxybmgfluqbayqsrxgs:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### Supabase Project Info:

- **Project URL:** https://doxybmgfluqbayqsrxgs.supabase.co
- **Project Ref:** doxybmgfluqbayqsrxgs
- **API Key:** (untuk REST API, bukan database)

