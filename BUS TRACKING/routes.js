const CAMPUS_ARRIVAL = "7:40 am";

const ROUTES = [
  // ----- R01 to R06 (already have boarding, kept as is) -----
  { no:"R01",  name:"Ennore", depart:"5:50 am", arrive: CAMPUS_ARRIVAL, path:"n01",
    boarding: [
      { stop: "Lift Gate",            time: "5:50 am" },
      { stop: "Wimco Market",         time: "5:55 am" },
      { stop: "Ajax",                 time: "6:00 am" },
      { stop: "Periyar Nagar",        time: "6:03 am" },
      { stop: "Thiruvortiyur Market", time: "6:08 am" },
      { stop: "Theradi",              time: "6:10 am" },
      { stop: "Ellaimman Koil",       time: "6:12 am" },
      { stop: "Raja Kadai",           time: "6:14 am" },
      { stop: "Toll Gate",            time: "6:15 am" },
      { stop: "RIT Campus",           time: "7:40 am" }
    ]
  },
  { no:"R01A", name:"Tondiarpet", depart:"6:17 am", arrive: CAMPUS_ARRIVAL, path:"n01a",
    boarding: [
      { stop: "New Vannarpettai",        time: "6:17 am" },
      { stop: "Apollo",                  time: "6:18 am" },
      { stop: "Tondiarpet",              time: "6:19 am" },
      { stop: "Maharani",                time: "6:21 am" },
      { stop: "Mint",                    time: "6:22 am" },
      { stop: "New Bus Stand Mint",      time: "6:27 am" },
      { stop: "Thirupalli Street",       time: "6:33 am" },
      { stop: "Aminijkarai",             time: "7:00 am" },
      { stop: "Skywalk",                 time: "7:02 am" },
      { stop: "Arumbakkam",              time: "7:07 am" },
      { stop: "Koyambedu Metro",         time: "7:10 am" },
      { stop: "Vengaya Mandi",           time: "7:16 am" },
      { stop: "Ration Stop (Nerkundram)",time: "7:20 am" },
      { stop: "Maduravoyal",             time: "7:21 am" },
      { stop: "Maduravoyal Erikarai",    time: "7:25 am" },
      { stop: "Vanagaram",               time: "7:29 am" },
      { stop: "RIT Campus",              time: "7:40 am" }
    ]
  },
  { no:"R01B", name:"Kasimedu", depart:"6:15 am", arrive: CAMPUS_ARRIVAL, path:"n01b",
    boarding: [
      { stop: "Kasimedu",        time: "6:15 am" },
      { stop: "Kalmandapam",     time: "6:21 am" },
      { stop: "Royapuram Bridge",time: "6:27 am" },
      { stop: "Beach Station",   time: "6:30 am" },
      { stop: "Parry's",         time: "6:34 am" },
      { stop: "Central",         time: "6:37 am" },
      { stop: "Egmore",          time: "6:40 am" },
      { stop: "Dasprakash",      time: "6:44 am" },
      { stop: "Eaga Theatre",    time: "6:48 am" },
      { stop: "Amjikarai Market",time: "6:51 am" },
      { stop: "RIT Campus",      time: "7:40 am" }
    ]
  },
  { no:"R02",  name:"Triplicane", depart:"6:20 am", arrive: CAMPUS_ARRIVAL, path:"n02",
    boarding: [
      { stop: "Chintadripet (Post Office)",       time: "6:20 am" },
      { stop: "D1 Police Station",                time: "6:25 am" },
      { stop: "Triplicane Highway",               time: "6:29 am" },
      { stop: "Ice House Police Station",         time: "6:32 am" },
      { stop: "Meersahibpet Market",              time: "6:35 am" },
      { stop: "Royapettah New College",           time: "6:39 am" },
      { stop: "Sterling Road (Bharath Petrol Bunk)", time: "6:40 am" },
      { stop: "Choolaimedu Subway",               time: "6:43 am" },
      { stop: "Choolaimedu Bus Stop",             time: "6:45 am" },
      { stop: "Anna Arch",                        time: "6:50 am" },
      { stop: "Arumbakkam Panchaliamman Koil",    time: "6:53 am" },
      { stop: "NSK",                              time: "6:55 am" },
      { stop: "Maduravoyal Murugan Store",        time: "6:58 am" },
      { stop: "RIT Campus",                       time: "7:40 am" }
    ]
  },
  { no:"R03",  name:"Choolai", depart:"6:20 am", arrive: CAMPUS_ARRIVAL, path:"n03",
    boarding: [
      { stop: "Pulianthope",              time: "6:20 am" },
      { stop: "Choolai Post Office",      time: "6:25 am" },
      { stop: "Purasaivakkam Doveton",    time: "6:30 am" },
      { stop: "Kellys Signal",            time: "6:33 am" },
      { stop: "Water Tank Road Signal",   time: "6:40 am" },
      { stop: "Kilpauk Garden",           time: "6:45 am" },
      { stop: "Chinthamani",              time: "6:50 am" },
      { stop: "Anna Nagar Roundtana",     time: "6:55 am" },
      { stop: "Thirumangalam Blue Star",  time: "6:57 am" },
      { stop: "VR Mall",                  time: "7:00 am" },
      { stop: "Maduravoyal Ration Shop",  time: "7:10 am" },
      { stop: "RIT Campus",               time: "7:40 am" }
    ]
  },
  { no:"R03A", name:"Collector Nagar", depart:"6:50 am", arrive: CAMPUS_ARRIVAL, path:"n03a",
    boarding: [
      { stop: "Collector Nagar",     time: "6:50 am" },
      { stop: "Golden Flat",         time: "6:55 am" },
      { stop: "Mogappair West Depot",time: "7:00 am" },
      { stop: "Nolambur",            time: "7:03 am" },
      { stop: "MGR University",      time: "7:08 am" },
      { stop: "RIT Campus",          time: "7:40 am" }
    ]
  },
  { no:"R03B", name:"Water Tank", depart:"6:40 am", arrive: CAMPUS_ARRIVAL, path:"n03b",
    boarding: [
      { stop: "Gangaiamman Koil",        time: "6:40 am" },
      { stop: "Madina Masjid",           time: "6:43 am" },
      { stop: "New Avadi Road",          time: "6:45 am" },
      { stop: "Chintamani",              time: "6:50 am" },
      { stop: "Nalli Store",             time: "6:58 am" },
      { stop: "Anna Nagar Metro",        time: "7:05 am" },
      { stop: "Thirumangalam Metro",     time: "7:10 am" },
      { stop: "Nerkundram",              time: "7:15 am" },
      { stop: "Maduravaoyal Ration Shop",time: "7:25 am" },
      { stop: "Maduravoyal Erikarai",    time: "7:27 am" },
      { stop: "RIT Campus",              time: "7:40 am" }
    ]
  },
  { no:"R04",  name:"East Mogappair", depart:"6:30 am", arrive: CAMPUS_ARRIVAL, path:"n04",
    boarding: [
      { stop: "JJ Nagar Police Station", time: "6:30 am" },
      { stop: "HDFC Bank",               time: "6:32 am" },
      { stop: "IOB Bank",                time: "6:35 am" },
      { stop: "7H Bus Depot",            time: "6:40 am" },
      { stop: "Amutha School",           time: "6:50 am" },
      { stop: "D.R. Super Market",       time: "6:52 am" },
      { stop: "Nolambur",                time: "6:55 am" },
      { stop: "Meadows Apartment",       time: "6:57 am" },
      { stop: "MGR University",          time: "7:00 am" },
      { stop: "RIT Campus",              time: "7:40 am" }
    ]
  },
  { no:"R05",  name:"CIT Nagar", depart:"6:10 am", arrive: CAMPUS_ARRIVAL, path:"n05",
    boarding: [
      { stop: "CIT Nagar",           time: "6:10 am" },
      { stop: "Aranganathan Subway", time: "6:12 am" },
      { stop: "Srinivasa Theatre",   time: "6:14 am" },
      { stop: "Metupalayam",         time: "6:16 am" },
      { stop: "Sangamam Hotel",      time: "6:19 am" },
      { stop: "Aryagowda Road",      time: "6:24 am" },
      { stop: "Vivek",               time: "6:29 am" },
      { stop: "Usman Road",          time: "6:34 am" },
      { stop: "RIT Campus",          time: "7:40 am" }
    ]
  },
  { no:"R05A", name:"Loyola College", depart:"6:40 am", arrive: CAMPUS_ARRIVAL, path:"n05a",
    boarding: [
      { stop: "Loyola College",          time: "6:40 am" },
      { stop: "Choolaimedu",             time: "6:45 am" },
      { stop: "Metha Nagar",             time: "6:49 am" },
      { stop: "NSK Nagar",               time: "6:55 am" },
      { stop: "Arumbakkam (SBI Bank)",   time: "7:00 am" },
      { stop: "MMDA Cholan Street",      time: "7:05 am" },
      { stop: "MMDA Vallavan Hotel",     time: "7:10 am" },
      { stop: "CMBT (Koyambedu)",        time: "7:15 am" },
      { stop: "Rohini (Theatre)",        time: "7:18 am" },
      { stop: "Nerkundram Vengaya Mandi",time: "7:22 am" },
      { stop: "Maduravoyal Erikarai",    time: "7:25 am" },
      { stop: "RIT Campus",              time: "7:40 am" }
    ]
  },
  { no:"R06",  name:"Chinmayanagar", depart:"6:10 am", arrive: CAMPUS_ARRIVAL, path:"n06",
    boarding: [
      { stop: "Chinmaiya Nagar",     time: "6:10 am" },
      { stop: "Sai Nagar",           time: "6:12 am" },
      { stop: "Natesan Nagar",       time: "6:13 am" },
      { stop: "Elango Nagar",        time: "6:14 am" },
      { stop: "Virugampakkam",       time: "6:17 am" },
      { stop: "KK Nagar",            time: "6:20 am" },
      { stop: "KK Nagar ESI",        time: "6:27 am" },
      { stop: "Ashok Pillar",        time: "6:32 am" },
      { stop: "Kasi Theatre",        time: "6:37 am" },
      { stop: "Ekkatuthangal",       time: "6:42 am" },
      { stop: "Olympia",             time: "6:43 am" },
      { stop: "Porur Saravana Store",time: "6:55 am" },
      { stop: "RIT Campus",          time: "7:40 am" }
    ],
    stops: [
      { "name": "Chinmaiya Nagar", "lat": 13.06221, "lng": 80.19918 },
      { "name": "RIT", "lat": 13.0379, "lng": 80.0448 }   
    ]
  },

  // ----- R07 to R14 (added boarding from PDF) -----
  { no:"R07",  name:"Santhome", depart:"6:10 am", arrive: CAMPUS_ARRIVAL, path:"n07",
    boarding: [
      { stop: "Mandaveli Bus Depot", time: "6:10 am" },
      { stop: "Pattinapakkam", time: "6:15 am" },
      { stop: "Kutchery Road", time: "6:20 am" },
      { stop: "Luz Corner", time: "6:25 am" },
      { stop: "P.S.Sivasamy Road", time: "6:27 am" },
      { stop: "SIET College", time: "6:32 am" },
      { stop: "Nanthanam Signal", time: "6:37 am" },
      { stop: "Saidapet Vetrinary Hospital", time: "6:42 am" },
      { stop: "Saidapet Bus Stop", time: "6:47 am" },
      { stop: "Guindy", time: "6:49 am" },
      { stop: "Butt Road", time: "6:55 am" },
      { stop: "Chennai Trade Centre", time: "7:10 am" },
      { stop: "Porur", time: "7:15 am" },
      { stop: "Ayyapanthangal", time: "7:18 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R08",  name:"Kovilambakkam", depart:"6:10 am", arrive: CAMPUS_ARRIVAL, path:"n08",
    boarding: [
      { stop: "Kovilampakkam", time: "6:10 am" },
      { stop: "Keelkattalai Bus Stop", time: "6:12 am" },
      { stop: "Madipakkam UTI Bank", time: "6:15 am" },
      { stop: "Madipakkam Koot Road Bus stop", time: "6:16 am" },
      { stop: "Ranga Theatre", time: "6:18 am" },
      { stop: "Nanganallur Chidambaram Stores", time: "6:10 am" },
      { stop: "Nanganallur Saravana Hotel", time: "6:22 am" },
      { stop: "Vanuvampet Church", time: "6:25 am" },
      { stop: "Surendhar Nagar Bus Stop", time: "6:27 am" },
      { stop: "Jayalakshmi Theatre", time: "6:29 am" },
      { stop: "Thillai Ganga Nagar Sub Way", time: "6:32 am" },
      { stop: "Aazar Khana Bus Stop", time: "6:35 am" },
      { stop: "Butt Road", time: "6:37 am" },
      { stop: "Ramavaram", time: "6:39 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R08A", name:"Adambakkam", depart:"6:30 am", arrive: CAMPUS_ARRIVAL, path:"n08a",
    boarding: [
      { stop: "Seasons", time: "6:30 am" },
      { stop: "Kakkan Bridge", time: "6:33 am" },
      { stop: "Adambakkam Bus Depot", time: "6:35 am" },
      { stop: "St Thomas Mount", time: "6:38 am" },
      { stop: "Deepam Foods", time: "6:40 am" },
      { stop: "Maharaja traders", time: "6:45 am" },
      { stop: "Vanuvampet church", time: "6:50 am" },
      { stop: "Thilaiganga nagar subway", time: "6:55 am" },
      { stop: "Butt road", time: "7:00 am" },
      { stop: "Poonamallee", time: "7:35 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R09",  name:"MKB Nagar", depart:"6:00 am", arrive: CAMPUS_ARRIVAL, path:"n09",
    boarding: [
      { stop: "Vyasarpadi", time: "6:00 am" },
      { stop: "MKB Nagar", time: "6:05 am" },
      { stop: "E.B. Stop", time: "6:08 am" },
      { stop: "Kannadhasan Nagar", time: "6:10 am" },
      { stop: "M.R.Nagar", time: "6:13 am" },
      { stop: "lakshmi Amman Nagar", time: "6:22 am" },
      { stop: "B.B.Road", time: "6:26 am" },
      { stop: "Perumbur Market", time: "6:34 am" },
      { stop: "Agaram", time: "6:40 am" },
      { stop: "Peravalur Road", time: "6:42 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R09A", name:"Perambur", depart:"6:30 am", arrive: CAMPUS_ARRIVAL, path:"n09a",
    boarding: [
      { stop: "BB Road", time: "6:30 am" },
      { stop: "Perambur bus stop", time: "6:35 am" },
      { stop: "Perambur Railway station", time: "6:39 am" },
      { stop: "Perambur Church", time: "6:41 am" },
      { stop: "Sembium police station", time: "6:43 am" },
      { stop: "Gandhi Salai", time: "6:45 am" },
      { stop: "Venus mall", time: "6:47 am" },
      { stop: "Retteri", time: "6:50 am" },
      { stop: "Senthil Nagar", time: "6:55 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R10",  name:"Thachoor", depart:"5:50 am", arrive: CAMPUS_ARRIVAL, path:"n10",
    boarding: [
      { stop: "Thachoor", time: "5:50 am" },
      { stop: "Panjetty", time: "5:52 am" },
      { stop: "Janappanchatram Bypass", time: "5:55 am" },
      { stop: "Karanodai Bypass", time: "5:58 am" },
      { stop: "Vijaya Nallur", time: "6:03 am" },
      { stop: "Toll Gate", time: "6:05 am" },
      { stop: "Padianallur", time: "6:07 am" },
      { stop: "Red Hills (GRT)", time: "6:10 am" },
      { stop: "Red Hills Market", time: "6:12 am" },
      { stop: "Kavangarai", time: "6:15 am" },
      { stop: "Puzhal Jail", time: "6:17 am" },
      { stop: "Puzhal Camp", time: "6:20 am" },
      { stop: "Velammal college", time: "6:25 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R11",  name:"Chengalpattu", depart:"6:00 am", arrive: CAMPUS_ARRIVAL, path:"n11",
    boarding: [
      { stop: "Chengalpattu Rattinakinaru", time: "6:00 am" },
      { stop: "New Bus Stand", time: "6:02 am" },
      { stop: "Old Bus Stand", time: "6:04 am" },
      { stop: "Chengalpattu Bypass", time: "6:07 am" },
      { stop: "SP Kovil", time: "6:18 am" },
      { stop: "MM Nagar Samiyar Gate", time: "6:23 am" },
      { stop: "MM Nagar Bus Stand", time: "6:28 am" },
      { stop: "KattanKulathur", time: "6:30 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ],
    stops: [
      { "name": "Chengalpattu Rattinakinaru", "lat": 12.6842, "lng": 79.9833 },
      { "name": "New Bus Stand", "lat": 12.6913, "lng": 79.9807 },
      { "name": "Old Bus Stand", "lat": 12.6967, "lng": 79.9768 },
      { "name": "Chengalpattu Bypass", "lat": 12.7001, "lng": 79.9684 },
      { "name": "SP Kovil", "lat": 12.7628, "lng":  80.0039 },
      { "name": "MM Nagar Samiyar Gate", "lat": 12.7945, "lng": 80.0197 },
      { "name": "MM Nagar Bus Stand","lat": 12.7999, "lng": 80.0231 },
      { "name": "KattanKulathur", "lat": 12.8089, "lng": 80.0291 },
      { "name": "RIT Campus", "lat": 13.0379, "lng": 80.0448 }


    ]
  },
  { no:"R11A", name:"Guduvanchery", depart:"6:30 am", arrive: CAMPUS_ARRIVAL, path:"n11a",
    boarding: [
      { stop: "Guduvanchery", time: "6:30 am" },
      { stop: "Urapakkam", time: "6:35 am" },
      { stop: "Vandalur", time: "6:40 am" },
      { stop: "Perungalathur", time: "6:45 am" },
      { stop: "Vandalur Bridge", time: "6:55 am" },
      { stop: "Mannivakkam", time: "7:05 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R12",  name:"Minjur", depart:"5:45 am", arrive: CAMPUS_ARRIVAL, path:"n12",
    boarding: [
      { stop: "Minjur Bus Stand", time: "5:45 am" },
      { stop: "Minjur Railway Station", time: "5:50 am" },
      { stop: "BDO Office", time: "5:52 am" },
      { stop: "Nandiyambakkam", time: "5:54 am" },
      { stop: "Pattamandiri", time: "6:00 am" },
      { stop: "Napalayam", time: "6:05 am" },
      { stop: "Manali Pudhu nagar", time: "6:08 am" },
      { stop: "Manali Market", time: "6:15 am" },
      { stop: "MMDA 3rd Main Road", time: "6:18 am" },
      { stop: "Mathur", time: "6:22 am" },
      { stop: "Veterinary Hospital", time: "6:25 am" },
      { stop: "Madhavaram Milk Colony", time: "6:28 am" },
      { stop: "Arul Nagar", time: "6:30 am" },
      { stop: "Thapalpetti", time: "6:32 am" },
      { stop: "Moolakadai", time: "6:38 am" },
      { stop: "Kalpana Lamp", time: "6:45 am" },
      { stop: "Madhavaram Roundana", time: "6:47 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R13",  name:"Vyasarpadi", depart:"6:10 am", arrive: CAMPUS_ARRIVAL, path:"n13",
    boarding: [
      { stop: "Ganeshapuram", time: "6:10 am" },
      { stop: "G3 Police Station", time: "6:15 am" },
      { stop: "Pattalam", time: "6:18 am" },
      { stop: "Otteri", time: "6:20 am" },
      { stop: "Podi Kadai", time: "6:23 am" },
      { stop: "T.B.Hospital", time: "6:25 am" },
      { stop: "Ayanawaram Signal", time: "6:27 am" },
      { stop: "Sayyani", time: "6:30 am" },
      { stop: "Ayanawaram Noor Hotel", time: "6:33 am" },
      { stop: "Joint Office", time: "6:35 am" },
      { stop: "Ayanawaram Railway Quarters", time: "6:37 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R13A", name:"ICF", depart:"6:45 am", arrive: CAMPUS_ARRIVAL, path:"n13a",
    boarding: [
      { stop: "ICF Signal", time: "6:45 am" },
      { stop: "Villivakkam Bus Stand", time: "6:50 am" },
      { stop: "Korattur Signal", time: "6:55 am" },
      { stop: "Nolambur Signal", time: "7:05 am" },
      { stop: "Vanagaram", time: "7:15 am" },
      { stop: "Velappanchavadi", time: "7:23 am" },
      { stop: "Poonamallee Bypass", time: "7:30 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R14",  name:"Thiruvallur", depart:"6:25 am", arrive: CAMPUS_ARRIVAL, path:"n14",
    boarding: [
      { stop: "Sevapetai", time: "6:25 am" },
      { stop: "Kakkalur", time: "6:30 am" },
      { stop: "Poonga Nagar", time: "6:35 am" },
      { stop: "GRT", time: "6:50 am" },
      { stop: "Manavalanagar Signal", time: "6:55 am" },
      { stop: "Manavalanagar Railway Station", time: "6:57 am" },
      { stop: "Putlur", time: "7:10 am" },
      { stop: "Aranvoyal", time: "7:15 am" },
      { stop: "Puthuchatram (India Japan Company)", time: "7:20 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R14A", name:"Kakkalur", depart:"6:55 am", arrive: CAMPUS_ARRIVAL, path:"n14a",
    boarding: [
      { stop: "Kakkalur Signal", time: "6:55 am" },
      { stop: "SBI Bank", time: "6:58 am" },
      { stop: "Vellavedu", time: "7:20 am" },
      { stop: "Thirumazhisai", time: "7:25 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },

  // ----- R15 (already has boarding and stops, keep unchanged) -----
  { no:"R15",  name:"Cheyyar", depart:"6:00 am", arrive: CAMPUS_ARRIVAL, path:"n15",
    boarding: [
      { stop: "Kanchipuram",           time: "6:00 am" },
      { stop: "Aayangarkulam",         time: "6:00 am" },
      { stop: "Housing Board",         time: "6:05 am" },
      { stop: "Collector Office",      time: "6:07 am" },
      { stop: "Rangasamy Kulam",       time: "6:15 am" },
      { stop: "RIT Campus",            time: "7:40 am" }
    ],
    stops: [
      { "name": "Cheyyar", "lat": 12.6647, "lng": 79.5403 },
      { "lat": 12.6661, "lng": 79.5513, "visible": false },
      { "lat": 12.6671, "lng": 79.5585, "visible": false },
      { "lat": 12.7277, "lng": 79.6723, "visible": false },
      { "name": "Ayyangarkulam", "lat": 12.7836, "lng": 79.6772 },
      { "name": "Housing Board", "lat": 12.8188, "lng": 79.6938 },
      { "name": "Collector Office", "lat": 12.8226, "lng": 79.6992 },
      { "lat": 12.8240, "lng": 79.7009, "visible": false },
      { "lat": 12.8257, "lng": 79.7038, "visible": false },
      { "lat": 12.8298, "lng": 79.7037, "visible": false },
      { "name": "Rangasamy Kulam", "lat": 12.8267, "lng": 79.7081 },
      { "lat": 12.8348, "lng": 79.7115, "visible": false },
      { "lat": 12.8364, "lng": 79.7064, "visible": false },
      { "lat": 12.8406, "lng": 79.7071, "visible": false },
      { "lat": 12.8424, "lng": 79.7030, "visible": false },
      { "lat": 12.8710, "lng": 79.7084, "visible": false },
      { "lat": 12.8728, "lng": 79.7030, "visible": false },
      { "lat": 12.8713, "lng": 79.7090, "visible": false },
      { "name": "Poonamallee Side", "lat": 13.0379, "lng": 80.0448 }
    ]
  },

  { no:"R15A", name:"Orikkai", depart:"6:15 am", arrive: CAMPUS_ARRIVAL, path:"n15a",
    boarding: [
      { stop: "Orikkai", time: "6:15 am" },
      { stop: "JJ Nagar", time: "6:17 am" },
      { stop: "Keerai Mandapam", time: "6:20 am" },
      { stop: "Tollgate", time: "6:23 am" },
      { stop: "Pachaiyappa's College", time: "6:30 am" },
      { stop: "Ayyampettai", time: "6:32 am" },
      { stop: "Rajampettai", time: "6:40 am" },
      { stop: "Walajabad", time: "6:50 am" },
      { stop: "Natha nallur", time: "7:00 am" },
      { stop: "Panrutti", time: "7:03 am" },
      { stop: "Oragadam", time: "7:12 am" },
      { stop: "Arun Excello", time: "7:15 am" },
      { stop: "Sriperumbudur High School", time: "7:20 am" },
      { stop: "Sriperumbudur Tollgate", time: "7:25 am" },
      { stop: "Irungattukottai bus stand", time: "7:30 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R16",  name:"Neelangkarai", depart:"6:10 am", arrive: CAMPUS_ARRIVAL, path:"n16",
    boarding: [
      { stop: "Prathana Theatre", time: "6:10 am" },
      { stop: "Vetuvankeni", time: "6:15 am" },
      { stop: "Thiruvanmiyur RTO Office", time: "6:20 am" },
      { stop: "Adyar Depot", time: "6:29 am" },
      { stop: "Madyakailash", time: "6:35 am" },
      { stop: "Guindy", time: "6:42 am" },
      { stop: "Mugalivakkam", time: "6:55 am" },
      { stop: "Karayanchavadi", time: "7:10 am" },
      { stop: "Poonamallee Bus Stand", time: "7:15 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R16A", name:"Guindy", depart:"6:45 am", arrive: CAMPUS_ARRIVAL, path:"n16a",
    boarding: [
      { stop: "Butt Road", time: "6:45 am" },
      { stop: "Nandambakkam", time: "6:48 am" },
      { stop: "Ramapuram Signal", time: "6:52 am" },
      { stop: "DLF", time: "6:55 am" },
      { stop: "Mugalivakkam", time: "7:00 am" },
      { stop: "Saravana Store", time: "7:03 am" },
      { stop: "Poonamallee Depot", time: "7:25 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R16B", name:"Sholinganallur", depart:"6:10 am", arrive: CAMPUS_ARRIVAL, path:"n16b",
    boarding: [
      { stop: "Sholinganallur", time: "6:10 am" },
      { stop: "Karapakkam", time: "6:16 am" },
      { stop: "Karapakkam - TCS", time: "6:19 am" },
      { stop: "PTC (KFC)", time: "6:24 am" },
      { stop: "Mettukuppam", time: "6:26 am" },
      { stop: "Selaiyur", time: "6:56 am" },
      { stop: "MCC", time: "6:59 am" },
      { stop: "Kulakarai street", time: "7:05 am" },
      { stop: "Krishna Nagar", time: "7:07 am" },
      { stop: "Bharathi Nagar", time: "7:08 am" },
      { stop: "Madanapuram", time: "7:13 am" },
      { stop: "Nazarathpettai", time: "7:34 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R17",  name:"Valluvarkottam", depart:"6:15 am", arrive: CAMPUS_ARRIVAL, path:"n17",
    boarding: [
      { stop: "Valluvarkottam", time: "6:15 am" },
      { stop: "Liberty", time: "6:20 am" },
      { stop: "Power House", time: "6:25 am" },
      { stop: "Lakshman Sruthi", time: "6:30 am" },
      { stop: "Thai Sathya", time: "6:35 am" },
      { stop: "Virugambakkam", time: "6:40 am" },
      { stop: "Alwar Thirunagar", time: "6:42 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R17A", name:"Valasaravakkam", depart:"6:45 am", arrive: CAMPUS_ARRIVAL, path:"n17a",
    boarding: [
      { stop: "Valasaravakkam Shivan Koil", time: "6:45 am" },
      { stop: "Valasaravakkam", time: "6:50 am" },
      { stop: "Saravana Bhavan Hotel", time: "6:53 am" },
      { stop: "Lakshmi Nagar", time: "6:55 am" },
      { stop: "Porur Bridge", time: "7:00 am" },
      { stop: "Iyyappanthangal", time: "7:05 am" },
      { stop: "Kattupakkam", time: "7:10 am" },
      { stop: "Kumanachavadi", time: "7:15 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },

  // ----- R18 to R18B (R18A already has boarding, R18B added) -----
  { no:"R18",  name:"Pallikaranai", depart:"6:15 am", arrive: CAMPUS_ARRIVAL, path:"n18",
    boarding: [
      { stop: "Pallikaranai", time: "6:15 am" },
      { stop: "Oil Mill", time: "6:16 am" },
      { stop: "Jeyachandran", time: "6:18 am" },
      { stop: "Medavakkam Nilgris", time: "6:20 am" },
      { stop: "Medavakkam Koot Road", time: "6:21 am" },
      { stop: "Santhosapuram", time: "6:25 am" },
      { stop: "Tambaram", time: "6:40 am" },
      { stop: "Lakshmi Nagar", time: "6:45 am" },
      { stop: "Mudichur", time: "6:50 am" },
      { stop: "Padmavathy Kalyana Mandam", time: "6:52 am" },
      { stop: "Mathanapuram", time: "7:00 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R18A", name:"Sembakkam", depart:"6:25 am", arrive: CAMPUS_ARRIVAL, path:"n18a",
    boarding: [
      { stop: "Sembakkam",             time: "6:25 am" },
      { stop: "Kamarajapuram",         time: "6:30 am" },
      { stop: "Rajakilpakkam Signal",  time: "6:32 am" },
      { stop: "Camproad",              time: "6:35 am" },
      { stop: "Tambaram Sanatorium",   time: "6:50 am" },
      { stop: "Chrompet",              time: "6:55 am" },
      { stop: "Thirumeermalai",        time: "7:00 am" },
      { stop: "RIT Campus",            time: "7:40 am" }
    ],
    stops: [
      { "name": "Sembakkam", "lat": 12.9232, "lng": 80.1602 },
      { "name": "Kamarajapuram ", "lat": 12.9234, "lng": 80.1550 },
      { "name": "Rajakilpakkam", "lat": 12.9226, "lng": 80.1518 },
      { "name": "Camp Road", "lat": 12.9224, "lng": 80.1429 },
      { "lat": 12.9244, "lng": 80.1152, "visible": false },
      { "name": "Tambaram Sanatorium", "lat": 12.9366, "lng": 80.1274 },
      { "name": "Chrompet Bus Stand", "lat": 12.9512, "lng": 80.1398 },
      { "name": "Thiruneermalai Road", "lat": 12.9612, "lng": 80.1455 },
      { "lat":12.9584, "lng":80.1188, "visible": false },
      { "name": "Poonamallee Side", "lat": 13.0379, "lng": 80.0448 }
    ]
  },
  { no:"R18B", name:"Kelambakkam", depart:"6:00 am", arrive: CAMPUS_ARRIVAL, path:"n18b",
    boarding: [
      { stop: "Kelambakkam - GH", time: "6:00 am" },
      { stop: "Pudupakkam", time: "6:10 am" },
      { stop: "Mambakkam (Samathuvapuram)", time: "6:15 am" },
      { stop: "Mambakkam Kulam", time: "6:25 am" },
      { stop: "Ponmar", time: "6:30 am" },
      { stop: "Sithalapakkam", time: "6:35 am" },
      { stop: "Private Parking", time: "6:45 am" },
      { stop: "Santhosapuram", time: "6:50 am" },
      { stop: "Kamarajapuram", time: "7:00 am" },
      { stop: "Kishkinta Kulam", time: "7:15 am" },
      { stop: "Old Perungalathur", time: "7:20 am" },
      { stop: "Mudichur Bypass", time: "7:25 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },

  // ----- R19 to R29B (added boarding) -----
  { no:"R19",  name:"Poombukar", depart:"6:10 am", arrive: CAMPUS_ARRIVAL, path:"n19",
    boarding: [
      { stop: "Poombukar", time: "6:10 am" },
      { stop: "Ganga Cinima", time: "6:25 am" },
      { stop: "Donbosco", time: "6:28 am" },
      { stop: "Poombukar", time: "6:30 am" },
      { stop: "Korattur Bus Stop", time: "6:55 am" },
      { stop: "Padi Britania", time: "6:58 am" },
      { stop: "TVS Show Room", time: "7:10 am" },
      { stop: "Ambattur", time: "7:12 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R19A", name:"Vinayagapuram", depart:"6:45 am", arrive: CAMPUS_ARRIVAL, path:"n19a",
    boarding: [
      { stop: "Vinayagapuram Bus Stand", time: "6:45 am" },
      { stop: "Retteri RTO Office", time: "6:55 am" },
      { stop: "Retteri", time: "6:58 am" },
      { stop: "Senthil Nagar", time: "7:00 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R20",  name:"Vepampattu", depart:"6:30 am", arrive: CAMPUS_ARRIVAL, path:"n20",
    boarding: [
      { stop: "Vepampattu Railway Station", time: "6:30 am" },
      { stop: "Madha Kovir", time: "6:32 am" },
      { stop: "Eswar Nagar", time: "6:33 am" },
      { stop: "Indian Bank Thiruvninravur", time: "6:35 am" },
      { stop: "Thiruninravur Railway Station", time: "6:36 am" },
      { stop: "Thiruninravur Bridge", time: "6:37 am" },
      { stop: "Jaya College", time: "6:39 am" },
      { stop: "Nemilicherri Road", time: "6:40 am" },
      { stop: "Pattabiram Gandhi Nagar", time: "6:41 am" },
      { stop: "Pattabiram Vasantha Mandapam", time: "6:42 am" },
      { stop: "Sekkadu Bus Stand", time: "6:45 am" },
      { stop: "Avadi Ponnu Store", time: "6:50 am" },
      { stop: "Avadi J.P.Garden", time: "6:52 am" },
      { stop: "Govarthanagiri Bus Stand", time: "6:55 am" },
      { stop: "Chennirkuppam", time: "7:05 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R21",  name:"Ayyapakkam", depart:"6:15 am", arrive: CAMPUS_ARRIVAL, path:"n21",
    boarding: [
      { stop: "Ayappakkam Parking", time: "6:15 am" },
      { stop: "Ayappakkam SBI ATM", time: "6:17 am" },
      { stop: "Ayappakkam Petrol Bunk", time: "6:20 am" },
      { stop: "ICF Church", time: "6:22 am" },
      { stop: "Canara Bank", time: "6:27 am" },
      { stop: "Singapore Shopping", time: "6:32 am" },
      { stop: "Senneerkuppam", time: "7:05 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R22",  name:"Thiruthani", depart:"5:55 am", arrive: CAMPUS_ARRIVAL, path:"n22",
    boarding: [
      { stop: "Thiruthani Bypass", time: "5:55 am" },
      { stop: "Thiruvallur Bypass X Road", time: "6:00 am" },
      { stop: "Nagalamman Nagar", time: "6:08 am" },
      { stop: "Krishna Poly", time: "6:10 am" },
      { stop: "Jothi Nagar", time: "6:12 am" },
      { stop: "Indira Gandhi Nagar", time: "6:15 am" },
      { stop: "Swalpetaih", time: "6:16 am" },
      { stop: "Government Hospital", time: "6:17 am" },
      { stop: "Old Bus stand", time: "6:18 am" },
      { stop: "Railway Station", time: "6:20 am" },
      { stop: "New Bus Stand", time: "6:22 am" },
      { stop: "Navy Gate", time: "6:30 am" },
      { stop: "Venkatesapuram", time: "6:31 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R22A", name:"SR Gate", depart:"6:30 am", arrive: CAMPUS_ARRIVAL, path:"n22a",
    boarding: [
      { stop: "SR Gate", time: "6:30 am" },
      { stop: "Thakkolam Koot Road", time: "6:40 am" },
      { stop: "Thakkolam", time: "6:44 am" },
      { stop: "Marimangalam", time: "6:50 am" },
      { stop: "Narasimapuram", time: "6:55 am" },
      { stop: "Perambakkam", time: "7:05 am" },
      { stop: "Koovam Bus Stop", time: "7:08 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R23",  name:"K4 Police Station", depart:"6:35 am", arrive: CAMPUS_ARRIVAL, path:"n23",
    boarding: [
      { stop: "Nathamuni Theatre", time: "6:35 am" },
      { stop: "K4 Police Station", time: "6:40 am" },
      { stop: "Labour officers Quarters", time: "6:52 am" },
      { stop: "Vijaya Maruthi (Nuts & Spices)", time: "6:44 am" },
      { stop: "Udayam colony", time: "6:46 am" },
      { stop: "Kambar Colony", time: "6:48 am" },
      { stop: "Anna Nagar West Depot", time: "6:50 am" },
      { stop: "Thirumangalam Bridge", time: "6:52 am" },
      { stop: "Thirumangalam Waves", time: "6:56 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R24",  name:"Arcot", depart:"5:25 am", arrive: CAMPUS_ARRIVAL, path:"n24",
    boarding: [
      { stop: "Arcot Bus Stand", time: "5:25 am" },
      { stop: "Muthukadai", time: "5:30 am" },
      { stop: "VC Motor", time: "5:33 am" },
      { stop: "Walajapettai", time: "5:35 am" },
      { stop: "Arignar Anna Gov College", time: "5:37 am" },
      { stop: "Walajapettai Toll gate", time: "5:40 am" },
      { stop: "Kaveripakkam", time: "5:45 am" },
      { stop: "Perumpullipakkam", time: "6:00 am" },
      { stop: "Vinayagapuram (KPM)", time: "6:20 am" },
      { stop: "Olimugamathu Pettai(Gori)", time: "6:22 am" },
      { stop: "Egambarathanar Koil", time: "6:25 am" },
      { stop: "Kachapeswarar Koil", time: "6:28 am" },
      { stop: "Pookadai chatram", time: "6:32 am" },
      { stop: "Kammal Street", time: "6:35 am" },
      { stop: "Indra Nagar (KPM Railwaygate)", time: "6:37 am" },
      { stop: "Ponnerikarai", time: "6:40 am" },
      { stop: "Santhavellore", time: "7:05 am" },
      { stop: "Sungawarchthram", time: "7:10 am" },
      { stop: "Vadamangalam", time: "7:20 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R25",  name:"Kallikuppam", depart:"6:45 am", arrive: CAMPUS_ARRIVAL, path:"n25",
    boarding: [
      { stop: "Kallikuppam", time: "6:45 am" },
      { stop: "Stedford Hospital", time: "6:50 am" },
      { stop: "Saraswathy Nagar Indian oil petrol bunk", time: "6:54 am" },
      { stop: "Manigandapuram", time: "6:56 am" },
      { stop: "Thirumullaiyoyal Junction", time: "6:58 am" },
      { stop: "Vaishnavi Nagar", time: "7:00 am" },
      { stop: "Murugappa Polytechnic", time: "7:02 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R25A", name:"Pudur", depart:"6:45 am", arrive: CAMPUS_ARRIVAL, path:"n25a",
    boarding: [
      { stop: "Pudur", time: "6:45 am" },
      { stop: "Oragadam HP Pump", time: "6:47 am" },
      { stop: "PTR Mahal", time: "6:50 am" },
      { stop: "Ponnu Supermarket", time: "6:53 am" },
      { stop: "Govardhanagari", time: "7:15 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R26",  name:"Andarkuppam", depart:"6:35 am", arrive: CAMPUS_ARRIVAL, path:"n26",
    boarding: [
      { stop: "Andarkuppam", time: "6:35 am" },
      { stop: "Kundrathur", time: "6:40 am" },
      { stop: "Kundrathur Thandalam", time: "6:43 am" },
      { stop: "Kovur", time: "6:45 am" },
      { stop: "Gerugambakkam", time: "6:50 am" },
      { stop: "Bai Kadai", time: "6:53 am" },
      { stop: "Mathanandapuram", time: "6:55 am" },
      { stop: "Venkateswara Nagar", time: "6:58 am" },
      { stop: "Porur", time: "7:05 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
    ,
    stops: [
      { name: "Andarkuppam",          lat: 13.006120, lng: 80.083980, time: "6:35 am" },
      { name: "Kundrathur",           lat: 13.000365, lng: 80.097829, time: "6:40 am" },
      { name: "Kundrathur Thandalam", lat: 13.003495, lng: 80.099935, time: "6:43 am" },
      { name: "Kovur E.B. Office",    lat: 13.010741, lng: 80.114254, time: "6:45 am" },
      { name: "Kovur",                lat: 13.011811, lng: 80.126883, time: "6:47 am" },
      { name: "Gerugambakkam",        lat: 13.015559, lng: 80.136591, time: "6:50 am" },
      { name: "Bai Kadai",            lat: 13.019217, lng: 80.142373, time: "6:53 am" },
      { name: "Mathanandapuram",      lat: 13.023303, lng: 80.146498, time: "6:55 am" },
      { name: "Venkateswara Nagar",   lat: 13.028225, lng: 80.151160, time: "6:58 am" },
      { name: "Porur",                lat: 13.034284, lng: 80.155534, time: "7:05 am" },
      { name: "RIT Campus",           lat: 13.037900, lng: 80.044800, time: "7:40 am" }
    ]
  },
  
  { no:"R27",  name:"Avadi", depart:"6:25 am", arrive: CAMPUS_ARRIVAL, path:"n27",
    boarding: [
      { stop: "Ajeva Stadium", time: "6:25 am" },
      { stop: "HVF", time: "6:28 am" },
      { stop: "CRP", time: "6:32 am" },
      { stop: "Mitnamalli", time: "6:35 am" },
      { stop: "Muthapudupet", time: "6:40 am" },
      { stop: "Sasthri Nagar", time: "6:45 am" },
      { stop: "Avadi Checkpost", time: "6:55 am" },
      { stop: "Rama Rathna Theatre", time: "7:06 am" },
      { stop: "Avadi mankoil", time: "7:10 am" },
      { stop: "Vasantham Nagar", time: "7:12 am" },
      { stop: "Kovarthanagiri", time: "7:14 am" },
      { stop: "Kendra vihar", time: "7:15 am" },
      { stop: "Kaduveti", time: "7:17 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R27A", name:"Kollumedu", depart:"6:30 am", arrive: CAMPUS_ARRIVAL, path:"n27a",
    boarding: [
      { stop: "Kollumedu", time: "6:30 am" },
      { stop: "Vel Tech College", time: "6:40 am" },
      { stop: "Kovilpathagai", time: "6:45 am" },
      { stop: "Ajeya Stadium", time: "6:50 am" },
      { stop: "CRPF", time: "6:55 am" },
      { stop: "Mittanemili", time: "7:00 am" },
      { stop: "Palavedu Service Road", time: "7:10 am" },
      { stop: "Nemilichery Tollgate", time: "7:15 am" },
      { stop: "Chithukadu Blue", time: "7:25 am" },
      { stop: "Panimalar Tollgate", time: "7:30 am" },
      { stop: "Chembarambakkam", time: "7:37 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R28",  name:"Agaram", depart:"6:20 am", arrive: CAMPUS_ARRIVAL, path:"n28",
    boarding: [
      { stop: "Agaram", time: "6:20 am" },
      { stop: "Periyar Nagar", time: "6:22 am" },
      { stop: "Thiruvalluvar Thirumanamandapam", time: "6:24 am" },
      { stop: "Permal Koil", time: "6:26 am" },
      { stop: "Kamban Nagar", time: "6:28 am" },
      { stop: "E.B", time: "6:30 am" },
      { stop: "Shanmugam Mahal", time: "6:32 am" },
      { stop: "Senthil Nagar", time: "6:35 am" },
      { stop: "Thathankuppam", time: "6:38 am" },
      { stop: "Kalyan Jewalrs", time: "6:45 am" },
      { stop: "Collector Nagar", time: "6:47 am" },
      { stop: "Cheriyan Hospital", time: "6:48 am" },
      { stop: "Golden Flats", time: "6:50 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R29",  name:"Velachery", depart:"6:10 am", arrive: CAMPUS_ARRIVAL, path:"n29",
    boarding: [
      { stop: "Vijayanagar Bus Stand", time: "6:10 am" },
      { stop: "Kaiveli", time: "6:15 am" },
      { stop: "kamachi Hospital", time: "6:17 am" },
      { stop: "Pallavaram Singapore Shopping", time: "6:30 am" },
      { stop: "Krishna nagar", time: "6:33 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R29A", name:"Pammal", depart:"6:35 am", arrive: CAMPUS_ARRIVAL, path:"n29a",
    boarding: [
      { stop: "Pammal", time: "6:35 am" },
      { stop: "Arunmathi theatre", time: "6:37 am" },
      { stop: "Anagaputhur", time: "6:39 am" },
      { stop: "Manikandan Nagar", time: "6:41 am" },
      { stop: "Karima Nagar", time: "6:45 am" },
      { stop: "Kundrathur (theradi)", time: "6:48 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  },
  { no:"R29B", name:"Sivanthangal", depart:"7:05 am", arrive: CAMPUS_ARRIVAL, path:"n29b",
    boarding: [
      { stop: "Sivanthangal", time: "7:05 am" },
      { stop: "Muthukumaran College", time: "7:10 am" },
      { stop: "Pattu Koot Road", time: "7:13 am" },
      { stop: "Mangadu", time: "7:15 am" },
      { stop: "Kankaiyamman Kovil", time: "7:20 am" },
      { stop: "MGR Nagar", time: "7:23 am" },
      { stop: "Kumananchavadi", time: "7:25 am" },
      { stop: "Aravind Hospital", time: "7:30 am" },
      { stop: "RIT Campus", time: "7:40 am" }
    ]
  }
];