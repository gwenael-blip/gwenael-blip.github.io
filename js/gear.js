/* Gear shown on the site. Edit this file to change what is listed.
 *
 *  No prices here, on purpose: the site shows none (decided 11 Nov 2026). A customer sends a list and gets the
 *  price in the quote, which is made in the Gear Tracker from its own day rates. This file is public, so never
 *  put a price in it.
 *  qty    = how many identical pieces you have (shown as "×3").
 *  ref    = the item ID(s) in the Gear Tracker. Never shown; a quote request uses it to tell the tracker which gear is meant.
 *  includes / note = short text in English (en) and Faroese (fo).
 *  packages = the two items shown as big cards at the top.
 */
window.AKHC_GEAR = {
 "updated": "2026-10-17",
 "packages": ["CAM-03", "CAM-14"],
 "categories": [
  {
   "id": "cameras", "name": {"en": "Cameras & monitoring", "fo": "Kameraer og skíggjar"},
   "items": [
    {"ref": "CAM-03", "name": "ARRI AMIRA package", "includes": {"en": "Includes 4 Anton Bauer 90 and 4 HC Dionic batteries, GM2 dual charger, 4 CFast cards, side bracket, adapter plate and top handle. Lenses are rented separately.", "fo": "Inniheldur 4 Anton Bauer 90 og 4 HC Dionic batteri, GM2 hleðara fyri tvey batteri, 4 CFast kort, síðubrakkett, adapterplátu og handtak ovast. Linsur verða leigaðar sær."}},
    {"ref": "CAM-14", "name": "DJI Ronin 4D camera system", "includes": {"en": "Includes 5 batteries, 1 TB SSD, expansion plate, AC power adapter, hand focus unit, video transmitter and High-Bright remote monitor.", "fo": "Inniheldur 5 batteri, 1 TB SSD, víðkingarplátu, AC streymtil, hond-fokus, video-sendara og High-Bright fjarskíggja."}},
    {"ref": "CAM-21", "name": "DJI Ronin 4D Flex extension system", "note": {"en": "Add-on for the Ronin 4D", "fo": "Tillag til Ronin 4D"}},
    {"ref": "CAM-22", "name": "DJI manual-lens focus motor", "note": {"en": "Add-on for the Ronin 4D", "fo": "Tillag til Ronin 4D"}},
    {"ref": "CAM-23", "name": "NiSi ATHENA PL-DJI DX lens mount adapter", "note": {"en": "Add-on for the Ronin 4D", "fo": "Tillag til Ronin 4D"}},
    {"ref": "CAM-01", "name": "Sony A7S III"},
    {"ref": "CAM-02", "name": "Sony A7R IV"},
    {"ref": "CAM-04", "name": "Hollyland Pyro transmission & monitoring kit", "note": {"en": "Wireless video link with monitor", "fo": "Tráðleyst video-leinki við skíggja"}},
    {"ref": "CAM-12", "name": "Eizo ColorEdge CG277 monitor", "note": {"en": "27-inch colour-accurate monitor", "fo": "27 tummu litrættur skíggi"}}
   ]
  },
  {
   "id": "lenses", "name": {"en": "Lenses", "fo": "Linsur"},
   "items": [
    {"ref": "LEN-01", "name": "Sony FE 14mm F1.8 GM", "note": {"en": "E-mount", "fo": "E-mount"}},
    {"ref": "LEN-02", "name": "Sony FE 24-70mm F2.8 GM II", "note": {"en": "E-mount", "fo": "E-mount"}},
    {"ref": "LEN-03", "name": "Sony FE 70-200mm F2.8 GM OSS II", "note": {"en": "E-mount", "fo": "E-mount"}},
    {"ref": "LEN-04", "name": "Sigma 50mm Art"},
    {"ref": "LEN-05", "name": "DZOFilm Vespid 25mm T2.1", "note": {"en": "PL mount", "fo": "PL mount"}},
    {"ref": "LEN-06", "name": "DZOFilm Pictor Zoom 20-55mm T2.8", "note": {"en": "Super35 zoom, PL mount", "fo": "Super35 zoom, PL mount"}}
   ]
  },
  {
   "id": "lighting", "name": {"en": "Lighting", "fo": "Ljós"},
   "items": [
    {"ref": "LGT-07", "name": "Nanlux Evoke 900C", "note": {"en": "Reflector included", "fo": "Reflektari fylgir við"}},
    {"ref": ["LGT-01", "LGT-02", "LGT-03"], "name": "Nanlite Forza 60C", "qty": 3},
    {"ref": ["LGT-04", "LGT-05", "LGT-06"], "name": "Nanlite PavoTube 30X", "qty": 3},
    {"ref": "LGT-16", "name": "Nanlite PavoTube 15X"},
    {"ref": "KIT-03", "name": "Nanlite PavoBulb 10C kit", "note": {"en": "4 bulbs", "fo": "4 perur"}},
    {"ref": ["LGT-10", "LGT-11"], "name": "Godox SL-60W", "qty": 2},
    {"ref": "LGT-09", "name": "Godox AD600Pro Witstro flash with Sony trigger"},
    {"ref": ["LGT-18", "LGT-19"], "name": "Godox AD400Pro", "qty": 2},
    {"ref": ["LGT-12", "LGT-13"], "name": "Godox AD200Pro", "qty": 2},
    {"ref": "LGT-08", "name": "Etec 1500 hazer", "note": {"en": "Fluid is billed separately", "fo": "Vøkvi verður rindaður sær"}}
   ]
  },
  {
   "id": "shaping", "name": {"en": "Light shaping", "fo": "Softboxar og reflektorar"},
   "items": [
    {"ref": ["MOD-01", "MOD-02"], "name": "Spotlight mount for Nanlite Forza 60C", "qty": 2},
    {"ref": "MOD-03", "name": "Nanlite Forza 60 softbox with grid"},
    {"ref": "MOD-04", "name": "Nanlite Forza 60 lantern softbox 18\""},
    {"ref": "MOD-05", "name": "Nanlux lantern softbox for Evoke 47.2\""},
    {"ref": "MOD-12", "name": "Aputure Fresnel 2X"},
    {"ref": "MOD-07", "name": "Broncolor softbox 120×180 with grid (Bowens)"},
    {"ref": "MOD-10", "name": "Broncolor softbox 30×120 (Bowens)"},
    {"ref": "MOD-09", "name": "Broncolor softbox 35×60 (Bowens)"},
    {"ref": "MOD-08", "name": "Broncolor Para 88"},
    {"ref": "MOD-11", "name": "Westcott 45 Deep Focus reflector with grids"},
    {"ref": "MOD-17", "name": "Impact 7' umbrella (white/black)"},
    {"ref": "MOD-15", "name": "Sunbounce Sun-Bouncer Pro reflector kit 4 × 6' (silver/white)"},
    {"ref": "MOD-16", "name": "Sunbounce Pro frame 4 × 6' with Black Hole screen"}
   ]
  },
  {
   "id": "sound", "name": {"en": "Sound", "fo": "Ljóð"},
   "items": [
    {"ref": "AUD-01", "name": "Sound Devices MixPre-3 II"},
    {"ref": ["AUD-02", "AUD-03", "AUD-04"], "name": "DPA 4060", "qty": 3, "note": {"en": "Miniature lavalier microphone", "fo": "Lítil lavalier-mikrofon"}},
    {"ref": "AUD-08", "name": "Sanken CMS-50"},
    {"ref": ["AUD-05", "AUD-06", "AUD-07"], "name": "Tentacle Sync Track E", "qty": 3, "note": {"en": "Timecode generator", "fo": "Tímakoda-generator"}}
   ]
  },
  {
   "id": "support", "name": {"en": "Support & grip", "fo": "Standar og grip"},
   "items": [
    {"ref": "GRP-10", "name": "Easyrig Minimax with quick release"},
    {"ref": "GRP-11", "name": "Tilta Float handheld gimbal support system (DJI RS 2, Gold Mount)"},
    {"ref": "STD-01", "name": "Kupo High Roller"},
    {"ref": ["STD-02", "STD-03", "STD-04"], "name": "Impact Turtle Base C-stand kit 10.75'", "qty": 3},
    {"ref": ["STD-05", "STD-06"], "name": "Avenger C-stand 5.7'", "qty": 2},
    {"ref": ["STD-07", "STD-08"], "name": "Impact KEYGRIP low roller combo stand 4'", "qty": 2},
    {"ref": "GRP-08", "name": "Impact mid-range boom arm"},
    {"ref": "GRP-01", "name": "Kupo 4-in-1 nesting apple box"},
    {"ref": "GRP-02", "name": "Matthews black flag 24×36\""},
    {"ref": ["GRP-03", "GRP-09"], "name": "Matthews Hollywood head & arm 20\"", "qty": 2},
    {"ref": "GRP-04", "name": "Matthews offset arm"},
    {"ref": "GRP-05", "name": "Impact Baby triple header"},
    {"ref": ["GRP-06", "GRP-07"], "name": "Autopole", "qty": 2},
    {"ref": "KIT-01", "name": "Grip bag", "note": {"en": "Spring clamps, super clamps, pins and more", "fo": "Klemmur, superklemmur, pinnar og fleiri"}},
    {"ref": "KIT-02", "name": "Sandbags"}
   ]
  },
  {
   "id": "power", "name": {"en": "Power", "fo": "Rafmagn"},
   "items": [
    {"ref": ["BAT-05", "BAT-06"], "name": "V-mount battery 98 Wh", "qty": 2},
    {"ref": ["BAT-21", "BAT-22"], "name": "Sony NP-FZ100 battery", "qty": 2},
    {"ref": ["BAT-23", "BAT-24", "BAT-25"], "name": "Gold Mount to V-mount plate", "qty": 3},
    {"ref": ["BAT-26", "BAT-27"], "name": "V-mount to DC (Nanlite)", "qty": 2}
   ]
  }
 ]
};
