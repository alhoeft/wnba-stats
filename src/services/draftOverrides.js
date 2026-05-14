// Manual draft year overrides for players the ESPN API is missing data for.
// For undrafted/international players, we use their first WNBA season as their class year.
// Key = ESPN athlete ID, Value = WNBA draft/entry year.
export const DRAFT_YEAR_OVERRIDES = {
  // 2009
  '869':     2009, // DeWanna Bonner
  // 2010
  '924':     2010, // Alysha Clark
  // 2011
  '981':     2011, // Courtney Vandersloot
  '1004':    2011, // Sydney Colson
  // 2012
  '1054':    2012, // Tiffany Hayes
  '1107':    2012, // Shey Peddy
  // 2013
  '2491205': 2013, // Skylar Diggins
  '2491214': 2013, // Erica Wheeler
  // 2014
  '2529047': 2014, // Odyssey Sims
  '2529125': 2014, // Haley Peters
  '2529130': 2014, // Natasha Howard
  '2529140': 2014, // Alyssa Thomas
  '2529183': 2014, // Stefanie Dolson
  '2529205': 2014, // Kayla McBride
  '2529567': 2014, // Robyn Parks
  '2529622': 2014, // Kayla Thornton
  // 2015
  '2529458': 2015, // Cheyenne Parker-Tyus
  '2566081': 2015, // Elizabeth Williams
  '2566106': 2015, // Dearica Hamby
  '2591976': 2015, // Crystal Bradford
  // 2016
  '2987891': 2016, // Courtney Williams
  '2998927': 2016, // Moriah Jefferson
  '2998938': 2016, // Kahleah Copper
  '2999101': 2016, // Jonquel Jones
  // 2017
  '2984111': 2017, // Alexis Prince
  '3054590': 2017, // Nia Coffey
  '3058895': 2017, // Brionna Jones
  '2284331': 2017, // Emma Cannon
  // 2018
  '3056730': 2018, // Karlie Samuelson
  '3065570': 2017, // Kelsey Plum
  '3142010': 2018, // Azura Stevens
  '3142087': 2018, // Kathryn Westbeld
  '3142255': 2018, // Monique Billings
  // 2019
  '3906753': 2019, // Natisha Hiedeman
  '3906972': 2019, // Bridget Carleton
  '3916514': 2019, // Kalani Brown
  // 2024
  '4066527': 2024, // Jaelyn Brown
  '4433386': 2024, // Jaylyn Sherrod
  // 2025
  '4399342': 2025, // Lexi Held
  '4433510': 2025, // Megan McConnell
  '4704417': 2025, // Ajae Petty
  '4790264': 2025, // Janelle Salaun
  '3142242': 2025, // Amy Okonkwo
  '4595150': 2025, // Camryn Taylor
  '3904548': 2025, // Kyra Lambert
  '5278686': 2025, // Kariata Diaby
  '5220147': 2025, // Marieme Badiane
  '5220167': 2025, // Murjanatu Musa

  // International players — entry year used as class year
  '3102133': 2015, // Rebecca Allen
  '887':     2016, // Sami Whitcomb
  '4257500': 2016, // Cecilia Zandalasini (actual draft year)
  '3142328': 2018, // Gabby Williams
  '3099736': 2018, // Stephanie Talbot
  '2569044': 2018, // Temi Fagbenle (actual draft year)
  '4038379': 2021, // Marine Johannes
  '4336633': 2022, // Li Yueru
  '2327695': 2022, // Rebekah Gardner
  '2566110': 2023, // Julie Vanloo
  '5209660': 2023, // Sevgi Uzun
  '4280877': 2024, // Chloe Bibby
  '4873359': 2024, // Kyara Linskens
  '5279789': 2024, // Mamignan Toure
  '5274110': 2024, // Monique Akoa Makani
  '2325299': 2024, // Yvonne Anderson
};
