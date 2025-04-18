const cities = [
  { place: 'Sapporo', lat: '42.9853', lon: '141.2480' },
  { place: 'Sendai', lat: '38.3146', lon: '140.7688' },
  { place: 'Tokyo', lat: '35.5092', lon: '139.7698' },
  { place: 'Yokohama', lat: '35.4527', lon: '139.5950' },
  { place: 'Nagoya', lat: '35.1471', lon: '136.9263' },
  { place: 'Kyoto', lat: '35.0982', lon: '135.7189' },
  { place: 'Osaka', lat: '34.6776', lon: '135.4860' },
  { place: 'Fukuoka', lat: '33.6500', lon: '130.2640' },
  { place: 'Kagoshima', lat: '31.5229', lon: '130.5581' },
  { place: 'Okinawa', lat: '26.3606', lon: '127.8139' },
]
const placeNames = cities.map(p => p.place);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getWeather = async () => {
  try {
    let lat = cities.map(p => p.lat).join(',')
    let lon = cities.map(p => p.lon).join(',')
    const url = 'https://api.open-meteo.com/v1/forecast?' + [
      'latitude=' + lat,
      'longitude=' + lon,
      'daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      'current=precipitation,temperature_2m',
      'timezone=Asia%2FTokyo',
    ].join('&');
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error fetching weather: ${response.status}`)
    return await response.json();
  } catch (err) {
    console.error(err);
    alert('Failed to fetch weather data')
    return null;
  }
}

const setTemp = (place, weatherData) => {
  const placeName = document.getElementById('place-name');
  placeName.innerText = place;
  const placeCurrentTemp = document.getElementById('place-current-temp');
  placeCurrentTemp.innerText = weatherData[placeNames.indexOf(place)].current.temperature_2m;
  const placeCurrentProb = document.getElementById('place-current-prob');
  let roundProb = Math.round(weatherData[placeNames.indexOf(place)].daily.precipitation_probability_max[0] / 10) * 10;
  placeCurrentProb.innerText = roundProb;

  const wallPaper = document.getElementById('wall-paper');
  const placePic = document.getElementById('place-pic');
  wallPaper.src = `./assets/prefectures/${place.toLowerCase()}.jpg`
  placePic.src = `./assets/prefectures/${place.toLowerCase()}.jpg`

  for (let i = 0; i < 4; i++) {
    const date = document.getElementById(`date${i}`);
    const month = document.getElementById(`month${i}`); const dateStr = weatherData[placeNames.indexOf(place)].daily.time[i];
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const monthNum = dateObj.getMonth();

    const max = document.getElementById(`max${i}`);
    const min = document.getElementById(`min${i}`);
    const prob = document.getElementById(`prob${i}`);

    date.innerText = day;
    month.innerText = i === 0 || day === 1 ? months[monthNum] : '';
    max.innerText = weatherData[placeNames.indexOf(place)].daily.temperature_2m_max[i];
    min.innerText = weatherData[placeNames.indexOf(place)].daily.temperature_2m_min[i];
    roundProb = Math.round(weatherData[placeNames.indexOf(place)].daily.precipitation_probability_max[i] / 10) * 10;
    prob.innerText = roundProb;
  }
}

window.addEventListener('load', async () => {
  const weatherData = await getWeather()

  for (let i = 0; i < placeNames.length; i++) {
    const prefTemp = document.getElementById(`temp-${placeNames[i].toLowerCase()}`);
    prefTemp.innerText = weatherData[i].current.temperature_2m;
    const prefProb = document.getElementById(`prob-${placeNames[i].toLowerCase()}`);
    prefProb.innerText = Math.round(weatherData[i].daily.precipitation_probability_max[0] / 10) * 10;
  }

  let initialPlace = 'Tokyo';
  setTemp(initialPlace, weatherData);

  const prefectures = document.querySelectorAll('.prefecture')
  prefectures.forEach((pref) => {
    pref.addEventListener('click', () => {
      const placeName = pref.id.replace('pref-', '');
      selectedPlace = placeName.charAt(0).toUpperCase() + placeName.slice(1);
      const h2 = document.querySelector('.place h2');
      h2.style.fontSize = getFontSize(selectedPlace);
      prefectures.forEach(pref => pref.classList.remove('selected'));
      pref.classList.add('selected');
      setTemp(selectedPlace, weatherData);
    })
  })
});

const getFontSize = (place) => {
  const fontSizes = {
    Yokohama: '65px',
    Kagoshima: '60px',
    Fukuoka: '78px',
    Okinawa: '75px',
    default: '80px',
  }
  return fontSizes[place] || fontSizes.default;
}