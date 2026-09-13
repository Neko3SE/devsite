# VOICE CHANGER LAB β — Phase 4 — MANUAL DSP

Baseline: Phase 3 Rev.3, verified on PC and Android.

## Implemented
- PRESET / MANUAL mode tabs
- MANUAL accordion:
  - VOICE: Pitch Shift, Formant Character
  - FILTER/EQ: Low Cut, High Cut, Low EQ, High EQ
  - MODULATION: Type, Rate, Depth
  - DELAY: Time, Feedback
  - DRIVE/OUTPUT: Distortion, Mix, Output Gain
- Slider + numeric input synchronization
- MANUAL APPLY uses the existing Worker DSP pipeline and always processes from ORIGINAL
- MIX dry/wet stage added before output limiter
- RESET returns MANUAL controls to neutral and marks parameters changed; it does not process automatically
- BYPASS ON disables APPLY and processed monitoring; ORIGINAL remains the monitor path
- COPY TO MANUAL copies the selected preset parameters, switches to MANUAL, and does not process automatically
- Applied MANUAL settings are displayed separately from measured A/B analysis
- Existing valid PROCESSED audio remains until a new APPLY succeeds
- Re-record retains MANUAL settings but clears processed/applied-result state

## PC test focus
1. Record.
2. Switch MANUAL.
3. Change Pitch/Formant and APPLY; confirm sound and A/B changes.
4. Test FILTER/EQ, modulation, delay, distortion, Mix and Output Gain.
5. RESET: controls neutral, no automatic processing.
6. Select a PRESET -> COPY TO MANUAL: values copied, MANUAL selected, no automatic processing.
7. BYPASS ON: APPLY disabled; use PLAY ORIGINAL for monitoring.
8. BYPASS OFF: APPLY becomes available.
9. Existing PROCESSED remains playable after editing MANUAL until next APPLY.
10. Re-record: MANUAL values remain, old processed result clears.
