// NFL Live rosters: starting offensive players per team, taken from public depth charts.
// Depth charts change all the time, so edit this file to match the current roster.
// A slot set to null falls back to a generic name (for example "BUF TE").
// Only names live here. Ratings, jersey numbers and looks in the game are simulated.
const ROSTERS_ASOF = 'October 2026';
const ROSTERS = {
  ATL: { qb: 'Tua Tagovailoa', qb2: 'Michael Penix Jr.', rb: 'Bijan Robinson', wr1: 'Drake London', wr2: 'Jahan Dotson', wr3: 'Olamide Zaccheaus', te: 'Kyle Pitts Sr.' },
  AZ: { qb: 'Jacoby Brissett', qb2: 'Gardner Minshew II', rb: 'Jeremiyah Love', wr1: 'Marvin Harrison Jr.', wr2: 'Michael Wilson', wr3: 'Kendrick Bourne', te: 'Trey McBride' },
  BAL: { qb: 'Lamar Jackson', qb2: 'Tyler Huntley', rb: 'Derrick Henry', wr1: 'Zay Flowers', wr2: 'Rashod Bateman', wr3: 'Devontez Walker', te: 'Mark Andrews' },
  BUF: { qb: 'Josh Allen', qb2: 'Kyle Allen', rb: 'James Cook III', wr1: 'DJ Moore', wr2: 'Khalil Shakir', wr3: 'Joshua Palmer', te: null },
  CAR: { qb: 'Bryce Young', qb2: 'Kenny Pickett', rb: 'Chuba Hubbard', wr1: 'Tetairoa McMillan', wr2: 'Jalen Coker', wr3: 'Xavier Legette', te: 'Tommy Tremble' },
  CHI: { qb: 'Caleb Williams', qb2: 'Tyson Bagent', rb: 'D\'Andre Swift', wr1: 'Rome Odunze', wr2: 'Luther Burden III', wr3: 'Kalif Raymond', te: 'Colston Loveland' },
  CIN: { qb: 'Joe Burrow', qb2: 'Jake Browning', rb: 'Chase Brown', wr1: 'Ja\'Marr Chase', wr2: 'Tee Higgins', wr3: 'Andrei Iosivas', te: 'Drew Sample' },
  CLE: { qb: 'Deshaun Watson', qb2: 'Shedeur Sanders', rb: 'Quinshon Judkins', wr1: 'Jerry Jeudy', wr2: 'KC Concepcion', wr3: 'Denzel Boston', te: 'Harold Fannin Jr.' },
  DAL: { qb: 'Dak Prescott', qb2: 'Joe Milton III', rb: 'Javonte Williams', wr1: 'CeeDee Lamb', wr2: 'George Pickens', wr3: 'Ryan Flournoy', te: 'Jake Ferguson' },
  DEN: { qb: 'Bo Nix', qb2: 'Jarrett Stidham', rb: 'J.K. Dobbins', wr1: 'Courtland Sutton', wr2: 'Jaylen Waddle', wr3: 'Marvin Mims Jr.', te: 'Evan Engram' },
  DET: { qb: 'Jared Goff', qb2: 'Joshua Dobbs', rb: 'Jahmyr Gibbs', wr1: 'Amon-Ra St. Brown', wr2: 'Jameson Williams', wr3: 'Isaac TeSlaa', te: 'Sam LaPorta' },
  GB: { qb: 'Jordan Love', qb2: 'Tyrod Taylor', rb: 'MarShawn Lloyd', wr1: 'Christian Watson', wr2: 'Jayden Reed', wr3: 'Matthew Golden', te: 'Tucker Kraft' },
  HOU: { qb: 'C.J. Stroud', qb2: 'Davis Mills', rb: 'David Montgomery', wr1: 'Nico Collins', wr2: 'Jayden Higgins', wr3: 'Xavier Hutchinson', te: 'Dalton Schultz' },
  IND: { qb: 'Daniel Jones', qb2: 'Anthony Richardson Sr.', rb: 'Jonathan Taylor', wr1: 'Alec Pierce', wr2: 'Josh Downs', wr3: 'Keenan Allen', te: 'Tyler Warren' },
  JAX: { qb: 'Trevor Lawrence', qb2: 'Quinn Ewers', rb: 'Bhayshul Tuten', wr1: 'Parker Washington', wr2: 'Brian Thomas Jr.', wr3: 'Jakobi Meyers', te: 'Brenton Strange' },
  KC: { qb: 'Patrick Mahomes', qb2: 'Justin Fields', rb: 'Kenneth Walker III', wr1: 'Rashee Rice', wr2: 'Xavier Worthy', wr3: 'Tyquan Thornton', te: 'Travis Kelce' },
  LAC: { qb: 'Justin Herbert', qb2: 'Trey Lance', rb: 'Omarion Hampton', wr1: 'Ladd McConkey', wr2: 'Quentin Johnston', wr3: 'Tre\' Harris', te: 'Charlie Kolar' },
  LAR: { qb: 'Matthew Stafford', qb2: 'Stetson Bennett IV', rb: 'Kyren Williams', wr1: 'Puka Nacua', wr2: 'Davante Adams', wr3: 'Jordan Whittington', te: null },
  LV: { qb: 'Kirk Cousins', qb2: 'Fernando Mendoza', rb: 'Ashton Jeanty', wr1: 'Jalen Nailor', wr2: 'Tre Tucker', wr3: 'Jack Bech', te: 'Brock Bowers' },
  MIA: { qb: 'Malik Willis', qb2: 'Kyle McCord', rb: 'De\'Von Achane', wr1: 'Caleb Douglas', wr2: 'Malik Washington', wr3: 'Chris Bell', te: 'Greg Dulcich' },
  MIN: { qb: 'Kyler Murray', qb2: 'Carson Wentz', rb: 'Aaron Jones Sr.', wr1: 'Justin Jefferson', wr2: 'Jordan Addison', wr3: 'Jauan Jennings', te: 'T.J. Hockenson' },
  NE: { qb: 'Drake Maye', qb2: 'Tommy DeVito', rb: 'Rhamondre Stevenson', wr1: 'A.J. Brown', wr2: 'Romeo Doubs', wr3: 'DeMario Douglas', te: 'Hunter Henry' },
  NO: { qb: 'Tyler Shough', qb2: 'Spencer Rattler', rb: 'Travis Etienne Jr.', wr1: 'Chris Olave', wr2: 'Jordyn Tyson', wr3: null, te: null },
  NYG: { qb: 'Jaxson Dart', qb2: 'Jameis Winston', rb: 'Cam Skattebo', wr1: 'Malik Nabers', wr2: 'Darius Slayton', wr3: null, te: 'Isaiah Likely' },
  NYJ: { qb: 'Geno Smith', qb2: 'Cade Klubnik', rb: 'Breece Hall', wr1: 'Garrett Wilson', wr2: 'Adonai Mitchell', wr3: 'Omar Cooper Jr.', te: 'Mason Taylor' },
  PHI: { qb: 'Jalen Hurts', qb2: null, rb: 'Saquon Barkley', wr1: 'DeVonta Smith', wr2: 'Dontayvion Wicks', wr3: 'Makai Lemon', te: 'Dallas Goedert' },
  PIT: { qb: 'Aaron Rodgers', qb2: 'Mason Rudolph', rb: 'Jaylen Warren', wr1: 'DK Metcalf', wr2: 'Michael Pittman Jr.', wr3: 'Germie Bernard', te: 'Pat Freiermuth' },
  SEA: { qb: 'Sam Darnold', qb2: 'Drew Lock', rb: 'Zach Charbonnet', wr1: 'Jaxon Smith-Njigba', wr2: 'Cooper Kupp', wr3: 'Rashid Shaheed', te: 'AJ Barner' },
  SF: { qb: 'Brock Purdy', qb2: 'Mac Jones', rb: 'Christian McCaffrey', wr1: 'Mike Evans', wr2: 'Deebo Samuel', wr3: 'Demarcus Robinson', te: 'George Kittle' },
  TB: { qb: 'Baker Mayfield', qb2: 'Jalon Daniels', rb: 'Bucky Irving', wr1: 'Emeka Egbuka', wr2: 'Chris Godwin', wr3: 'Jalen McMillan', te: 'Cade Otton' },
  TEN: { qb: 'Cam Ward', qb2: 'Mitchell Trubisky', rb: 'Tony Pollard', wr1: 'Calvin Ridley', wr2: 'Carnell Tate', wr3: 'Wan\'Dale Robinson', te: 'Gunnar Helm' },
  WAS: { qb: 'Jayden Daniels', qb2: 'Marcus Mariota', rb: 'Jacory Croskey-Merritt', wr1: 'Terry McLaurin', wr2: 'Stefon Diggs', wr3: 'Dyami Brown', te: 'Chig Okonkwo' },
};
