# Phone Setup

## Local check

```bash
cd C:\Users\andyg\Desktop\cursor\mmg-shot-tracker
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Deploy for course use

1. Create a new GitHub repo for this standalone tracker.
2. Push this folder to that repo.
3. Import the repo into Netlify.
4. Use build command `npm run build`.
5. Deploy.
6. Open the Netlify HTTPS URL on your phone.
7. Allow location access.
8. Add it to your phone home screen.

## Round flow

1. Select course and tee.
2. Select hole.
3. Enter club and note.
4. Tap `Start tracking`.
5. Walk to the ball.
6. Tap `End tracking`.
7. Add score, putts, penalties, fairway, and GIR.
8. Tap `Next hole`.
9. After the round, tap `Save round`.
10. Tap `Export backup` to keep a local copy.
