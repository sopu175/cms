# Next.js PWA Boilerplate 🚀

A production-ready, super-fast Next.js 15 boilerplate with PWA capabilities, reusable components, and smooth scrolling animations.

## 🌟 Features

- ⚡ **Next.js 15** with App Router
- 📱 **Progressive Web App (PWA)** ready
- 🎨 **Tailwind CSS 4** for styling
- 🔄 **Smooth Scrolling** with Lenis & GSAP
- 🧩 **Reusable Components** with TypeScript
- 📊 **SEO Optimized** with metadata API
- 🎭 **Framer Motion** animations
- 📝 **React Hook Form** for forms
- 🎯 **TypeScript** for type safety
- 🎪 **Swiper.js** for carousels
- 🖼️ **LightGallery** for image galleries
- 📱 **Responsive Design** with mobile-first approach

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd next-boilerplate

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [slug]/            # Dynamic pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── client/           # Client-side components
│   ├── global/           # Global components
│   ├── ui/               # UI components
│   └── transitions/      # Page transitions
├── context/              # React contexts
├── utils/                # Utility functions
└── types/                # TypeScript definitions
```

## 🧩 Component Documentation

### UI Components

#### Button Component
```tsx
import Button from '@/components/ui/Button';

<Button
  text="Click Me"
  src="/about"
  background="var(--var-dc--primary-color)"
  hoverBackground="var(--var-dc--secondary-color)"
  onClick={() => console.log('Clicked!')}
/>
```

#### Title Component
```tsx
import Title from '@/components/ui/Title';

<Title 
  tag="h1"
  fontSize="2rem"
  color="var(--var-dc--primary-color)"
  spanColor="var(--var-dc--accent-color)"
>
  Welcome to <span>Our Site</span>
</Title>
```

#### Paragraph Component
```tsx
import Paragraph from '@/components/ui/Paragraph';

<Paragraph
  textOne="First paragraph content"
  textTwo="Second paragraph content"
  fontSize="1.2rem"
  spanColor="var(--var-dc--primary-color)"
/>
```

### Global Components

#### Navigation Buttons
```tsx
import NavigationButtons from '@/components/global/NavigationButtons';

<NavigationButtons
  isBeginning={currentIndex === 0}
  isEnd={currentIndex === totalItems - 1}
  onPrevious={() => handlePrevious()}
  onNext={() => handleNext()}
  size={50}
  backgroundColor="#0070f3"
/>
```

#### Social Icons
```tsx
import SocialIcons from '@/components/global/SocialIcons';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const socialItems = [
  { icon: Facebook, url: "https://facebook.com", tooltip: "Facebook" },
  { icon: Twitter, url: "https://twitter.com", tooltip: "Twitter" },
];

<SocialIcons items={socialItems} variant="primary" size="lg" />
```

#### Share Buttons
```tsx
import ShareButtons from '@/components/global/ShareButtons';

<ShareButtons
  title="Amazing Article"
  description="Check out this article!"
  platforms={['facebook', 'twitter', 'linkedin', 'email']}
  variant="primary"
/>
```

### Form Components

#### Text Input
```tsx
import TextInput from '@/components/ui/field/TextInput';
import { useForm } from 'react-hook-form';

const { register, formState: { errors } } = useForm();

<TextInput
  name="email"
  placeholder="Enter your email"
  type="email"
  register={register}
  validation={{ required: "Email is required" }}
  error={errors.email}
/>
```

#### Select Input
```tsx
import SelectInput from '@/components/ui/field/SelectInput';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
];

<SelectInput
  name="select"
  options={options}
  placeholder="Choose an option"
  onChange={(value) => console.log(value)}
/>
```

### Media Components

#### Gallery
```tsx
import Gallery from '@/components/ui/Gallery';

const galleryItems = [
  {
    id: 1,
    type: "image",
    thumb: "/thumb1.jpg",
    src: "/image1.jpg",
    title: "Image 1"
  },
  {
    id: 2,
    type: "video",
    thumb: "/thumb2.jpg",
    src: "/video1.mp4",
    title: "Video 1"
  }
];

<Gallery items={galleryItems} />
```

#### Video Player
```tsx
import { VideoPlayer } from '@/components/global/VideoPlayer';

<VideoPlayer
  url="https://www.youtube.com/watch?v=VIDEO_ID"
  controls={true}
  playing={false}
  muted={false}
/>
```

### Animation Components

#### Sticky Icon
```tsx
import StickyIcon from '@/components/global/StickyIcon';
import { Phone } from 'lucide-react';

<StickyIcon
  icon={Phone}
  bottom="20"
  right="20"
  variant="primary"
  tooltip="Call us"
  onClick={() => window.open('tel:+1234567890')}
/>
```

## 🎨 Styling System

### CSS Variables
The project uses CSS custom properties for consistent theming:

```css
:root {
  /* Colors */
  --var-dc--primary-color: #0070f3;
  --var-dc--secondary-color: #7928ca;
  --var-dc--accent-color: #ff0080;
  --var-dc--background: #ffffff;
  --var-dc--foreground: #171717;
  
  /* Typography */
  --var-dc--font-primary: 'Inter', sans-serif;
  --var-dc--font-secondary: 'Poppins', sans-serif;
  --var-dc--font-mono: 'Roboto Mono', monospace;
  
  /* Spacing */
  --var-dc--spacing-20: 20px;
  --var-dc--spacing-40: 40px;
  --var-dc--spacing-60: 60px;
  --var-dc--spacing-80: 80px;
  --var-dc--spacing-100: 100px;
}
```

### Utility Classes
```css
/* Padding utilities */
.pt-100 { padding-top: var(--var-dc--spacing-100); }
.pb-100 { padding-bottom: var(--var-dc--spacing-100); }

/* Margin utilities */
.mt-40 { margin-top: var(--var-dc--spacing-40); }
.mb-40 { margin-bottom: var(--var-dc--spacing-40); }
```

## 🎭 Smooth Scrolling

### Lenis Smooth Scroll Setup

```tsx
// In your layout or main component
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

useEffect(() => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return () => {
    lenis.destroy();
  };
}, []);
```

### GSAP Scroll Animations

```tsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

useGSAP(() => {
  // Fade in animation
  gsap.from('.fade-in', {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: '.fade-in',
      start: 'top 80%',
      end: 'top 20%',
      toggleActions: 'play none none reverse',
    },
  });
}, []);
```

## 📱 PWA Configuration

The PWA is configured in `next.config.ts`:

```typescript
import withPWA from 'next-pwa';

const nextPWAConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === 'development',
  skipWaiting: true,
  clientsClaim: true,
  // ... other PWA settings
});
```

### Manifest Configuration
Located in `public/manifest.json`:

```json
{
  "name": "Next.js Boilerplate",
  "short_name": "NextJS App",
  "description": "A Next.js PWA boilerplate",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000"
}
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_GOOGLE_ANALYTICS=UA-123456789-1
```

### TypeScript Configuration
The project includes comprehensive TypeScript support with strict mode enabled.

### ESLint & Prettier
Code quality is maintained with ESLint and Prettier configurations.

## 🚀 Performance Optimizations

- **Image Optimization**: Next.js Image component with WebP support
- **Code Splitting**: Automatic code splitting with dynamic imports
- **PWA Caching**: Service worker for offline functionality
- **Font Optimization**: Preloaded fonts with font-display: swap
- **Bundle Analysis**: Built-in bundle analyzer

## 📊 SEO Features

- **Metadata API**: Dynamic meta tags for each page
- **Open Graph**: Social media sharing optimization
- **JSON-LD**: Structured data for rich snippets
- **Sitemap**: Automatic sitemap generation
- **Robots.txt**: Search engine crawling instructions

## 🧪 Testing

```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Format code
npm run format
```

## 📦 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review component examples

---

Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS.