

## Problem

The screen is blank because `src/App.jsx` has a **variable ordering bug**: line 1404 uses `s0.plantName` but `s0` is not defined until line 1442. This causes a runtime ReferenceError that crashes the component silently.

```
Line 1404:  const siteRegistered = !!(s0.plantName && s0.millName && s0.contactEmail);
Line 1442:  const [s0, setS0] = useState({...});
```

## Fix

Move the `siteRegistered` declaration (and `FREE_TABS`, `FREE_SEARCHES`) to **after** the `s0` state is defined (after line ~1444). Specifically:

1. **Remove lines 1404-1406** from their current position
2. **Insert them after the `s0` useState block** (after line ~1490 or wherever the `s0` initial state object closes)

This is a single edit in `src/App.jsx`. No other files need changes.

