# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

---

# NativeWind v4 — Critical Styling Rule

**Never use Tailwind opacity modifiers (`/n`) inside dynamic `className` expressions.**

Classes like `shadow-brand/40`, `bg-surface/90`, `border-danger/30`, or a conditional `opacity-70` class trigger an async CSS parsing path in `react-native-css-interop` that races against React Navigation's context initialization. This produces a **misleading crash**:

```
Error: Couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?
```

The app IS correctly wrapped — the crash is caused by NativeWind, not a missing NavigationContainer.

**Rule:** If a class string with an opacity modifier changes between renders (inside a ternary or template literal), move the opacity-dependent value into an inline `style` prop instead.

```tsx
// ✅ Correct
<Pressable
  className={`rounded-full ${isActive ? 'bg-brand' : 'bg-surfaceElevated'}`}
  style={isActive ? { shadowColor: '#00F2FE', shadowOpacity: 0.4, elevation: 4 } : undefined}
/>

// ❌ Crashes
<Pressable
  className={`rounded-full ${isActive ? 'bg-brand shadow-brand/40' : 'bg-surfaceElevated'}`}
/>
```

See `docs/design-system.md` § 8 for full details and all affected class families.
