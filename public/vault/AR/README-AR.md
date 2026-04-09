# AR assets

- **GLB** files are used for **WebXR** (Android Chrome). No change needed.
- **USDZ** files are used for **Quick Look AR** (iPhone Safari). To generate them:

## Option 1 — Script (Docker or Apple USDPython)

From the project root:

```bash
./scripts/convert-glb-to-usdz.sh
```

- With **Docker**: `docker pull marlon360/usd-from-gltf` then run the script.
- With **Apple USDPython** (`usdzconvert` in PATH): run the script.

## Option 2 — Free online converter (recommended; no Docker/Xcode)

Reality Composer Pro’s **Import** dialog only accepts **USD/USDZ**, not GLB — so GLB will always be grayed out there. Easiest path:

1. **Prepare GLBs** (removes Draco so converters work reliably):
   ```bash
   npm run ar:prepare-glb
   ```
   This creates **`public/vault/AR/for-apple/`** with plain GLBs.

2. **Convert to USDZ in the browser:**  
   Open [usdz.io](https://usdz.io) or [Paus AR Studio converter](https://converter.pausarstudio.de/).  
   Upload each file from **`for-apple`**, download the USDZ, and save it into **`public/vault/AR/`** with the **same base name** (e.g. `artwork 1_planet of love_character.usdz`). See the table below for exact names.

Done — no Reality Composer Pro or Docker needed.

## Option 2b — Docker (GLB → USDZ in Terminal)

**1. Install Docker (if you don’t have it)**  
- Mac: [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/) — download, install, open the app, and wait until it’s running (whale icon in the menu bar).  
- Or with Homebrew: `brew install --cask docker`, then open Docker from Applications.

**2. Open Terminal** and go to your project root (the `EXO SANCTRA` folder):

```bash
cd "/Users/USER/Downloads/APPS/EXO SANCTRA"
```

**3. Prepare the GLBs** (creates `public/vault/AR/for-apple/`):

```bash
npm run ar:prepare-glb
```

**4. Pull the conversion image** (one-time):

```bash
docker pull marlon360/usd-from-gltf
```

**5. Run the conversion script:**

```bash
./scripts/convert-glb-to-usdz-from-for-apple.sh
```

The script reads GLBs from `public/vault/AR/for-apple/` and writes USDZ files into `public/vault/AR/`. When it finishes, the `/ar` page can use “View in AR (Quick Look)” on iPhone.

**If some files didn’t convert**, run only the missing ones: `./scripts/convert-missing-usdz.sh`

## Option 2c — Reality Composer Pro (USDZ only)

Reality Composer Pro only **imports** USD/USDZ. So you must create USDZ first (e.g. with Option 2 or 2b), then you can open those USDZ in **Xcode → Open Developer Tool → Reality Composer Pro** to edit materials/lighting if you want.

## Option 3 — Free online converter

Use a browser-based GLB → USDZ converter (e.g. [usdz.io](https://usdz.io) or [Paus AR Studio converter](https://converter.pausarstudio.de/)). Upload each GLB, download the USDZ, and save it here with the same base name.

---

**Exact names to create**

| From (GLB) | To (USDZ) |
|------------|-----------|
| `artwork 1_planet of love_character.glb` | `artwork 1_planet of love_character.usdz` |
| `artwork 2_the unburied ones_character.glb` | `artwork 2_the unburied ones_character.usdz` |
| `artwork 4_my freak family_character.glb` | `artwork 4_my freak family_character.usdz` |
| `artwork 7_liquid desire_character.glb` | `artwork 7_liquid desire_character.usdz` |
| `artwork 8_cleansing rite_character.glb` | `artwork 8_cleansing rite_character.usdz` |
| `artwork 10_necroflora_character.glb` | `artwork 10_necroflora_character.usdz` |

Put the `.usdz` files in this folder. The `/ar` page will then offer “View in AR (Quick Look)” on iPhone.
