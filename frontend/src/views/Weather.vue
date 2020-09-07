<template>
  <div>
    <div
      class="mt-5 ml-auto mr-auto shadow"
      style=" height:90vh;"
      id="map"
      ref="map"
    ></div>
    <!-- <div style="width:20px;"></div> -->
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      address: [
        { name: "서울", latitude: 37.56638, longitude: 126.977902 },
        // { name: "경기도", latitude: 37.658377, longitude: 126.833811 },
        { name: "강원도", latitude: 		38.069442, longitude: 		128.170699 },
        { name: "충청북도", latitude: 	36.984607, longitude: 128.365431 },
        { name: "충청남도", latitude: 36.815116, longitude: 127.113745 },
        { name: "전라북도", latitude: 35.82408, longitude: 127.147958 },
        { name: "전라남도", latitude: 34.81089, longitude: 126.391914 },
        { name: "경상북도", latitude: 	 			35.944943 , longitude: 		128.728501 },
        { name: "경상남도", latitude: 35.227597, longitude: 128.682366 },
        { name: "제주도", latitude: 33.383293, longitude: 126.259003 },
      ],
      wheatherInfo: [],
    };
  },
  async mounted() {
    // 구현해야 하는것
    // 각 지역별 온도 나타내서 지역에 표시하기
    // Promise.all은 순서를 보장해주지 않는다.
    // const responseData = await Promise.all(
    //   this.address.map((li) => {
    //     console.log(li.latitude);
    //     return axios.get(
    //       `http://api.openweathermap.org/data/2.5/weather?lat=${li.latitude}&lon=${li.longitude}&appid=2719e331e07a6af0547cfe7df2754c8c`
    //     );
    //   })
    // );
    // TODO 날씨랑 지도 연동해서 나타내기
    const responseData = await Promise.all(
      this.address.map((li) => {
        console.log(li.latitude);
        return axios.get(
          `http://api.openweathermap.org/data/2.5/weather?lat=${li.latitude}&lon=${li.longitude}&appid=2719e331e07a6af0547cfe7df2754c8c`
        );
      })
    );
    this.wheatherInfo = responseData.map((li) => li.data);

    console.log(this.wheatherInfo);
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=ccbae68ec4a07269f64368d0670925b4";
      document.head.appendChild(script);
    }
    // 카카오 지도 연동하기
  },
  methods: {
    matchIcon(weatherData) {
      console.log(weatherData);
      if (weatherData === "Clear") return require("../assets/039-sun.png");
      if (weatherData === "Clouds") return require("../assets/001-cloud.png");
      if (weatherData === "Rain") return require("../assets/003-rainy.png");
      if (weatherData === "Snow") return require("../assets/006-snowy.png");
      if (weatherData === "Thunderstorm")
        return require("../assets/008-storm.png");
      if (weatherData === "Drizzle")
        return require("../assets/031-snowflake.png");
      if (weatherData === "Atmosphere")
        return require("../assets/033-hurricane.png");
      else {
        return require("../assets/033-hurricane.png");
      }
    },
    initMap() {
      const mapContainer = document.getElementById("map"), // 지도를 표시할 div
        mapOption = {
          center: new kakao.maps.LatLng(34.99, 127.4), // 지도의 중심좌표
          level: 13, // 지도의 확대 레벨
        };

      var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

      const positions = this.wheatherInfo.map((li) => {
        console.log("aa");
        console.log(li);
        return {
          title: li.name,
          latlng: new kakao.maps.LatLng(li.coord.lat, li.coord.lon),
          temp: li.main.temp - 273.15,
          weather: li.weather[0].main,
        };
      });
      console.log(positions);

      // 마커 이미지의 이미지 주소입니다
      var imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

      for (let i = 0; i < positions.length; i++) {
        // 마커 이미지의 이미지 크기 입니다
        const imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        // const marker = new kakao.maps.Marker({
        //   map: map, // 마커를 표시할 지도
        //   position: positions[i].latlng, //positions[i].latlng, // 마커를 표시할 위치
        //   title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        //   image: markerImage, // 마커 이미지
        // });
        console.log(positions[i]);
        const content = `<div class ="label"><img src=${this.matchIcon(
          positions[i].weather
        )} style="width:50px;"/><div class="bg-primary text-white p-1" style="border-radius:8px;">${positions[
          i
        ].temp.toFixed(2)}</div></div>`;
        const customOverlay = new kakao.maps.CustomOverlay({
          position: positions[i].latlng,
          content: content,
        });
        customOverlay.setMap(map);
      }
    },
  },
};
</script>

<style></style>
