/*
 * BIG WEEK 2026 — site configuration
 * Update links and dates here; every page reads from this file.
 * All times are South African Standard Time (UTC+02:00).
 */
window.BW_CONFIG = {
  links: {
    preRegister: "https://bigweek.howler.co.za/reg2026",
    /* Howler buttons. Until sales open (loyaltyOnSale below), every Howler button
       shows "Coming soon" with no link. They switch on by themselves at that time.
       Override: ticketsLive: true = force live now, false = keep "Coming soon". */
    ticketsLive: false,   // false = every ticket button shows "Coming soon" (no link). Set to "auto" once an on-sale date is set below.

    // Main Howler event page — every "Buy now" / "Get tickets" button uses this
    // unless a more specific link below is filled in.
    tickets: "https://bigweek.howler.co.za",
    days: {
      "yanoz-club": "",
      "shimza": "",
      "aklalwa-ekhaya": "",
      "maziwe-ke": ""
    },
    bigPass: "",
    bigTable: ""
  },

  dates: {
    preRegCloses: "2026-10-02T00:00:00+02:00",   // pre-registration closed early
    loyaltyOnSale: "",   // on-sale to pre-registered fam — leave "" until confirmed (e.g. "2026-10-20T12:00:00+02:00")
    publicOnSale: "",    // on-sale to the public — leave "" until confirmed
    festivalStart: "2026-12-27T15:00:00+02:00"
  },

  /* Lineup — add artists to each night whenever you announce them (one or many at a time).
     Each artist can be just a name:        "Artist Name"
     or a name with a photo:                { name: "Artist Name", photo: "artist-name.jpg" }
     Make an artist a headliner (double-size card on the Lineup page):
                                            { name: "Artist Name", photo: "artist-name.jpg", headliner: true }
     Photos go in assets/img/artists/ — portrait 4:5, about 1000 x 1250 px, JPG.
     Names show in the order listed. Set complete: true once the full lineup is out. */
  lineup: {
    complete: false,
    nights: {
      "yanoz-club": [],
      "shimza": [],
      "aklalwa-ekhaya": [],
      "maziwe-ke": []
    }
  },

  /* Partner gallery (Partners page). One entry per brand, shown as a tab.
     Each photo: [large file, small file, small width, small height] in assets/img/partners/.
     The caption "BIG WEEK x <brand>" is added automatically. Order here = tab order. */
  partnerGallery: [
    {
      brand: "Flying Fish",
      photos: [
        ["flying-fish-01.jpg", "flying-fish-01-sm.jpg", 480, 720],
        ["flying-fish-02.jpg", "flying-fish-02-sm.jpg", 480, 720],
        ["flying-fish-03.jpg", "flying-fish-03-sm.jpg", 480, 720],
        ["flying-fish-04.jpg", "flying-fish-04-sm.jpg", 480, 720],
        ["flying-fish-05.jpg", "flying-fish-05-sm.jpg", 480, 720],
        ["flying-fish-06.jpg", "flying-fish-06-sm.jpg", 480, 720],
        ["flying-fish-07.jpg", "flying-fish-07-sm.jpg", 480, 720],
        ["flying-fish-08.jpg", "flying-fish-08-sm.jpg", 480, 720],
        ["flying-fish-09.jpg", "flying-fish-09-sm.jpg", 480, 720],
        ["flying-fish-10.jpg", "flying-fish-10-sm.jpg", 480, 720],
        ["flying-fish-11.jpg", "flying-fish-11-sm.jpg", 480, 720],
        ["flying-fish-12.jpg", "flying-fish-12-sm.jpg", 480, 720],
        ["flying-fish-13.jpg", "flying-fish-13-sm.jpg", 480, 720],
        ["flying-fish-14.jpg", "flying-fish-14-sm.jpg", 480, 720],
        ["flying-fish-15.jpg", "flying-fish-15-sm.jpg", 480, 720],
        ["flying-fish-18.jpg", "flying-fish-18-sm.jpg", 720, 480],
        ["flying-fish-19.jpg", "flying-fish-19-sm.jpg", 720, 480],
        ["flying-fish-20.jpg", "flying-fish-20-sm.jpg", 480, 720]
      ]
    },
    {
      brand: "Fanta",
      photos: [
        ["fanta-01.jpg", "fanta-01-sm.jpg", 480, 720],
        ["fanta-02.jpg", "fanta-02-sm.jpg", 480, 720],
        ["fanta-03.jpg", "fanta-03-sm.jpg", 480, 720],
        ["fanta-04.jpg", "fanta-04-sm.jpg", 480, 720],
        ["fanta-05.jpg", "fanta-05-sm.jpg", 480, 720],
        ["fanta-06.jpg", "fanta-06-sm.jpg", 480, 720],
        ["fanta-07.jpg", "fanta-07-sm.jpg", 480, 720],
        ["fanta-08.jpg", "fanta-08-sm.jpg", 480, 720],
        ["fanta-09.jpg", "fanta-09-sm.jpg", 720, 480],
        ["fanta-10.jpg", "fanta-10-sm.jpg", 720, 480],
        ["fanta-11.jpg", "fanta-11-sm.jpg", 720, 480]
      ]
    },
    {
      brand: "Gordon's",
      photos: [
        ["gordons-01.jpg", "gordons-01-sm.jpg", 480, 720],
        ["gordons-02.jpg", "gordons-02-sm.jpg", 480, 720],
        ["gordons-03.jpg", "gordons-03-sm.jpg", 480, 720],
        ["gordons-04.jpg", "gordons-04-sm.jpg", 480, 720]
      ]
    },
    {
      brand: "Johnnie Walker",
      photos: [
        ["johnny-walker-01.jpg", "johnny-walker-01-sm.jpg", 480, 720],
        ["johnny-walker-02.jpg", "johnny-walker-02-sm.jpg", 480, 720],
        ["johnny-walker-03.jpg", "johnny-walker-03-sm.jpg", 480, 720],
        ["johnny-walker-04.jpg", "johnny-walker-04-sm.jpg", 480, 720],
        ["johnny-walker-05.jpg", "johnny-walker-05-sm.jpg", 480, 720],
        ["johnny-walker-06.jpg", "johnny-walker-06-sm.jpg", 480, 720]
      ]
    },
    {
      brand: "Red Bull",
      photos: [
        ["red-bull-01.jpg", "red-bull-01-sm.jpg", 480, 720],
        ["red-bull-02.jpg", "red-bull-02-sm.jpg", 480, 720],
        ["red-bull-03.jpg", "red-bull-03-sm.jpg", 480, 720],
        ["red-bull-04.jpg", "red-bull-04-sm.jpg", 480, 720],
        ["red-bull-05.jpg", "red-bull-05-sm.jpg", 480, 720],
        ["red-bull-06.jpg", "red-bull-06-sm.jpg", 480, 720]
      ]
    },
    {
      brand: "Sprite",
      photos: [
        ["sprite-01.jpg", "sprite-01-sm.jpg", 480, 720],
        ["sprite-02.jpg", "sprite-02-sm.jpg", 720, 480],
        ["sprite-03.jpg", "sprite-03-sm.jpg", 720, 480],
        ["sprite-04.jpg", "sprite-04-sm.jpg", 720, 480],
        ["sprite-05.jpg", "sprite-05-sm.jpg", 720, 480],
        ["sprite-06.jpg", "sprite-06-sm.jpg", 480, 720],
        ["sprite-07.jpg", "sprite-07-sm.jpg", 480, 720]
      ]
    },
    {
      brand: "TOPS at SPAR",
      photos: [
        ["tops-at-spar-01.jpg", "tops-at-spar-01-sm.jpg", 480, 720],
        ["tops-at-spar-02.jpg", "tops-at-spar-02-sm.jpg", 480, 720],
        ["tops-at-spar-03.jpg", "tops-at-spar-03-sm.jpg", 720, 480],
        ["tops-at-spar-04.jpg", "tops-at-spar-04-sm.jpg", 480, 720],
        ["tops-at-spar-05.jpg", "tops-at-spar-05-sm.jpg", 480, 720],
        ["tops-at-spar-06.jpg", "tops-at-spar-06-sm.jpg", 480, 720],
        ["tops-at-spar-07.jpg", "tops-at-spar-07-sm.jpg", 480, 720]
      ]
    },
    {
      brand: "VELO",
      photos: [
        ["velo-01.jpg", "velo-01-sm.jpg", 480, 720],
        ["velo-02.jpg", "velo-02-sm.jpg", 480, 720],
        ["velo-03.jpg", "velo-03-sm.jpg", 480, 720],
        ["velo-04.jpg", "velo-04-sm.jpg", 480, 720],
        ["velo-05.jpg", "velo-05-sm.jpg", 480, 720],
        ["velo-06.jpg", "velo-06-sm.jpg", 480, 720],
        ["velo-07.jpg", "velo-07-sm.jpg", 480, 720],
        ["velo-08.jpg", "velo-08-sm.jpg", 480, 720],
        ["velo-09.jpg", "velo-09-sm.jpg", 480, 720],
        ["velo-10.jpg", "velo-10-sm.jpg", 480, 720],
        ["velo-11.jpg", "velo-11-sm.jpg", 480, 720]
      ]
    }
  ],

  contact: {
    email: "info@gandgpro.com",
    phone: "010 824 7639"
  }
};
