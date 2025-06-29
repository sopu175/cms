# DC CMS Setup Guide

This guide will walk you through the process of setting up the DC CMS from scratch, including database setup, configuration, and initial content creation.

## Prerequisites

Before you begin, make sure you have:

1. A Supabase account (free tier is sufficient)
2. Node.js 18+ installed
3. Git (optional, for version control)

## Step 1: Clone or Download the Repository

```bash
git clone https://github.com/your-username/dc-cms.git
cd dc-cms
```

Or download and extract the ZIP file from the repository.

## Step 2: Install Dependencies

```bash
npm install
```

This will install all the required dependencies for the project.

## Step 3: Set Up Supabase

1. **Create a new Supabase project**:
   - Go to [Supabase](https://supabase.com/) and sign in
   - Click "New Project"
   - Enter a name for your project
   - Set a secure database password
   - Choose a region close to your users
   - Click "Create new project"

2. **Get your Supabase credentials**:
   - Once your project is created, go to the project dashboard
   - Click on "Settings" in the sidebar
   - Click on "API" in the submenu
   - Copy the "URL" and "anon/public" key

3. **Create a .env file**:
   - Copy the `.env.example` file to `.env`
   - Fill in your Supabase URL and anon key:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 4: Set Up the Database Schema

1. **Run the migration script**:
   - Navigate to the Supabase dashboard for your project
   - Go to "SQL Editor"
   - Copy the contents of `supabase/migrations/20250629131206_wispy_boat.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the SQL

This will create all the necessary tables, views, functions, and policies for your CMS.

## Step 5: Create an Admin User

1. **Register a new user**:
   - Start the development server:
   ```bash
   npm run dev
   ```
   - Open the application in your browser (usually at http://localhost:5173)
   - Click "Sign Up" on the login page
   - Register with email `admin@dccms.com` and a secure password
   - This email is automatically assigned the admin role by the database trigger

2. **Verify admin access**:
   - After registration, you should be logged in automatically
   - You should see the full admin dashboard with all menu items

## Step 6: Import Demo Data (Optional)

If you want to populate your CMS with demo data:

1. **Create categories**:
   - Go to the Categories section
   - Click "New Category"
   - Create a few categories like "Electronics", "Clothing", etc.

2. **Create products**:
   - Go to the Products section
   - Click "New Product"
   - Fill in the product details
   - Add variations if needed

3. **Create content pages**:
   - Go to the Content Pages section
   - Click "New Page"
   - Create pages like "Home", "About", "Contact", etc.

## Step 7: Configure Settings

1. **Site Information**:
   - Go to Settings > Site Info
   - Enter your site name, description, contact information, etc.

2. **Branding**:
   - Go to Settings > Branding
   - Upload your logo and favicon

3. **Payment Gateways** (if using ecommerce):
   - Go to Settings > Payment
   - Configure your payment gateways (Stripe, PayPal, etc.)

## Step 8: Set Up for Production

When you're ready to deploy to production:

1. **Build the application**:
```bash
npm run build
```

2. **Deploy the built files**:
   - The built files will be in the `dist` directory
   - Deploy these files to your hosting provider (Netlify, Vercel, etc.)

3. **Set environment variables**:
   - Make sure to set the Supabase URL and anon key in your hosting provider's environment variables

## Troubleshooting

### Database Issues

If you encounter database issues:

1. **Check RLS policies**:
   - Make sure Row Level Security (RLS) policies are correctly set up
   - You can review and modify them in the Supabase dashboard under "Authentication > Policies"

2. **Reset the database**:
   - If you need to start fresh, you can:
     - Delete all tables in the Supabase dashboard
     - Re-run the migration script
     - Create a new admin user

### Authentication Issues

If you have trouble with authentication:

1. **Check user roles**:
   - Verify that your user has the correct role in the `profiles` table
   - Admin users should have the role 'admin'

2. **Reset password**:
   - You can reset a user's password in the Supabase dashboard under "Authentication > Users"

## API Documentation

For information on how to use the API, refer to the [API Documentation](api-documentation.md).

## Customization

### Adding Custom Fields

To add custom fields to products, posts, or other entities:

1. Modify the database schema to include the new fields
2. Update the corresponding components to display and edit these fields
3. Update any API endpoints that handle these entities

### Extending Functionality

To add new features:

1. Create new components in the `src/components` directory
2. Add new routes if needed
3. Update the database schema if required
4. Add new API endpoints if necessary

## Backup and Restore

### Database Backup

To backup your database:

1. Go to the Supabase dashboard
2. Navigate to "Project Settings > Database"
3. Click "Generate backup"
4. Download the backup file

### Database Restore

To restore from a backup:

1. Go to the Supabase dashboard
2. Navigate to "Project Settings > Database"
3. Click "Restore backup"
4. Upload your backup file

## Conclusion

You now have a fully functional CMS with content management, ecommerce capabilities, and user management. Explore the different sections of the admin dashboard to familiarize yourself with all the features.

For any questions or issues, please refer to the documentation or contact support.