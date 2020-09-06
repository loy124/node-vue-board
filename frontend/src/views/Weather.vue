<template>
  <div>
    <div
      class="mt-5 ml-auto mr-auto shadow"
      style="width:1200px; height:1600px;"
      id="map"
      ref="map"
    ></div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      address: [
        { name: "서울", latitude: 37.56826, longitude: 126.977829 },
        { name: "경기도", latitude: 37.418163, longitude: 126.714935 },
        { name: "강원도", latitude: 37.348326, longitude: 127.928925 },
        { name: "충청북도", latitude: 37.142803, longitude: 128.18161 },
        { name: "충청남도", latitude: 36.476515, longitude: 127.082977 },
        { name: "경상남도", latitude: 35.041241, longitude: 128.049774 },
        { name: "전라북도", latitude: 35.431582, longitude: 127.415314 },
        { name: "전라남도", latitude: 34.987253, longitude: 127.404327 },
        { name: "제주도", latitude: 33.383293, longitude: 126.259003 },
      ],
    };
  },
  async mounted() {
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
    const responseArr = responseData.map((li) => li.data);
    console.log(responseArr);
    // 카카오 지도 연동하기
  },
  methods: {
    initMap() {
      var mapContainer = document.getElementById("map"), // 지도를 표시할 div
        mapOption = {
          center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
          level: 13, // 지도의 확대 레벨
        };

      var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

      const positions = this.address.map((li) => {
        console.log(li);
        return {
          title: li.name,
          latlng: new kakao.maps.LatLng(li.latitude, li.longitude),
        //   temp: li.main.temp - 273.15,
        };
      });
      console.log(positions);

      // 마커 이미지의 이미지 주소입니다
      var imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

      for (var i = 0; i < positions.length; i++) {
        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: positions[i].latlng, //positions[i].latlng, // 마커를 표시할 위치
          title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image: markerImage, // 마커 이미지
        });
        var content =
          `<div class ="label"><span class="left"></span><span class="center">${positions[i].temp}</span><span class="right"></span></div>`;
        var customOverlay = new kakao.maps.CustomOverlay({
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
