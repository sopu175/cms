# Component Documentation 📚

This document provides comprehensive usage instructions for all reusable components in the Next.js PWA Boilerplate.

## Table of Contents

- [UI Components](#ui-components)
- [Global Components](#global-components)
- [Form Components](#form-components)
- [Media Components](#media-components)
- [Animation Components](#animation-components)
- [Layout Components](#layout-components)

## UI Components

### Button Component

A highly customizable button component with hover effects and link functionality.

```tsx
import Button from '@/components/ui/Button';

// Basic button
<Button text="Click Me" onClick={() => console.log('Clicked!')} />

// Link button
<Button
  text="Learn More"
  src="/about"
  background="var(--var-dc--primary-color)"
  hoverBackground="var(--var-dc--secondary-color)"
/>

// External link
<Button
  text="Visit Website"
  src="https://example.com"
  target="_blank"
/>

// With icon
<Button
  text="Download"
  img="/icons/download.svg"
  fontSize={16}
  fontWeight={600}
/>
```

**Props:**
- `text` - Button text content
- `src` - URL for link functionality
- `onClick` - Click handler function
- `background` - Background color
- `hoverBackground` - Hover background color
- `fontSize` - Font size in pixels
- `borderRadius` - Border radius in pixels
- `target` - Link target (_blank, _self, etc.)

### Title Component

Flexible heading component with HTML parsing and span styling.

```tsx
import Title from '@/components/ui/Title';

// Basic usage
<Title tag="h1">Welcome to Our Site</Title>

// With custom styling
<Title 
  tag="h2"
  fontSize="2.5rem"
  color="var(--var-dc--primary-color)"
  fontWeight="700"
  textAlign="center"
>
  Our Services
</Title>

// With HTML and span styling
<Title 
  tag="h1"
  spanColor="var(--var-dc--accent-color)"
  spanFontWeight="800"
>
  Welcome to <span>Our Amazing</span> Platform
</Title>
```

**Props:**
- `tag` - HTML tag (h1-h6)
- `fontSize` - Font size (CSS value)
- `color` - Text color
- `spanColor` - Color for span elements
- `fontFamily` - Font family
- `textAlign` - Text alignment

### Paragraph Component

Responsive paragraph component with two-column layout support.

```tsx
import Paragraph from '@/components/ui/Paragraph';

// Single paragraph
<Paragraph
  textOne="This is a single paragraph with some content."
  fontSize="1.2rem"
  color="var(--var-dc--foreground)"
/>

// Two-column layout
<Paragraph
  textOne="First column content goes here."
  textTwo="Second column content goes here."
  gap="gap-8"
  fontSize="1.1rem"
/>

// With HTML and span styling
<Paragraph
  textOne="This paragraph has <span>highlighted text</span> in it."
  spanColor="var(--var-dc--primary-color)"
  spanFontWeight="700"
/>
```

**Props:**
- `textOne` - Primary text content (required)
- `textTwo` - Secondary text for two-column layout
- `fontSize` - Font size
- `gap` - Gap between columns (Tailwind classes)
- `spanColor` - Color for span elements

### Image Components

#### Img Component (Next.js Image with responsive support)

```tsx
import Img from '@/components/ui/Img';

<Img
  alt="Product image"
  srcLg="/images/product-large.jpg"
  srcMd="/images/product-medium.jpg"
  srcSm="/images/product-small.jpg"
  widthPx={800}
  heightPx={600}
  className="rounded-lg"
/>
```

#### PictureImg Component (HTML Picture element)

```tsx
import PictureImg from '@/components/ui/PictureImg';

<PictureImg
  alt="Hero image"
  srcLg="/images/hero-large.jpg"
  srcMd="/images/hero-medium.jpg"
  srcSm="/images/hero-small.jpg"
  widthPx={1200}
  heightPx={800}
  objectFit="cover"
/>
```

## Global Components

### Navigation Buttons

Customizable navigation buttons for sliders and carousels.

```tsx
import NavigationButtons from '@/components/global/NavigationButtons';

<NavigationButtons
  isBeginning={currentIndex === 0}
  isEnd={currentIndex === totalItems - 1}
  onPrevious={() => handlePrevious()}
  onNext={() => handleNext()}
  size={50}
  backgroundColor="#0070f3"
  borderRadius="50%"
  svgColor="#fff"
/>
```

**Props:**
- `isBeginning` - Disable previous button
- `isEnd` - Disable next button
- `onPrevious` - Previous button handler
- `onNext` - Next button handler
- `size` - Button size in pixels
- `backgroundColor` - Button background color

### Social Icons

Social media icons with tooltips and hover effects.

```tsx
import SocialIcons from '@/components/global/SocialIcons';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const socialItems = [
  { icon: Facebook, url: "https://facebook.com", tooltip: "Facebook" },
  { icon: Twitter, url: "https://twitter.com", tooltip: "Twitter" },
  { icon: Instagram, url: "https://instagram.com", tooltip: "Instagram" },
];

<SocialIcons 
  items={socialItems} 
  variant="primary" 
  size="lg"
  spacing="gap-6"
  showTooltips={true}
/>
```

**Props:**
- `items` - Array of social icon configurations
- `variant` - Color variant (primary, secondary, etc.)
- `size` - Icon size (sm, md, lg, xl)
- `spacing` - Gap between icons

### Share Buttons

Social sharing buttons using react-share.

```tsx
import ShareButtons from '@/components/global/ShareButtons';

<ShareButtons
  title="Amazing Article"
  description="Check out this article!"
  platforms={['facebook', 'twitter', 'linkedin', 'email']}
  variant="primary"
  size="md"
  showTooltips={true}
/>
```

**Props:**
- `title` - Content title
- `description` - Content description
- `platforms` - Array of platforms to include
- `variant` - Style variant
- `size` - Button size

### Sticky Icon

Floating action button with positioning options.

```tsx
import StickyIcon from '@/components/global/StickyIcon';
import { Phone, Mail, MessageCircle } from 'lucide-react';

// Phone button
<StickyIcon
  icon={Phone}
  bottom="20"
  right="20"
  variant="primary"
  tooltip="Call us"
  onClick={() => window.open('tel:+1234567890')}
/>

// Multiple icons
<>
  <StickyIcon icon={Phone} bottom="20" right="20" variant="primary" />
  <StickyIcon icon={Mail} bottom="80" right="20" variant="secondary" />
  <StickyIcon icon={MessageCircle} bottom="140" right="20" variant="success" />
</>
```

**Props:**
- `icon` - Lucide icon component
- `bottom/top/left/right` - Position from edges
- `variant` - Color variant
- `tooltip` - Tooltip text
- `onClick` - Click handler

### Slider Component

Advanced slider with Swiper.js integration.

```tsx
import Slider from '@/components/global/Slider';

const sliderData = {
  data: [
    { id: 1, title: "Slide 1", content: "..." },
    { id: 2, title: "Slide 2", content: "..." },
  ],
  speed: 300,
  loop: true,
  autoplayDelay: 3000,
};

<Slider data={sliderData} />
```

## Form Components

### Text Input

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

### Select Input

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
  error={errors.select}
/>
```

### Textarea Input

```tsx
import TextAreaInput from '@/components/ui/field/TextAreaInput';

<TextAreaInput
  name="message"
  placeholder="Enter your message"
  rows={5}
  register={register}
  validation={{ required: "Message is required" }}
  error={errors.message}
/>
```

### Checkbox

```tsx
import CheckBox from '@/components/ui/field/CheckBox';

<CheckBox
  name="terms"
  label="Terms and Conditions"
  options="accept:I accept the terms and conditions"
  register={register}
  validation={{ required: "Please accept terms" }}
  error={errors.terms}
/>
```

### Radio Button

```tsx
import RadioButton from '@/components/ui/field/RadioButton';

<RadioButton
  name="gender"
  label="Gender"
  options="male:Male,female:Female,other:Other"
  register={register}
  validation={{ required: "Please select gender" }}
  error={errors.gender}
/>
```

### Complete Form Example

```tsx
import FormContact from '@/components/FormContact';

const formData = [
  {
    field_key: "name",
    field_type: "textInput",
    label: "Full Name",
    placeholder: "Enter your name",
    validators: "required, string"
  },
  {
    field_key: "email",
    field_type: "textInput",
    label: "Email",
    placeholder: "Enter your email",
    validators: "required, email"
  },
  {
    field_key: "message",
    field_type: "textArea",
    label: "Message",
    placeholder: "Your message",
    validators: "required, string"
  }
];

<FormContact
  formData={formData}
  form_id="contact_form"
/>
```

## Media Components

### Gallery

LightGallery integration with image and video support.

```tsx
import Gallery from '@/components/ui/Gallery';

const galleryItems = [
  {
    id: 1,
    type: "image",
    thumb: "/thumbnails/image1.jpg",
    src: "/images/image1.jpg",
    title: "Beautiful Landscape"
  },
  {
    id: 2,
    type: "video",
    thumb: "/thumbnails/video1.jpg",
    src: "/videos/video1.mp4",
    title: "Product Demo"
  }
];

<Gallery items={galleryItems} />
```

### Video Player

React Player wrapper with platform support.

```tsx
import { VideoPlayer } from '@/components/global/VideoPlayer';

// YouTube video
<VideoPlayer
  url="https://www.youtube.com/watch?v=VIDEO_ID"
  controls={true}
  playing={false}
  muted={false}
  config={{
    youtube: {
      playerVars: {
        modestbranding: 1,
        showinfo: 0
      }
    }
  }}
/>

// Vimeo video
<VideoPlayer
  url="https://vimeo.com/VIDEO_ID"
  playing={true}
  muted={true}
  volume={0.7}
/>

// Direct video file
<VideoPlayer
  url="/videos/demo.mp4"
  controls={true}
  loop={true}
/>
```

## Animation Components

### Smooth Scroll

Lenis smooth scroll integration.

```tsx
import SmoothScroll from '@/components/global/SmoothScroll';

// Wrap your entire app
<SmoothScroll
  duration={1.2}
  easing={(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))}
  smoothTouch={false}
  touchMultiplier={2}
>
  <YourAppContent />
</SmoothScroll>

// Custom configuration
<SmoothScroll
  duration={1.5}
  mouseMultiplier={1.5}
  smoothTouch={true}
>
  <YourAppContent />
</SmoothScroll>
```

### Scroll Animations

GSAP ScrollTrigger animations.

```tsx
import ScrollAnimations from '@/components/global/ScrollAnimations';

<ScrollAnimations
  triggerStart="top 80%"
  triggerEnd="top 20%"
  stagger={0.1}
  duration={1}
>
  {/* Fade in animation */}
  <div className="fade-in">This will fade in on scroll</div>
  
  {/* Slide animations */}
  <div className="slide-up">Slides up from bottom</div>
  <div className="slide-left">Slides in from right</div>
  <div className="slide-right">Slides in from left</div>
  
  {/* Scale animations */}
  <div className="scale-in">Scales in from small</div>
  <div className="scale-out">Scales in from large</div>
  
  {/* Text animations */}
  <div className="split-text">Text splits and animates</div>
  
  {/* Parallax effect */}
  <div className="parallax" data-speed="0.5">Parallax background</div>
  
  {/* Counter animation */}
  <div className="counter" data-count="100" data-duration="2">0</div>
  
  {/* Sticky/Pin element */}
  <div className="pin">This element will stick during scroll</div>
</ScrollAnimations>
```

**Available Animation Classes:**
- `fade-in` - Fade in with slight upward movement
- `slide-up` - Slide up from bottom
- `slide-down` - Slide down from top
- `slide-left` - Slide in from right
- `slide-right` - Slide in from left
- `scale-in` - Scale in from small
- `scale-out` - Scale in from large
- `rotate-in` - Rotate and scale in
- `flip-in` - 3D flip animation
- `split-text` - Character-by-character text animation
- `parallax` - Parallax scrolling effect
- `counter` - Animated number counting
- `pin` - Sticky element during scroll

### Custom Scroll Animations

```tsx
import { useScrollAnimation } from '@/components/global/ScrollAnimations';

const MyComponent = () => {
  const { animateOnScroll } = useScrollAnimation();
  
  useEffect(() => {
    animateOnScroll('.my-element', {
      from: { opacity: 0, scale: 0.5, rotation: -45 },
      to: { opacity: 1, scale: 1, rotation: 0 },
      start: "top 80%",
      end: "top 20%"
    });
  }, []);
  
  return <div className="my-element">Custom animated element</div>;
};
```

## Layout Components

### Main Menu

Responsive navigation with multi-level dropdowns.

```tsx
import MainMenu from '@/components/global/MainMenu';

// The menu automatically uses data from GlobalContext
<MainMenu />
```

### Footer

Comprehensive footer with multiple sections.

```tsx
import Footer from '@/components/global/Footer';

// Uses data from GlobalContext automatically
<Footer />

// Or with custom data
<Footer data={customFooterData} />
```

### Custom Modal

Flexible modal component with different types.

```tsx
import CustomModal from '@/components/global/CustomModal';

// Team modal
<CustomModal 
  modalType="team" 
  title="Team Member"
  teamId="team-1"
/>

// Video modal
<CustomModal 
  modalType="video" 
  title="Watch Video"
/>

// Popup modal
<CustomModal 
  modalType="popup" 
  title="Information"
/>
```

## Global Context Usage

Access global data throughout your application.

```tsx
import { useGlobalData } from '@/context/GlobalContext';

const MyComponent = () => {
  const { globalData, menuData } = useGlobalData();
  
  if (!globalData) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>{globalData.site_title}</h1>
      <p>{globalData.slogan}</p>
    </div>
  );
};
```

## CSS Variables

Use the design system variables for consistent theming:

```css
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

/* Font Sizes */
--var-dc--font-size-xs: clamp(0.75rem, 0.878vw, 0.75rem);
--var-dc--font-size-sm: clamp(0.875rem, 1.025vw, 0.875rem);
--var-dc--font-size-base: clamp(1rem, 1.171vw, 1rem);
--var-dc--font-size-lg: clamp(1.125rem, 1.318vw, 1.125);
--var-dc--font-size-xl: 1.25rem;
--var-dc--font-size-2xl: clamp(1rem, 2.5vw, 1.5rem);

/* Spacing */
--var-dc--spacing-20: 20px;
--var-dc--spacing-40: 40px;
--var-dc--spacing-60: 60px;
--var-dc--spacing-80: 80px;
--var-dc--spacing-100: 100px;
```

## Utility Classes

Pre-built utility classes for common spacing:

```css
/* Padding utilities */
.pt-100 { padding-top: var(--var-dc--spacing-100); }
.pb-100 { padding-bottom: var(--var-dc--spacing-100); }
.pt-80 { padding-top: var(--var-dc--spacing-80); }
.pb-80 { padding-bottom: var(--var-dc--spacing-80); }

/* Margin utilities */
.mt-40 { margin-top: var(--var-dc--spacing-40); }
.mb-40 { margin-bottom: var(--var-dc--spacing-40); }
.mt-60 { margin-top: var(--var-dc--spacing-60); }
.mb-60 { margin-bottom: var(--var-dc--spacing-60); }
```

## Best Practices

1. **Performance**: Use `loading="lazy"` for images below the fold
2. **Accessibility**: Always provide `alt` text for images and `aria-label` for interactive elements
3. **Responsive**: Test components on all screen sizes
4. **TypeScript**: Use proper types for all props
5. **CSS Variables**: Use design system variables for consistency
6. **Animation**: Respect `prefers-reduced-motion` for accessibility
7. **SEO**: Use semantic HTML and proper heading hierarchy

## Troubleshooting

### Common Issues

1. **Smooth scroll not working**: Ensure SmoothScroll wraps your entire app
2. **Animations not triggering**: Check ScrollTrigger setup and element visibility
3. **Images not loading**: Verify image paths and Next.js Image configuration
4. **Form validation errors**: Check react-hook-form setup and validation rules
5. **CSS variables not applying**: Ensure variables are defined in globals.css

### Debug Mode

Enable debug mode for scroll animations:

```tsx
<ScrollAnimations debug={true}>
  {/* Your content */}
</ScrollAnimations>
```

This will show ScrollTrigger markers in development mode to help debug animation triggers.