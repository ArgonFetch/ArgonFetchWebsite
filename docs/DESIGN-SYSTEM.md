# ArgonFetch Design System Documentation

This document describes how to use the ArgonFetch design system throughout your application to ensure consistent styling and visual experience.

## Table of Contents

1. [Design Tokens](#design-tokens)
2. [Colors](#colors)
3. [Typography](#typography)
4. [Spacing](#spacing)
5. [Effects](#effects)
6. [Components](#components)
7. [Utilities](#utilities)
8. [CSS Variables](#css-variables)
9. [Best Practices](#best-practices)

## Design Tokens

ArgonFetch uses a design token system to manage all visual properties. These tokens are defined in:

```
src/styles/design-tokens.scss
```

This serves as the single source of truth for all design-related properties.

## Colors

Use consistent colors throughout your application by using the color tokens:

### Primary Colors

- **Primary**: `var(--primary)` or `tokens.color('primary')`
- **Primary Light**: `var(--primary-light)` or `tokens.color('primary-light')`
- **Primary Dark**: `var(--primary-dark)` or `tokens.color('primary-dark')`
- **Secondary**: `var(--secondary)` or `tokens.color('secondary')`

### Background Colors

- **Darker**: `var(--darker)` or `tokens.color('darker')`
- **Dark**: `var(--dark)` or `tokens.color('dark')`
- **Light**: `var(--light)` or `tokens.color('light')`

### Text Colors

- **Text Primary**: `var(--text-primary)` or `tokens.color('text-primary')`
- **Text Secondary**: `var(--text-secondary)` or `tokens.color('text-secondary')`

### State Colors

- **Success**: `var(--color-success)` or `tokens.color('success')`
- **Warning**: `var(--color-warning)` or `tokens.color('warning')`
- **Danger**: `var(--color-danger)` or `tokens.color('danger')`
- **Info**: `var(--color-info)` or `tokens.color('info')`

## Typography

### Font Families

- **Sans-serif**: `var(--font-family-sans)` or `tokens.font('font-family-sans')`
- **Headings**: `var(--font-family-heading)` or `tokens.font('font-family-heading')`
- **Code**: `var(--font-family-code)` or `tokens.font('font-family-code')`

### Font Sizes

- **XS**: `var(--font-size-xs)` or `tokens.font('font-size-xs')`
- **Small**: `var(--font-size-sm)` or `tokens.font('font-size-sm')`
- **Base**: `var(--font-size-base)` or `tokens.font('font-size-base')`
- **Medium**: `var(--font-size-md)` or `tokens.font('font-size-md')`
- **Large**: `var(--font-size-lg)` or `tokens.font('font-size-lg')`
- **XL**: `var(--font-size-xl)` or `tokens.font('font-size-xl')`
- **2XL**: `var(--font-size-2xl)` or `tokens.font('font-size-2xl')`
- **3XL**: `var(--font-size-3xl)` or `tokens.font('font-size-3xl')`
- **4XL**: `var(--font-size-4xl)` or `tokens.font('font-size-4xl')`
- **5XL**: `var(--font-size-5xl)` or `tokens.font('font-size-5xl')`

### Font Weights

- **Normal**: `var(--font-weight-normal)` or `tokens.font('font-weight-normal')`
- **Medium**: `var(--font-weight-medium)` or `tokens.font('font-weight-medium')`
- **Semibold**: `var(--font-weight-semibold)` or `tokens.font('font-weight-semibold')`
- **Bold**: `var(--font-weight-bold)` or `tokens.font('font-weight-bold')`
- **Heading Bold**: `var(--font-weight-heading-bold)` or `tokens.font('font-weight-heading-bold')`

### Line Heights

- **Tight**: `var(--line-height-tight)` or `tokens.font('line-height-tight')`
- **Normal**: `var(--line-height-normal)` or `tokens.font('line-height-normal')`
- **Loose**: `var(--line-height-loose)` or `tokens.font('line-height-loose')`

## Spacing

Use consistent spacing throughout the application:

- **XS**: `var(--spacing-xs)` or `tokens.spacing('xs')` - 0.5rem (8px)
- **SM**: `var(--spacing-sm)` or `tokens.spacing('sm')` - 1rem (16px)
- **MD**: `var(--spacing-md)` or `tokens.spacing('md')` - 1.5rem (24px)
- **LG**: `var(--spacing-lg)` or `tokens.spacing('lg')` - 2rem (32px)
- **XL**: `var(--spacing-xl)` or `tokens.spacing('xl')` - 3rem (48px)
- **XXL**: `var(--spacing-xxl)` or `tokens.spacing('xxl')` - 4rem (64px)
- **Section**: `var(--spacing-section)` or `tokens.spacing('section')` - 6rem (96px)

## Effects

- **Border Radius**: `var(--border-radius)` or `tokens.effect('border-radius')`
- **Border Radius Small**: `var(--border-radius-sm)` or `tokens.effect('border-radius-sm')`
- **Border Radius Large**: `var(--border-radius-lg)` or `tokens.effect('border-radius-lg')`
- **Border Radius Pill**: `var(--border-radius-pill)` or `tokens.effect('border-radius-pill')`
- **Card Shadow**: `var(--card-shadow)` or `tokens.effect('card-shadow')`
- **Card Shadow Hover**: `var(--card-shadow-hover)` or `tokens.effect('card-shadow-hover')`
- **Button Shadow**: `var(--button-shadow)` or `tokens.effect('button-shadow')`
- **Transition**: `var(--transition)` or `tokens.effect('transition')`

## Components

ArgonFetch includes reusable components with consistent styling:

### Button

Use the button component with predefined styles:

```html
<app-button type="primary">Primary Button</app-button>
<app-button type="secondary">Secondary Button</app-button>
<app-button type="text">Text Button</app-button>
```

### Card

Use the card component for consistent card styling:

```html
<app-card>
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</app-card>
```

### Section

Use the section component for consistent section styling:

```html
<app-section title="Section Title" subtitle="Section subtitle text">
  <!-- Section content -->
</app-section>
```

## Utilities

Use utility classes for common styling patterns:

### Spacing Utilities

- Margin: `.m-{size}`, `.mt-{size}`, `.mb-{size}`, `.ml-{size}`, `.mr-{size}`, `.mx-{size}`, `.my-{size}`
- Padding: `.p-{size}`, `.pt-{size}`, `.pb-{size}`, `.pl-{size}`, `.pr-{size}`, `.px-{size}`, `.py-{size}`

Where `{size}` can be: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`

### Typography Utilities

- Text sizes: `.text-xs`, `.text-sm`, `.text-base`, `.text-md`, `.text-lg`, `.text-xl`, `.text-2xl`, etc.
- Font weights: `.font-normal`, `.font-medium`, `.font-semibold`, `.font-bold`
- Font families: `.font-heading`, `.font-sans`, `.font-code`
- Text alignment: `.text-center`, `.text-left`, `.text-right`

### Layout Utilities

- Grid: `.grid`, `.grid-cols-2`, `.grid-cols-3`, `.grid-cols-4`
- Flex: `.flex`, `.flex-center`, `.flex-between`, `.flex-column`

## CSS Variables

All design tokens are available as CSS variables for easy use in component styles:

```scss
.my-component {
  color: var(--primary);
  font-family: var(--font-family-heading);
  padding: var(--spacing-md);
}
```

## Best Practices

1. Always use the design tokens and CSS variables instead of hardcoded values
2. Import the design tokens in your SCSS file: `@use 'styles/design-tokens' as tokens;`
3. Use the helper functions for accessing tokens in SCSS: `tokens.color('primary')`
4. Use utility classes for common styling patterns
5. Use the shared components for consistent UI elements

For questions or updates to the design system, please contact the design team.
