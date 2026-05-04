# Project Checklist

## 1) Focused Audit (first)
- Audit API error handling across key routes
- Verify auth edge cases (expired token, invalid token, refresh/re-login)
- Check UI regressions after recent theme updates

## 2) End-to-End Testing (next)
- Full user journey: register -> login -> create story -> publish -> play
- Mobile + responsive testing across key pages
- Confirm auto-seed + npm run seed behavior on empty DB

## 3) Missing Implementations (current app)
- Story editor autosave + unsaved changes warning
- Frontend + backend input validation
- Loading/error states for all API calls
- Auth token expiry handling (logout, read-only, prevent edits)

## 4) Future Updates
- Story editor upgrades: node graph improvements, drag/drop, autosave
- User settings + profile stats
- Ratings system (one rating per user + concurrency-safe updates + caching strategy)
- Export/share options: public link, embed, PDF, "Export (Coming Soon)" UI
- Moderation/admin tools + content reporting
- Deployment + CI (build/test pipeline, previews)
