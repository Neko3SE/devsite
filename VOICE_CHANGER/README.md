# VOICE CHANGER LAB β — Phase 3 Rev.3

Phase 3 Rev.2 is the approved PC + Android baseline.

## Rev.3 scope — processed result visibility
This revision implements the approved distinction between:
1. **APPLIED SETTINGS** — the DSP parameters requested by PRESET.
2. **MEASURED A/B RESULTS** — analysis measured from ORIGINAL and PROCESSED audio.

After APPLY completes, the UI displays:
- Applied PRESET / Pitch Shift / Formant Character / filters / EQ / modulation / delay / drive / output gain
- Pitch AVG
- Pitch RANGE
- RMS AVG
- Peak
- Spectral Centroid AVG
- Duration
- Change values where meaningful
- Duration MATCH / WARNING

`FORMANT CHARACTER +N%` is explicitly a DSP character parameter, not a measured F1/F2/F3 percentage.

Whole-buffer analysis now also calculates a bounded Worker-side average spectral centroid for A/B display.

## Regression test
1. Record and confirm ORIGINAL ANALYSIS.
2. Apply CHILD/MALE/FEMALE/OLD/ROBOT/ALIEN.
3. Confirm APPLIED SETTINGS matches the selected preset.
4. Confirm A: ORIGINAL and B: PROCESSED values are populated.
5. Confirm DURATION shows MATCH under normal processing.
6. Confirm PLAY ORIGINAL / PLAY PROCESSED / STOP and Analyzer still work.
7. Re-record: comparison resets until the next successful APPLY.
8. Test on PC first, then Android after PC acceptance.
