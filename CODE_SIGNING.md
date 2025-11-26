# Code Signing Guide

Code signing your Electron app ensures users trust your application and reduces security warnings during installation.

## Why Code Sign?

**Without signing:**
- ⚠️ **Windows**: "Windows protected your PC" SmartScreen warning
- ⚠️ **macOS**: "Unidentified developer" / "App is damaged" warnings
- ⚠️ **Linux**: No issues (signing not required)

**With signing:**
- ✅ **Windows**: No SmartScreen warning (after building reputation)
- ✅ **macOS**: Smooth installation, no warnings
- ✅ Users trust your app is from you and hasn't been tampered with

## Platform Requirements & Costs

| Platform | Cost | Renewal | Setup Complexity |
|----------|------|---------|-----------------|
| **Windows** | $200-400/year | Annual | Medium |
| **macOS** | $99/year | Annual | High |
| **Linux** | Free | N/A | Not needed |

---

## Windows Code Signing

### Step 1: Obtain a Code Signing Certificate

**Option A: Purchase from a Certificate Authority (CA)**

Recommended CAs:
- [DigiCert](https://www.digicert.com/signing/code-signing-certificates) - $474/year
- [Sectigo](https://sectigo.com/ssl-certificates-tls/code-signing) - $200-400/year
- [SSL.com](https://www.ssl.com/certificates/code-signing/) - $200-300/year
- [Certum](https://en.sklep.certum.pl/code-signing-certificates.html) - ~$150/year (EU-based)

**Requirements:**
- Business entity (LLC, Corporation) or sole proprietorship
- Business verification (DUNS number, articles of incorporation, etc.)
- Personal identity verification
- Processing time: 1-7 days

**Option B: Use an EV Code Signing Certificate**

Extended Validation (EV) certificates provide immediate SmartScreen reputation:
- Cost: $400-600/year
- Delivered on physical USB token (for security)
- Instant SmartScreen reputation (no warning even for new apps)
- Same verification requirements as standard certificates

### Step 2: Install the Certificate

After purchase, you'll receive:
- `.pfx` or `.p12` file (certificate + private key)
- Password to unlock the file

**For local signing:**
1. Import the certificate to your Windows certificate store
2. Or keep the `.pfx` file in a secure location

**For GitHub Actions:**
1. Base64 encode the certificate:
   ```powershell
   certutil -encode certificate.pfx certificate.txt
   ```
2. Store in GitHub Secrets (see CI/CD section below)

### Step 3: Configure electron-builder

Add to `package.json`:

```json
{
  "build": {
    "win": {
      "certificateFile": "./certificate.pfx",
      "certificatePassword": "YOUR_PASSWORD",
      "signingHashAlgorithms": ["sha256"],
      "sign": "./custom-sign.js"
    }
  }
}
```

**Security best practice - use environment variables:**

```json
{
  "build": {
    "win": {
      "certificateFile": "./certificate.pfx",
      "certificatePassword": "${WIN_CSC_KEY_PASSWORD}",
      "signingHashAlgorithms": ["sha256"]
    }
  }
}
```

Then set environment variable:
```bash
# Windows
set WIN_CSC_KEY_PASSWORD=your_password

# macOS/Linux
export WIN_CSC_KEY_PASSWORD=your_password
```

### Step 4: Build and Sign

```bash
npm run build:win
```

electron-builder automatically signs the installer during the build process.

### Step 5: Build SmartScreen Reputation

Even with a valid certificate, new applications may trigger SmartScreen warnings initially. Build reputation by:
- Getting downloads from trusted sources
- Ensuring consistent publisher name across versions
- Avoiding sudden changes in behavior
- Typically takes 1-3 months and hundreds of downloads

**EV certificates bypass this reputation requirement.**

---

## macOS Code Signing

macOS code signing is more complex and requires an Apple Developer account.

### Step 1: Join Apple Developer Program

1. Go to [developer.apple.com](https://developer.apple.com)
2. Enroll in Apple Developer Program ($99/year)
3. Complete identity verification (can take 1-2 days)

### Step 2: Create Developer ID Certificate

**On macOS:**

1. Open **Keychain Access**
2. Go to **Keychain Access → Certificate Assistant → Request a Certificate from a Certificate Authority**
3. Enter your email and name
4. Select "Saved to disk"
5. Save the certificate request file

**On Apple Developer Portal:**

1. Go to [developer.apple.com/account](https://developer.apple.com/account)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **+** to create a new certificate
4. Select **Developer ID Application** (for distribution outside Mac App Store)
5. Upload your certificate request file
6. Download the generated certificate (`.cer` file)

**Back on macOS:**

1. Double-click the downloaded `.cer` file to install in Keychain
2. Verify it appears in **Keychain Access** under "My Certificates"

### Step 3: Get Your Certificate Identity

```bash
security find-identity -v -p codesigning
```

Output shows your signing identities:
```
1) 1234567890ABCDEF "Developer ID Application: Your Name (TEAM_ID)"
```

Copy the full identity string in quotes.

### Step 4: Configure electron-builder

Add to `package.json`:

```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (TEAM_ID)",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist"
    }
  }
}
```

### Step 5: Create Entitlements File

Create `build/entitlements.mac.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.allow-dyld-environment-variables</key>
    <true/>
</dict>
</plist>
```

### Step 6: Set Up Notarization (Required for macOS 10.14.5+)

Notarization is Apple's malware scanning service - required for distribution.

**Create app-specific password:**

1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in → **Security** → **App-Specific Passwords**
3. Generate new password
4. Save it securely

**Configure notarization:**

Add to `package.json`:

```json
{
  "build": {
    "mac": {
      "notarize": {
        "teamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

**Set environment variables:**

```bash
export APPLE_ID="your@email.com"
export APPLE_APP_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"
export APPLE_TEAM_ID="YOUR_TEAM_ID"
```

Find your Team ID at [developer.apple.com/account](https://developer.apple.com/account) (in top right).

### Step 7: Build and Sign

```bash
npm run build:mac
```

electron-builder will:
1. Code sign the app
2. Upload to Apple for notarization (takes 1-5 minutes)
3. Staple the notarization ticket to the app
4. Create the DMG

**Note**: Notarization requires an internet connection and can take several minutes.

---

## Linux

Linux doesn't require code signing for distribution. Users can verify packages using:
- GPG signatures (optional, advanced)
- Package repository signatures (if you host your own repository)

Most Electron apps on Linux are distributed unsigned without issues.

---

## CI/CD: Code Signing in GitHub Actions

To automatically sign apps in your release workflow, you need to securely store certificates as GitHub Secrets.

### Windows Signing in GitHub Actions

**1. Prepare certificate:**

```powershell
# Base64 encode your .pfx file
certutil -encode certificate.pfx certificate-base64.txt
```

**2. Add GitHub Secrets:**

Go to your repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:
- `WIN_CSC_LINK`: Content of `certificate-base64.txt` (the base64 certificate)
- `WIN_CSC_KEY_PASSWORD`: Your certificate password

**3. Update `.github/workflows/release.yml`:**

```yaml
- name: Build app for Windows
  if: matrix.os == 'windows-latest'
  env:
    WIN_CSC_LINK: ${{ secrets.WIN_CSC_LINK }}
    WIN_CSC_KEY_PASSWORD: ${{ secrets.WIN_CSC_KEY_PASSWORD }}
  run: npm run build:win
```

### macOS Signing in GitHub Actions

**1. Export your certificate:**

```bash
# Export from Keychain as .p12
# In Keychain Access, right-click your Developer ID certificate
# Export → Save as .p12 with a password

# Base64 encode it
base64 -i certificate.p12 -o certificate-base64.txt
```

**2. Add GitHub Secrets:**

- `CSC_LINK`: Content of `certificate-base64.txt`
- `CSC_KEY_PASSWORD`: Your .p12 password
- `APPLE_ID`: Your Apple ID email
- `APPLE_APP_SPECIFIC_PASSWORD`: App-specific password from appleid.apple.com
- `APPLE_TEAM_ID`: Your Team ID

**3. Update `.github/workflows/release.yml`:**

```yaml
- name: Build app for macOS
  if: matrix.os == 'macos-latest'
  env:
    CSC_LINK: ${{ secrets.CSC_LINK }}
    CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
    APPLE_ID: ${{ secrets.APPLE_ID }}
    APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
    APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
  run: npm run build:mac
```

### Complete Signed Release Workflow

Here's an updated workflow file with signing:

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  release:
    name: Build and Release
    runs-on: ${{ matrix.os }}

    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build app for Linux
        if: matrix.os == 'ubuntu-latest'
        run: npm run build:linux

      - name: Build app for Windows (signed)
        if: matrix.os == 'windows-latest'
        env:
          WIN_CSC_LINK: ${{ secrets.WIN_CSC_LINK }}
          WIN_CSC_KEY_PASSWORD: ${{ secrets.WIN_CSC_KEY_PASSWORD }}
        run: npm run build:win

      - name: Build app for macOS (signed & notarized)
        if: matrix.os == 'macos-latest'
        env:
          CSC_LINK: ${{ secrets.CSC_LINK }}
          CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
          APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
        run: npm run build:mac

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.os }}-build
          path: dist/*
          retention-days: 5

  create-release:
    name: Create GitHub Release
    needs: release
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: artifacts

      - name: Display structure of downloaded files
        run: ls -R artifacts

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          draft: false
          prerelease: false
          generate_release_notes: true
          files: |
            artifacts/**/*
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Testing Code Signing

### Windows

```bash
# Check if file is signed
signtool verify /pa /v "CSV Dashboard Setup 1.0.0.exe"

# View signature details
Get-AuthenticodeSignature "CSV Dashboard Setup 1.0.0.exe" | Format-List
```

### macOS

```bash
# Check code signature
codesign -dv --verbose=4 "CSV Dashboard.app"

# Check notarization
spctl -a -vv "CSV Dashboard.app"

# Check entitlements
codesign -d --entitlements - "CSV Dashboard.app"
```

---

## Troubleshooting

### Windows

**"SignTool Error: No certificates were found"**
- Certificate not installed in Windows certificate store
- Use `certificateFile` in package.json to point to .pfx file

**"The specified timestamp server could not be reached"**
- Temporary timestamp server issue
- Retry the build
- electron-builder uses multiple timestamp servers automatically

**SmartScreen still shows warnings**
- Normal for new certificates
- Build reputation over time (1-3 months)
- Consider EV certificate for immediate reputation

### macOS

**"no identity found"**
- Certificate not installed in Keychain
- Check with: `security find-identity -v -p codesigning`
- Ensure certificate is valid and not expired

**Notarization fails with "Invalid Code Signing Entitlements"**
- Check your `entitlements.mac.plist` file
- Ensure all required entitlements are included for Electron

**"App is damaged and can't be opened"**
- App not notarized
- Built on non-Mac (can't notarize)
- Workaround for users: `xattr -cr /Applications/YourApp.app`

**Notarization timeout**
- Apple's servers can be slow
- Usually completes in 1-5 minutes
- Can take up to 30 minutes during peak times
- Check status at [appstoreconnect.apple.com](https://appstoreconnect.apple.com)

---

## Cost Summary

### Minimal Setup (Windows only)
- **Windows certificate**: $200-400/year
- **Total**: $200-400/year
- Users: Windows users see no warnings (after reputation), macOS users see warnings

### Full Production Setup (Windows + macOS)
- **Windows certificate**: $200-400/year
- **Apple Developer Program**: $99/year
- **Total**: $300-500/year
- Users: No warnings on any platform

### Premium Setup (EV Certificate + macOS)
- **Windows EV certificate**: $400-600/year (instant reputation)
- **Apple Developer Program**: $99/year
- **Total**: $500-700/year
- Users: Immediate trust on all platforms, no warnings ever

---

## Do You Need Code Signing?

**You should sign if:**
- ✅ Distributing to non-technical users
- ✅ Building trust and credibility
- ✅ App will be widely distributed
- ✅ Commercial or professional use

**You can skip signing if:**
- ❌ Internal company use only
- ❌ Technical users who understand warnings
- ❌ Open source project (users expect it)
- ❌ Early development/testing phase

Start without signing, add it when your user base grows and demands it.

---

## Recommended Timeline

**Phase 1 - Early Development**
- No signing needed
- Focus on features and stability
- Test distribution process

**Phase 2 - Public Beta**
- Consider signing if user feedback mentions security warnings
- Start with Windows (larger user base)
- Document workarounds for unsigned apps

**Phase 3 - Production Release**
- Sign both Windows and macOS
- Set up automated signing in CI/CD
- Professional, trustworthy distribution

---

## Additional Resources

- [electron-builder Code Signing](https://www.electron.build/code-signing)
- [Apple Notarization Guide](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Microsoft Code Signing Best Practices](https://docs.microsoft.com/windows-hardware/drivers/dashboard/code-signing-best-practices)
- [Electron Code Signing Tutorial](https://www.electronjs.org/docs/latest/tutorial/code-signing)
