const names = [
  'James', 'Mike', 'Jim', 'Saturn', 'Sun', 'Viper', 'Dodge', 'Captain', 'Boa',
  'Joe', 'Sami', 'Ahmed', 'Fathi', 'Shamir', 'Jean',
  'Vlad', 'Kao', 'George', 'Billel', 'Kamel', 'Haikel',
  'Khaled', 'Ramzi', 'Carlos', 'Loa', 'Paolo', 'Salah', 'Mandi',
  'Saif', 'Wahbi', 'Pirko', 'John', 'Vidka', 'Malony', 'Messi', 'Ronaldo',
  'Mario', 'Khabib', 'Pedri', 'Maldini', 'Dybala', 'Simeone', 'Pogba', 'Hakimi',
  'Benzema', 'Cezar', 'Tevez', 'Ambrosini', 'Nesta', 'Stam', 'Lion', 'Tiger', 'Moon',
  'Eros', 'Geographos', 'Hathor', 'Hermes', 'Icarus', 'Pallas', 'Trojan', 'asteroids', 'Vesta',
  'Mercury', 'Venus', 'Earth', 'Mars', ' Jupiter', 'Saturn', 'Uranus', 'Neptune',
  'CoRoT-7b', 'Gliese 581', 'HD 209458b', 'HIP 13044b', 'Kepler186f', 'Kepler452b',
  'Sleepy', 'Happy', 'Dopey', 'Sneezey', 'Grumpy', 'Bashful', 'Doc'
];

export default function makeid() {
  return names[Math.floor(Math.random() * names.length)] + '-' + Math.floor(10 + Math.random() * 99);
}