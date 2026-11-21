# Changelog

## 0.19.1

- Assist button (optional, in Settings → Home): a microphone at the top that opens Home Assistant's Assist, to talk or type to your home; in the companion app it opens the app's own Assist; only shows when Assist is set up.
- Covers: "Ask before switching" now also covers the up, stop and down buttons and the position bar, on small and large cards (before, only a tap on the card asked for a second tap).
- Separators: in Edit mode, "Starts folded" beside the title keeps a separator folded by default (each device still opens and closes it with a tap).
- Covers: a "No status" option in the card's options, for covers that never report whether they are open or closed; the child lock padlock sits on the icon's corner, clear of the buttons.
- Sensors at the top of a room: their details open above everything (they sat behind the cards); each sensor can show its icon, text or both, with your own text (card options, in Edit mode); the "Environment" heading above them only shows in Edit mode.
- Floor plan in Edit mode: zoom with the mouse wheel or a pinch, and drag the background to move the zoomed plan; what you leave off the plan goes to a list under it (it used to stay faded inside the room, taking space).
- Rooms by floor (Settings → Rooms): on a phone, the room bar gets one row per floor.
- With a mouse, the navigation bar and the room bar can be dragged sideways (in the desktop app too).
- Media player (options of the player's card, in Edit mode): "Open as a window" opens the player in a window over the panel instead of full screen; "Player parts" leaves out the cover, progress, shuffle and repeat, volume, speakers or the power button, in the player and on its card; and "Player buttons" adds your own buttons (scripts, scenes, switches, buttons), with the entity's picture when it has one, like a radio station's logo.
- Scene strip: the child lock now applies to scene and script buttons, and the "Highlight when on" option (tap the button in Edit mode) lights the button while a chosen entity is on; the options also open for scenes and scripts without a room.
- Weather: your own wind and pressure sensors (in Settings → Weather), besides temperature and humidity.
- Weather forecast: the next hours can be dragged sideways with the mouse.
- Vehicle card: the charging button says "Stop charging" while the car charges, and black and white colors.
- Sidebar layout: the left column stays in place and only the content scrolls (the column used to scroll with the page).
- Sidebar layout: the weather with its forecast, notices, people and buttons at the top wrap to a second line when the area is narrow, instead of slipping under the column.
- Vehicle card: the chips no longer repeat what the status line already says (the range showed twice), the odometer shows as a chip from 2× up, and the Lock slot also accepts a lock binary sensor.
- Combustion Vehicle card with no level sensor: shows just "—", without the word "fuel".
- The small texts on the Overview cards (Security, Climate, Energy) keep their original casing, such as "smart EQ" and "kWh".

## 0.19.0

- HomeDeck Desktop (Pro): an app for Mac and Windows that opens HomeDeck from the menu bar or the tray, with a click or ⌥⌘H / Ctrl+Alt+H. A compact, wide (three times wider) or full-screen window, with the system's own corners and adjustable transparency, Settings in the system's look and automatic updates. Download it at homedeck.pro/desktop; it needs this version of the integration.
- A download button for the app in Settings → Plan, and HomeDeck Desktop in the list of Pro benefits.
- A support section in Settings → Plan: a star on GitHub, the community on the forum and HomeDeck's Instagram.

## 0.18.0

- Photo layout (Pro, in Settings → Appearance → Layout): a photo of each room fills the screen, with its cards on a panel beside it in your background color. In Edit mode the camera button sends the room's (or the home's) photo, with framing, darkening when the lights are off and a warm glow where the lamp is. The Floor plan fills the whole panel in this layout.
- Vehicle card (Pro, in Edit mode → Add vehicle): electric, plug-in hybrid, fuel or motorbike, with battery or fuel, range, charging, cable, power, time to full, location, locks, climate and odometer, found on their own on the car's device and the charger. Any reading can be swapped or hidden, and a tap opens the details with the controls.
- Floor plan: L-shaped (or any shape) rooms with extra parts, one outline and one glow, with no crossing lines; optional room names (a button in Edit mode); choose the floor that opens first; the Floor plan card with or without the background image; in 3D the devices stand up again and the ceiling outline is gone; covers open their details on tap; image visibility down to zero; bigger spots.
- Home status sensor (in Settings → Home, under Show status): your own sensor instead of the light count at the top of Home.
- Automations can be added as cards (on/off), and script and scene buttons use the icon you chose.
- Tomorrow's events on the screensaver (optional): the next day's appointments below today's.
- Cover details follow the card's options: buttons only or bar only, reversed bar and reversed open/closed.
- Text size slider (in Settings → This device), from 80% to 180%, with a preview of cards beside it. The screensaver keeps its own size.
- Easier sensor values: durations in words ("1 h 22 min" instead of "82.53 min") and rounded numbers ("92.9 m" instead of "92.9334359988155 m").
- People's photos follow the rounder or squarer corners.
- Image uploads (room photos and floor plans) shrink the image on their own to fit Home Assistant, and say so when the browser can't open the format.
- New languages: French, Dutch, Italian, Swedish and Turkish.

## 0.17.0

- Transitions and effects: the tab bar has a highlight that slides to the chosen tab, pages fade in smoothly, a room's content slides in when you switch rooms, cards arrive one after another and detail windows open with a light spring (on phones they rise from the bottom).
- Animations per device: in Settings → This device → Animations, each device turns transitions, the cards' animations (Pro) and the animated background on or off, all on by default. The options that were in Appearance and the card style moved there.
- This device is organized in groups: Look, Animations, Settings and Music.
- Settings save themselves: every change is saved on its own, with no Save button, and the top shows "Changes saved automatically". Every settings panel now shares the same titles, text and fields.
- Air conditioner on a small card: the target temperature sits in the top right corner and the card keeps the size of the others.
- Focus layout: every room starts at the top, lined up.
- Phones held upright: the tab bar and the Edit button sit a little higher and slimmer.
- Solid cards (Appearance → Card style) lean to white instead of black.
- Kids layout: the cover level looks like the brightness bar, the screensaver uses the layout's rounded type and the lock on locked cards follows its style.
- Child lock: holding a locked card doesn't open its details either, and the message points to the lock at the top of the screen.
- Floor plan (Pro, in Settings → Navigation): your home drawn floor by floor from Home Assistant's floors and areas, with nothing to set up. Rooms arrange themselves like a plan and glow warm with their lights; open doors and windows show in red, motion pulses and the temperature sits in the corner. Each room shows the same devices and sensors as its own screen (what leaves the room leaves the plan), with sensors as pills showing their reading. A tap switches a device and holding opens its details. In Edit mode, drag a room to move it, its corner to resize it and each device to place it. The plan fills the screen, with no title or room names (those show only in Edit mode), and zooms with a pinch or the mouse wheel. On a phone held upright the plan turns to use the whole screen. Works in every layout. Each floor can have a background image (the real plan: a drawing, photo or screenshot), sent in Edit mode (PNG and WebP keep their transparency), with the rooms placed over it and its visibility adjustable. The 3D button tilts the plan like a model, with low walls and the buttons facing you, and dragging turns and tilts it freely (Shift or two fingers move it). And the Floor plan card (optional, in Settings → Home) shows the first floor with the rooms lit, always at the plan's real proportions, and opens the Floor plan.
- Devices with no room: in Card options (Edit → tap the card, inside "Unassigned") there's "Move to a room", which shows the device in the chosen room and hides it in "Unassigned". The top of the details also showed "Unassigned" in English; it's translated now.
- Device details also show the Home Assistant device and the entity ID, in small print, so you can tell where a card comes from (like a router's "Internet access" switch).
- Security card: with two or more alerts, a tap lists them all (it used to open only the first one), and each one opens its details.
- Compact sensors on phones take the whole row, with their full name and value, while the other cards stay in two columns.
- Forecast: the name of the place (the weather entity, like "Home" or a city) shows under the title.
- Screensaver: up to eight temperature sensors (was six). They sit side by side as long as they fit the screen width, and with many they split evenly into two rows (8 make 4 + 4, 7 make 4 + 3) instead of leaving one alone below.
- Home Assistant notifications (optional, in Settings → Home): a bell in the header with Home Assistant's own notifications, with a dot and the count when there are any. A tap lists them with title, text and time, and you can dismiss one or all of them (in Home Assistant too).
- Kids layout: the big line of summary cards (like "Everything secure") is a little smaller, so whole words fit.
- Home columns by screen: tablets lying down 5 (was 6), big screens 6 or more as they widen, phones lying down 3 or 4.
- Real glass (optional, in Settings → Appearance, Glass theme): cards look like a pane of glass, with a shining top edge, a soft sheen, richer color behind and a light shadow.
- Floor plan card with a picture: the card is lit, like a room with lights on, and shows the picture as it is.
- Kids layout: cards, icons and controls follow the rounder or squarer corners option.
- Room cards with extra devices (like two covers) fit their row on smaller tablets too.
- On Android, long descriptions in Settings no longer show in larger text than the rest.
- Covers: choose buttons, the position bar or both in Card options.
- Rows that scroll sideways (tab bar, rooms, scenes) fade where there is more to see.
- The header stays still when changing pages; people now come before the weather.
- The media player fits phone screens without scrolling, on frosted glass like the screensaver.
- Details windows always open on the visible part of the screen, inside the Home Assistant app too.
- Panel text no longer gets selected by a long press.
- Time format (in Settings → Home): Automatic, 24 h or 12 h. Automatic follows the time format of your Home Assistant profile, and it applies to the clock, the screensaver, the calendar, history charts and the hourly forecast.
- Text size and interface size (in Settings → This device): Small, Normal or Large, kept per device. Text size changes only the text; interface size changes everything together (cards, icons, buttons, the sidebar and the text), to fit more on a wall tablet.
- Forecast in the header (optional, in Settings → Weather): the next 3 or 5 days beside the weather at the top of the screen, with high and low.
- Recently added card (Pro, in Settings → Home): covers of the newest movies and episodes in your library, from the sensors of integrations like Plex Recently Added, Jellyfin, Sonarr and Radarr. At double and large size it shows more covers.
- Folder card (Pro, in Edit mode): a card that opens a window with its own cards, arranged like a room (add devices, sizes, separators and lists). The card shows its icon, its name and how many devices are on. Handy for a Garden or a Garage on Home.
- Start screen (in Settings → Navigation): choose the screen the panel opens on, among Home, the tabs that are on and your pages. The panel also goes back to it after a minute without a touch.
- Folding separators: outside Edit mode, a tap on a separator's title folds or unfolds the cards below it, and each device remembers what is folded.
- ½× for any card: besides sensors, lights, switches, fans, covers, scripts, scenes and more can be half height, one line with icon, name and state. A tap still switches them.
- Group rooms by floor (optional, in Settings → Rooms): in the Rooms tab, the room list is split under Home Assistant's floors.
- Lights button on room cards (in Settings → Appearance, on by default): turn it off for room cards without the round lights button.
- Cover without highlight (in the cover's Card options): the card keeps the plain look, open or closed.
- Export and import the configuration (in Settings → System): a file with everything set in HomeDeck, to keep as a backup and restore later. The license is not included.
- The weather window and the Security alert list close with Esc.
- Faster cameras: the live view uses Home Assistant's WebRTC player whenever the camera offers WebRTC (it starts in about a second and stays smooth, where MJPEG of an RTSP camera was slow and froze). Other cameras stay on MJPEG, and each camera can go back to MJPEG in Card options ("Use MJPEG first").
- Alarm: a "Buttons on the card" option in the alarm panel's options. At double size and up, the card shows Home, Away and Night (or Disarm), and so does the Security card on Home. When a code is needed, a tap opens the keypad.
- Security: any binary sensor can join Security from its card options ("Security item"), like a window Home Assistant doesn't mark as a window, with an alert while it is on or open.
- Waste collection: sensors in Italian and French are understood (oggi, domani, tra 3 giorni; aujourd'hui, demain, dans 3 jours), and calendars work too: the date of the next event, or of the next event with a word in its title ("Carta", "Plastica"), for one calendar with every collection.
- Humidity on the room card (optional, in the room options in Edit mode): a humidity sensor beside the temperature, like "22° · 55%".
- Outdoor temperature and humidity (optional, in Settings → Weather): your own sensors replace the weather's values in the header, the weather card and the screensaver, and the forecast stays.
- Fixed: the device list for adding a notice (and other lists opened in Settings) showed behind the settings that followed it.
- List card (Pro, in Edit mode): several entities in one card, each on its own line with its value or its control (switch, cover, option list, run button). Start from a device to bring all its entities at once, or pick them one by one from any room. You can change the title, rename and reorder the lines, and have the list's entities leave the other cards of the screen. A tap on a reading opens its details with the history. Works in rooms, on Home and on pages, in every layout.
- Environment sensors at the top of each room (optional, in Settings → Rooms): a room's temperature, humidity, CO₂, air quality, light and pressure readings show as pills under its name, with the reading and the sensor's name, instead of among the cards. A tap opens the details with the history. In Edit mode you can reorder or hide them and add other sensors. Works in every layout.
- Scenes at the top of each room (optional, in Settings → Rooms): each room shows its scenes as buttons above its devices, styled like the scene strip on Home, instead of among the cards. In Edit mode you can reorder or hide them and add scenes or scripts from elsewhere. Works in every layout.
- Waste collection: each bin has a new "Value" choice, to read the sensor's state (as before) or one of its attributes, with each one's current value shown in the list. The attribute is read as a number of days, a date or a phrase, so one sensor with an attribute per waste type can feed several bins.

## 0.16.7

- Kids layout (Pro): in Settings → Layout, a playful children's game look with rounded type, colorful chunky cards with a solid edge, bouncy animations (cards hop in, squish when tapped, icons wiggle while on and sparkle when turned on) and six exclusive animated scenes in Settings → Appearance: Sky, Ocean, Space, Candy, Enchanted (pink, with a castle, butterflies and sparkles) and Road (blue, with hills and little cars), also offered in the first setup when the Kids layout is picked. The motion stops in Edit mode and for reduced motion.
- Covers: closed now counts as on (lit card, active count and details) and open as off; covers set to "Reverse open and closed" are reversed here too.
- Device picker (Add devices and others): bigger on tablets and computers, with the devices in columns; filters by type with counts (Lights, Switches, Covers, Sensors...) and "Selected" to review what is ticked; each row shows the current state and the entity id; the room name stays pinned while scrolling, and the search and filters stay on screen.
- Long dropdowns (energy sensors, waste collection, screensaver, doorbell...): a search field on top, and each sensor shows its entity id under the name.
- Covers: new "Buttons on the side" option in Card options; on the small tile the up, stop and down buttons stack on the right, so the tile is as tall as the others.
- Name in this room only: when you rename a device in Card options inside a room, "Only in this room" gives it a name used only there, and it keeps its usual name everywhere else.
- Child lock: in Settings → This device, a lock in the header that locks or unlocks when held for 3 seconds. While locked, the cards marked "Lock with the child lock" (in Card options) do nothing and show a lock, and Settings and Edit stay closed. Nothing is locked by default.
- Sidebar layout on phones: the room title no longer sits at a different height in rooms with few cards.
- Screensaver (Pro): up to six temperature sensors under the clock, each with its room name, and a Normal or Large text size; Large shows the weather and temperatures as big numbers with their names below, to read from across the room.
- Scene strip: now takes scripts too. In Edit mode, "Add scenes or scripts" puts a script next to your scenes and it runs with one tap (no script is added on its own).
- Door, window, motion and other binary sensors show Home Assistant's own wording (Open/Closed, Detected/Clear...) instead of on/off.
- Home Assistant icons: with "Home Assistant icons" on (or chosen on a card), a card shows exactly the icon HA shows, worked out from its device class and state (blinds, doors, a switch on or off), not only icons set by hand.
- Covers: new "Reverse up and down" option for motors wired the other way round.
- Kids layout: the sparkles when something turns on open from behind the icon, without crossing its outline.
- Layout and background per device (Settings → This device): each tablet can have its own layout, background and Kids scene (Kids in the kids' room, Grid in the living room). "Same as the panel" follows the shared one, as before.
- Kids layout: while a command is on its way the card's own border pulses, instead of a second line inside it that looked like a doubled outline.
- Back to Home after 1 minute without a touch, in every layout. Not on the screensaver, in Edit mode or Settings, on the cameras screen or camera pages, while a camera or the player is open, or while the doorbell rings.
- Tablets lying down (Echo Show, iPad, Fire and big touch screens) always show 6 columns on Home; phones 2, while tablets standing up and computers still fit their width.

## 0.16.6

- Security item: in the details of a door, window or motion sensor, or a lock, turn off "Security item" to leave it out of the Security card, its alerts and the Security screen. It still shows in its room.
- Tap action for header notices: in Settings → Home → Notices → Options, each notice can open its details (default), be dismissed (hidden on every screen until the entity changes again), turn its entity off or run a script, button, automation or scene. These ask for a second tap, and holding a notice always opens its details.
- Covers (card options in Edit mode): "Only the buttons act" makes a tap on the card or its icon do nothing; "Reverse the position bar" and "Reverse open and closed", separately, for covers that report their position the other way round.
- Time since the last change (optional, in Settings → Cards): sensor cards at 1× and ½× also show how long ago they changed.
- Sidebar layout: the room list in the sidebar is now separate from the room cards on the overview. Hiding a card no longer removes its room from the sidebar, the sidebar follows the room order in Settings → Rooms, and in Edit mode it can be reordered and have rooms hidden on its own.
- Vacuum card at double and large size: the three buttons are stacked with their full labels, so they fit the card in every language.
- People in the header: in Settings → Home, choose which people show in the presence avatars. With nothing chosen, everyone shows, as before.
- Compact sensors (optional, in the room options in Edit mode): every sensor in the room at ½×, with icon, name and value on one line.
- Where each card comes from: in Edit mode, a card's options show the Home Assistant device the entity belongs to and its entity ID.
- Fixed: devices on a room card covered the temperature. The temperature now stays in the left half, on a large (4×) card the devices take the full width above the name, and on short screens the card grows just enough to clear the power button.
- Fixed: the import dashboard window opens centered on the screen with its full title, and the Cancel and Import buttons match.

## 0.16.5

- Import a Home Assistant dashboard: during setup or in Settings → Navigation, pick a dashboard you already use. Each tab becomes a HomeDeck screen (Pro) with the same devices, in the same order, with section titles as separators, and the rooms can show only what's in that dashboard. Nothing changes in Home Assistant.
- Header notices: a tap now opens HomeDeck's own details, and in Settings → Home each notice has its own style (icon and text, icon only or text only) and custom text.
- Visibility rules (Pro): show a card only when conditions on entities are met (on or off, equal or not to a state, above or below a value, all or any of them), when someone or nobody is home, by day or night, within a time window and on chosen days. For cards it's in the Edit mode options; for header notices, in Settings → Home → Notices.
- Cameras screen in the bottom bar (optional, in Settings → Navigation): 16:9 cells with no cropping, 1 to 4 cameras per row, drag to reorder and make any camera 4×, 9× or 16× (bigger sizes with Pro).
- Camera pages (Pro): create as many as you like under Your pages, each with its own cameras and layout.
- Icon choices stay closed (pages, rooms and cards): only the current icon shows, and the list opens when you tap it.
- 6× and 8× camera cards (Pro) on the other screens, from the size button in Edit mode.
- Whole picture on camera cards (optional, in Settings → Cameras): shows the full image instead of cutting the edges.
- Lighter cameras: the live video on cards is really closed when you leave the screen or HomeDeck, and pauses during the screensaver or while a camera is open full screen.
- Alarm: when Alarmo doesn't arm because sensors are open, the panel now shows which ones and offers "Arm anyway".
- Who can see (Pro): when editing a card or a room, an administrator picks which people see it; for everyone else it's gone from screens, counts and actions. This controls what shows in HomeDeck and is not a Home Assistant security permission.
- Waste collection card (Pro), in Settings → Home: up to 4 bins with a color and a name, the days until collection and the weekday, from your sensors.
- Devices inside a card (Pro): double and large room and device cards can hold up to 2 extra devices in their free space, each with the right control (cover, light, list, script, button, sensor). In Edit mode, a tap on the card opens the choice, and each one can have its own name on that card. A washer's program and its Start button can share one card.
- Editing cards only in Edit mode: details no longer show those options. In Edit mode, a tap on a card (without dragging) opens its name, icon and options.
- Truer light colors: the buttons look the same on screen but now send the lamp the pure color (green 0,255,0, blue 0,0,255...). The details also have "Other color", with a color wheel to pick any color.
- Highlight follows the light, per card (in the card's options): while it's on, the card's highlight takes the lamp's color.
- On a tablet lying down, the on-screen keyboard no longer resizes the panel, and browser or app bars that come and go no longer change the size of the cards.
- In Edit mode, the cards on Home keep the same size as outside it.
- The brightness control now sits above the name, so the name stays in the same place as on other cards.
- Media cards realigned. With nothing playing, one centered button turns the player on or starts playing, on every player. A TV that is on with nothing playing gets power, volume and, on bigger cards, the source picker, plus the artwork when there is one, and Spotify with no active device opens the choice of where to play, without an error.
- Header notices now come before the forecast.
- Appearance has a new order: colors, background, style and icons.
- Home Assistant icons on rooms too (Appearance → Icons).
- 15 new backgrounds (Pro): 10 fixed with more vivid colors and 5 automatic ones that change with the lights that are on (Orchid, Reef, Berry, Glacier and Citrus).
- Lights with color temperature get Warm, Normal and Cool in their details.
- 31 new icons for cards, rooms and pages, in a grid that shows them all.
- Custom pages have their own icon on the bottom bar: pick it in the page's Edit mode or in Settings → Navigation.
- Date and time sensors in a friendly format ("Today, 23:12", "Oct 21, 20:12").
- input_boolean can now be added to screens in Edit mode.
- Hiding a device takes it off the screen: instead of waiting in a list at the bottom, it goes back to "Add devices".
- Removing the license takes a second tap.
- New Year and birthdays no longer have the details on top of the cards.
- Fixed: the frame didn't apply to the cards in Settings; the screensaver clock sits lower when showing events; empty pages no longer show the message, only the add button.

## 0.16.4

- List layout: the Devices group (the ones added to Home) no longer disappears in Edit mode; each one gets a − to take it off Home.
- Lights hidden from a room (in Edit mode) are left out of the counts ("1 of 3 on", "6 lights on at home") and of Turn all on / Turn all off, in the room and on Home. Handy for Govee segment entities and the like.
- Fixed: in homes set to Fahrenheit, the 7-day forecast (and the hours, when they came from Open-Meteo) showed Celsius. It now follows the weather entity's or Home Assistant's unit, with wind in mph.
- Light effects: lights with effects (Rainbow, Candle, Thanksgiving...) get an Effect selector in their details and on double and large cards, with "No effect" to go back to plain light. It only shows on lights that have effects. Thanks @JEdwards2525!
- Fixed: picking an option from a list inside a card (like a washing machine program) also toggled the card.
- Notices beside the people, in Settings → Home → Notices: pick entities (a mailbox, the garage door, the doorbell...) and each one becomes a chip in the header only when there's something to notice: on, open or detected, a number above zero, or an event in the last 30 minutes ("Doorbell 5 min ago"). A tap opens Home Assistant's details. Nothing shows until you pick them. Thanks @karaspr!
- Choosing a card's size in Edit mode: the size button opens a slim column of round buttons above it (½×, 1×, 2× and 4×), with the current size marked, instead of cycling on each tap.
- Small size for sensors (Pro), in the same menu. The card is half as tall, with the icon, name and value on one line, and small cards fit side by side. Thanks @karaspr!
- Player for every media player (Pro): Apple TV and HomePod (Apple Music), Sonos, Chromecast and other players use the same player as Spotify, with artwork, progress and controls. The card shows the app playing (for example Music), buttons follow what each device supports, and a TV that is off gets a power button. On by default; Settings → Appearance switches back to the previous card.
- Calendar colors: each calendar now uses the color set in Home Assistant (Settings → Entities → calendar → Color). A calendar without one gets a fixed color that no longer changes when other calendars are added or removed. Thanks @carlospparedes!

## 0.16.3

- First-time setup has two new steps: pick the layout (Grid and List on Free, Sidebar and Focus on Pro), and "Going on a wall tablet?", with hiding the Home Assistant sidebar, keeping the screen on and the screensaver. Just tapping Continue gives the same result as before.
- Keep the screen on, in Settings → This device: the Echo Show's Silk browser closes the page after a while. In Automatic mode (the default, only on an Echo Show), a silent sound loops in the background to keep the browser open and the display lit, like the Keep Silk Open project. You can also choose Always (other tablets) or Off.
- Special dates (Pro), in Settings → Calendar → Special dates, off by default: a countdown by the clock, a light animation on the day and a greeting on the screensaver. Christmas (snow), New Year (sparkles, a countdown to midnight on the screensaver and fireworks in the first minutes), Valentine's Day (June 12 in Brazil, February 14 elsewhere), Halloween, Easter, Carnival (Brazil), Thanksgiving (US), birthdays from your calendars ("Happy birthday, Grandma!", with confetti) and your own dates with the animation you pick. Each date has its own switch, follows the country set in Home Assistant, pauses while the panel isn't visible and respects "reduce motion". A See button previews each date's animation for a few seconds in Settings. Decorations live on the cards and in empty spaces: presents on the cards and string lights at Christmas; webs, a dangling spider and a ghost at Halloween; a bunny peeking over the cards and eggs at Easter; hanging hearts on Valentine's Day; streamers at Carnival; leaves on the cards at Thanksgiving; balloons and confetti on birthdays.
- Confirm before toggling, in each device's details (Card options), off by default: the first tap only shows “Tap again to turn off” for 3 seconds and the second one acts. The card gets a small lock. In the List and Focus layouts, a tap opens the details instead.
- Card icon: in Card options, pick Automatic, the Home Assistant icon or one of HomeDeck's icons. In Appearance → Icons, an option (off by default) uses the Home Assistant icon on every card that has one.

## 0.16.2

- Settings reorganized: new Weather, Calendar, Cameras, Screensaver and This device sections (choices that apply only to the device in use). On a phone the menu scrolls sideways to the chosen section.
- Live video on camera cards, on by default (Settings → Cameras): a card plays the live video while it's on screen, Nest cameras included. Turn it off to go back to a still every 10 seconds.
- The panel's address now carries a fingerprint of the file, so browsers always load the new panel after an update instead of a cached copy.
- Google Nest cameras (WebRTC only): the live view now opens straight in Home Assistant's player. Before, Nest served a placeholder picture instead of MJPEG, so no video showed.
- Lock editing on this device, in Settings → This device, off by default: hides the Edit button on that device only, for a wall dashboard.
- Spotify speaker on this device, in Settings → This device: playback started from that device goes to the chosen speaker.
- Doorbell pop-up (Pro), in Settings → Cameras, off by default: when the doorbell rings (a doorbell event entity, or a sensor turning on), the chosen camera's live view pops up over the panel, even on the screensaver, and closes by itself after the time you pick. The doorbell and camera are suggested the first time, and a Test button shows it right away.
- Sensor charts (Pro), in Appearance → Card style, off by default: numeric sensor cards at double size show a line of the last 24 hours, and at large size the chart fills the middle of the card.
- Device details: a long name wraps to up to two lines and the rename pencil stays visible beside it.

## 0.16.1

- Polish: the whole dashboard and the integration setup in Home Assistant. Like the other languages, it follows the user's language in Home Assistant.
- Settings → Navigation: when Scenes, Media or Security is on but its tab doesn't show because the panel's rooms have nothing of that kind (for example, scenes without an area in Home Assistant), a note explains why.

## 0.16.0

Everything is optional: if you don't turn anything on, the panel looks as before.

- History in the details of numeric sensors (temperature, power, prices…): a 6 h, 24 h or 7-day chart with the lowest and highest value and the value under your finger.
- Camera full screen: a button in the camera details. It uses the browser's full screen and, where there is none (some apps and webviews), covers the whole panel.
- Cameras that only stream over WebRTC or HLS (such as newer Google Nest models): when a camera has no MJPEG stream, the live view uses Home Assistant's own camera player. Cameras that already worked are unchanged.
- More cards on Home, in Settings → Home → More cards on Home, all off by default:
  - Weather: temperature, condition, high and low; at double size, the next hours; a tap opens the forecast.
  - Sun: next sunrise or sunset and elevation; at double size, the sun's path through the day.
  - Energy (Pro): home consumption, solar, grid (importing or exporting), battery and today's production. Sensors are suggested the first time and can be changed; each line opens the sensor with its history; at large size, a chart of the last 24 h.
- Large size (Pro): the size badge in Edit mode now goes from normal to double, large (two columns and two rows) and back to normal.
- Animations (Pro), in Appearance → Card style, off by default: running fans spin, lit lights glow, and washing machines, dryers and dishwashers shake while they run (recognized by name).
- Screensaver (Pro) with today's agenda: under the clock, today's upcoming events (in each calendar's color) and the reminders due, overdue ones in red. Each part is turned on separately in Settings → Appearance → Screensaver and uses the same calendars and list as the agenda.
- No scroll bars: while HomeDeck is open, the panel's and the page's scroll bars are hidden (scrolling works as before, by touch, wheel or keyboard); they come back when you leave.
- Home without the small scroll: when it is only a little taller than the screen (a separator, one more row), everything shrinks by up to 15% to fit; much bigger homes still scroll, and phones don't change.
- List layout: a separator inside a room is inset like the rows instead of touching the edges; in Home's Edit mode it no longer jiggles and its name can be selected and edited.

## 0.15.0

Everything is optional: if you don't change anything, the panel looks exactly as before.

- Nicknames: in a device's details, the pencil beside the name renames it in HomeDeck only (Home Assistant keeps its own name). It applies to every screen and layout; leaving it empty goes back to the Home Assistant name, shown right under the field.
- Rename rooms in Settings → Rooms: the pencil beside each one gives it another name in HomeDeck only (the area's name in Home Assistant shows beside it, in gray). It applies to every screen and layout once saved.
- Room options in Edit mode: pick the icon (Automatic, as before, the area's icon from Home Assistant, or one of HomeDeck's icons, with new ones for dining, laundry, pool, games, stairs and plants) and the sensor that gives the temperature on the room card (Automatic still uses the climate device).
- Alarm panels (`alarm_control_panel`): a card with the state (disarmed, armed home, away, night, triggered…), lit while armed; in the details, arm in the modes the panel supports and disarm, with a code field when the panel asks for one. It never shows up on its own: it waits under Hidden in the room's and the Security page's Edit mode until you add it.
- Plants (`plant`, from the Plant integration and Plant Monitor/OpenPlantbook): a card that says "Doing well" or "Needs attention" (red); in the details and at double size, soil moisture, temperature, light and fertility, with out-of-range readings marked. It also shows up only once added.
- Alarm panels and plants don't count toward the free plan's limit.
- Player cards (Spotify and others at double size) no longer show volume buttons: the volume lives in the details, one tap away.

## 0.14.1

- The Spotify card now just says "Spotify": a speaker name on two lines made the row taller and pushed the cards against the bottom bar (the name still shows in the player).
- Today card at double size: up to 3 items and the full weekday, without stretching the row.
- Double-size camera: the name is back under the picture instead of behind the "Watch live" badge.

## 0.14.0

- Settings → System now says HomeDeck is designed by people and built with AI, like the README and the website.
- Bottom bar: in Edit mode, drag the tabs to reorder them (Home always stays first). This includes the pages you created, which used to sit at the end, and the links of the Sidebar layout.
- Media volume uses − and + buttons (on double-size cards and in the details) instead of a slider. This also works on TVs that can only step the volume up and down, like many Samsung and LG models, where the slider did nothing.
- Media artwork: what an Apple TV, Sonos, Chromecast or other player is playing shows on its card (instead of the icon), on the Media card on Home and large in its details.
- Favorites and sources: a player's details list the sources it offers, such as saved favorites and playlists on Sonos, apps on Apple TV and inputs on a TV. One tap switches.
- Today card on Home: turn it on in Settings → Home → Calendar and reminders. It shows the day's upcoming events (in each calendar's color) and the reminders due, without opening the calendar; events that have ended drop off. At normal size, the next timed event and how many more there are; at double size, the day's list. A tap opens the calendar, and a reminder in the list opens the reminders. It uses the calendars and list chosen for the buttons beside the clock.
- German: the whole dashboard (Home, rooms, layouts, Edit mode, Settings, the Free and Pro plans, feedback, weather, calendar, cameras and vacuums) and the integration setup in Home Assistant. Like the other languages, it follows the user's language in Home Assistant.

## 0.13.0

- Separators: in Edit mode, **Add separator** adds a title with a thin line that splits a screen into groups (for example "Waste" or "Kitchen"). Drag, rename or remove it. Works on Home, in rooms (every layout) and on your pages.
- More text on cards: the state now takes up to two lines (four on a double-size card, two on List rows) instead of being cut after the first, which helps with waste collection, alerts and text sensors.
- Reordering rooms in the List, Sidebar or Focus layout no longer moves the other items on Home.
- Fixed "Error setting up entry HomeDeck" on Home Assistant older than 2026.5: the integration used a frontend function that only exists from that version on. It works again from 2024.7, the minimum listed in HACS.

## 0.12.0

- Style (Pro), in Settings → Appearance, previewed live on the dashboard: corners from square to very round across the whole interface (cards, buttons, pills, menus, sheets and controls), the cards' frame on or off, and glass from solid (in the background's tone) to see-through. Profile pictures stay round; **Restore defaults** brings back the original look.
- Send feedback (Pro), in Settings → Plan: your e-mail, a type (problem, idea or praise) and a message. It reaches support with the HomeDeck and Home Assistant versions, and the reply goes straight to your e-mail.

## 0.11.0

- Cameras: the latest still fills the card and refreshes every 10 seconds while the dashboard is on screen; a tap opens the live view. Cameras also appear on the Security page.
- Vacuums: status and battery on the card, with start or pause and back to dock; stop too at double size and in the details. The card lights up and its icon moves while it cleans.
- Scripts and buttons run with one tap, like scenes.
- Selects (`select` and `input_select`), such as a washing machine program: the current option in a picker on the card, every option in the details and at double size.
- Rooms with a light on show their power button lit in the highlight color.
- Cameras, vacuums, scripts, buttons and selects don't count toward the Free plan limit.

## 0.10.3

First public release.

- Dashboard that builds itself from Home Assistant areas, devices and entities, with a
  first-run setup that finds your home and lets you pick the rooms.
- Four layouts (Grid, Sidebar, List and Focus) followed by every screen, including Media,
  Security, Scenes and your own pages.
- Edit mode on every screen: drag, hide, add devices from other rooms and double-size cards.
- Calendar and reminders beside the clock, with a full-screen month and a reminders list.
- Full weather forecast with fallbacks: chosen weather entity, any working `weather.*`,
  outdoor temperature sensors and Open-Meteo for the home's location.
- Big cards with brightness, colors, vertical cover control and climate ring; Spotify
  player; screensaver; editable scene strip.
- Option to hide the Home Assistant sidebar on each device.
- Free and Pro plans, with Pro bought from the dashboard (Stripe, with a QR code to pay on
  your phone) and activated automatically.
- English, Portuguese and Spanish; Pro priced in US dollars, or in Brazilian reais in Brazil.
