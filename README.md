# Tracking Weight — Indian Food Calorie & Weight Loss Tracker

A simple, private calorie and weight-loss tracker made for Indian food and
Indian budgets. Dark Apple-style look: pure black background, frosted-glass
cards, green pill buttons, floating bottom menu. Mobile-first, big readable
text.

## How to open it

No install, no build step, no internet needed after download:

1. **Double-click `index.html`** — it opens in any modern browser (Chrome,
   Edge, Firefox, Safari) on phone or computer.
2. **Or via GitHub Pages:** push this folder to a GitHub repository, enable
   Pages (Settings → Pages → Deploy from branch → `main` / root), and open
   the published link.

## Features

- **Profile & personal plan:** age, gender, height in **feet + inches**
  (with quick-pick chips from 5′0″ to 6′0″), current and target weight,
  activity level. Calculates BMI, BMR (Mifflin-St Jeor), a daily calorie
  target for fat loss (TDEE minus ~500, minimum 1200) and a protein target.
- **Language switcher:** English / Hindi (Devanagari) / Marathi (Devanagari)
  for all main UI labels. Default is Hindi. Your choice is remembered.
- **Today dashboard:** calories eaten vs target ring, protein progress,
  water tracker (tap the glasses), today's food and exercise lists.
- **Add Food:** searchable Indian food database (46 items — roti, dal, rice,
  sabzi, idli, dosa, poha, chole, rajma, biryani, samosa, Maggi, chips,
  biscuits, cold drink, mithai and more) with calories + protein per normal
  serving. Portion choice: 0.5x / 1x / 1.5x / 2x. One-tap add, plus a custom
  food form (name + calories + protein).
- **Packaged / fried food warnings:** items like Maggi, chips, cold drinks
  and samosas show a clear warning with a plain-language reason why they
  harm the body (high sodium, trans fat, hidden sugar, empty calories,
  refined flour) and a healthier, cheaper swap suggestion.
- **Exercise:** walking, running, cycling, skipping, yoga, home workout,
  swimming, dancing, stairs and more. Calories burned are calculated from
  your body weight using the MET formula. Log entries per day.
- **Recipes:** tick the ingredients you have at home (dal, chana, soya,
  anda, paneer, seasonal sabzi, rice, oats, sprouts…) and get simple
  low-calorie Indian recipes that use only those ingredients, each with
  calories and short steps.
- **Progress:** weight log with a goal progress bar and a weight-trend line
  chart, plus a **monthly body-progress photo** section — one photo per
  month (compressed to max 800px JPEG before saving), a month-by-month
  timeline, and a before-vs-now side-by-side compare once you have 2+
  photos.

## Honest note — what this standalone version does NOT do

This version has **no AI photo analysis and no cloud saving**. Food and
body photos are not analysed by AI here — you pick the matching dish (or
add a custom food) and the app does the calorie math. All data (profile,
food logs, exercise, weight, photos) stays in **your own browser**
(`localStorage`) on the device you open it on. Nothing is uploaded
anywhere, and data does not sync between devices or browsers. Clearing
browser data will erase it, so export or note down anything important.

The full AI version — with photo analysis that identifies food and body
progress, AI coaching and cloud-saved data — lives inside Muse.

## Files

- `index.html` — app structure and screens
- `styles.css` — dark glass styling
- `app.js` — all logic, food database, exercises, recipes, charts
- `README.md` — this file

## Privacy

Photos you add (including body-progress photos) never leave your device in
this version. Photo comparison is visual only — it is not a medical
measurement, diagnosis, or body-fat estimate.
