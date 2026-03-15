# UI Components

This directory contains reusable UI components built with Radix UI primitives.

## Navigation Menu

The navigation menu component provides an accessible dropdown navigation system.

### Features

- Accessible keyboard navigation
- Smooth animations
- Responsive design
- Dropdown menus with icons
- Mobile-friendly

### Usage

```tsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Item</NavigationMenuTrigger>
      <NavigationMenuContent>
        {/* Content */}
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### Dependencies

- @radix-ui/react-navigation-menu
- class-variance-authority
- clsx
- tailwind-merge

All dependencies are already included in package.json.
